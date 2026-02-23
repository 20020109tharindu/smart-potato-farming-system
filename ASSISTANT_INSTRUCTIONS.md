# Potato Seed Readiness Predictor — Implementation Guidance (Copilot)

## 0) Goal (What we are building)
A responsive web app (React) + Flask backend that:
1) Farmer uploads (or captures) a potato seed photo
2) Backend runs preprocessing (crop/remove background noise if possible)
3) Model predicts:
   - Readiness (Ready / Not Ready / Maybe)
   - Sprout length category (Short / Medium / Long) OR readiness rules-based label
   - Damage/quality category (Low / Medium / High) (optional, if you have this label)
4) Backend returns a **personalized feedback message** in Sinhala/English with suggestions
5) Admin can see model metrics and which model is currently active (best accuracy)

---

## 1) Decide the “Model Type” (Important)
### You DO need Computer Vision (CV).
Because:
- Your input is images (potato seeds)
- Background varies (buildings, people, tables, etc.)
- You need to extract visual features (sprouts, damage, shape)

**Simplest approach (fast + strong):**
- Use an image classification CNN (Transfer Learning) and add preprocessing to reduce background.
- If background is too noisy, use a **segmentation/cropping step** (CV) before classification.

**We will implement:**
A) Preprocess: auto-crop potato area (from background)
B) Train: 3 classification models
C) Use best model
D) Return feedback rules-based

---

## 2) Dataset Plan (You already captured 700–800 images)
### 2.1 Single potato per image vs multiple potatoes?
**For readiness prediction, prefer:**
- **One potato per image** for training (easier, more accurate)
- Later you can support multi-potato by adding a detection step (optional)

So:
- **Training dataset:** mostly single potato images (recommended 800–1500)
- **Optional multi-potato dataset:** later, for detection/segmentation

### 2.2 Your images status (what’s good / what to fix)
✅ Good:
- White background images are excellent
- Potato is visible and sharp

⚠️ Needs improvement:
- Images with buildings/people/background will reduce accuracy unless you crop.
- Potato not centered is OK **if cropping is done**.
- Distance changes are OK **if your dataset includes that variation** (it helps generalization).
- But extremely far images (potato tiny) are bad.

**Rule: potato must occupy at least 15–30% of image area.**

---

## 3) Folder Structure (Dataset + Labels)
Create this structure in your repo (or in Google Drive if using Colab):

dataset/
  raw/
    single/
      IMG_0001.jpg
      ...
    noisy_background/
      IMG_0200.jpg
  processed/
    images/
    labels.csv
  splits/
    train/
      images/
      labels.csv
    val/
      images/
      labels.csv
    test/
      images/
      labels.csv

---

## 4) Labeling Strategy (fast + accurate)
### 4.1 What labels should we store?
Minimum:
- `readiness` = {ready, not_ready, maybe}

Optional (if your rubric includes these):
- `sprout_length_cat` = {short, medium, long}
- `damage_cat` = {low, medium, high}
- `sprout_count` = integer (optional)
- `notes` = text

### 4.2 How to label quickly (recommended workflow)
**Use a CSV label file** instead of drawing boxes for now.

Create: `dataset/processed/labels.csv`

Columns:
- filename
- readiness
- sprout_length_cat
- damage_cat
- notes

Example:
filename,readiness,sprout_length_cat,damage_cat,notes
IMG_0001.jpg,ready,medium,low,good sprouts
IMG_0002.jpg,not_ready,short,low,too short
IMG_0003.jpg,maybe,short,low,short but healthy

**How to decide “maybe”?**
Use it for borderline cases (ex: 1.5–2.5cm but good quality). This solves your “short sprout but still ready” problem.

---

## 5) Preprocessing Pipeline (Auto-crop + clean)
We will implement a robust preprocessing function in Python (OpenCV):
1) Resize (keep aspect ratio, max side 1024)
2) Convert to HSV
3) Detect white background (or detect potato region by non-white)
4) Morphology clean
5) Find largest contour
6) Crop bounding box + add padding
7) Output 224x224 for model

This will make noisy background images usable.

**Output:** cleaned image ready for model.

---

## 6) Train 3 Models (Pick best)
Train in Google Colab or local if you have GPU.

### Model A (Baseline): MobileNetV2 Transfer Learning
- Fast, good accuracy

### Model B: EfficientNetB0 Transfer Learning
- Often better accuracy than MobileNet

### Model C: ResNet50 Transfer Learning
- Strong baseline, slightly heavier

All models output `readiness` (3 classes).

