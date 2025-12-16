import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  return (
    <header className='w-full bg-white shadow-md p-4 flex items-center justify-between'>
      <div>
        <h1 className='text-xl font-bold text-green-700'>Smart Potato Farming</h1>
      </div>
      <div className='flex items-center gap-4'>
        <div className='text-sm text-gray-600'>
          {currentUser ? currentUser.email : 'Not signed in'}
        </div>
        {currentUser ? (
          <button
            onClick={handleLogout}
            className='px-3 py-1 rounded bg-red-50 text-red-600 border border-red-200'
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={() => navigate('/signin')}
            className='px-3 py-1 rounded bg-green-50 text-green-700 border border-green-200'
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}
