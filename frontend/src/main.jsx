<<<<<<< HEAD
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n"; // <-- move this ABOVE App
import App from "./App.jsx";
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
>>>>>>> 0aa9b2edbeefa0bcf539f487f7fb2785e38743d4

createRoot(document.getElementById("root")).render(
  <StrictMode>
<<<<<<< HEAD
    <App />
  </StrictMode>
);
=======
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
>>>>>>> 0aa9b2edbeefa0bcf539f487f7fb2785e38743d4
