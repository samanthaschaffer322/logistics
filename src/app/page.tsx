'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// LogiAI V4.0 - Cache Buster: 20250907065024
console.log('🚀 LogiAI V4.0 Loading!');
console.log('✅ Upgraded to Next.js 15.5.2 + React 18.3.1');
console.log('🎯 Cache Buster: 20250907065024');

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    console.log('🔄 LogiAI V4.0 - Checking authentication...');
    
    // Immediate redirect without any delays
    const isAuthenticated = sessionStorage.getItem('logiai_authenticated');
    const userSession = localStorage.getItem('logiai_user');
    
    if (isAuthenticated === 'true' && userSession) {
      console.log('✅ User authenticated - redirecting to dashboard');
      router.replace('/dashboard');
    } else {
      console.log('🔐 User not authenticated - redirecting to login');
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
          LogiAI V4.0
        </h1>
        <p className="text-slate-400 mt-2">Loading your enhanced logistics platform...</p>
        <p className="text-xs text-slate-500 mt-1">Build: 20250907065024</p>
      </div>
    </div>
  );
};

export default HomePage;
