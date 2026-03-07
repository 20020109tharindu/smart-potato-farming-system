# backend/utils/predict.py
import os
import json
import glob
import zipfile
import numpy as np
import tensorflow as tf
import cv2
import requests

from .preprocess import to_square_resize, to_square_resize_256_rgb

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Model directory
if os.path.isdir(os.path.join(BASE_DIR, "models")):
    MODELS_DIR = os.path.join(BASE_DIR, "models")
else:
    MODELS_DIR = os.path.join(BASE_DIR, "seed_readiness_predictor_models")

# Labels directory
if os.path.isdir(os.path.join(BASE_DIR, "labels")):
    LABELS_DIR = os.path.join(BASE_DIR, "labels")
else:
    LABELS_DIR = os.path.join(BASE_DIR, "seed_readiness_predictor_labels")

os.makedirs(MODELS_DIR, exist_ok=True)

CONFIG_FILE = os.path.join(BASE_DIR, "model_config.json")

# Sprout length: PyTorch .pth (keypoint heatmap model)
SPROUT_PTH_FILENAME = "sprout_heatmap_keypoint_best.pth"
SPROUT_PTH_PATH = os.path.join(MODELS_DIR, SPROUT_PTH_FILENAME)

# Keras-only keys (sprout_length is PyTorch)
KERAS_KEYS = ["shrivel_level", "damage_level", "seed_readiness"]


# =========================
# CONFIG
# =========================
def load_config():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    return {"model_source": "local", "google_drive_urls": {}, "auto_download": True}


# =========================
# VALIDATION
# =========================
def is_valid_keras_file(path):
    if not os.path.exists(path) or os.path.getsize(path) < 1024:
        return False
    try:
        with zipfile.ZipFile(path, "r") as zf:
            names = set(zf.namelist())
            return "config.json" in names and "metadata.json" in names
    except zipfile.BadZipFile:
        return False


# =========================
# GOOGLE DRIVE DOWNLOAD
# =========================
def extract_file_id(url):
    if '/file/d/' in url:
        return url.split('/file/d/')[1].split('/')[0]
    elif 'id=' in url:
        return url.split('id=')[1].split('&')[0]
    return url


def download_from_google_drive(file_id, destination, validate_keras=True):
    print(f"Downloading model: {destination}")
    url = f"https://drive.google.com/uc?id={file_id}"
    response = requests.get(url, stream=True)

    temp_path = destination + ".download"
    with open(temp_path, "wb") as f:
        for chunk in response.iter_content(32768):
            if chunk:
                f.write(chunk)

    if validate_keras and not is_valid_keras_file(temp_path):
        os.remove(temp_path)
        raise ValueError("Downloaded file is not a valid .keras model.")

    os.replace(temp_path, destination)
    print("Download complete.")


def _is_valid_pth_file(path):
    """Check file is not an HTML page (Google Drive often returns HTML instead of the file)."""
    if not os.path.exists(path) or os.path.getsize(path) < 100:
        return False
    with open(path, "rb") as f:
        first = f.read(50)
    return not first.lstrip().startswith(b"<")


def download_sprout_pth_if_needed(config):
    """Download PyTorch sprout .pth from Google Drive using gdown (avoids HTML redirect)."""
    if config.get("model_source") != "google_drive":
        return
    gdrive_urls = config.get("google_drive_urls", {})
    if "sprout_length" not in gdrive_urls:
        return
    if os.path.exists(SPROUT_PTH_PATH) and _is_valid_pth_file(SPROUT_PTH_PATH):
        return
    # Remove bad/corrupt file so we re-download
    if os.path.exists(SPROUT_PTH_PATH):
        try:
            os.remove(SPROUT_PTH_PATH)
        except OSError:
            pass
    file_id = extract_file_id(gdrive_urls["sprout_length"])
    try:
        import gdown
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, SPROUT_PTH_PATH, quiet=False)
    except Exception as e:
        raise RuntimeError(
            f"Failed to download sprout model from Drive: {e}. "
            "Ensure the link is shared as 'Anyone with the link can view'."
        ) from e
    if not _is_valid_pth_file(SPROUT_PTH_PATH):
        if os.path.exists(SPROUT_PTH_PATH):
            os.remove(SPROUT_PTH_PATH)
        raise ValueError(
            "Downloaded file is not a valid .pth (got HTML?). "
            "Check the Drive link and share settings."
        )
    print("Sprout model download complete.")


