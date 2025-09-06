import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

// Metadata for the application
export const metadata: Metadata = {
  title: 'LogiAI V4.0 - Enhanced AI-Powered Vietnamese Logistics Management',
  description: 'Advanced AI-powered logistics management platform with Vietnamese market expertise, route optimization, and intelligent supply chain solutions.',
  keywords: 'logistics, AI, Vietnam, supply chain, route optimization, transportation, Next.js 15, React 18',
  authors: [{ name: 'LogiAI Team' }],
  creator: 'LogiAI Development Team',
  publisher: 'LogiAI',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} dark bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}

/* LogiAI V4.0 - Next.js 15 + React 18 Upgrade - Deployment: Sat 07 Sep 2025 13:26:46 +07 */
