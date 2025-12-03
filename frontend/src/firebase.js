// Firebase initialization (replace values with your Firebase project config)
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBhqNacZ7FXLkbeR8Kn6TrVoHrQx6yMXfQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "authentication-daf0d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "authentication-daf0d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "authentication-daf0d.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "811689800378",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:811689800378:web:7b987e7aa6c390db57c883",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export default app
