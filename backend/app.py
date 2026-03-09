from flask import Flask, request, jsonify
import os, uuid
import numpy as np
import pandas as pd
import pickle
import warnings
from flask_cors import CORS
from utils.predict import predict_one
import soil_utils

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

# ================================================================
# YIELD PREDICTION MODELS (lazy-loaded)
# ================================================================
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
_yield_artifacts = None

YIELD_PKL_FILES = [
    "best_price_model.pkl", "best_yield_model.pkl", "scaler.pkl",
    "label_encoders.pkl", "feature_columns.pkl",
    "seed_cost_lkr_model.pkl", "fertilizer_cost_lkr_model.pkl", "labor_cost_lkr_model.pkl",
    "cost_scaler.pkl", "cost_label_encoders.pkl", "cost_feature_columns.pkl",
]


def _download_yield_models_if_needed():
    if all(os.path.exists(os.path.join(MODEL_DIR, f)) for f in YIELD_PKL_FILES):
        return
    config_path = os.path.join(os.path.dirname(__file__), "model_config.json")
    if not os.path.exists(config_path):
        return
    import json
    with open(config_path) as f:
        config = json.load(f)
    if not config.get("auto_download", False):
        return
    url = config.get("google_drive_urls", {}).get("yield_models_zip")
    if not url or not url.strip():
        return
    if "/file/d/" in url:
        file_id = url.split("/file/d/")[1].split("/")[0]
    elif "id=" in url:
        file_id = url.split("id=")[1].split("&")[0]
    else:
        file_id = url.strip()
    os.makedirs(MODEL_DIR, exist_ok=True)
    zip_path = os.path.join(MODEL_DIR, "yield_models.zip")
    print("[Yield Models] Downloading yield_models.zip from Google Drive...")
    try:
        import gdown, zipfile, shutil
        gdown.download(f"https://drive.google.com/uc?id={file_id}", zip_path, quiet=False)
        with zipfile.ZipFile(zip_path, "r") as z:
            z.extractall(MODEL_DIR)
        if os.path.exists(zip_path):
            os.remove(zip_path)
        for name in YIELD_PKL_FILES:
            dst = os.path.join(MODEL_DIR, name)
            if os.path.exists(dst):
                continue
            for root, _, files in os.walk(MODEL_DIR):
                if root == MODEL_DIR:
                    continue
                if name in files:
                    shutil.move(os.path.join(root, name), dst)
                    break
        print("[Yield Models] Download and extract complete.")
    except Exception as e:
        if os.path.exists(zip_path):
            try:
                os.remove(zip_path)
            except Exception:
                pass
        print(f"[Yield Models] Download failed: {e}.")


def get_yield_artifacts():
    global _yield_artifacts
    if _yield_artifacts is not None:
        return _yield_artifacts
    _download_yield_models_if_needed()
    try:
        def load(name):
            with open(os.path.join(MODEL_DIR, name), "rb") as f:
                return pickle.load(f)
        price_model             = load("best_price_model.pkl")
        yield_model             = load("best_yield_model.pkl")
        stage2_scaler           = load("scaler.pkl")
        stage2_label_encoders   = load("label_encoders.pkl")
        stage2_features         = load("feature_columns.pkl")
        seed_cost_model         = load("seed_cost_lkr_model.pkl")
        fertilizer_cost_model   = load("fertilizer_cost_lkr_model.pkl")
        labor_cost_model        = load("labor_cost_lkr_model.pkl")
        cost_scaler             = load("cost_scaler.pkl")
        cost_label_encoders     = load("cost_label_encoders.pkl")
        cost_feature_columns    = load("cost_feature_columns.pkl")
        potato_varieties        = list(stage2_label_encoders["potato_variety"].classes_)
        _yield_artifacts = {
            "price_model": price_model,
            "yield_model": yield_model,
            "stage2_scaler": stage2_scaler,
            "stage2_label_encoders": stage2_label_encoders,
            "stage2_features": stage2_features,
            "seed_cost_model": seed_cost_model,
            "fertilizer_cost_model": fertilizer_cost_model,
            "labor_cost_model": labor_cost_model,
            "cost_scaler": cost_scaler,
            "cost_label_encoders": cost_label_encoders,
            "cost_feature_columns": cost_feature_columns,
            "POTATO_VARIETIES": potato_varieties,
        }
        return _yield_artifacts
    except FileNotFoundError:
        return None


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ================================================================
# DISEASE PREDICTION MODEL (lazy-loaded)
# ================================================================
BASE_DIR           = os.path.dirname(__file__)
DISEASE_MODEL_PATH = os.path.join(BASE_DIR, "models", "disease.h5")
DISEASE_IMG_SIZE   = (224, 224)
DISEASE_CLASSES    = ["Early Blight", "Late Blight", "Healthy"]

