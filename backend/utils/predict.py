# backend/utils/predict.py
import os, json, glob
import numpy as np
import tensorflow as tf
import cv2
from .preprocess import to_square_resize

# ResNet50V2 preprocessing
from tensorflow.keras.applications.resnet_v2 import preprocess_input

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
# support both expected directory names
if os.path.isdir(os.path.join(BASE_DIR, "models")):
    MODELS_DIR = os.path.join(BASE_DIR, "models")
else:
    MODELS_DIR = os.path.join(BASE_DIR, "seed_readiness_predictor_models")

if os.path.isdir(os.path.join(BASE_DIR, "labels")):
    LABELS_DIR = os.path.join(BASE_DIR, "labels")
else:
    LABELS_DIR = os.path.join(BASE_DIR, "seed_readiness_predictor_labels")

def load_labels(name):
    path = os.path.join(LABELS_DIR, f"{name}_labels.json")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Labels file not found: {path}")
    with open(path, "r") as f:
        return json.load(f)["class_names"]

def find_model_file(name):
    # Try common patterns
    candidates = [
        os.path.join(MODELS_DIR, f"{name}.keras"),
        os.path.join(MODELS_DIR, f"{name}_best.keras"),
        os.path.join(MODELS_DIR, f"{name}.h5"),
        os.path.join(MODELS_DIR, f"{name}_best.h5"),
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    # fallback: search for files that start with name
    pattern = os.path.join(MODELS_DIR, f"{name}*")
    matches = glob.glob(pattern)
    if matches:
        return matches[0]
    raise FileNotFoundError(f"Model file for '{name}' not found in {MODELS_DIR}")

def load_model(name):
    path = find_model_file(name)
    return tf.keras.models.load_model(path, compile=False)

# Load models and labels (when server starts)
MODEL_KEYS = ["sprout_length", "shrivel_level", "damage_level", "seed_readiness"]

models = {k: load_model(k) for k in MODEL_KEYS}
labels = {k: load_labels(k) for k in MODEL_KEYS}

def predict_one(image_path):
    img_bgr = cv2.imread(image_path)
    if img_bgr is None:
        raise ValueError("Invalid image")

    # Preprocess image (same as training)
    img = to_square_resize(img_bgr)
    img = img[:, :, ::-1]  # BGR -> RGB

    x = np.expand_dims(img, axis=0).astype(np.float32)
    x = preprocess_input(x)  # ResNet50V2 standardization

    output = {}
    for k in MODEL_KEYS:
        probs = models[k].predict(x, verbose=0)[0]
        idx = int(np.argmax(probs))
        output[k] = {
            "label": labels[k][idx],
            "confidence": float(probs[idx])
        }
    return output
