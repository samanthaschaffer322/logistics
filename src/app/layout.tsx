'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>LogiAI - Enhanced AI-Powered Vietnamese Logistics Management</title>
        <meta name="description" content="Advanced AI-powered logistics management platform with Vietnamese market expertise, route optimization, and intelligent supply chain solutions." />
        <meta name="keywords" content="logistics, AI, Vietnam, supply chain, route optimization, transportation" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
