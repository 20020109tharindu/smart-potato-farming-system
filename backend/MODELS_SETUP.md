# Model Setup Guide

## For team members (first-time run)

You **don’t need** to copy or download model files yourself. The repo already has `model_config.json` with Google Drive links. When you run the backend for the first time (`python app.py`), it will automatically download all models (sprout .pth + Keras models) into `backend/models/`. After that, predictions work as usual. Just ensure Drive links are shared as **“Anyone with the link can view”**.

---

## Problem
Manually copying model files from Google Colab to VS Code every time you retrain is inefficient.

## Solution: Auto-Download from Google Drive

The backend now automatically downloads model files from Google Drive URLs!

### Steps:

#### 1. In Google Colab (after training):
```python
# Save model to Google Drive
from google.colab import drive
drive.mount('/content/drive')

# Save your models
model.save('/content/drive/MyDrive/potato_models/sprout_length.keras')
model.save('/content/drive/MyDrive/potato_models/shrivel_level.keras')
model.save('/content/drive/MyDrive/potato_models/damage_level.keras')
model.save('/content/drive/MyDrive/potato_models/seed_readiness.keras')
```

#### 2. Get Shareable Links:
- Go to Google Drive
- Right-click each model file → "Get shareable link"
- Set to "Anyone with the link can view"
- Copy the link (looks like: `https://drive.google.com/file/d/1abc123xyz/view?usp=sharing`)

#### 3. Update `model_config.json`:
```json
{
  "model_source": "google_drive",
  "auto_download": true,
  "google_drive_urls": {
    "sprout_length": "https://drive.google.com/file/d/YOUR_FILE_ID_1/view",
    "shrivel_level": "https://drive.google.com/file/d/YOUR_FILE_ID_2/view",
    "damage_level": "https://drive.google.com/file/d/YOUR_FILE_ID_3/view",
    "seed_readiness": "https://drive.google.com/file/d/YOUR_FILE_ID_4/view"
  }
}
```

#### 4. Run Backend:
```bash
python app.py
```

The models will automatically download on first run!

### To Update Models:
1. Train new model in Colab
2. Save to same Google Drive location (overwrite old file)
3. Delete local model from `backend/models/` folder
4. Restart backend - new model downloads automatically!

### Alternative: Local Models
If you prefer local files, set:
```json
{
  "model_source": "local",
  "auto_download": false
}
```
Then manually place models in `backend/models/` folder.

### Sprout Length (PyTorch)
- The **sprout length** model is a PyTorch keypoint model (`.pth`), not Keras.
- Put the shareable link in `google_drive_urls.sprout_length` in `model_config.json`.
- The backend downloads it as `sprout_heatmap_keypoint_best.pth` into `backend/models/`.
- Labels are derived from the model (none / short / medium / long); no labels file needed.

### File Locations:
- **Models**: `backend/models/` (Keras: `*.keras`; Sprout: `sprout_heatmap_keypoint_best.pth`)
- **Labels**: `backend/seed_readiness_predictor_labels/` (for shrivel, damage, seed_readiness only)
- **Config**: `backend/model_config.json`
