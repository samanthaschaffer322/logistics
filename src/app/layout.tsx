'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary';
import MetaMaskBlocker from '@/components/MetaMaskBlocker';

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
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; object-src 'none';" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Early MetaMask blocking
              (function() {
                if (typeof window !== 'undefined') {
                  // Block MetaMask injection immediately
                  Object.defineProperty(window, 'ethereum', {
                    get: function() {
                      console.warn('MetaMask access blocked by LogiAI');
                      return undefined;
                    },
                    set: function() {
                      console.warn('MetaMask injection blocked by LogiAI');
                      return false;
                    },
                    configurable: false,
                    enumerable: false
                  });
                  
                  Object.defineProperty(window, 'web3', {
                    get: function() { return undefined; },
                    set: function() { return false; },
                    configurable: false,
                    enumerable: false
                  });
                  
                  // Block common MetaMask events
                  const originalAddEventListener = window.addEventListener;
                  window.addEventListener = function(type, listener, options) {
                    if (type && (type.includes('ethereum') || type.includes('metamask') || type.includes('web3'))) {
                      console.warn('Blocked MetaMask event:', type);
                      return;
                    }
                    return originalAddEventListener.call(this, type, listener, options);
                  };
                  
                  console.log('LogiAI MetaMask protection active');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <MetaMaskBlocker>
            <AuthProvider>
              <LanguageProvider>
                {children}
              </LanguageProvider>
            </AuthProvider>
          </MetaMaskBlocker>
        </ErrorBoundary>
      </body>
    </html>
  )
}