def download_model_if_needed(name, config):
    if config.get("model_source") != "google_drive":
        return

    gdrive_urls = config.get("google_drive_urls", {})

    # Sprout: PyTorch .pth (handled by download_sprout_pth_if_needed)
    if name == "sprout_length":
        download_sprout_pth_if_needed(config)
        return

    if name not in gdrive_urls:
        return

    model_path = os.path.join(MODELS_DIR, f"{name}.keras")

    if os.path.exists(model_path) and is_valid_keras_file(model_path):
        return

    file_id = extract_file_id(gdrive_urls[name])
    download_from_google_drive(file_id, model_path)


# =========================
# LOAD LABELS & MODELS
# =========================
def load_labels(name):
    path = os.path.join(LABELS_DIR, f"{name}_labels.json")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Labels file not found: {path}")
    with open(path, "r") as f:
        return json.load(f)["class_names"]


def find_model_file(name):
    # Sprout: PyTorch .pth first
    if name == "sprout_length":
        if os.path.exists(SPROUT_PTH_PATH) and os.path.getsize(SPROUT_PTH_PATH) > 1024:
            return SPROUT_PTH_PATH
        for ext in (".keras", ".h5"):
            p = os.path.join(MODELS_DIR, f"{name}{ext}")
            if os.path.exists(p):
                return p
        matches = glob.glob(os.path.join(MODELS_DIR, f"{name}*"))
        if matches:
            return matches[0]
        raise FileNotFoundError(f"Model file for '{name}' not found (expected {SPROUT_PTH_FILENAME} or .keras).")

    candidates = [
        os.path.join(MODELS_DIR, f"{name}.keras"),
        os.path.join(MODELS_DIR, f"{name}.h5"),
    ]
    for c in candidates:
        if os.path.exists(c):
            return c

    matches = glob.glob(os.path.join(MODELS_DIR, f"{name}*"))
    if matches:
        return matches[0]

    raise FileNotFoundError(f"Model file for '{name}' not found.")


def load_model(name):
    config = load_config()
    download_model_if_needed(name, config)
    path = find_model_file(name)
    return tf.keras.models.load_model(path, compile=False)


# =========================
# LAZY LOAD (IMPORTANT FOR FLASK DEBUG)
# =========================
MODEL_KEYS = ["sprout_length", "shrivel_level", "damage_level", "seed_readiness"]

models = None
labels = None
_models_loaded = False


def ensure_models_loaded():
    global models, labels, _models_loaded
    if _models_loaded:
        return

    config = load_config()
    download_sprout_pth_if_needed(config)

    print("Loading models...")
    # Keras models for shrivel, damage, seed_readiness
    models = {}
    labels = {}
    for k in KERAS_KEYS:
        models[k] = load_model(k)
        labels[k] = load_labels(k)

    _models_loaded = True
    print("Models loaded successfully!")


# =========================
# PREDICTION
# =========================
def predict_one(image_path):
    ensure_models_loaded()

    img_bgr = cv2.imread(image_path)
    if img_bgr is None:
        raise ValueError("Invalid image")

    output = {}

    # Sprout length: PyTorch keypoint model (if .pth present)
    sprout_path = find_model_file("sprout_length")
    if sprout_path.endswith(".pth"):
        from .sprout_model import predict_sprout_length_from_image
        output["sprout_length"] = predict_sprout_length_from_image(
            img_bgr, sprout_path, to_square_resize_256_rgb
        )
    else:
        # Fallback: Keras sprout model (if you had an old .keras)
        img = to_square_resize(img_bgr)
        img = img[:, :, ::-1]
        x = np.expand_dims(img, axis=0).astype(np.float32)
        if "sprout_length" not in models:
            models["sprout_length"] = load_model("sprout_length")
            labels["sprout_length"] = load_labels("sprout_length")
        probs = models["sprout_length"].predict(x, verbose=0)[0]
        idx = int(np.argmax(probs))
        top3 = np.argsort(probs)[::-1][:3]
        output["sprout_length"] = {
            "label": labels["sprout_length"][idx],
            "confidence": float(probs[idx]),
            "top3": [{"label": labels["sprout_length"][i], "probability": float(probs[i])} for i in top3],
        }

    # Keras: shrivel, damage, seed_readiness
    img = to_square_resize(img_bgr)
    img = img[:, :, ::-1]  # BGR -> RGB
    x = np.expand_dims(img, axis=0).astype(np.float32)

    for k in KERAS_KEYS:
        probs = models[k].predict(x, verbose=0)[0]
        idx = int(np.argmax(probs))
        top3 = np.argsort(probs)[::-1][:3]
        output[k] = {
            "label": labels[k][idx],
            "confidence": float(probs[idx]),
            "top3": [
                {"label": labels[k][i], "probability": float(probs[i])}
                for i in top3
            ]
        }

    return output