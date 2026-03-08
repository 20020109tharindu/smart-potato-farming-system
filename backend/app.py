from flask import Flask, request, jsonify
import os, uuid
import numpy as np
from flask_cors import CORS
from utils.predict import predict_one

app = Flask(__name__)
CORS(app)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ── Disease predictor setup ──────────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)
DISEASE_MODEL_PATH = os.path.join(BASE_DIR, "models", "disease.h5")
DISEASE_IMG_SIZE = (224, 224)

# Class names – must match the order used during training
DISEASE_CLASSES = ["Early Blight", "Late Blight", "Healthy"]

# Fertilizer / action recommendations per class
DISEASE_RECOMMENDATIONS = {
    "Early Blight": {
        "action": "Apply fungicide (e.g. Mancozeb or Chlorothalonil) every 7–10 days.",
        "fertilizer": "Increase Potassium (K) to boost plant immunity. Avoid excess Nitrogen.",
        "severity": "moderate",
        "tips": [
            "Remove and destroy infected leaves immediately.",
            "Ensure good air circulation between plants.",
            "Water at the base, avoid wetting foliage.",
            "Apply mulch to reduce soil splash.",
        ],
    },
    "Late Blight": {
        "action": "Apply systemic fungicide (e.g. Metalaxyl) immediately — Late Blight spreads fast.",
        "fertilizer": "Balanced N-P-K with emphasis on Phosphorus (P) for root strength.",
        "severity": "high",
        "tips": [
            "Destroy all infected plant material — do not compost.",
            "Avoid overhead irrigation.",
            "Monitor weather — Late Blight thrives in cool, wet conditions.",
            "Consider harvesting early if infection is widespread.",
        ],
    },
    "Healthy": {
        "action": "No disease detected. Continue regular monitoring.",
        "fertilizer": "Maintain standard N-P-K schedule appropriate for growth stage.",
        "severity": "none",
        "tips": [
            "Keep monitoring every 7 days during wet season.",
            "Maintain proper spacing for air flow.",
            "Follow recommended irrigation schedule.",
        ],
    },
}

_disease_model = None


def _download_disease_model_if_needed():
    """Download disease.h5 from Google Drive if not present locally."""
    if os.path.exists(DISEASE_MODEL_PATH) and os.path.getsize(DISEASE_MODEL_PATH) > 1024 * 100:
        return  # already downloaded

    config_path = os.path.join(BASE_DIR, "model_config.json")
    if not os.path.exists(config_path):
        return

    import json
    with open(config_path) as f:
        config = json.load(f)

    if not config.get("auto_download", False):
        return

    url = config.get("google_drive_urls", {}).get("disease_model")
    if not url:
        return

    # Extract Google Drive file ID
    if "/file/d/" in url:
        file_id = url.split("/file/d/")[1].split("/")[0]
    elif "id=" in url:
        file_id = url.split("id=")[1].split("&")[0]
    else:
        file_id = url

    os.makedirs(os.path.dirname(DISEASE_MODEL_PATH), exist_ok=True)
    print(f"[Disease Model] Downloading disease.h5 from Google Drive...")
    try:
        import gdown
        gdown.download(f"https://drive.google.com/uc?id={file_id}", DISEASE_MODEL_PATH, quiet=False)
        print("[Disease Model] Download complete.")
    except Exception as e:
        if os.path.exists(DISEASE_MODEL_PATH):
            os.remove(DISEASE_MODEL_PATH)
        raise RuntimeError(
            f"Failed to download disease.h5 from Google Drive: {e}. "
            "Make sure the file is shared as 'Anyone with the link can view'."
        ) from e


def get_disease_model():
    """Lazy-load the disease model, auto-downloading from Google Drive if needed."""
    global _disease_model
    if _disease_model is not None:
        return _disease_model
    _download_disease_model_if_needed()
    if not os.path.exists(DISEASE_MODEL_PATH):
        raise FileNotFoundError(
            f"disease.h5 not found at {DISEASE_MODEL_PATH}. "
            "Add your Google Drive link to model_config.json under 'disease_model'."
        )
    import tensorflow as tf
    _disease_model = tf.keras.models.load_model(DISEASE_MODEL_PATH, compile=False)
    return _disease_model


def preprocess_disease_image(file_path):
    """Load and preprocess image for the disease model (ResNet/MobileNet style)."""
    import cv2
    img = cv2.imread(file_path)
    if img is None:
        raise ValueError("Cannot read image file.")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, DISEASE_IMG_SIZE)
    img = img.astype(np.float32) / 255.0
    return np.expand_dims(img, axis=0)  # shape: (1, 224, 224, 3)


