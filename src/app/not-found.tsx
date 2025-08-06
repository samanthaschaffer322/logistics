'use client'

import React from 'react'
import Link from 'next/link'
import { Home, ArrowLeft, Search, Brain } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold gradient-text animate-pulse">404</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-slate-400 text-lg mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link 
            href="/dashboard"
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:scale-105 transition-transform duration-300"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
          
          <Link 
            href="/super-ai"
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 transition-transform duration-300"
          >
            <Brain className="w-5 h-5" />
            Try AI Assistant
          </Link>
        </div>

        {/* Popular Pages */}
        <div className="dark-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" />
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Dashboard
            </Link>
            <Link href="/super-ai" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Super AI
            </Link>
            <Link href="/analytics" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Analytics
            </Link>
            <Link href="/file-learning" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              File Learning
            </Link>
            <Link href="/fleet-management" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Fleet
            </Link>
            <Link href="/transportation" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Transport
            </Link>
            <Link href="/warehouse" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Warehouse
            </Link>
            <Link href="/shipments" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Shipments
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
