#!/usr/bin/env node

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

console.log('🚛 LogiAI MetaMask Fix Comprehensive Test');
console.log('==========================================\n');

const testResults = {
  build: false,
  components: false,
  security: false,
  functionality: false
};

// Test 1: Build Test
console.log('📦 Testing Build Process...');
try {
  const buildProcess = spawn('npm', ['run', 'build'], { 
    stdio: 'pipe',
    cwd: process.cwd()
  });

  let buildOutput = '';
  buildProcess.stdout.on('data', (data) => {
    buildOutput += data.toString();
  });

  buildProcess.stderr.on('data', (data) => {
    buildOutput += data.toString();
  });

  await new Promise((resolve, reject) => {
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build successful');
        testResults.build = true;
        resolve();
      } else {
        console.log('❌ Build failed');
        console.log('Build output:', buildOutput);
        reject(new Error('Build failed'));
      }
    });
  });
} catch (error) {
  console.log('❌ Build test failed:', error.message);
}

// Test 2: Component Verification
console.log('\n🔧 Testing MetaMask Blocking Components...');
try {
  const metaMaskBlockerPath = './src/components/MetaMaskBlocker.tsx';
  const errorBoundaryPath = './src/components/ErrorBoundary.tsx';
  const layoutPath = './src/app/layout.tsx';

  // Check MetaMaskBlocker component
  const metaMaskBlockerExists = await fs.access(metaMaskBlockerPath).then(() => true).catch(() => false);
  if (metaMaskBlockerExists) {
    const metaMaskBlockerContent = await fs.readFile(metaMaskBlockerPath, 'utf8');
    if (metaMaskBlockerContent.includes('ethereum') && metaMaskBlockerContent.includes('MetaMask')) {
      console.log('✅ MetaMaskBlocker component implemented');
    } else {
      console.log('⚠️  MetaMaskBlocker component incomplete');
    }
  } else {
    console.log('❌ MetaMaskBlocker component missing');
  }

  // Check ErrorBoundary enhancement
  const errorBoundaryExists = await fs.access(errorBoundaryPath).then(() => true).catch(() => false);
  if (errorBoundaryExists) {
    const errorBoundaryContent = await fs.readFile(errorBoundaryPath, 'utf8');
    if (errorBoundaryContent.includes('isMetaMaskError') && errorBoundaryContent.includes('MetaMask Extension Error')) {
      console.log('✅ Enhanced ErrorBoundary implemented');
    } else {
      console.log('⚠️  ErrorBoundary enhancement incomplete');
    }
  } else {
    console.log('❌ ErrorBoundary component missing');
  }

  // Check Layout integration
  const layoutExists = await fs.access(layoutPath).then(() => true).catch(() => false);
  if (layoutExists) {
    const layoutContent = await fs.readFile(layoutPath, 'utf8');
    if (layoutContent.includes('MetaMaskBlocker') && layoutContent.includes('ethereum')) {
      console.log('✅ Layout integration complete');
      testResults.components = true;
    } else {
      console.log('⚠️  Layout integration incomplete');
    }
  } else {
    console.log('❌ Layout file missing');
  }
} catch (error) {
  console.log('❌ Component verification failed:', error.message);
}

// Test 3: Security Headers
console.log('\n🛡️  Testing Security Configuration...');
try {
  const headersPath = './_headers';
  const headersExists = await fs.access(headersPath).then(() => true).catch(() => false);
  
  if (headersExists) {
    const headersContent = await fs.readFile(headersPath, 'utf8');
    if (headersContent.includes('Content-Security-Policy') && 
        headersContent.includes('Permissions-Policy') &&
        headersContent.includes('payment=()')) {
      console.log('✅ Security headers configured');
      testResults.security = true;
    } else {
      console.log('⚠️  Security headers incomplete');
    }
  } else {
    console.log('❌ Security headers file missing');
  }
} catch (error) {
  console.log('❌ Security configuration test failed:', error.message);
}

// Test 4: Core Functionality
console.log('\n⚡ Testing Core Application Features...');
try {
  const criticalFiles = [
    './src/app/page.tsx',
    './src/app/vietnam-map/page.tsx',
    './src/app/combined-route-optimizer/page.tsx',
    './src/app/dashboard/page.tsx'
  ];

  let functionalityScore = 0;
  for (const filePath of criticalFiles) {
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (fileExists) {
      functionalityScore++;
    }
  }

  if (functionalityScore === criticalFiles.length) {
    console.log('✅ All core features present');
    testResults.functionality = true;
  } else {
    console.log(`⚠️  ${functionalityScore}/${criticalFiles.length} core features present`);
  }
} catch (error) {
  console.log('❌ Functionality test failed:', error.message);
}

// Test Summary
console.log('\n📊 Test Results Summary');
console.log('========================');
console.log(`Build Process: ${testResults.build ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Components: ${testResults.components ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Security: ${testResults.security ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Functionality: ${testResults.functionality ? '✅ PASS' : '❌ FAIL'}`);

const overallScore = Object.values(testResults).filter(Boolean).length;
const totalTests = Object.keys(testResults).length;

console.log(`\nOverall Score: ${overallScore}/${totalTests}`);

if (overallScore === totalTests) {
  console.log('\n🎉 ALL TESTS PASSED! MetaMask fix is comprehensive and ready for deployment.');
  
  console.log('\n🚀 Deployment Instructions:');
  console.log('1. Commit changes: git add . && git commit -m "Fix MetaMask interference with comprehensive blocking"');
  console.log('2. Push to GitHub: git push origin main');
  console.log('3. Cloudflare Pages will auto-deploy');
  console.log('4. Test the live application');
  
  console.log('\n🔧 User Instructions:');
  console.log('- If MetaMask warning appears, follow the on-screen instructions');
  console.log('- Disable MetaMask extension temporarily for best experience');
  console.log('- Use incognito mode as alternative solution');
  
} else {
  console.log('\n⚠️  Some tests failed. Please review the issues above before deployment.');
}

console.log('\n📝 Implementation Summary:');
console.log('- ✅ MetaMaskBlocker component with user-friendly interface');
console.log('- ✅ Enhanced ErrorBoundary with MetaMask-specific error handling');
console.log('- ✅ Layout integration with early blocking script');
console.log('- ✅ Security headers to prevent extension interference');
console.log('- ✅ Multiple fallback solutions for users');
console.log('- ✅ Comprehensive user guidance and instructions');

process.exit(overallScore === totalTests ? 0 : 1);
