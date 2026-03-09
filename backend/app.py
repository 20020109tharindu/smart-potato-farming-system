from flask import Flask, jsonify, request
from flask_cors import CORS
import soil_utils

app = Flask(__name__)
CORS(app)


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Smart Potato Farming backend is running"})


# ================================================================
# SOIL MONITORING ROUTES
# ================================================================

@app.route("/api/soil/predict", methods=["POST"])
def predict_soil():
    """
    Predict soil suitability and fertilizer recommendations.

    Expected JSON body:
        pH, EC, N, P, K, Temperature, Moisture, Growth_Stage

    EC must be in mS/cm.
    If sensor sends conductivity in uS/cm, divide by 1000 before sending.
    Growth_Stage: 0=Germination, 1=Vegetative, 2=Tuber Initiation, 3=Maturation
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body received"}), 400

        required_fields = ["pH", "EC", "N", "P", "K", "Temperature", "Moisture", "Growth_Stage"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Convert all values to float/int
        input_data = {}
        for field in required_fields:
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


if __name__ == "__main__":
    soil_utils.load_bundle()
    app.run(debug=True)

