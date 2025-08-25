'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>LogiAI - Enhanced AI-Powered Vietnamese Logistics Management</title>
        <meta name="description" content="Advanced AI-powered logistics management platform with Vietnamese market expertise, route optimization, and intelligent supply chain solutions." />
        <meta name="keywords" content="logistics, AI, Vietnam, supply chain, route optimization, transportation" />
      </head>
      <body className={`${inter.className} dark bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900`}>
        {/* VERY OBVIOUS GLOBAL TEST ELEMENT */}
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100px',
          backgroundColor: 'red',
          border: '10px solid yellow',
          zIndex: '9999',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          🔴 GLOBAL TEST - LAYOUT IS LOADING! 🔴
        </div>
        
        <ErrorBoundary>
          <AuthProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
