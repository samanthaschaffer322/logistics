'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetaMaskBlockerProps {
  children: React.ReactNode;
}

const MetaMaskBlocker: React.FC<MetaMaskBlockerProps> = ({ children }) => {
  const [showMetaMaskWarning, setShowMetaMaskWarning] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const blockMetaMask = () => {
      try {
        // Check if MetaMask is present
        const hasMetaMask = typeof window !== 'undefined' && 
          (window as any).ethereum && 
          ((window as any).ethereum.isMetaMask || (window as any).ethereum.providers?.some((p: any) => p.isMetaMask));

        if (hasMetaMask) {
          console.warn('MetaMask detected - implementing blocking measures');
          setShowMetaMaskWarning(true);
          setIsBlocked(true);

          // Remove ethereum object
          if ((window as any).ethereum) {
            delete (window as any).ethereum;
          }

          // Prevent future injections
          Object.defineProperty(window, 'ethereum', {
            get: () => {
              console.warn('MetaMask access blocked by LogiAI');
              return undefined;
            },
            set: () => {
              console.warn('MetaMask injection blocked by LogiAI');
              return false;
            },
            configurable: false,
            enumerable: false
          });

          // Block web3 object as well
          if ((window as any).web3) {
            delete (window as any).web3;
          }

          Object.defineProperty(window, 'web3', {
            get: () => undefined,
            set: () => false,
            configurable: false,
            enumerable: false
          });

          // Additional MetaMask-specific blocking
          const metaMaskMethods = [
            'ethereum',
            'web3',
            '__METAMASK_EXTENSION_ID__',
            'isMetaMask'
          ];

          metaMaskMethods.forEach(method => {
            if ((window as any)[method]) {
              try {
                delete (window as any)[method];
              } catch (e) {
                // Ignore deletion errors
              }
            }
          });

          // Prevent MetaMask events
          const originalAddEventListener = window.addEventListener;
          window.addEventListener = function(type: string, listener: any, options?: any) {
            if (type.includes('ethereum') || type.includes('metamask') || type.includes('web3')) {
              console.warn(`Blocked MetaMask event: ${type}`);
              return;
            }
            return originalAddEventListener.call(this, type, listener, options);
          };

          console.log('MetaMask blocking measures implemented successfully');
        }
      } catch (error) {
        console.error('Error implementing MetaMask blocking:', error);
      }
    };

    // Block immediately
    blockMetaMask();

    // Block on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', blockMetaMask);
    }

    // Block on window load
    window.addEventListener('load', blockMetaMask);

    // Periodic check for MetaMask injection attempts
    const intervalId = setInterval(blockMetaMask, 1000);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('DOMContentLoaded', blockMetaMask);
      window.removeEventListener('load', blockMetaMask);
    };
  }, []);

  const handleDismissWarning = () => {
    setShowMetaMaskWarning(false);
  };

  const handleDisableMetaMask = () => {
    window.open('chrome://extensions/', '_blank');
  };

  if (showMetaMaskWarning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="bg-gray-800/90 backdrop-blur-xl border-yellow-500/50 max-w-2xl w-full shadow-2xl">
          <CardHeader className="border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-yellow-400 flex items-center text-xl">
                <Shield className="h-6 w-6 mr-3" />
                MetaMask Interference Detected
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismissWarning}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-2">
                    Browser Extension Conflict
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    MetaMask browser extension is interfering with LogiAI's Vietnam map system and 
                    causing unexpected redirects. This is a known compatibility issue.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">Quick Solutions:</h4>
              
              <div className="space-y-3">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h5 className="font-medium text-blue-400 mb-2">Option 1: Disable MetaMask (Recommended)</h5>
                  <p className="text-gray-300 text-sm mb-3">
                    Temporarily disable MetaMask extension while using LogiAI
                  </p>
                  <Button
                    onClick={handleDisableMetaMask}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Chrome Extensions
                  </Button>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h5 className="font-medium text-green-400 mb-2">Option 2: Use Incognito Mode</h5>
                  <p className="text-gray-300 text-sm">
                    Open LogiAI in an incognito/private browsing window where extensions are disabled
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h5 className="font-medium text-purple-400 mb-2">Option 3: Continue with Protection</h5>
                  <p className="text-gray-300 text-sm mb-3">
                    LogiAI has implemented blocking measures. You can continue, but some features may be affected.
                  </p>
                  <Button
                    onClick={handleDismissWarning}
                    variant="outline"
                    className="bg-gray-700/50 border-gray-600/50 text-white hover:bg-gray-600/50 text-sm"
                  >
                    Continue with Protection
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <h5 className="font-medium text-gray-300 mb-2">Manual Steps for Chrome:</h5>
              <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                <li>Type <code className="bg-gray-800 px-1 rounded">chrome://extensions/</code> in address bar</li>
                <li>Find MetaMask extension</li>
                <li>Toggle the switch to disable it</li>
                <li>Refresh this page</li>
              </ol>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-700/50">
              <Button
                onClick={handleDismissWarning}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                Continue to LogiAI
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="bg-gray-700/50 border-gray-600/50 text-white hover:bg-gray-600/50"
              >
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default MetaMaskBlocker;