def generate_disease_visualizations(file_path, predicted_class):
    """
    Generate 3 OpenCV-based visualizations of the disease area:
      1. original  – the resized original image
      2. mask      – isolated disease/lesion regions in red on black background
      3. overlay   – original image with semi-transparent red overlay on diseased areas
    Returns a dict of base64-encoded JPEG strings.
    """
    import cv2, base64

    img_bgr = cv2.imread(file_path)
    if img_bgr is None:
        return {}

    # Work at a fixed display size
    DISP = (400, 400)
    img_bgr = cv2.resize(img_bgr, DISP)
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    # ── Step 1: Extract leaf mask (remove background) ──────────────────────
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    # Green leaf range in HSV
    lower_leaf = np.array([25, 30, 30])
    upper_leaf = np.array([95, 255, 255])
    leaf_mask = cv2.inRange(hsv, lower_leaf, upper_leaf)
    # morphological clean-up
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_CLOSE, kernel, iterations=3)
    leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_OPEN,  kernel, iterations=2)

    # ── Step 2: Detect disease/lesion regions ──────────────────────────────
    # LAB colour space – lesions show as high 'a' channel (reddish/brownish)
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    L, a_ch, b_ch = cv2.split(lab)

    disease_mask = np.zeros(img_bgr.shape[:2], dtype=np.uint8)

    if predicted_class == "Healthy":
        # No disease — empty mask
        pass
    elif predicted_class in ("Early Blight", "Late Blight"):
        # Brown / dark necrotic lesions: high 'a', low lightness, low saturation
        _, dark_spots  = cv2.threshold(L,    95, 255, cv2.THRESH_BINARY_INV)
        _, high_a      = cv2.threshold(a_ch, 130, 255, cv2.THRESH_BINARY)
        brown_mask = cv2.bitwise_and(dark_spots, high_a)

        # Also catch yellowish-brown chlorotic areas
        lower_yellow = np.array([15, 40, 60])
        upper_yellow = np.array([35, 255, 255])
        yellow_mask  = cv2.inRange(hsv, lower_yellow, upper_yellow)

        # Grayish dead tissue (low saturation, medium lightness)
        S = hsv[:, :, 1]
        _, low_sat = cv2.threshold(S, 50, 255, cv2.THRESH_BINARY_INV)
        _, mid_L   = cv2.threshold(L, 60, 255, cv2.THRESH_BINARY)
        _, max_L   = cv2.threshold(L, 180, 255, cv2.THRESH_BINARY_INV)
        gray_mask  = cv2.bitwise_and(cv2.bitwise_and(low_sat, mid_L), max_L)

        disease_mask = cv2.bitwise_or(brown_mask, yellow_mask)
        disease_mask = cv2.bitwise_or(disease_mask, gray_mask)

        # Only keep disease pixels that are on the leaf
        disease_mask = cv2.bitwise_and(disease_mask, leaf_mask)

        # Clean up
        k2 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        disease_mask = cv2.morphologyEx(disease_mask, cv2.MORPH_CLOSE, k2, iterations=2)
        disease_mask = cv2.morphologyEx(disease_mask, cv2.MORPH_OPEN,  k2, iterations=1)

    # ── Step 3: Build visualisations ───────────────────────────────────────
    def to_b64(img_array_bgr):
        _, buf = cv2.imencode(".jpg", img_array_bgr, [cv2.IMWRITE_JPEG_QUALITY, 88])
        return "data:image/jpeg;base64," + base64.b64encode(buf).decode()

    # Find contours once — used by multiple visualisations
    contours, _ = cv2.findContours(disease_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 3a. Leaf Area — original image with purple/violet contours drawn around disease spots
    leaf_area = img_bgr.copy()
    cv2.drawContours(leaf_area, contours, -1, (200, 50, 180), 2)   # purple-violet in BGR
    leaf_area_b64 = to_b64(leaf_area)

    # 3b. Disease mask — red regions on WHITE background
    mask_vis = np.full_like(img_bgr, 255)          # white canvas
    mask_vis[disease_mask > 0] = [0, 0, 220]       # red blobs in BGR
    mask_b64 = to_b64(mask_vis)

    # 3c. Combined — original + translucent red overlay on disease areas
    combined = img_bgr.copy()
    red_layer = np.zeros_like(img_bgr)
    red_layer[disease_mask > 0] = [0, 0, 255]
    combined = cv2.addWeighted(combined, 1.0, red_layer, 0.5, 0)
    cv2.drawContours(combined, contours, -1, (0, 0, 200), 2)
    combined_b64 = to_b64(combined)

    # ── Step 4: Pixel statistics ────────────────────────────────────────────
    leaf_pixels    = int(np.count_nonzero(leaf_mask))
    disease_pixels = int(np.count_nonzero(disease_mask))
    disease_pct    = round(disease_pixels / leaf_pixels * 100, 1) if leaf_pixels > 0 else 0.0

    return {
        "leaf_area":     leaf_area_b64,
        "disease_mask":  mask_b64,
        "combined":      combined_b64,
        "leaf_pixels":   leaf_pixels,
        "disease_pixels": disease_pixels,
        "disease_area_pct": disease_pct,
    }


# ── Seed readiness endpoint (existing) ──────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filename = f"{uuid.uuid4().hex}.jpg"
    file_path = os.path.join(UPLOAD_DIR, filename)
    file.save(file_path)

    try:
        predictions = predict_one(file_path)
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


# ── Disease predictor endpoint ───────────────────────────────────────────────
@app.route("/api/predict-disease", methods=["POST"])
def predict_disease():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Validate mime type
    allowed = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
    if file.content_type and file.content_type not in allowed:
        return jsonify({"error": "Unsupported file type. Use JPEG or PNG."}), 400

    filename = f"{uuid.uuid4().hex}.jpg"
    file_path = os.path.join(UPLOAD_DIR, filename)
    file.save(file_path)

    try:
        model = get_disease_model()
        img_array = preprocess_disease_image(file_path)
        preds = model.predict(img_array, verbose=0)[0]          # shape: (num_classes,)

        predicted_idx = int(np.argmax(preds))
        confidence = float(preds[predicted_idx])

        # Guard: if model has different number of classes, slice safely
        class_name = (
            DISEASE_CLASSES[predicted_idx]
            if predicted_idx < len(DISEASE_CLASSES)
            else f"Class {predicted_idx}"
        )

        rec = DISEASE_RECOMMENDATIONS.get(class_name, DISEASE_RECOMMENDATIONS["Healthy"])

        # Build per-class probability list for the chart
        class_probs = [
            {
                "class": (DISEASE_CLASSES[i] if i < len(DISEASE_CLASSES) else f"Class {i}"),
                "probability": round(float(preds[i]) * 100, 1),
            }
            for i in range(len(preds))
        ]

        # Generate disease area visualizations
        viz = generate_disease_visualizations(file_path, class_name)

        return jsonify({
            "success": True,
            "predicted_class": class_name,
            "confidence": round(confidence * 100, 1),
            "class_probabilities": class_probs,
            "recommendation": rec,
            "visualizations": viz,
        })

    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


# ── ESP32-CAM capture & predict ──────────────────────────────────────────────
@app.route("/api/predict-from-esp32", methods=["POST"])
def predict_from_esp32():
    """Fetch a JPEG from ESP32-CAM /capture, run disease prediction, return same JSON as /predict-disease."""
    data = request.get_json(silent=True) or {}
    esp32_ip = data.get("esp32_ip", "172.20.10.2").strip().rstrip("/")
    if not esp32_ip.startswith("http"):
        esp32_ip = "http://" + esp32_ip
    capture_url = esp32_ip + "/capture"

    file_path = os.path.join(UPLOAD_DIR, f"esp32_{uuid.uuid4().hex}.jpg")
    try:
        import urllib.request
        req = urllib.request.Request(capture_url, headers={"User-Agent": "SmartPotato/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            img_bytes = resp.read()
        with open(file_path, "wb") as f:
            f.write(img_bytes)

        model = get_disease_model()
        img_tensor = preprocess_disease_image(file_path)
        preds = model.predict(img_tensor, verbose=0)[0]
        predicted_idx = int(np.argmax(preds))
        confidence = float(preds[predicted_idx])
        class_name = (
            DISEASE_CLASSES[predicted_idx]
            if predicted_idx < len(DISEASE_CLASSES)
            else f"Class {predicted_idx}"
        )
        rec = DISEASE_RECOMMENDATIONS.get(class_name, DISEASE_RECOMMENDATIONS["Healthy"])
        class_probs = [
            {"class": (DISEASE_CLASSES[i] if i < len(DISEASE_CLASSES) else f"Class {i}"),
             "probability": round(float(preds[i]) * 100, 1)}
            for i in range(len(preds))
        ]
        viz = generate_disease_visualizations(file_path, class_name)
        return jsonify({
            "success": True,
            "predicted_class": class_name,
            "confidence": round(confidence * 100, 1),
            "class_probabilities": class_probs,
            "recommendation": rec,
            "visualizations": viz,
            "source": "esp32",
        })
    except Exception as e:
        return jsonify({"error": f"ESP32 capture failed: {e}"}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


# ── Health check ─────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    model_ready = os.path.exists(DISEASE_MODEL_PATH)
    return jsonify({"message": "ok", "disease_model_loaded": model_ready})


if __name__ == "__main__":
    app.run(debug=True)
