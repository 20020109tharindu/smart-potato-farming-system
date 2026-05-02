# IoT-Enabled Soil Monitoring using Machine Learning

## 1. Purpose of This Component
This component is designed to support potato farmers by combining:
- IoT-based real-time soil sensing
- Machine learning based soil suitability prediction
- Action-oriented fertilizer and corrective recommendations

The module focuses on turning raw sensor readings into practical farming decisions.

---

## 2. Business Goal
Main objective:
- Improve potato yield quality and consistency
- Reduce input waste (fertilizer, water, labor)
- Detect soil problems early
- Guide stage-specific decisions (Germination to Maturation)

Target context:
- Potato farming workflows similar to Sri Lankan highland cultivation (for example: Badulla/Uva context in UI content).

---

## 3. High-Level Architecture
The implementation follows a 3-layer architecture:

1. Data Ingestion Layer (IoT + Firebase Realtime Database)
- Soil sensors push readings through ESP32/NodeMCU
- Live values are stored in Firebase Realtime Database

2. Intelligence Layer (Flask + ML Bundle)
- Flask API receives structured inputs
- ML model bundle predicts soil suitability and nutrient statuses
- Rule-enhanced logic generates corrective actions and fertilizer plan

3. Experience Layer (React Frontend)
- Live dashboard for current sensor status
- Manual input fallback mode
- Historical prediction view
- Trend visualization
- Downloadable PDF analysis report

---

## 4. Core Input Parameters
The soil analysis pipeline expects the following features:

- pH
- EC (mS/cm)
- N (Nitrogen)
- P (Phosphorus)
- K (Potassium)
- Temperature
- Moisture
- Growth_Stage

Important unit rule:
- Backend expects EC in mS/cm
- If sensor gives conductivity in uS/cm, divide by 1000 before prediction

Growth stage values:
- 0: Germination
- 1: Vegetative Growth
- 2: Tuber Initiation
- 3: Maturation

---

## 5. Data Flow (End-to-End)
### Step 1: Live Sensor Streaming
- Realtime listener reads /soil node from Firebase Realtime DB
- Raw fields are mapped into prediction payload format

### Step 2: User Context Input
- Farmer selects growth stage manually
- Farmer can optionally add land area in acres

### Step 3: Prediction Request
- Frontend sends POST request to backend endpoint:
  - /api/soil/predict

### Step 4: Model Inference + Logic
Backend executes:
- Input validation
- Model bundle load/use
- Soil suitability prediction
- N/P/K status prediction (or fallback logic)
- Fertilizer quantity recommendation
- Corrective action generation based on stage + thresholds

### Step 5: Result Presentation
Frontend renders:
- Suitability badge (color + label)
- Confidence (if model supports predict_proba)
- NPK statuses
- Fertilizer per-acre and total calculation
- Corrective action list with severity

### Step 6: Persistence + Analytics
- Prediction payload and result are saved in Firestore
- History tab shows recent runs
- Trend tab visualizes parameter changes over time

### Step 7: Reporting
- PDF report can be generated and downloaded
- Report includes inputs, outputs, status, and recommendations

---

## 6. Backend API Contract
### Health Endpoint
- GET /api/health
- Purpose: verify backend availability

### Prediction Endpoint
- POST /api/soil/predict

Request body (JSON):
- pH
- EC
- N
- P
- K
- Temperature
- Moisture
- Growth_Stage

Response includes:
- soil_suitability
  - value, label, color, description
- confidence
- growth_stage
- npk_status
  - n, p, k labels
- fertilizers
  - urea, tsp, mop, organic
- corrective_actions[]

Validation behavior:
- Missing required field -> 400 error
- Invalid numeric conversion -> 400 error
- Model/internal failure -> 500 error

---

## 7. ML and Rules Strategy
The backend supports two model formats:

1. New Bundle Format
- Multi-model dictionary structure
- Can predict:
  - Soil suitability
  - N status, P status, K status
  - Urea, TSP, MOP, Organic quantities

2. Old Format Compatibility
- Legacy single model support
- NPK and fertilizer values are generated via rule-based fallback tables

Why this matters:
- Enables backward compatibility with previous experiments
- Reduces downtime when model artifacts evolve

---

## 8. Stage-Aware Agronomic Logic
Corrective actions are stage-aware and severity-based.

