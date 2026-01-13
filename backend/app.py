from flask import Flask, request, jsonify
import os, uuid
from flask_cors import CORS
from utils.predict import predict_one

app = Flask(__name__)
CORS(app)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
        predictions = predict_one(file_path)  # Call the prediction function from utils/predict.py
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(file_path)


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"message": "ok"})

if __name__ == "__main__":
    app.run(debug=True)
