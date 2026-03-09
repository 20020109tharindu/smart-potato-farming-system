# Backend (Python + Flask)

The backend API server for the Smart Potato Farming System. Provides disease prediction, seed readiness analysis, ESP32-CAM integration, AI-powered recommendations, and disease reporting.

## Quick Setup

```bash
cd backend
python -m venv ../.venv
source ../.venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the server:

```bash
python app.py
# Runs on http://127.0.0.1:5000
```

> **Note:** The disease model (`models/disease.h5`) is auto-downloaded from Google Drive on first launch via `gdown`.

## Features

- **Leaf Disease Prediction** — CNN-based classification (Early Blight / Late Blight / Healthy) with OpenCV disease-area visualization
- **ESP32-CAM Integration** — Capture images directly from ESP32-CAM hardware over WiFi and run disease prediction
- **Gemini AI Recommendations** — Personalized fertilizer and treatment plans via Google Gemini 2.5 Flash REST API with automatic model fallback
- **Disease Reporting** — CRUD API for crowdsourced disease map reports (JSON file storage)
- **Seed Readiness Prediction** — Multi-model ensemble for seed readiness, damage level, shrivel level, and sprout length
- **Disease Area Visualization** — OpenCV-based heatmap, contour detection, and severity percentage calculation

## Project Structure

```
backend/
├── app.py                              # Main Flask application (all endpoints)
├── requirements.txt                    # Python dependencies
├── .env                                # API keys (GEMINI_API_KEY)
├── model_config.json                   # Disease model Google Drive download config
├── disease_reports.json                # Stored disease map reports
├── test_predict.py                     # Test script for seed predictions
├── models/                             # Disease TensorFlow models (auto-downloaded)
│   └── disease.h5
├── seed_readiness_predictor_models/    # Trained Keras models (.keras)
│   ├── seed_readiness_best.keras
│   ├── damage_level_best.keras
│   ├── shrivel_level_best.keras
│   └── sprout_length_best.keras
├── seed_readiness_predictor_labels/    # Label mappings (JSON)
│   ├── seed_readiness_labels.json
│   ├── damage_level_labels.json
│   ├── shrivel_level_labels.json
│   └── sprout_length_labels.json
├── uploads/                            # Temporary uploaded images
└── utils/
    ├── predict.py                      # Seed readiness prediction logic
    └── preprocess.py                   # Image preprocessing utilities
```

## API Endpoints

### Health Check

```
GET /api/health
```

Returns `{ "status": "ok", "message": "..." }`.

### Disease Prediction (Image Upload)

```
POST /api/predict-disease
Content-Type: multipart/form-data
Body: image=<file>
```

**Response:**
```json
{
  "success": true,
  "predicted_class": "Early Blight",
  "confidence": 94.3,
  "class_probabilities": [...],
  "recommendation": { "action": "...", "fertilizer": "...", "severity": "..." },
  "visualizations": {
    "original": "data:image/png;base64,...",
    "heatmap": "data:image/png;base64,...",
    "contour": "data:image/png;base64,...",
    "combined": "data:image/png;base64,...",
    "disease_area_pct": 3.4
  }
}
```

### Disease Prediction (ESP32-CAM)

```
POST /api/predict-from-esp32
Content-Type: application/json
Body: { "esp32_ip": "10.27.132.16" }
```

Fetches a JPEG from `http://<esp32_ip>/capture`, runs disease prediction. Same response format as `/api/predict-disease` with `"source": "esp32"`.

### AI Recommendation (Gemini)

```
POST /api/ai-recommendation
Content-Type: application/json
Body: { "disease": "Early Blight", "confidence": 94.3, "disease_area_pct": 3.4 }
```

**Response:**
```json
{
  "success": true,
  "ai_recommendation": {
    "immediate_actions": "...",
    "fertilizer_plan": "...",
    "preventive_measures": "...",
    "ai_severity_assessment": "..."
  }
}
```

### Seed Readiness Prediction

```
POST /predict
Content-Type: multipart/form-data
Body: image=<file>
```

Returns predictions for seed readiness, damage level, shrivel level, and sprout length.

### Disease Reports (CRUD)

```
GET    /api/disease-reports            # List all reports
POST   /api/disease-reports            # Add report { lat, lng, disease, severity, note, date }
DELETE /api/disease-reports/<id>        # Delete a report
```

## Dependencies

Key packages (see `requirements.txt`):

| Package | Purpose |
|---------|---------|
| Flask + Flask-CORS | Web framework with CORS |
| TensorFlow / Keras | Disease & seed readiness CNN models |
| OpenCV (`opencv-python`) | Disease area visualization & heatmaps |
| NumPy / Pillow | Image processing |
| requests | Gemini REST API calls |
| python-dotenv | Environment variable loading |
| gdown | Auto-download disease model from Google Drive |
| scikit-learn | ML utilities |
| pandas | Data processing |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI recommendations |

## Disease Model

- **Path:** `models/disease.h5`
- **Auto-download:** Configured in `model_config.json` — pulled from Google Drive via `gdown` on first use
- **Architecture:** CNN trained on potato leaf images
- **Input:** 224×224 RGB images
- **Classes:** `["Early Blight", "Late Blight", "Healthy"]`
- **Output:** Softmax probability distribution

## Gemini AI Integration

- **Model:** `gemini-2.5-flash` (primary), with fallback to `gemini-2.0-flash` and `gemini-2.0-flash-lite`
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- **Retry logic:** 3 attempts with exponential backoff per model, automatic fallback on 429/5xx errors
- **Response format:** Structured JSON with immediate actions, fertilizer plan, preventive measures, and severity assessment

## Testing

```bash
python test_predict.py
```

## Notes

- Images are validated and preprocessed before model inference
- Predictions return confidence scores and labels
- Uploaded files are stored in the `uploads/` directory
