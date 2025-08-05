import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { EnhancedTranslationProvider } from '@/lib/i18n/enhanced-translation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LogiAI - AI-Powered Logistics Management',
  description: 'Advanced AI-powered logistics management platform with fleet management, real-time tracking, and supply chain optimization.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={inter.className}>
        <EnhancedTranslationProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </EnhancedTranslationProvider>
      </body>
    </html>
  )
}
