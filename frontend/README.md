# Frontend (React + Vite + Tailwind CSS)

This is the frontend application for the Smart Potato Farming System. It's built with React, Vite, and Tailwind CSS, featuring Firebase Authentication.

## Quick Setup

1. Install dependencies:

```powershell
cd frontend
npm install
```

2. Create a `.env` file in the `frontend/` folder with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Run the dev server:

```powershell
npm run dev
```

Visit `http://localhost:5173` and navigate to `/signin` or `/signup` to create an account.

## Features

- **User Authentication**: Sign up and sign in with Firebase Email/Password
- **Image Upload**: Upload potato seed images for analysis
- **Predictions**: View seed readiness, damage level, shrivel level, and sprout length predictions
- **Dashboard**: View prediction history and results
- **Responsive Design**: Works on desktop and mobile devices with Tailwind CSS

## Project Structure

```
frontend/
├── index.html                   # Entry HTML file
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── eslint.config.js            # ESLint configuration
├── src/
│   ├── main.jsx                # Application entry point
│   ├── App.jsx                 # Main app component
│   ├── firebase.js             # Firebase initialization
│   ├── index.css               # Global styles
│   ├── App.css                 # App-specific styles
│   ├── components/             # Reusable components
│   │   ├── Header.jsx          # Top navigation
│   │   ├── Sidebar.jsx         # Side navigation
│   │   ├── Footer.jsx          # Footer component
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   └── ImageUpload.jsx     # Image upload component
│   ├── contexts/               # React context
│   │   └── AuthContext.jsx     # Authentication context
│   ├── pages/                  # Page components
│   │   ├── Landing.jsx         # Home page
│   │   ├── SignIn.jsx          # Sign in page
│   │   ├── SignUp.jsx          # Sign up page
│   │   ├── Dashboard.jsx       # User dashboard
│   │   ├── InputPage.jsx       # Input/upload page
│   │   ├── SeedReadinessPage.jsx
│   │   ├── RecommendationPage.jsx
│   │   └── ResultsPage.jsx     # Results display page
│   ├── assets/                 # Static assets
│   └── public/                 # Public files
└── node_modules/               # Dependencies
```

## Key Files

- **`src/firebase.js`** — Firebase initialization and configuration
- **`src/contexts/AuthContext.jsx`** — React context wrapper for user authentication
- **`src/pages/SignIn.jsx`, `src/pages/SignUp.jsx`** — Authentication pages
- **`src/components/Layout.jsx`** — Main layout with Header, Sidebar, and Footer
- **`src/components/ImageUpload.jsx`** — Image upload component for predictions

## Pages

- **Landing** — Home page with overview
- **Sign In/Sign Up** — User authentication
- **Dashboard** — User's prediction history
- **Input Page** — Upload images for analysis
- **Seed Readiness Page** — View seed readiness details
- **Recommendation Page** — Get farming recommendations
- **Results Page** — Display prediction results

## Available Scripts

```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Technologies

- **React** — UI library
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Utility-first CSS framework
- **Firebase** — Authentication and backend
- **ESLint** — Code quality tool

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Email/Password authentication
3. Copy your Firebase config
4. Add the config values to your `.env` file

## Development

### Hot Module Replacement (HMR)
Vite provides fast HMR for rapid development feedback.

### ESLint
Run linting with:
```powershell
npm run lint
```

### Building for Production
```powershell
npm run build
```
This creates an optimized build in the `dist/` folder.

## Environment Variables

All environment variables must start with `VITE_` to be accessible in the browser:
- `VITE_FIREBASE_*` — Firebase configuration

## Notes

- Never commit `.env` file to version control
- Use `.env.local` for local environment variables
- Authentication tokens are stored in browser storage
- All API calls should go through the backend at `http://localhost:5000`
