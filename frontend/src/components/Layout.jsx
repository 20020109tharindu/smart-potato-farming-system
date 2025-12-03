import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Header from './header'
import Sidebar from './sidebar'
import Footer from './footer'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to='/signin' replace />
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='flex'>
        <Sidebar />
        <main className='flex-1 ml-64 p-6'>
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  )
}
