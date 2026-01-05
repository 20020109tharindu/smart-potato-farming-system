# Smart Potato Farming System - Backend

Flask-based REST API for soil health analysis and potato cultivation recommendations.

## 🚀 Features

- **Soil Health Prediction:** ML-powered soil suitability analysis
- **Fertilizer Recommendations:** Automated NPK fertilizer calculations
- **Historical Data Analysis:** Statistical insights from soil sample database
- **RESTful API:** Clean, well-documented endpoints

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## 🛠️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## 🏃 Running the Server

### Development Mode
```bash
python app.py
```

The server will start at `http://127.0.0.1:5000`

### Production Mode (Optional)
```bash
flask run --host=0.0.0.0 --port=5000
```

## 📚 API Endpoints

### Health Check
```http
GET /api/health
```
Check if the backend server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Smart Potato Farming backend is running"
}
```

---

### Soil Prediction
```http
POST /api/soil/predict
```
Predict soil suitability for potato cultivation.

**Request Body:**
```json
{
  "pH": 6.49,
  "EC": 0.042,
  "N": 40.2,
  "P": 43.4,
  "K": 250.4,
  "Temperature": 23.4,
  "Humidity": 76.5,
  "Moisture": 61.4
}
```

**Response:**
```json
{
  "label": "Marginally Suitable",
  "color": "orange",
  "desc": "Soil requires amendments for optimal potato growth",
  "prediction": 1,
  "confidence": 85.4,
  "recommendations": {
    "urea": 11,
    "tsp": 0,
    "mop": 8,
    "actions": [
      "pH level is optimal for potato cultivation",
      "Moderate nitrogen: Apply urea at 11 kg/acre",
      "..."
    ]
  }
}
```

---

### Soil Statistics
```http
GET /api/soil/statistics
```
Get statistical analysis from historical soil data.

**Response:**
```json
{
  "total_samples": 171,
  "total_locations": 12,
  "avg_ph": 6.02,
  "avg_nitrogen": 42.5,
  "avg_phosphorus": 95.3,
  "avg_potassium": 267.8,
  "avg_moisture": 55.2,
  "avg_temperature": 21.3,
  "suitability_distribution": {
    "0": 15,
    "1": 48,
    "2": 108
  }
}
```

---

### Recent Samples
```http
GET /api/soil/recent?limit=5
```
Get recent soil samples from the database.

**Query Parameters:**
- `limit` (optional): Number of samples to return (default: 10)

**Response:**
```json
{
  "samples": [
    {
      "Farm_ID": "BD_BW_2023_0001",
      "Location": "Bandarawela",
      "Collection_Date": "2023-10-09",
      "pH": 6.4,
      "N": 50.2,
      "P": 116.5,
      "K": 335.9,
      "Soil_Suitability": 2
    }
  ]
}
```

## 🧪 ML Model

### Model Information
- **File:** `model/best_soil_model.pkl`
- **Type:** Gradient Boosting Classifier
- **Features:** pH, EC, P, K, Temperature, Humidity, Moisture, N
- **Output:** 3 classes (0: Not Suitable, 1: Marginally Suitable, 2: Suitable)

### Model Performance
- Trained on 171 soil samples from Sri Lankan potato farms
- Features exclude Organic Matter and Altitude as per requirements

## 📁 Project Structure

```
backend/
├── app.py                    # Main Flask application
├── soil_utils.py            # ML model and prediction utilities
├── requirements.txt         # Python dependencies
├── soil_data.csv           # Historical soil sample data
└── model/
    └── best_soil_model.pkl # Trained ML model
```

## 📦 Dependencies

```
Flask==3.1.2
flask-cors==6.0.1
pandas==2.0.3
scikit-learn==1.3.0
```

## 🔧 Configuration

### CORS Settings
CORS is enabled for all origins in development. Update in `app.py` for production:

```python
CORS(app, resources={r"/api/*": {"origins": "https://yourdomain.com"}})
```

### Model Path
Model is loaded from `model/best_soil_model.pkl` relative to `app.py`

## 🐛 Troubleshooting

### Model Version Warnings
If you see sklearn version warnings:
```bash
pip install scikit-learn==1.6.1
```
Or retrain the model with your current sklearn version.

### Port Already in Use
Change the port in `app.py`:
```python
app.run(debug=True, port=5001)
```

### CSV File Not Found
Ensure `soil_data.csv` is in the backend directory:
```bash
ls -la soil_data.csv
```

## 🧪 Testing

Test the API with curl:

```bash
# Health check
curl http://127.0.0.1:5000/api/health

# Soil prediction
curl -X POST http://127.0.0.1:5000/api/soil/predict \
  -H "Content-Type: application/json" \
  -d '{"pH":6.49,"EC":0.042,"N":40.2,"P":43.4,"K":250.4,"Temperature":23.4,"Humidity":76.5,"Moisture":61.4}'

# Statistics
curl http://127.0.0.1:5000/api/soil/statistics

# Recent samples
curl http://127.0.0.1:5000/api/soil/recent?limit=5
```

## 📝 Notes

- The model uses 8 soil parameters (excluding OM and Altitude)
- Fertilizer recommendations are based on nutrient status thresholds
- All measurements follow Sri Lankan agricultural standards
- Temperature in Celsius, Moisture/Humidity in percentage

## 🤝 Contributing

When updating the model or adding new features:
1. Update `soil_utils.py` with new logic
2. Test all API endpoints
3. Update this README with new endpoints
4. Ensure backward compatibility

## 📄 License

Part of the Smart Potato Farming System project.

## 👨‍💻 Maintainer

Backend API for soil health analysis and crop recommendations.
