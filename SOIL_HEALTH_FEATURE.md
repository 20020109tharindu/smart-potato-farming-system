# Soil Health Analysis Feature

## Overview
Complete soil health analysis system with ML prediction for potato cultivation suitability.

## Features Implemented

### Backend (Flask API)
- **API Endpoints:**
  - `POST /api/soil/predict` - Predict soil suitability with ML model
  - `GET /api/soil/statistics` - Get statistical analysis from historical data
  - `GET /api/soil/recent` - Get recent soil samples

- **Files Created:**
  - `backend/soil_utils.py` - ML model integration and recommendation engine
  - `backend/soil_data.csv` - Historical soil data (171 samples)
  - `backend/app.py` - Updated with soil health routes

### Frontend (React)
- **New Page:** `frontend/src/pages/SoilHealth.jsx`
- **Route:** `/app/soil-health`
- **Features:**
  - 📊 Statistics dashboard with 4 metric cards
  - 🌱 Soil parameter input form (pH, EC, N, P, K, Temperature, Humidity, Moisture)
  - 📈 Real-time prediction with ML model
  - 🧪 Fertilizer recommendations (Urea, TSP, MOP)
  - 📋 Actionable recommendations based on soil conditions
  - 📊 Data analysis tab with historical trends
  - 📑 Recent samples table

### Parameters Used (Excluding OM & Altitude as requested)
1. **pH** - Soil acidity/alkalinity (optimal: 5.5-6.5)
2. **EC** - Electrical Conductivity
3. **N** - Nitrogen (ppm)
4. **P** - Phosphorus (ppm)
5. **K** - Potassium (ppm)
6. **Temperature** - Ambient temperature (°C)
7. **Humidity** - Relative humidity (%)
8. **Moisture** - Soil moisture content (%)

### Predictions & Recommendations
- **Suitability Levels:**
  - ✅ Suitable (Green)
  - ⚠️ Marginally Suitable (Orange)
  - ❌ Not Suitable (Red)

- **Fertilizer Recommendations:**
  - Urea (kg/acre) - Based on nitrogen levels
  - TSP - Triple Super Phosphate (kg/acre) - Based on phosphorus
  - MOP - Muriate of Potash (kg/acre) - Based on potassium

## Installation & Setup

### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Backend Server
```bash
python app.py
```
Server runs on `http://127.0.0.1:5000`

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## Git Branch
Created feature branch: `feature/soil-health`

**Commits:**
1. Main feature implementation with ML prediction
2. Added pandas and scikit-learn dependencies

## Usage

1. Navigate to `/app/soil-health` from the sidebar
2. Click "Predict Suitability" tab
3. Enter soil parameters in the form
4. Click "🔍 Analyze Soil"
5. View results with:
   - Suitability prediction with confidence score
   - Fertilizer recommendations
   - Actionable suggestions
6. Check "Data Analysis" tab for historical insights

## Design
- Clean, modern UI using existing color scheme (green theme)
- Responsive cards and forms
- Tabbed interface for organized content
- Gradient cards matching existing Dashboard style
- Clear visual indicators for soil suitability levels

## Model Integration
- Uses `best_soil_model.pkl` from `backend/model/` directory
- Automatic model loading on server startup
- Error handling for missing model or data files

## Next Steps (For IOT Integration)
When ready to implement IoT:
- Connect sensors to real-time data collection
- Add WebSocket for live updates
- Implement time-series data storage
- Add alert system for critical soil conditions
