# Frontend (React + Vite + Tailwind CSS)

The frontend application for the Smart Potato Farming System — a modern single-page app with Firebase authentication, AI-powered disease analysis, interactive disease mapping, and cost/yield planning.

## Quick Setup

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

> **Prerequisite:** The backend server must be running on `http://127.0.0.1:5000` (see backend README).

## Features

- **Landing Page** — Showcase of all four platform modules with animated stats, technology stack, and feature previews
- **Firebase Authentication** — Email/password sign up and sign in with protected routes
- **Leaf Disease Predictor** — Upload leaf images or capture via ESP32-CAM, get CNN prediction with OpenCV visualizations, severity gauge, probability chart, and Gemini AI fertilizer recommendations
- **ESP32-CAM Live Stream** — Real-time MJPEG video feed from ESP32-CAM with one-click capture and analysis
- **Disease Reporting Map** — Interactive Leaflet map for crowdsourced disease sighting reports with CRUD operations
- **Seed Readiness Analysis** — Upload potato seed images, get readiness/damage/shrivel/sprout predictions
- **Cost & Yield Analysis** — Input farming parameters, view yield predictions, profitability dashboard, and recommendations
- **Responsive Design** — Fully responsive with Tailwind CSS, works on desktop and mobile

## Project Structure

```
frontend/
├── index.html                     # Entry HTML
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.js               # ESLint configuration
├── public/                        # Static public assets
└── src/
    ├── main.jsx                   # Application entry point
    ├── App.jsx                    # Route definitions
    ├── App.css                    # App-specific styles
    ├── index.css                  # Global styles (Tailwind directives)
    ├── firebase.js                # Firebase initialization
    ├── assets/                    # Static assets (images, icons)
    ├── components/
    │   ├── Layout.jsx             # Authenticated layout (Header + Sidebar + Footer)
    │   ├── header.jsx             # Top navigation bar
    │   ├── sidebar.jsx            # Side navigation menu
    │   ├── footer.jsx             # Footer component
    │   └── ImageUpload.jsx        # Reusable image upload component
    ├── contexts/
    │   └── AuthContext.jsx        # Firebase auth context provider
    └── pages/
        ├── Landing.jsx            # Public landing page (all modules showcase)
        ├── SignIn.jsx             # Sign in page
        ├── SignUp.jsx             # Sign up page
        ├── DiseasePredictor.jsx   # Disease detection + ESP32-CAM + AI recs + map
        ├── SeedReadinessPage.jsx  # Seed readiness analysis
        ├── Dashboard.jsx          # Cost analysis dashboard
        ├── InputPage.jsx          # Cost/yield input form
        ├── ResultsPage.jsx        # Cost/yield results display
        └── RecommendationPage.jsx # Cost recommendations
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Landing` | Public landing page |
| `/signin` | `SignIn` | Firebase sign in |
| `/signup` | `SignUp` | Firebase sign up |
| `/app/seed-readiness` | `SeedReadinessPage` | Seed readiness analysis |
| `/app/disease` | `DiseasePredictor` | Disease predictor + map |
| `/app/soil-health` | — | Coming soon |
| `/app/cost` | `Dashboard` | Cost analysis dashboard |
| `/app/cost/in` | `InputPage` | Cost/yield input form |
| `/app/cost/results` | `ResultsPage` | Cost/yield results |
| `/app/cost/recommendations` | `RecommendationPage` | Cost recommendations |

## Disease Predictor Page

The main feature page (`DiseasePredictor.jsx`) includes:

- **Two main tabs:** Predictor and Disease Map
- **Upload / Live toggle:** Switch between file upload and ESP32-CAM live stream
- **ESP32-CAM section:** IP input, live MJPEG stream, capture & analyze button
- **Results panel:** Prediction badge, confidence, disease area %, severity gauge
- **OpenCV Visualizations:** Original, heatmap, contour, and combined views
- **Probability Chart:** Bar chart showing per-class probabilities
- **AI Recommendations:** Gemini-powered fertilizer and treatment plan (with loading/error states)
- **Standard Recommendations:** Built-in action, fertilizer, and prevention tips
- **Disease Map:** Interactive Leaflet map for reporting disease sightings

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `react` / `react-dom` | UI framework (v19) |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP client for backend API |
| `firebase` | Authentication |
| `leaflet` / `react-leaflet` | Interactive disease reporting map |
| `lucide-react` | Icon library |
| `tailwindcss` | Utility-first CSS |
| `vite` | Build tool and dev server |

## Available Scripts

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable **Email/Password** authentication
3. Copy your Firebase config into `src/firebase.js`

## Environment Variables

All environment variables must start with `VITE_` to be accessible in the browser:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

## Notes

- Backend must be running on `http://127.0.0.1:5000` for all API features to work
- Never commit `.env` files to version control
- ESP32-CAM must be on the same WiFi network as the machine running the backend
- Authentication tokens are managed via Firebase SDK
