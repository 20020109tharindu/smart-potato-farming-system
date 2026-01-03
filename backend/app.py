from flask import Flask, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import base64

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable CORS for all routes

# Add request size limit
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max

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

def array_to_base64(image_array):
    """
    Convert numpy array to base64 string
    """
    _, buffer = cv2.imencode('.jpg', image_array)
    base64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{base64_str}"

def calculate_disease_severity(image_array):
    """
    Calculate disease severity from image
    Uses HSV-based leaf segmentation and color-based lesion detection
    Returns severity percentage and visualization images
    """
    try:
        # Convert BGR to HSV
        hsv = cv2.cvtColor(image_array, cv2.COLOR_BGR2HSV)
        
        # Green leaf segmentation (improved range for better detection)
        # Detecting all green shades including light green and olive
        lower_green = np.array([25, 20, 20])
        upper_green = np.array([100, 255, 255])
        leaf_mask = cv2.inRange(hsv, lower_green, upper_green)
        
        # Apply morphological operations to clean up noise
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_CLOSE, kernel)
        leaf_mask = cv2.morphologyEx(leaf_mask, cv2.MORPH_OPEN, kernel)
        
        # Remove small black spots (holes) from leaf mask
        # Fill holes by using closing operation with larger kernel
        large_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
        leaf_mask_filled = cv2.morphologyEx(leaf_mask, cv2.MORPH_CLOSE, large_kernel)
        
        # Diseased region detection (brown/dark lesions on leaves)
        # Potato late blight creates dark brown/black necrotic lesions
        
        # Dark brown lesions (H: 0-20, low saturation, medium-low value)
        lower_brown1 = np.array([0, 10, 30])
        upper_brown1 = np.array([20, 150, 180])
        brown_mask1 = cv2.inRange(hsv, lower_brown1, upper_brown1)
        
        # Reddish-brown lesions (H: 160-180)
        lower_brown2 = np.array([160, 20, 40])
        upper_brown2 = np.array([180, 200, 200])
        brown_mask2 = cv2.inRange(hsv, lower_brown2, upper_brown2)
        
        # Olive/dark lesions (H: 20-40, medium saturation)
        lower_olive = np.array([20, 30, 40])
        upper_olive = np.array([40, 180, 160])
        olive_mask = cv2.inRange(hsv, lower_olive, upper_olive)
        
        # Combine all diseased regions
        diseased_mask = cv2.bitwise_or(brown_mask1, brown_mask2)
        diseased_mask = cv2.bitwise_or(diseased_mask, olive_mask)
        
        # Remove small noise and fill small gaps in disease regions
        diseased_mask = cv2.morphologyEx(diseased_mask, cv2.MORPH_CLOSE, kernel)
        diseased_mask = cv2.morphologyEx(diseased_mask, cv2.MORPH_OPEN, kernel)
        
        # Only count diseased pixels within filled leaf area (without small holes)
        # This ensures we only detect disease on the leaf, not background
        valid_disease_mask = cv2.bitwise_and(diseased_mask, leaf_mask_filled)
        
        # Calculate severity percentage using filled leaf mask for accuracy
        leaf_pixels = cv2.countNonZero(leaf_mask_filled)
        diseased_pixels = cv2.countNonZero(valid_disease_mask)
        
        if leaf_pixels == 0:
            severity_percentage = 0
        else:
            severity_percentage = (diseased_pixels / leaf_pixels) * 100
            severity_percentage = min(100, max(0, severity_percentage))  # Clamp between 0-100
        
        # Create visualization images
        # 1. Leaf area visualization (green) - use filled mask
        leaf_viz = cv2.cvtColor(leaf_mask_filled, cv2.COLOR_GRAY2BGR)
        leaf_viz[:, :, 1] = 0  # Remove green
        leaf_viz[:, :, 2] = 0  # Remove red
        leaf_viz[:, :, 0] = leaf_mask_filled  # Keep only blue channel -> GREEN in BGR
        # Actually, let's do it correctly for BGR format
        leaf_viz = np.zeros_like(image_array)
        leaf_viz[:, :, 1] = leaf_mask_filled  # Green channel (G in BGR)
        
        # 2. Disease area visualization (red)
        disease_viz = np.zeros_like(image_array)
        disease_viz[:, :, 2] = valid_disease_mask  # Red channel (R in BGR)
        
        # 3. Combined visualization (green leaf + red disease)
        combined_viz = image_array.copy()
        # Highlight leaf area in green overlay
        combined_viz[leaf_mask_filled > 0] = [0, 150, 0]  # Green in BGR
        # Highlight disease area in red overlay (overwrites green)
        combined_viz[valid_disease_mask > 0] = [0, 0, 255]  # Red in BGR
        
        return {
            'severity_percentage': severity_percentage,
            'leaf_pixels': leaf_pixels,
            'diseased_pixels': diseased_pixels,
            'leaf_mask': leaf_mask_filled,
            'disease_mask': valid_disease_mask,
            'leaf_viz': leaf_viz,
            'disease_viz': disease_viz,
            'combined_viz': combined_viz
        }
    except Exception as e:
        print(f"Error calculating severity: {e}")
        import traceback
        traceback.print_exc()
        return {
            'severity_percentage': 0,
            'leaf_pixels': 0,
            'diseased_pixels': 0,
            'leaf_mask': None,
            'disease_mask': None,
            'leaf_viz': None,
            'disease_viz': None,
            'combined_viz': None
        }

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Smart Potato Farming backend is running"})

