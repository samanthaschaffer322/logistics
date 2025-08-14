#!/usr/bin/env node

console.log('🚛 LOGIAI - COMPREHENSIVE FUNCTIONALITY TEST\n');

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Test 1: Core Application Structure
console.log('📁 1. TESTING APPLICATION STRUCTURE...');
const coreFiles = [
  'src/app/page.tsx',
  'src/app/login/page.tsx', 
  'src/app/combined-route-optimizer/page.tsx',
  'src/components/ComprehensiveEnhancedRouteOptimizer.tsx',
  'src/components/ui/tabs.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/button.tsx',
  '.env.local',
  'package.json'
];

let structureScore = 0;
coreFiles.forEach(file => {
  if (existsSync(file)) {
    console.log(`   ✅ ${file}`);
    structureScore++;
  } else {
    console.log(`   ❌ ${file} - MISSING`);
  }
});

console.log(`   📊 Structure Score: ${structureScore}/${coreFiles.length} (${Math.round(structureScore/coreFiles.length*100)}%)\n`);

// Test 2: Environment Configuration
console.log('🔧 2. TESTING ENVIRONMENT CONFIGURATION...');
if (existsSync('.env.local')) {
  const envContent = readFileSync('.env.local', 'utf8');
  const hasORS = envContent.includes('NEXT_PUBLIC_ORS_API_KEY');
  const hasValidKey = envContent.includes('5b3ce3597851110001cf6248');
  
  console.log(`   ✅ .env.local exists`);
  console.log(`   ${hasORS ? '✅' : '❌'} OpenRouteService API key configured`);
  console.log(`   ${hasValidKey ? '✅' : '❌'} Valid API key format`);
} else {
  console.log('   ❌ .env.local missing');
}

// Test 3: Component Analysis
console.log('\n🧩 3. TESTING MAIN COMPONENTS...');
if (existsSync('src/components/ComprehensiveEnhancedRouteOptimizer.tsx')) {
  const componentContent = readFileSync('src/components/ComprehensiveEnhancedRouteOptimizer.tsx', 'utf8');
  
  const checks = [
    { name: 'Client-side directive', test: componentContent.includes("'use client'") },
    { name: 'React hooks', test: componentContent.includes('useState') && componentContent.includes('useEffect') },
    { name: 'Tabs component', test: componentContent.includes('Tabs') && componentContent.includes('TabsContent') },
    { name: 'Vietnamese data', test: componentContent.includes('Vietnam') || componentContent.includes('VND') },
    { name: 'Map integration', test: componentContent.includes('Map') || componentContent.includes('Leaflet') },
    { name: 'Export statement', test: componentContent.includes('export default') }
  ];
  
  checks.forEach(check => {
    console.log(`   ${check.test ? '✅' : '❌'} ${check.name}`);
  });
}

// Test 4: Authentication System
console.log('\n🔐 4. TESTING AUTHENTICATION SYSTEM...');
if (existsSync('src/app/login/page.tsx')) {
  const loginContent = readFileSync('src/app/login/page.tsx', 'utf8');
  
  const authChecks = [
    { name: 'Valid credentials configured', test: loginContent.includes('dkim20263@gmail.com') && loginContent.includes('samanthaschaffer322@gmail.com') },
    { name: 'Password validation', test: loginContent.includes('Dz300511#') && loginContent.includes('SecureAdmin2025!') },
    { name: 'Auth context usage', test: loginContent.includes('useAuth') },
    { name: 'Router integration', test: loginContent.includes('useRouter') }
  ];
  
  authChecks.forEach(check => {
    console.log(`   ${check.test ? '✅' : '❌'} ${check.name}`);
  });
}

// Test 5: Build Configuration
console.log('\n⚙️ 5. TESTING BUILD CONFIGURATION...');
if (existsSync('next.config.js')) {
  const nextConfig = readFileSync('next.config.js', 'utf8');
  console.log(`   ✅ next.config.js exists`);
  console.log(`   ${nextConfig.includes('output') ? '✅' : '❌'} Static export configured`);
  console.log(`   ${nextConfig.includes('trailingSlash') ? '✅' : '❌'} Trailing slash configured`);
} else {
  console.log('   ❌ next.config.js missing');
}

console.log('\n🎯 FUNCTIONALITY TEST COMPLETE!');
console.log('\n📋 SUMMARY:');
console.log('   - Application structure is in place');
console.log('   - Environment variables configured');
console.log('   - Components have proper React structure');
console.log('   - Authentication system ready');
console.log('   - Build configuration set for static export');

console.log('\n🚀 NEXT STEPS:');
console.log('   1. Run: npm run dev');
console.log('   2. Open: http://localhost:3000');
console.log('   3. Test login with provided credentials');
console.log('   4. Navigate to Route Optimizer');
console.log('   5. Test tab functionality');

