# smart-potato-farming-system

A React + Vite frontend for the Smart Potato Farming System. Provides authentication (Firebase), pages for input, recommendations, and results, plus a responsive layout using Tailwind CSS.

**Tech Stack**

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS, PostCSS
- **Auth / Backend:** Firebase (Auth)

**Prerequisites**

- Node.js (recommended >= 18)
- npm (or pnpm / yarn)

**Quick Start**

1. Install dependencies:

```
npm install
```

2. Provide Firebase config via environment variables (recommended) or edit `src/firebase.js`:

Environment variables (example names used in `src/firebase.js`):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

3. Start the dev server:

```
npm run dev
```

**Available Scripts**

- `npm run dev`: Run the Vite development server.
- `npm run build`: Build the production bundle.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint across the project.

**Project Structure**

- **src/**: application source
  - `main.jsx` — app entry
  - `App.jsx` — root component
  - `firebase.js` — Firebase initialization (uses `VITE_` env vars)
  - `contexts/` — `AuthContext.jsx`
  - `components/` — UI components (header, footer, sidebar, layout, language switcher)
  - `pages/` — app pages (Landing, Dashboard, InputPage, RecommendationPage, ResultsPage, SignIn, SignUp)
  - `utils/` — helper utilities
- `index.html`, `vite.config.js`, `tailwind.config.js` — build & styling config

Notes:

- `src/firebase.js` contains fallback config values but you should set environment variables for production usage. See [src/firebase.js](src/firebase.js) for the keys used.
- Tailwind classes are configured via `tailwind.config.js` and `postcss.config.js`.

**Contributing**

- Fork and open a PR. Keep changes focused and add brief descriptions.

**License**

- Check the repository root for license information or add one if needed.

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