It checks:
- pH range by stage
- EC range by stage
- Temperature range by stage
- Moisture range by stage
- N, P, K status relevance by stage

Severity classes:
- critical
- warning
- info
- success

This helps transform model output into actionable farmer guidance instead of raw scores only.

---

## 9. Frontend Functional Modules
### A. Live Sensors Tab
- Shows real-time values and status cards
- Displays alerts for out-of-range parameters
- Enables quick analysis from live data

### B. Manual Input Tab
- Allows prediction without live IoT feed
- Useful during sensor outage, testing, or offline collection

### C. History Tab
- Displays recent predictions from Firestore
- Supports per-user historical tracking

### D. Trends Tab
- Plots selected parameter trends using line charts
- Shows reference boundary lines for optimal ranges

### E. Result Area
- Suitability summary
- NPK cards
- Fertilizer recommendation cards
- Corrective action panel
- PDF download action

---

## 10. Authentication and Access Control
- Firebase Authentication is integrated
- Protected app routes require signed-in user
- Unauthenticated users are redirected to sign-in

Effect:
- Prevents unauthorized access to monitoring and prediction workflow

---

## 11. Key Strengths of Current Design
- End-to-end functional pipeline from sensor to recommendation
- Combines ML with domain rules for practical accuracy
- Strong UX for farmers (live view + manual fallback + report)
- Maintains prediction history for decision continuity
- Includes explainable recommendation format (not black-box only)

---

## 12. Known Gaps and Improvement Opportunities
1. Deployment configuration
- Current API calls use localhost endpoint style in frontend
- Production-ready environment-based API URL mapping can improve portability

2. Multi-device scalability
- Current live read pattern is centered on a single path
- Multi-field or multi-device routing could be formalized

3. Cross-page unification
- Some non-soil pages still use mock/simulated logic
- End-to-end integration can be unified under one backend contract

4. MLOps lifecycle
- Model version governance, validation dashboards, and retraining triggers can be formalized

5. Alert automation
- Notifications (SMS/push/WhatsApp) for critical alerts can improve field response speed

---

## 13. Suggested KPIs for Evaluation
Technical KPIs:
- API response time
- Prediction success rate
- Sensor data freshness interval
- Realtime listener uptime

Agronomic KPIs:
- Fertilizer overuse reduction percentage
- Percentage of timely corrective actions applied
- Yield improvement across seasons

Product KPIs:
- Active users per season
- Predictions per farm
- PDF report downloads
- Retention of returning farmers

---

## 14. Summary
This component is a practical precision-agriculture module that bridges IoT data and ML-driven agronomic decisions. It is already structured with robust essentials:
- Real-time monitoring
- Stage-aware prediction
- Actionable recommendations
- Persistent history
- Report generation

With deployment hardening and broader data orchestration, it can evolve from a strong prototype into a production-grade digital advisory system for smart potato farming.

---

## 15. Google Colab Model Training Details (v2.0)

### 15.1 Training Environment
Model training was carried out in Google Colab with Google Drive integration.

Main setup:
- Drive mount path: `/content/drive/MyDrive/Potato_Soil_Project/`
- Core libraries used:
  - xgboost
  - scikit-learn
  - pandas
  - numpy
  - matplotlib
  - seaborn
- Random seed controls were applied for reproducibility.

### 15.2 Dataset Strategy
The training dataset is synthetically generated (not directly collected as a raw field CSV) using agronomic rules tailored to potato farming conditions.

Generator function:
- `generate_potato_soil_dataset(n_samples=1500, random_seed=42)`

Generated dataset size:
- Total rows: 1500

Feature generation ranges:
- pH: 4.60 to 7.30
- EC: 0.030 to 0.200 mS/cm
- Temperature: 13.0 to 28.0 C
- Moisture: 32.0 to 77.0%
- N: 8.0 to 82.0
- P: 12.0 to 158.0
- K: 140.0 to 385.0
- Growth_Stage: one of {0,1,2,3}

Humidity note:
- Humidity is intentionally excluded from v2.0 feature set.

### 15.3 Input Features Used for Training
Final feature columns (8):
- pH
- EC
- N
- P
- K
- Temperature
- Moisture
- Growth_Stage

