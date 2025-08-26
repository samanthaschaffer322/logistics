'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Immediate redirect without any delays
    const isAuthenticated = sessionStorage.getItem('logiai_authenticated');
    const userSession = localStorage.getItem('logiai_user');
    
    if (isAuthenticated === 'true' && userSession) {
      // User is authenticated, go to dashboard
      router.replace('/dashboard');
    } else {
      // User is not authenticated, go to login
      router.replace('/login');
    }
  }, [router]);

  // Show minimal loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          LogiAI
        </h1>
        <p className="text-slate-400 mt-2">Loading your logistics platform...</p>
      </div>
    </div>
  );
};

export default HomePage;
