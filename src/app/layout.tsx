import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LogiAI - Enhanced AI-Powered Vietnamese Logistics Management',
  description: 'Advanced AI-powered logistics management platform with Vietnamese market expertise, route optimization, and intelligent supply chain solutions.',
  keywords: ['logistics', 'AI', 'Vietnam', 'supply chain', 'route optimization', 'transportation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
