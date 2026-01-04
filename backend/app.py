from flask import Flask, jsonify, request
from flask_cors import CORS
import soil_utils

app = Flask(__name__)
CORS(app)  # allow React frontend to call this API (for dev)

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Smart Potato Farming backend is running"})

# Soil Health API Routes
@app.route("/api/soil/predict", methods=["POST"])
def predict_soil():
    """Predict soil suitability based on input parameters"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['pH', 'EC', 'P', 'K', 'Temperature', 'Humidity', 'Moisture', 'N']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Convert values to float
        input_data = {k: float(v) for k, v in data.items() if k in required_fields}
        
        # Get prediction
        result = soil_utils.predict_soil_suitability(input_data)
        
        if "error" in result:
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/soil/statistics", methods=["GET"])
def get_statistics():
    """Get soil data statistics"""
    try:
        stats = soil_utils.get_soil_statistics()
        
        if "error" in stats:
            return jsonify(stats), 500
        
        return jsonify(stats)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/soil/recent", methods=["GET"])
def get_recent():
    """Get recent soil samples"""
    try:
        limit = request.args.get('limit', 10, type=int)
        samples = soil_utils.get_recent_samples(limit=limit)
        
        if isinstance(samples, dict) and "error" in samples:
            return jsonify(samples), 500
        
        return jsonify({"samples": samples})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Load model on startup
    soil_utils.load_model()
    app.run(debug=True)
