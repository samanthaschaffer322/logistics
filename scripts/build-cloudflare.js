#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Cloudflare Pages Build Optimization');
console.log('=====================================');
console.log('');

// Check if .next directory exists
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  console.log('❌ .next directory not found - build may have failed');
  process.exit(1);
}

console.log('✅ Next.js build completed successfully!');
console.log('');

// Clean up large files for Cloudflare Pages (25MB limit per file)
console.log('🧹 Cleaning up large files for Cloudflare Pages...');

const filesToRemove = [
  '.next/cache',
  '.next/cache/webpack',
  '.next/cache/swc',
  '.next/static/chunks/*.map',
  '.next/server/chunks/*.map'
];

filesToRemove.forEach(pattern => {
  try {
    const fullPath = path.join(process.cwd(), pattern);
    if (fs.existsSync(fullPath)) {
      if (fs.statSync(fullPath).isDirectory()) {
        execSync(`rm -rf "${fullPath}"`, { stdio: 'inherit' });
        console.log(`✅ Removed: ${pattern}`);
      } else {
        execSync(`rm -f "${fullPath}"`, { stdio: 'inherit' });
        console.log(`✅ Removed: ${pattern}`);
      }
    }
  } catch (error) {
    console.log(`⚠️  Could not remove ${pattern}: ${error.message}`);
  }
});

// Check final .next directory size
try {
  const size = execSync(`du -sh "${nextDir}"`, { encoding: 'utf8' }).trim().split('\t')[0];
  console.log(`📊 Final .next directory size: ${size}`);
  
  // Parse size and warn if still too large
  const sizeNum = parseFloat(size);
  const unit = size.replace(/[0-9.]/g, '').trim();
  
  if (unit === 'G' || (unit === 'M' && sizeNum > 100)) {
    console.log('⚠️  Warning: Build size may be too large for Cloudflare Pages');
    console.log('   Consider optimizing dependencies or assets');
  } else {
    console.log('✅ Build output size is optimized for Cloudflare Pages!');
  }
} catch (error) {
  console.log('📁 Build directory ready for deployment');
}

console.log('');
console.log('🎯 Cloudflare Pages Configuration:');
console.log('- Framework preset: Next.js');
console.log('- Build command: npm run build');
console.log('- Build output directory: .next');
console.log('- Environment variables: OPENAI_API_KEY');
console.log('');
console.log('🎉 Ready for Cloudflare Pages deployment!');
