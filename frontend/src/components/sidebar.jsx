import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const links = [
    { to: '/app', label: 'Dashboard' },
    { to: '/app/seed-readiness', label: 'Seed Readiness' },
    { to: '/app/soil-health', label: 'Soil Health' },
    { to: '/app/disease', label: 'Disease Predictor' },
    { to: '/app/cost', label: 'Cost Analysis' },
  ]

  return (
    <aside className='w-64 bg-white border-r p-4 h-screen fixed'>
      <nav className='flex flex-col gap-2'>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md ${isActive ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
