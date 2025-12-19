import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";
import InputPage from "./pages/InputPage";
import ResultsPage from "./pages/ResultsPage";
import RecommendationPage from "./pages/RecommendationPage";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Landing from "./pages/Landing";
import Layout from "./components/Layout";

function App() {
  const [backendMessage, setBackendMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/health")
      .then((res) => res.json())
      .then((data) => setBackendMessage(data.message))
      .catch(() => setBackendMessage("Cannot reach backend"));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path='/' element={<Landing />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />

        {/* Protected */}
        <Route path='/app' element={<Layout />}>
          {/* Empty routes (no dashboard) */}
          <Route path='seed-readiness' element={null} />
          <Route path='soil-health' element={null} />
          <Route path='disease' element={null} />

          {/* COST ANALYSIS ONLY */}
          <Route path='cost'>
            <Route index element={<Dashboard />} />
            <Route path='in' element={<InputPage />} />
            <Route path='results' element={<ResultsPage />} />
            <Route path='recommendations' element={<RecommendationPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
