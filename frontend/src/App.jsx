import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Dashboard from '../src/pages/Dashboard'
import InputPage from '../src/pages/InputPage'
import ResultsPage from '../src/pages/ResultsPage'
import RecommendationPage from '../src/pages/RecommendationPage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Landing from './pages/Landing'
import Layout from './components/Layout'

function App() {
  const [backendMessage, setBackendMessage] = useState('Loading...')

  // Backend health check
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/health')
      .then((res) => res.json())
      .then((data) => setBackendMessage(data.message))
      .catch(() => setBackendMessage('Cannot reach backend'))
  }, [])

  return (
    <BrowserRouter>
      

      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />

        {/* Protected area under /app */}
        <Route path='/app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='in' element={<InputPage />} />
          <Route path='results' element={<ResultsPage />} />
          <Route path='recommendations' element={<RecommendationPage />} />
          {/* placeholder routes for other components */}
          <Route path='seed-readiness' element={<Dashboard />} />
          <Route path='soil-health' element={<Dashboard />} />
          <Route path='disease' element={<Dashboard />} />
          <Route path='cost' element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
