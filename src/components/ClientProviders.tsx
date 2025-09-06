'use client'

import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary';

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <div id="root" className="min-h-screen">
            {children}
          </div>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