### 15.4 Labels/Targets Used in Training
This is a multi-output training pipeline with classification and regression targets.

Classification targets:
- Soil_Suitability
- N_Status
- P_Status
- K_Status

Regression targets:
- Recommended_Urea
- Recommended_TSP
- Recommended_MOP
- Recommended_Organic

Label encodings:
- Soil_Suitability:
  - 0 = Not Suitable
  - 1 = Marginally Suitable
  - 2 = Suitable
- N_Status, P_Status, K_Status:
  - 0 = Low
  - 1 = Adequate
  - 2 = High

Growth stage encoding:
- 0 = Germination
- 1 = Vegetative Growth
- 2 = Tuber Initiation
- 3 = Maturation

### 15.5 How Labels Were Built
Soil suitability was generated using rule-based scoring from pH, EC, Temperature, and Moisture windows.

Scoring outcome mapping:
- score >= 11 -> Suitable
- score >= 6 and < 11 -> Marginally Suitable
- score < 6 -> Not Suitable

NPK status labels were generated using stage-aware thresholds:
- Different threshold bands per growth stage
- Each nutrient mapped to Low/Adequate/High

Fertilizer recommendation labels were generated with:
- stage x nutrient-status lookup tables (Urea/TSP/MOP)
- suitability-based organic recommendation table
- small controlled random perturbations for realism

### 15.6 Label Noise Injection
To avoid unrealistic perfect metrics and simulate real-world uncertainty, classification label noise was added.

Configuration:
- Noise rate: 12%
- Applied to:
  - Soil_Suitability
  - N_Status
  - P_Status
  - K_Status

### 15.7 Train/Test Split and Saved CSVs
Dataset split:
- Train rows: 1300
- Test rows: 200
- Stratification basis: Soil_Suitability

Files saved to Drive:
- `train_soil_v2.csv`
- `test_soil_v2.csv`

### 15.8 Preprocessing
Feature scaling:
- `StandardScaler` was fit on train features and applied to both train/test sets.

Reason:
- Keep numeric features normalized and improve model stability.

### 15.9 Model Families Evaluated
Three model families were evaluated for each classification target and each regression target.

Classification models:
- RandomForestClassifier
- XGBClassifier
- GradientBoostingClassifier

Regression models:
- RandomForestRegressor
- XGBRegressor
- GradientBoostingRegressor

### 15.10 Best Model Selection Logic
Classification:
- Best model selected per target using highest test accuracy.

Regression:
- Best model selected per target using highest R2 score.

This means final deployed bundle can include mixed algorithms across targets.

### 15.11 Metrics Tracked During Training
Classification metrics:
- Train Accuracy
- Test Accuracy
- Weighted F1-score
- Overfitting gap (Train Accuracy - Test Accuracy)
- Confusion Matrix
- Classification Report

Regression metrics:
- RMSE
- MAE
- R2 score

### 15.12 Visual Outputs Generated
Charts produced during training include:
- Confusion matrix grids for classification targets
- Classification accuracy comparison bars
- Regression R2 comparison bars
- RMSE vs MAE comparison
- Train vs validation accuracy curves
- Train vs validation loss curves (boosting stages)

### 15.13 Model Bundle Export (PKL)
Final artifact:
- `best_soil_model.pkl`

Bundle content includes:
- Metadata (version, description, district context)
- Feature schema and target schema
- Label mappings
- Trained scaler object
- Best trained model objects for all 8 targets
- Performance summary block
- Dataset summary block

Backend runtime uses this bundle for:
- Soil suitability inference
- NPK status inference
- Fertilizer quantity prediction

### 15.14 Verification and Live Test Cases
After saving the PKL bundle, verification steps were run:
- Reload PKL
- Reprint metadata and target metrics
- Run sample live-style test cases for multiple growth stages

Outputs checked for each case:
- Soil suitability label
- N/P/K status labels
- Urea/TSP/MOP/Organic recommendations

### 15.15 Training Pipeline Summary
In summary, the Colab process is:
1. Generate rule-grounded synthetic dataset
2. Build classification and regression labels
3. Add controlled noise for realistic generalization
4. Split, scale, and train multiple model families
5. Select best-per-target models
6. Export one unified inference bundle (`best_soil_model.pkl`)
7. Integrate the bundle into Flask backend prediction flow
