# Backend (Python + Flask)

This is the backend API for the Smart Potato Farming System. It provides endpoints for seed readiness prediction and image processing.

## Quick Setup

1. Install dependencies:

```powershell
cd backend
pip install -r requirements.txt
```

2. Run the Flask app:

```powershell
python app.py
```

The server will start on `http://localhost:5000` (or the configured port).

## Features

- **Seed Readiness Prediction**: Analyze potato seed images to predict readiness
- **Image Processing**: Preprocess images for ML model inference
- **Multiple Model Support**: Supports predictions for:
  - Seed readiness level
  - Shrivel level
  - Damage level
  - Sprout length

## Project Structure

```
backend/
├── app.py                              # Main Flask application
├── requirements.txt                    # Python dependencies
├── test_predict.py                     # Test script for predictions
├── seed_readiness_predictor_models/    # Trained Keras models
│   ├── seed_readiness_best.keras
│   ├── damage_level_best.keras
│   ├── shrivel_level_best.keras
│   └── sprout_length_best.keras
├── seed_readiness_predictor_labels/    # Label mappings for models
│   ├── seed_readiness_labels.json
│   ├── damage_level_labels.json
│   ├── shrivel_level_labels.json
│   └── sprout_length_labels.json
├── uploads/                            # Directory for uploaded images
└── utils/
    ├── predict.py                      # Prediction logic
    └── preprocess.py                   # Image preprocessing utilities
```

## API Endpoints

### Health Check
```
GET /
```
Returns API status.

### Make Prediction
```
POST /predict
```
Upload an image to get seed readiness predictions.

**Request**: `multipart/form-data` with image file
**Response**: JSON with predictions for seed readiness, damage level, shrivel level, and sprout length

## Testing

Run the test script to verify the setup:

```powershell
python test_predict.py
```

## Yield prediction models (Google Drive)

The app can download yield/cost pickle models from Google Drive if they are not in `backend/models/`.

1. **Create a ZIP** containing these 11 files (no subfolders inside the zip):
   - `best_price_model.pkl`, `best_yield_model.pkl`, `scaler.pkl`, `label_encoders.pkl`, `feature_columns.pkl`
   - `seed_cost_lkr_model.pkl`, `fertilizer_cost_lkr_model.pkl`, `labor_cost_lkr_model.pkl`
   - `cost_scaler.pkl`, `cost_label_encoders.pkl`, `cost_feature_columns.pkl`

2. **Upload** the ZIP to Google Drive and set sharing to **“Anyone with the link can view”**.

3. **Copy the share link** and put it in `model_config.json` under `google_drive_urls.yield_models_zip`:
   ```json
   "yield_models_zip": "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
   ```

4. Keep `"auto_download": true` in `model_config.json`. On first use of `/potato_analyze`, the app will download and extract the zip into `backend/models/`.

## Dependencies

Key packages (see `requirements.txt`):
- Flask — Web framework
- TensorFlow/Keras — ML models
- NumPy — Numerical computing
- Pillow — Image processing
- Python 3.8+

## Environment Variables

Configure these if needed:
- `FLASK_ENV` — Development or production
- `FLASK_DEBUG` — Enable debug mode
- `UPLOAD_FOLDER` — Path for uploaded images

## Model Information

All models are trained Keras models (`.keras` format) with corresponding label mappings:
- Models located in `seed_readiness_predictor_models/`
- Labels located in `seed_readiness_predictor_labels/`

## Notes

- Images are validated and preprocessed before model inference
- Predictions return confidence scores and labels
- Uploaded files are stored in the `uploads/` directory