DISEASE_RECOMMENDATIONS = {
    "Early Blight": {
        "action": "Apply fungicide (e.g. Mancozeb or Chlorothalonil) every 7-10 days.",
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
    if os.path.exists(DISEASE_MODEL_PATH) and os.path.getsize(DISEASE_MODEL_PATH) > 1024 * 100:
        return
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
    if "/file/d/" in url:
        file_id = url.split("/file/d/")[1].split("/")[0]
    elif "id=" in url:
        file_id = url.split("id=")[1].split("&")[0]
    else:
        file_id = url
    os.makedirs(os.path.dirname(DISEASE_MODEL_PATH), exist_ok=True)
    print("[Disease Model] Downloading disease.h5 from Google Drive...")
    try:
        import gdown
        gdown.download(f"https://drive.google.com/uc?id={file_id}", DISEASE_MODEL_PATH, quiet=False)
        print("[Disease Model] Download complete.")
    except Exception as e:
        if os.path.exists(DISEASE_MODEL_PATH):
            os.remove(DISEASE_MODEL_PATH)
        raise RuntimeError(f"Failed to download disease.h5: {e}") from e


def get_disease_model():
    global _disease_model
    if _disease_model is not None:
        return _disease_model
    _download_disease_model_if_needed()
    if not os.path.exists(DISEASE_MODEL_PATH):
        raise FileNotFoundError(f"disease.h5 not found at {DISEASE_MODEL_PATH}.")
    import tensorflow as tf
    _disease_model = tf.keras.models.load_model(DISEASE_MODEL_PATH, compile=False)
    return _disease_model


def preprocess_disease_image(file_path):
    import cv2
    img = cv2.imread(file_path)
    if img is None:
        raise ValueError("Cannot read image file.")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, DISEASE_IMG_SIZE)
    img = img.astype(np.float32) / 255.0
    return np.expand_dims(img, axis=0)


def generate_disease_visualizations(file_path, predicted_class):
    import cv2, base64
    img_bgr = cv2.imread(file_path)
    if img_bgr is None:
        return {}
    DISP = (400, 400)
    img_bgr   = cv2.resize(img_bgr, DISP)
    hsv       = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    leaf_mask = cv2.inRange(hsv, np.array([25, 30, 30]), np.array([95, 255, 255]))
    kernel    = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_CLOSE, kernel, iterations=3)
    leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_OPEN,  kernel, iterations=2)
    lab       = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    L, a_ch, _ = cv2.split(lab)
    disease_mask = np.zeros(img_bgr.shape[:2], dtype=np.uint8)
    if predicted_class in ("Early Blight", "Late Blight"):
        _, dark_spots  = cv2.threshold(L,    95, 255, cv2.THRESH_BINARY_INV)
        _, high_a      = cv2.threshold(a_ch, 130, 255, cv2.THRESH_BINARY)
        brown_mask     = cv2.bitwise_and(dark_spots, high_a)
        yellow_mask    = cv2.inRange(hsv, np.array([15, 40, 60]), np.array([35, 255, 255]))
        S = hsv[:, :, 1]
        _, low_sat = cv2.threshold(S, 50, 255, cv2.THRESH_BINARY_INV)
        _, mid_L   = cv2.threshold(L, 60, 255, cv2.THRESH_BINARY)
        _, max_L   = cv2.threshold(L, 180, 255, cv2.THRESH_BINARY_INV)
        gray_mask  = cv2.bitwise_and(cv2.bitwise_and(low_sat, mid_L), max_L)
        disease_mask = cv2.bitwise_and(
            cv2.bitwise_or(cv2.bitwise_or(brown_mask, yellow_mask), gray_mask),
            leaf_mask
        )
        k2 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        disease_mask = cv2.morphologyEx(disease_mask, cv2.MORPH_CLOSE, k2, iterations=2)
        disease_mask = cv2.morphologyEx(disease_mask, cv2.MORPH_OPEN,  k2, iterations=1)

    def to_b64(arr):
        _, buf = cv2.imencode(".jpg", arr, [cv2.IMWRITE_JPEG_QUALITY, 88])
        return "data:image/jpeg;base64," + base64.b64encode(buf).decode()

    contours, _ = cv2.findContours(disease_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    leaf_vis = img_bgr.copy();  cv2.drawContours(leaf_vis, contours, -1, (200, 50, 180), 2)
    mask_vis = np.full_like(img_bgr, 255);  mask_vis[disease_mask > 0] = [0, 0, 220]
    combined = img_bgr.copy()
    red_layer = np.zeros_like(img_bgr);  red_layer[disease_mask > 0] = [0, 0, 255]
    combined  = cv2.addWeighted(combined, 1.0, red_layer, 0.5, 0)
    cv2.drawContours(combined, contours, -1, (0, 0, 200), 2)
    leaf_px = int(np.count_nonzero(leaf_mask))
    dis_px  = int(np.count_nonzero(disease_mask))
    return {
        "leaf_area":        to_b64(leaf_vis),
        "disease_mask":     to_b64(mask_vis),
        "combined":         to_b64(combined),
        "leaf_pixels":      leaf_px,
        "disease_pixels":   dis_px,
        "disease_area_pct": round(dis_px / leaf_px * 100, 1) if leaf_px > 0 else 0.0,
    }


# ================================================================
# YIELD HELPER FUNCTIONS
# ================================================================
def _predict_costs_stage1(data, artifacts):
    row = data.copy()
    for col, enc in artifacts["cost_label_encoders"].items():
        if col in row:
            row[col] = enc.transform([row[col]])[0]
    df = pd.DataFrame([row]).reindex(columns=artifacts["cost_feature_columns"], fill_value=0)
    X  = artifacts["cost_scaler"].transform(df)
    return {
        "seed_cost_lkr":       max(0, float(artifacts["seed_cost_model"].predict(X)[0])),
        "fertilizer_cost_lkr": max(0, float(artifacts["fertilizer_cost_model"].predict(X)[0])),
        "labor_cost_lkr":      max(0, float(artifacts["labor_cost_model"].predict(X)[0])),
    }


def _preprocess_stage2(data, artifacts):
    df = pd.DataFrame([data])
    df["total_cost"] = df["seed_cost_lkr"] + df["fertilizer_cost_lkr"] + df["labor_cost_lkr"]
    for col, enc in artifacts["stage2_label_encoders"].items():
        df[col] = enc.transform(df[col])
    for col in artifacts["stage2_features"]:
        if col not in df.columns:
            df[col] = 0
    return artifacts["stage2_scaler"].transform(df[artifacts["stage2_features"]])


# ================================================================
# ROUTES
# ================================================================

@app.route("/api/health", methods=["GET"])
def health():
    disease_ready = os.path.exists(DISEASE_MODEL_PATH)
    yield_ready   = get_yield_artifacts() is not None
    soil_ready    = soil_utils.is_model_loaded()
    return jsonify({
        "message":              "Smart Potato Farming backend is running",
        "disease_model_loaded": disease_ready,
        "yield_models_loaded":  yield_ready,
        "soil_model_loaded":    soil_ready,
    })


# ── Soil Health Predictor ────────────────────────────────────────────────────
@app.route("/api/soil/predict", methods=["POST"])
def predict_soil():
    # Soil suitability + fertilizer recommendations.
    # Required: pH, EC, N, P, K, Temperature, Moisture, Growth_Stage
    # EC in mS/cm. Growth_Stage: 0=Germination 1=Vegetative 2=Tuber 3=Maturation
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body received"}), 400
        required = ["pH", "EC", "N", "P", "K", "Temperature", "Moisture", "Growth_Stage"]
        for field in required:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        input_data = {}
        for field in required:
            try:
                input_data[field] = float(data[field])
            except (ValueError, TypeError):
                return jsonify({"error": f"Invalid value for field: {field}"}), 400
        result = soil_utils.predict(input_data)
        if "error" in result:
            return jsonify(result), 500
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Seed Readiness ───────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400
    filename  = f"{uuid.uuid4().hex}.jpg"
    file_path = os.path.join(UPLOAD_DIR, filename)
    file.save(file_path)
    try:
        return jsonify(predict_one(file_path))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


# ── Disease Predictor ────────────────────────────────────────────────────────
@app.route("/api/predict-disease", methods=["POST"])
def predict_disease():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400
    if file.content_type and file.content_type not in {"image/jpeg","image/png","image/jpg","image/webp"}:
        return jsonify({"error": "Unsupported file type. Use JPEG or PNG."}), 400
    filename  = f"{uuid.uuid4().hex}.jpg"
    file_path = os.path.join(UPLOAD_DIR, filename)
    file.save(file_path)
    try:
        model      = get_disease_model()
        preds      = model.predict(preprocess_disease_image(file_path), verbose=0)[0]
        pred_idx   = int(np.argmax(preds))
        confidence = float(preds[pred_idx])
        class_name = DISEASE_CLASSES[pred_idx] if pred_idx < len(DISEASE_CLASSES) else f"Class {pred_idx}"
        rec        = DISEASE_RECOMMENDATIONS.get(class_name, DISEASE_RECOMMENDATIONS["Healthy"])
        class_probs = [{"class": (DISEASE_CLASSES[i] if i < len(DISEASE_CLASSES) else f"Class {i}"),
                        "probability": round(float(preds[i]) * 100, 1)} for i in range(len(preds))]
        return jsonify({
            "success":             True,
            "predicted_class":     class_name,
            "confidence":          round(confidence * 100, 1),
            "class_probabilities": class_probs,
            "recommendation":      rec,
            "visualizations":      generate_disease_visualizations(file_path, class_name),
        })
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


# ── Yield & Profit Predictor ─────────────────────────────────────────────────
@app.route("/potato_analyze", methods=["POST"])
def potato_analyze():
    from suggetion_service import generate_farmer_explanation, generate_action_plan
    artifacts = get_yield_artifacts()
    if artifacts is None:
        return jsonify({"error": "Yield models not loaded. Add .pkl files to backend/models/ and restart."}), 503
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400
    predicted_costs = _predict_costs_stage1(data, artifacts)
    data.update(predicted_costs)
    total_cost = sum(predicted_costs.values())
    if data.get("hands_on_money_lkr", 0) < total_cost:
        return jsonify({
            "status":            "insufficient_funds",
            "required_cost_lkr": round(total_cost, 2),
            "available_lkr":     data["hands_on_money_lkr"],
            "deficit_lkr":       round(total_cost - data["hands_on_money_lkr"], 2),
            "cost_breakdown":    predicted_costs,
        })
    results = []
    for variety in artifacts["POTATO_VARIETIES"]:
        row = data.copy();  row["potato_variety"] = variety
        X = _preprocess_stage2(row, artifacts)
        price = float(artifacts["price_model"].predict(X)[0])
        yld   = float(artifacts["yield_model"].predict(X)[0])
        rev   = yld * row["field_size_acres"] * price
        profit = rev - total_cost
        results.append({"variety": variety, "price": price, "yield_acre": yld,
                         "total_yield": yld * row["field_size_acres"],
                         "revenue": rev, "net_profit": profit,
                         "roi": (profit / total_cost * 100) if total_cost > 0 else 0})
    results = sorted(results, key=lambda x: x["net_profit"], reverse=True)
    strategies = []
    for i, r in enumerate(results[:3]):
        label = ["Premium","Balanced","Budget"][i]
        strategies.append({
            "strategy":              label,
            "type":                  r["variety"],
            "investment_lkr":        round(total_cost, 2),
            "expected_yield_kg":     round(r["total_yield"], 2),
            "expected_yield_per_acre": round(r["yield_acre"], 2),
            "expected_price_per_kg": round(r["price"], 2),
            "revenue_lkr":           round(r["revenue"], 2),
            "net_profit_lkr":        round(r["net_profit"], 2),
            "roi_percent":           round(r["roi"], 2),
            "farmer_explanation":    generate_farmer_explanation(r["variety"], label, r["roi"], r["net_profit"]),
            "action_plan":           generate_action_plan(r["variety"], label),
        })
    best = strategies[0]
    return jsonify({
        "status":            "ok",
        "predicted_costs":   predicted_costs,
        "baseline": {
            "price_lkr_per_kg": best["expected_price_per_kg"],
            "yield_per_acre":   best["expected_yield_per_acre"],
            "yield_total":      best["expected_yield_kg"],
        },
        "strategies":        strategies,
        "strategies_found":  len(strategies),
        "hands_on_money_lkr": data["hands_on_money_lkr"],
    })


if __name__ == "__main__":
    soil_utils.load_bundle()
    app.run(debug=True)
