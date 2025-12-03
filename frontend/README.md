# Frontend (React + Vite)

This frontend is a React + Vite app. It uses Firebase Authentication for user sign-up and sign-in.

Quick setup:

1. Install dependencies

```powershell
cd frontend
npm install
```

2. Create a Firebase project and enable Email/Password authentication.
3. Create a `.env` file at the `frontend/` folder with the following variables (replace values):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the dev server:

```powershell
npm run dev
```

Files added for authentication and layout:
- `src/firebase.js` — Firebase initialization
- `src/contexts/AuthContext.jsx` — React context wrapper for auth
- `src/pages/SignIn.jsx`, `src/pages/SignUp.jsx` — auth pages
- `src/components/{Header,Sidebar,Footer,Layout}.jsx` — layout and navigation

After starting the dev server you can visit `/signin` or `/signup` to create accounts.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
