import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col'>
      <header className='max-w-6xl mx-auto w-full p-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-green-800'>Smart Potato Farming</h1>
        <nav className='flex gap-4'>
          <Link to='/signin' className='text-sm text-green-700'>Sign in</Link>
          <Link to='/signup' className='text-sm text-green-700'>Sign up</Link>
        </nav>
      </header>

      <main className='flex-1 flex items-center justify-center'>
        <div className='max-w-4xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div>
            <h2 className='text-4xl font-extrabold text-green-900 mb-4'>
              Seed-ready predictions and farm insights
            </h2>
            <p className='text-gray-700 mb-6'>
              Upload seed images, track soil health, detect diseases and run cost
              analysis — all in one place built for smallholder farmers.
            </p>

            <div className='flex gap-4'>
              <Link
                to='/signin'
                className='inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700'
              >
                Get Started
              </Link>
              <a
                href='#features'
                className='inline-flex items-center px-6 py-3 border rounded-lg text-green-700 bg-white hover:bg-green-50'
              >
                Learn more
              </a>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow-lg p-6'>
            <h3 className='text-lg font-semibold mb-3'>How it helps</h3>
            <ul className='space-y-3 text-gray-700'>
              <li>• Identify which tubers are ready for planting</li>
              <li>• Monitor soil health trends</li>
              <li>• Detect early signs of disease</li>
              <li>• Estimate costs and potential returns</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className='w-full bg-white border-t p-4 text-center text-sm text-gray-600'>
        © {new Date().getFullYear()} Smart Potato Farming System
      </footer>
    </div>
  )
}
