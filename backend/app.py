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
        
        # Diseased region detection - optimized for accurate dark brown hole detection
        
        # Convert to LAB color space for better brown detection
        lab = cv2.cvtColor(image_array, cv2.COLOR_BGR2LAB)
        
        # Brown and dark lesions in LAB space
        # Target: Low lightness (L), high red component (a), moderate yellow (b)
        # More aggressive range to capture all brown variations
        brown_lab = cv2.inRange(lab, np.array([10, 125, 120]), np.array([140, 190, 180]))
        
        # HSV-based detection (multiple ranges for comprehensive coverage)
        # Very dark brown/black necrotic spots 
        lower_dark_brown = np.array([0, 30, 5])
        upper_dark_brown = np.array([30, 255, 130])
        dark_brown_mask = cv2.inRange(hsv, lower_dark_brown, upper_dark_brown)
        
        # Medium to light brown lesions (expanded)
        lower_med_brown = np.array([5, 40, 20])
        upper_med_brown = np.array([30, 255, 170])
        med_brown_mask = cv2.inRange(hsv, lower_med_brown, upper_med_brown)
        
        # Yellow-brown mixed areas (chlorotic transitions)
        lower_yellow_brown = np.array([15, 50, 60])
        upper_yellow_brown = np.array([40, 255, 220])
        yellow_brown_mask = cv2.inRange(hsv, lower_yellow_brown, upper_yellow_brown)
        
        # Grayish/whitish dead tissue (necrotic centers)
        lower_gray_dead = np.array([0, 0, 30])
        upper_gray_dead = np.array([180, 50, 140])
        gray_dead_mask = cv2.inRange(hsv, lower_gray_dead, upper_gray_dead)
        
        # Combine all disease detection methods
        diseased_mask = cv2.bitwise_or(brown_lab, dark_brown_mask)
        diseased_mask = cv2.bitwise_or(diseased_mask, med_brown_mask)
        diseased_mask = cv2.bitwise_or(diseased_mask, yellow_brown_mask)
        diseased_mask = cv2.bitwise_or(diseased_mask, gray_dead_mask)
        
        # Remove noise while preserving lesion integrity
        kernel_small = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2, 2))
        diseased_mask = cv2.morphologyEx(diseased_mask, cv2.MORPH_OPEN, kernel_small)
        diseased_mask = cv2.morphologyEx(diseased_mask, cv2.MORPH_CLOSE, kernel_small)
        
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
        # 1. Leaf area visualization - original uploaded image
        leaf_viz = image_array.copy()
        
        # 2. Disease area visualization - show only diseased spots in red on white background
        disease_viz = np.ones_like(image_array, dtype=np.uint8) * 255  # White background
        disease_viz[valid_disease_mask > 0] = [0, 0, 255]  # Red for disease (BGR format)
        
        # 3. Combined visualization - original image with red overlay on diseased areas only
        combined_viz = image_array.copy()
        # Apply red overlay on diseased areas with 50% transparency
        red_color = np.array([0, 0, 255], dtype=np.uint8)
        for i in range(3):  # BGR channels
            combined_viz[:, :, i] = np.where(
                valid_disease_mask > 0,
                (image_array[:, :, i] * 0.5 + red_color[i] * 0.5).astype(np.uint8),
                image_array[:, :, i]
            )
        
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
