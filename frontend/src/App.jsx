import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
      {/* Top header with backend status */}
      <div className='w-full bg-white shadow-md p-4 mb-6'>
        <h1 className='text-2xl font-bold text-green-700 text-center'>
          Smart Potato Farming System
        </h1>
        <p className='text-center text-gray-700 mt-1'>
          Backend status:{" "}
          <span className='font-semibold'>{backendMessage}</span>
        </p>
      </div>

      {/* Page routing */}
      <Routes>
        {/* match what your buttons/links use */}
        <Route path='/' element={<Dashboard />} />
        <Route path='/in' element={<InputPage />} />
        <Route path='/results' element={<ResultsPage />} />
        <Route path='/recommendations' element={<RecommendationPage />} />

        {/* legacy short paths → redirect to the new ones */}
        <Route path='/res' element={<Navigate to='/results' replace />} />
        <Route
          path='/re'
          element={<Navigate to='/recommendations' replace />}
        />

        {/* fallback: anything unknown goes home */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
