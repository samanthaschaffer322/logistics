'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  isMetaMaskError?: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if error is MetaMask-related
    const isMetaMaskError = error.message?.toLowerCase().includes('metamask') ||
                           error.message?.toLowerCase().includes('ethereum') ||
                           error.message?.toLowerCase().includes('web3') ||
                           error.stack?.toLowerCase().includes('metamask');

    return { 
      hasError: true, 
      error,
      isMetaMaskError 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log MetaMask-specific errors
    if (this.state.isMetaMaskError) {
      console.warn('MetaMask-related error detected:', error.message);
    }
  }

  handleDisableMetaMask = () => {
    window.open('chrome://extensions/', '_blank');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // MetaMask-specific error UI
      if (this.state.isMetaMaskError) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
            <Card className="bg-gray-800/90 backdrop-blur-xl border-red-500/50 max-w-2xl w-full shadow-2xl">
              <CardHeader className="border-b border-gray-700/50">
                <CardTitle className="text-red-400 flex items-center text-xl">
                  <Shield className="h-6 w-6 mr-3" />
                  MetaMask Extension Error
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-400 mb-2">
                        Browser Extension Conflict
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        MetaMask browser extension is causing errors in LogiAI. This is preventing 
                        the application from loading properly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Immediate Solutions:</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h5 className="font-medium text-blue-400 mb-2">1. Disable MetaMask Extension</h5>
                      <p className="text-gray-300 text-sm mb-3">
                        Temporarily disable MetaMask to use LogiAI without conflicts
                      </p>
                      <Button
                        onClick={this.handleDisableMetaMask}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Chrome Extensions
                      </Button>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <h5 className="font-medium text-green-400 mb-2">2. Use Incognito Mode</h5>
                      <p className="text-gray-300 text-sm">
                        Open LogiAI in incognito/private browsing where extensions are disabled
                      </p>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <h5 className="font-medium text-purple-400 mb-2">3. Use Different Browser</h5>
                      <p className="text-gray-300 text-sm">
                        Try Firefox, Safari, or Edge without MetaMask installed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h5 className="font-medium text-gray-300 mb-2">Quick Steps:</h5>
                  <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                    <li>Go to <code className="bg-gray-800 px-1 rounded">chrome://extensions/</code></li>
                    <li>Find MetaMask and toggle it OFF</li>
                    <li>Refresh this page</li>
                    <li>LogiAI should load normally</li>
                  </ol>
                </div>

                {this.state.error && (
                  <details className="text-sm text-gray-400 bg-gray-900/50 rounded p-3">
                    <summary className="cursor-pointer font-medium text-gray-300 mb-2">
                      Technical Error Details
                    </summary>
                    <pre className="text-xs overflow-auto whitespace-pre-wrap">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Page
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    className="bg-gray-700/50 border-gray-600/50 text-white hover:bg-gray-600/50"
                  >
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }

      // Generic error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
          <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700/50 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                The application encountered an error. Please try refreshing the page.
              </p>
              {this.state.error && (
                <details className="text-sm text-gray-400">
                  <summary className="cursor-pointer">Error details</summary>
                  <pre className="mt-2 p-2 bg-gray-900/50 rounded text-xs overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="bg-gray-700/50 border-gray-600/50 text-white hover:bg-gray-600/50"
                >
                  Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;