**Evaluation metrics:**
- Accuracy
- F1-score (macro)
- Confusion matrix

Save best model as:
backend/models/best_model.keras
backend/models/label_map.json

---

## 7) Flask Backend Implementation
### 7.1 Backend endpoints
Create these routes in Flask:

POST `/api/predict`
- form-data: `image` (file)
- returns JSON:
  - readiness_pred
  - confidence
  - feedback_text
  - processed_image_preview (optional base64)
  - model_name

GET `/api/health`
- returns {status: "ok"}

GET `/api/model-info`
- returns model metadata + accuracy + date trained

### 7.2 Backend flow (predict)
1) Receive image
2) Run preprocessing (crop)
3) Run model inference
4) Generate feedback message
5) Return JSON

---

## 8) Feedback Generator (Personalized to farmer)
Create rules-based feedback based on prediction & confidence:

Example rules:
- If `ready` & conf > 0.70:
  - "Your seed looks ready to plant. Sprouts are healthy. Plant soon to avoid breakage."
- If `not_ready`:
  - "Not ready yet. Keep in cool airy place. Avoid direct sunlight. Recheck in 3–5 days."
- If `maybe` or confidence < 0.60:
  - "Borderline. Please take another photo closer and ensure sprouts are visible."

Also return “tips”:
- Capture top view
- Keep white background
- Ensure potato is close enough
- No blur

Support Sinhala + English by storing templates or using simple mapping.

---

## 9) React Frontend (Mobile-first, camera upload)
You are using Vite + React.

### 9.1 Mobile camera capture input
Use:
`<input type="file" accept="image/*" capture="environment" />`

This opens camera on mobile.

### 9.2 UI Flow
Page: `UploadSeed.jsx`
- show camera upload button
- show preview
- send to backend `/api/predict`
- display readiness result + confidence + feedback message

### 9.3 API call
Use `fetch` with `FormData`.

---

## 10) Accuracy Improvement Checklist (Dataset quality)
Do these to improve accuracy quickly:
1) Prefer top-view images (your best)
2) Keep potato large in frame (15–30% of image)
3) Avoid blur (tap to focus)
4) Keep lighting consistent (shade is better than harsh sun)
5) Include variation (different potatoes, different sprout lengths)
6) Balance classes (try to have similar counts of ready / not_ready / maybe)
7) Use preprocessing crop for all images (even clean ones)
8) Use data augmentation in training (rotation, brightness, zoom)

---

## 11) What to implement NOW (order)
1) Create dataset folder + move images into `raw/`
2) Build preprocessing script -> generate `processed/images/`
3) Create labeling CSV for processed images
4) Create train/val/test split
5) Train 3 models -> choose best -> export model
6) Implement Flask `/api/predict` with preprocessing + inference
7) Implement React upload/camera page + show feedback
8) Add admin page to show model metrics + active model

---

## 12) Copilot Task List (give Copilot these tasks one by one)
### Task 1: Preprocessing script
“Create `backend/preprocess.py` with OpenCV functions to crop potato from white/noisy background and return 224x224 RGB.”

### Task 2: Dataset builder
“Create `backend/tools/build_processed_dataset.py` that reads `dataset/raw/**` images, runs preprocessing, writes into `dataset/processed/images`, and outputs a CSV template for labeling.”

### Task 3: Split generator
“Create `backend/tools/split_dataset.py` to split labels.csv into train/val/test and copy images accordingly.”

### Task 4: Model training notebook
“Create Colab-ready `train_models.ipynb` (MobileNetV2, EfficientNetB0, ResNet50), evaluate F1 macro, save best model + label map.”

### Task 5: Flask inference
“Update `backend/app.py`: add `/api/predict` endpoint that accepts image, preprocesses, loads model, predicts, and returns JSON + feedback.”

### Task 6: React upload page
“Create `frontend/src/pages/UploadSeed.jsx` with mobile camera input, preview, submit to `/api/predict`, display results.”

### Task 7: Feedback templates
“Create `backend/feedback.py` that returns English + Sinhala feedback based on prediction & confidence.”

---

## 13) Environment / Run commands
### Backend
- Create venv
- pip install -r requirements.txt
- python app.py

### Frontend
- npm install
- npm run dev

Use a proxy in Vite config OR call full backend URL.

---

## 14) Done Criteria
- Farmer can capture/upload a photo on phone
- Backend crops image automatically
- Model returns readiness + confidence
- UI shows clear feedback in user-friendly way
- Admin can see which model is used and accuracy