@app.route("/api/analyze-leaf", methods=["POST", "OPTIONS"])
def analyze_leaf():
    """
    Analyze leaf image and return severity and recommendations
    Expects base64 encoded image in request
    """
    # Handle preflight requests
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    
    try:
        data = request.get_json()
        print(f"Received request. Data keys: {data.keys() if data else 'None'}")
        
        if not data or 'image' not in data:
            print("Error: No image data provided")
            return jsonify({"error": "No image provided", "success": False}), 400
        
        image_data_str = data['image']
        print(f"Image data length: {len(image_data_str)}")
        
        # Decode base64 image
        try:
            # Handle data URL format (data:image/jpeg;base64,...)
            if ',' in image_data_str:
                image_data_str = image_data_str.split(',')[1]
            
            image_data = base64.b64decode(image_data_str)
            image = Image.open(BytesIO(image_data))
            print(f"Image loaded. Mode: {image.mode}, Size: {image.size}")
            
            # Convert to RGB if RGBA
            if image.mode == 'RGBA':
                image = image.convert('RGB')
            
            image_array = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            print(f"Image converted to OpenCV format: {image_array.shape}")
        except Exception as decode_err:
            print(f"Error decoding image: {decode_err}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": f"Failed to decode image: {str(decode_err)}", "success": False}), 400
        
        # Calculate severity with visualizations
        print("Starting disease severity calculation...")
        result = calculate_disease_severity(image_array)
        severity_percentage = result['severity_percentage']
        print(f"Severity calculated: {severity_percentage}%")
        
        # Get stage and recommendation
        stage = get_severity_stage(severity_percentage)
        recommendation = get_fertilizer_recommendation(stage)
        print(f"Stage determined: {stage}")
        
        # Convert visualization images to base64
        try:
            print("Converting visualizations to base64...")
            leaf_viz_base64 = array_to_base64(result['leaf_viz']) if result['leaf_viz'] is not None else None
            disease_viz_base64 = array_to_base64(result['disease_viz']) if result['disease_viz'] is not None else None
            combined_viz_base64 = array_to_base64(result['combined_viz']) if result['combined_viz'] is not None else None
            print("Visualizations converted successfully")
        except Exception as viz_err:
            print(f"Error converting visualizations: {viz_err}")
            import traceback
            traceback.print_exc()
            leaf_viz_base64 = None
            disease_viz_base64 = None
            combined_viz_base64 = None
        
        response_data = {
            "success": True,
            "severity": round(severity_percentage, 2),
            "stage": stage,
            "leafPixels": int(result['leaf_pixels']),
            "diseasedPixels": int(result['diseased_pixels']),
            "recommendation": recommendation,
            "visualizations": {
                "leafArea": leaf_viz_base64,
                "diseaseArea": disease_viz_base64,
                "combined": combined_viz_base64
            },
            "message": f"Disease severity: {severity_percentage:.2f}% - {stage} stage"
        }
        
        print(f"Returning response. Severity: {response_data['severity']}, Stage: {response_data['stage']}")
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Error in analyze_leaf: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Analysis failed: {str(e)}", "success": False}), 500

if __name__ == "__main__":
    app.run(debug=True)
