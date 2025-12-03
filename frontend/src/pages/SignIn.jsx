import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function validate() {
    const e = {}
    if (!emailRegex.test(email)) e.email = 'Enter a valid email address'
    if (!password || password.length < 6)
      e.password = 'Password must be at least 6 characters'
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      await login(email, password)
      navigate('/app')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white'>
      <div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-lg'>
        <h2 className='text-3xl font-bold text-green-800 mb-1'>Welcome back</h2>
        <p className='text-sm text-gray-500 mb-6'>Sign in to manage your farm predictions</p>

        {error && (
          <div className='text-sm text-red-600 mb-3 bg-red-50 p-2 rounded'>{error}</div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <input
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200'
            />
            {fieldErrors.email && (
              <div className='text-xs text-red-600 mt-1'>{fieldErrors.email}</div>
            )}
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700'>Password</label>
            <input
              type='password'
              placeholder='●●●●●●●●'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200'
            />
            {fieldErrors.password && (
              <div className='text-xs text-red-600 mt-1'>{fieldErrors.password}</div>
            )}
          </div>

          <div className='flex items-center justify-between'>
            <button
              type='submit'
              disabled={loading}
              className='inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60'
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <Link to='/signup' className='text-sm text-green-700'>
              Create account
            </Link>
          </div>
        </form>

        <div className='mt-6 text-center text-sm text-gray-500'>
          By signing in you agree with our terms and privacy policy.
        </div>
      </div>
    </div>
  )
}
