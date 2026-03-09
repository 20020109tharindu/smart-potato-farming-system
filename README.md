# 🥔 Smart Potato Farming System

An AI-powered precision agriculture platform for potato farming — combining deep learning, computer vision, IoT hardware, and generative AI to help farmers make data-driven decisions.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?logo=tensorflow&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.1-000000?logo=flask&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)

---

## 📋 Overview

The Smart Potato Farming System is a full-stack web application with four integrated modules:

| Module | Description | Status |
|--------|-------------|--------|
| 🌱 **Seed Readiness Predictor** | Analyzes potato seed images to predict readiness, damage level, shrivel level, and sprout length | ✅ Active |
| 🦠 **Leaf Disease Predictor** | Detects Early Blight, Late Blight, or Healthy status using CNN + OpenCV visualization + ESP32-CAM | ✅ Active |
| 🌍 **Soil Health Analysis** | Soil condition assessment and recommendations | 🚧 Coming Soon |
| 💰 **Cost & Yield Analysis** | Input farming data, get yield predictions and profitability recommendations | ✅ Active |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)           │
│  Landing · Auth · Disease Predictor · Seed Readiness│
│  Cost Analysis · Disease Map · Soil Health          │
│          Tailwind CSS · Leaflet Maps · Axios        │
└────────────────────────┬────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────┐
│                   Backend (Flask)                     │
│  Disease CNN · Seed Readiness Models · OpenCV Viz    │
│  Gemini AI Recommendations · Disease Reports         │
│  ESP32-CAM Integration · Cost/Yield API              │
└───────┬──────────────┬──────────────┬───────────────┘
        │              │              │
   TensorFlow     Google Gemini   ESP32-CAM
   (.h5 models)   (REST API)     (WiFi capture)
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** with pip
- **Node.js 18+** with npm
- **Firebase project** (for authentication)
- **Google Gemini API key** (for AI recommendations)

### 1. Clone the repository

```bash
git clone https://github.com/20020109tharindu/smart-potato-farming-system.git
cd smart-potato-farming-system
```

### 2. Backend setup

```bash
cd backend
python -m venv ../.venv
source ../.venv/bin/activate    # macOS/Linux
# ..\.venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

Create a `backend/.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the server:

```bash
python app.py
# Server runs on http://127.0.0.1:5000
```

> **Note:** The disease model (`models/disease.h5`) is auto-downloaded from Google Drive on first run.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 🧠 AI & ML Models

### Disease Prediction Model
- **Architecture:** CNN (TensorFlow/Keras)
- **Input:** 224×224 RGB potato leaf images
- **Classes:** Early Blight, Late Blight, Healthy
- **Output:** Softmax probabilities (confidence per class)
- **Visualization:** OpenCV-based disease area detection with heatmaps, contour mapping, and severity percentage

### Seed Readiness Models
- **Architecture:** Multi-model ensemble (4 Keras models)
- **Predictions:** Seed readiness level, damage level, shrivel level, sprout length
- **Labels:** JSON-mapped class labels

### Gemini AI Integration
- **Model:** Google Gemini 2.5 Flash (via REST API)
- **Purpose:** Personalized fertilizer and treatment recommendations based on detected disease, confidence, and disease area percentage
- **Fallback:** Automatic model fallback chain (gemini-2.5-flash → gemini-2.0-flash → gemini-2.0-flash-lite)

---

## 📡 ESP32-CAM Integration

The system supports **ESP32-CAM** hardware for real-time leaf image capture:

- **Live Stream:** MJPEG stream at `http://<esp32-ip>:81/stream`
- **Capture & Analyze:** Single-shot capture from `http://<esp32-ip>/capture`, automatically sent to the disease prediction pipeline
- Enter the ESP32-CAM IP address in the Disease Predictor UI to connect

---

## 🗺️ Disease Reporting Map

Interactive Leaflet map for crowdsourced disease tracking:
- Click on the map to report a disease sighting
- Reports stored in `backend/disease_reports.json`
- View all reports with disease type, severity, date, and GPS coordinates

---

## 📁 Project Structure

```
smart-potato-farming-system/
├── README.md                          # This file
├── backend/
│   ├── app.py                         # Flask API server (all endpoints)
│   ├── requirements.txt               # Python dependencies
│   ├── .env                           # API keys (GEMINI_API_KEY)
│   ├── disease_reports.json           # Stored disease map reports
│   ├── model_config.json              # Disease model download config
│   ├── models/                        # TensorFlow models (auto-downloaded)
│   │   └── disease.h5
│   ├── seed_readiness_predictor_models/
│   ├── seed_readiness_predictor_labels/
│   ├── uploads/                       # Temporary image uploads
│   └── utils/
│       ├── predict.py                 # Seed readiness prediction logic
│       └── preprocess.py              # Image preprocessing utilities
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx                    # Route definitions
│       ├── firebase.js                # Firebase config
│       ├── components/                # Layout, Header, Sidebar, Footer
│       ├── contexts/AuthContext.jsx    # Firebase auth context
│       └── pages/
│           ├── Landing.jsx            # Public landing page
│           ├── SignIn.jsx / SignUp.jsx # Authentication
│           ├── DiseasePredictor.jsx   # Disease detection + ESP32 + AI
│           ├── SeedReadinessPage.jsx  # Seed readiness analysis
│           ├── Dashboard.jsx          # Cost analysis dashboard
│           ├── InputPage.jsx          # Cost/yield input form
│           ├── ResultsPage.jsx        # Cost/yield results
│           └── RecommendationPage.jsx # Cost recommendations
└── .venv/                             # Python virtual environment
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/predict` | Seed readiness prediction (image upload) |
| `POST` | `/api/predict-disease` | Disease prediction (image upload) |
| `POST` | `/api/predict-from-esp32` | Disease prediction from ESP32-CAM capture |
| `GET` | `/api/disease-reports` | Get all disease map reports |
| `POST` | `/api/disease-reports` | Add a disease report |
| `DELETE` | `/api/disease-reports/:id` | Delete a disease report |
| `POST` | `/api/ai-recommendation` | Get Gemini AI fertilizer recommendation |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios |
| Maps | React-Leaflet, Leaflet.js |
| Auth | Firebase Authentication |
| Backend | Flask, Flask-CORS |
| ML/AI | TensorFlow/Keras, OpenCV, NumPy, Pillow |
| GenAI | Google Gemini 2.5 Flash (REST API) |
| IoT | ESP32-CAM (MJPEG stream + HTTP capture) |
| Data | JSON file storage (disease reports) |

---

## 👥 Team

Built as an academic project for precision agriculture research.

---

## 📄 License

This project is for educational and research purposes.