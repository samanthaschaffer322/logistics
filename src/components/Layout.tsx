'use client'

import React from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 min-h-screen">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Layout
