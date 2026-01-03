from flask import Flask, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import base64

app = Flask(__name__)
CORS(app)  # allow React frontend to call this API (for dev)

def get_severity_stage(severity_percentage):
    """
    Determine disease stage based on severity percentage
    """
    if severity_percentage <= 10:
        return "Very Early"
    elif severity_percentage <= 30:
        return "Early"
    elif severity_percentage <= 60:
        return "Progressive"
    else:
        return "Critical"

def get_fertilizer_recommendation(stage):
    """
    Get fertilizer recommendation based on disease stage
    """
    recommendations = {
        "Very Early": {
            "stage": "Very Early",
            "nitrogen": "Medium",
            "phosphorus": "Medium",
            "potassium": "High",
            "description": "Focus on strengthening plant immunity. Regular monitoring recommended."
        },
        "Early": {
            "stage": "Early",
            "nitrogen": "High",
            "phosphorus": "High",
            "potassium": "High",
            "description": "Increase nutrient support. Consider fungicide application."
        },
        "Progressive": {
            "stage": "Progressive",
            "nitrogen": "Very High",
            "phosphorus": "Very High",
            "potassium": "Very High",
            "description": "Critical nutrient boost needed. Immediate fungicide treatment required."
        },
        "Critical": {
            "stage": "Critical",
            "nitrogen": "Maximum",
            "phosphorus": "Maximum",
            "potassium": "Maximum",
            "description": "Severe intervention needed. Consider crop isolation or emergency treatment."
        }
    }
    return recommendations.get(stage, recommendations["Very Early"])

def calculate_disease_severity(image_array):
    """
    Calculate disease severity from image
    Uses HSV-based leaf segmentation and color-based lesion detection
    """
    try:
        # Convert BGR to HSV
        hsv = cv2.cvtColor(image_array, cv2.COLOR_BGR2HSV)
        
        # Green leaf segmentation (healthy leaf range in HSV)
        lower_green = np.array([35, 40, 40])
        upper_green = np.array([90, 255, 255])
        leaf_mask = cv2.inRange(hsv, lower_green, upper_green)
        
        # Diseased region detection (brown/yellow lesions)
        # Brown/yellow color range
        lower_brown = np.array([10, 50, 50])
        upper_brown = np.array([25, 255, 255])
        brown_mask = cv2.inRange(hsv, lower_brown, upper_brown)
        
        # Yellow lesions
        lower_yellow = np.array([20, 50, 50])
        upper_yellow = np.array([35, 255, 255])
        yellow_mask = cv2.inRange(hsv, lower_yellow, upper_yellow)
        
        # Combine diseased regions
        diseased_mask = cv2.bitwise_or(brown_mask, yellow_mask)
        
        # Calculate severity percentage
        leaf_pixels = cv2.countNonZero(leaf_mask)
        diseased_pixels = cv2.countNonZero(diseased_mask)
        
        if leaf_pixels == 0:
            severity_percentage = 0
        else:
            severity_percentage = (diseased_pixels / leaf_pixels) * 100
            severity_percentage = min(100, max(0, severity_percentage))  # Clamp between 0-100
        
        return severity_percentage
    except Exception as e:
        print(f"Error calculating severity: {e}")
        return 0

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Smart Potato Farming backend is running"})

@app.route("/api/analyze-leaf", methods=["POST"])
def analyze_leaf():
    """
    Analyze leaf image and return severity and recommendations
    Expects base64 encoded image in request
    """
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        # Decode base64 image
        image_data = base64.b64decode(data['image'].split(',')[1] if ',' in data['image'] else data['image'])
        image = Image.open(BytesIO(image_data))
        image_array = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Calculate severity
        severity_percentage = calculate_disease_severity(image_array)
        
        # Get stage and recommendation
        stage = get_severity_stage(severity_percentage)
        recommendation = get_fertilizer_recommendation(stage)
        
        return jsonify({
            "success": True,
            "severity": round(severity_percentage, 2),
            "stage": stage,
            "recommendation": recommendation,
            "message": f"Disease severity: {severity_percentage:.2f}% - {stage} stage"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500

if __name__ == "__main__":
    app.run(debug=True)
