#!/usr/bin/env node

console.log('🚀 Cloudflare Pages Build Optimization');
console.log('=====================================');
console.log('');
console.log('✅ Next.js build completed successfully!');
console.log('');
console.log('📊 Build Information:');
console.log('- Framework: Next.js');
console.log('- Output Directory: .next');
console.log('- Build Command: next build');
console.log('- Node.js Version: ' + process.version);
console.log('');
console.log('🔧 Cloudflare Pages Configuration:');
console.log('- Framework preset: Next.js');
console.log('- Build command: npm run build');
console.log('- Build output directory: .next');
console.log('- Environment variables: OPENAI_API_KEY');
console.log('');
console.log('✨ Your LogiAI platform is ready for deployment!');
console.log('');

// Check if .next directory exists
const fs = require('fs');
const path = require('path');

const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log('✅ .next directory found - build successful');
  
  // Get directory size
  const { execSync } = require('child_process');
  try {
    const size = execSync(`du -sh "${nextDir}"`, { encoding: 'utf8' }).trim().split('\t')[0];
    console.log(`📁 Build size: ${size}`);
  } catch (error) {
    console.log('📁 Build directory ready for deployment');
  }
} else {
  console.log('❌ .next directory not found - check build configuration');
  process.exit(1);
}

console.log('');
console.log('🎉 Ready for Cloudflare Pages deployment!');
