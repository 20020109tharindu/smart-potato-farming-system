import pandas as pd
import pickle
import os
from flask import jsonify

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'best_soil_model.pkl')
model = None

def load_model():
    """Load the trained soil model"""
    global model
    if model is None:
        try:
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
            print("✓ Soil model loaded successfully")
        except Exception as e:
            print(f"✗ Error loading model: {e}")
            model = None
    return model

def predict_soil_suitability(data):
    """
    Predict soil suitability based on input parameters
    Parameters not used: Organic Matter, Altitude
    """
    try:
        # Load model if not loaded
        mdl = load_model()
        if mdl is None:
            return {"error": "Model not loaded"}
        
        # Expected features (excluding OM and Altitude)
        features = ['pH', 'EC', 'P', 'K', 'Temperature', 'Humidity', 'Moisture', 'N']
        
        # Create DataFrame with input data
        input_df = pd.DataFrame([data], columns=features)
        
        # Make prediction
        prediction = mdl.predict(input_df)[0]
        
        # Get probability if available
        if hasattr(mdl, 'predict_proba'):
            probabilities = mdl.predict_proba(input_df)[0]
            confidence = float(max(probabilities)) * 100
        else:
            confidence = None
        
        # Map prediction to category
        suitability_map = {
            0: {"label": "Not Suitable", "color": "red", "desc": "Soil conditions are not favorable for potato cultivation"},
            1: {"label": "Marginally Suitable", "color": "orange", "desc": "Soil requires amendments for optimal potato growth"},
            2: {"label": "Suitable", "color": "green", "desc": "Soil conditions are favorable for potato cultivation"}
        }
        
        result = suitability_map.get(prediction, {"label": "Unknown", "color": "gray", "desc": "Unable to determine suitability"})
        result['prediction'] = int(prediction)
        result['confidence'] = confidence
        
        # Get recommendations based on input values
        recommendations = generate_recommendations(data, prediction)
        result['recommendations'] = recommendations
        
        return result
        
    except Exception as e:
        return {"error": str(e)}

def generate_recommendations(data, prediction):
    """Generate fertilizer recommendations based on soil data"""
    recommendations = {
        'urea': 0,
        'tsp': 0,
        'mop': 0,
        'actions': []
    }
    
    # pH recommendations
    ph = data.get('pH', 0)
    if ph < 5.5:
        recommendations['actions'].append("Add lime to increase soil pH to optimal range (5.5-6.5)")
    elif ph > 6.5:
        recommendations['actions'].append("Add sulfur to decrease soil pH to optimal range (5.5-6.5)")
    else:
        recommendations['actions'].append("pH level is optimal for potato cultivation")
    
    # Nitrogen (N) recommendations
    n = data.get('N', 0)
    if n < 30:
        recommendations['urea'] = 16.5
        recommendations['actions'].append("Low nitrogen: Apply urea at 16.5 kg/acre")
    elif n < 45:
        recommendations['urea'] = 11
        recommendations['actions'].append("Moderate nitrogen: Apply urea at 11 kg/acre")
    elif n < 55:
        recommendations['urea'] = 5.5
        recommendations['actions'].append("Good nitrogen: Apply urea at 5.5 kg/acre")
    else:
        recommendations['urea'] = 3
        recommendations['actions'].append("High nitrogen: Minimal urea application needed (3 kg/acre)")
    
    # Phosphorus (P) recommendations
    p = data.get('P', 0)
    if p < 50:
        recommendations['tsp'] = 6.7
        recommendations['actions'].append("Low phosphorus: Apply TSP at 6.7 kg/acre")
    elif p < 100:
        recommendations['tsp'] = 4.5
        recommendations['actions'].append("Moderate phosphorus: Apply TSP at 4.5 kg/acre")
    else:
        recommendations['tsp'] = 0
        recommendations['actions'].append("Adequate phosphorus: No TSP application needed")
    
    # Potassium (K) recommendations
    k = data.get('K', 0)
    if k < 200:
        recommendations['mop'] = 12.5
        recommendations['actions'].append("Low potassium: Apply MOP at 12.5 kg/acre")
    elif k < 280:
        recommendations['mop'] = 8
        recommendations['actions'].append("Moderate potassium: Apply MOP at 8 kg/acre")
    elif k < 320:
        recommendations['mop'] = 5
        recommendations['actions'].append("Good potassium: Apply MOP at 5 kg/acre")
    else:
        recommendations['mop'] = 0
        recommendations['actions'].append("High potassium: No MOP application needed")
    
    # Moisture recommendations
    moisture = data.get('Moisture', 0)
    if moisture < 40:
        recommendations['actions'].append("⚠ Low moisture: Increase irrigation frequency")
    elif moisture > 75:
        recommendations['actions'].append("⚠ High moisture: Improve drainage to prevent waterlogging")
    else:
        recommendations['actions'].append("✓ Moisture level is optimal")
    
    # Temperature recommendations
    temp = data.get('Temperature', 0)
    if temp < 15:
        recommendations['actions'].append("⚠ Low temperature: Consider delaying planting")
    elif temp > 25:
        recommendations['actions'].append("⚠ High temperature: Ensure adequate irrigation and mulching")
    else:
        recommendations['actions'].append("✓ Temperature is optimal for potato growth")
    
    return recommendations

def get_soil_statistics(csv_path='soil_data.csv'):
    """Get statistics from soil data CSV"""
    try:
        # Check if file exists in backend directory
        if not os.path.exists(csv_path):
            # Try in parent directory
            csv_path = os.path.join(os.path.dirname(__file__), '..', 'soil_data.csv')
        
        if not os.path.exists(csv_path):
            return {"error": "CSV file not found"}
        
        df = pd.read_csv(csv_path)
        
        # Calculate statistics
        stats = {
            'total_samples': len(df),
            'locations': df['Location'].unique().tolist(),
            'total_locations': len(df['Location'].unique()),
            'suitability_distribution': df['Soil_Suitability'].value_counts().to_dict(),
            'avg_ph': float(df['pH'].mean()),
            'avg_nitrogen': float(df['N'].mean()),
            'avg_phosphorus': float(df['P'].mean()),
            'avg_potassium': float(df['K'].mean()),
            'avg_moisture': float(df['Moisture'].mean()),
            'avg_temperature': float(df['Temperature'].mean()),
            'growth_stages': df['Growth_Stage'].value_counts().to_dict()
        }
        
        return stats
        
    except Exception as e:
        return {"error": str(e)}

def get_recent_samples(csv_path='soil_data.csv', limit=10):
    """Get recent soil samples from CSV"""
    try:
        if not os.path.exists(csv_path):
            csv_path = os.path.join(os.path.dirname(__file__), '..', 'soil_data.csv')
        
        if not os.path.exists(csv_path):
            return {"error": "CSV file not found"}
        
        df = pd.read_csv(csv_path)
        
        # Convert date and sort
        df['Collection_Date'] = pd.to_datetime(df['Collection_Date'], format='%m/%d/%Y')
        df_sorted = df.sort_values('Collection_Date', ascending=False).head(limit)
        
        # Convert to dict
        samples = df_sorted.to_dict('records')
        
        # Convert dates to string
        for sample in samples:
            sample['Collection_Date'] = sample['Collection_Date'].strftime('%Y-%m-%d')
        
        return samples
        
    except Exception as e:
        return {"error": str(e)}
