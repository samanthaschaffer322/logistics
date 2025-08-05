#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Cloudflare-optimized build...');

// Function to remove directory recursively
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ Removed: ${dirPath}`);
  }
}

// Function to get directory size
function getDirSize(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

// Function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Clean up large cache files after build
function cleanupLargeFiles() {
  console.log('🧹 Cleaning up large files for Cloudflare Pages...');
  
  const nextDir = '.next';
  const cacheDir = path.join(nextDir, 'cache');
  
  // Remove webpack cache (usually the largest)
  removeDir(path.join(cacheDir, 'webpack'));
  
  // Remove other cache directories that might be large
  removeDir(path.join(cacheDir, 'swc'));
  removeDir(path.join(cacheDir, 'images'));
  
  // Remove source maps (not needed in production)
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    const removeSourceMaps = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          removeSourceMaps(filePath);
        } else if (file.endsWith('.map')) {
          fs.unlinkSync(filePath);
          console.log(`✅ Removed source map: ${filePath}`);
        }
      }
    };
    removeSourceMaps(staticDir);
  }
  
  // Check final size
  if (fs.existsSync(nextDir)) {
    const finalSize = getDirSize(nextDir);
    console.log(`📊 Final .next directory size: ${formatBytes(finalSize)}`);
    
    if (finalSize > 100 * 1024 * 1024) { // 100MB
      console.warn('⚠️  Warning: Build output is still quite large. Consider further optimization.');
    } else {
      console.log('✅ Build output size is optimized for Cloudflare Pages!');
    }
  }
}

// Main execution
if (require.main === module) {
  cleanupLargeFiles();
}

module.exports = { cleanupLargeFiles };
