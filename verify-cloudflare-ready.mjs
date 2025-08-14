#!/usr/bin/env node

console.log('🚀 CLOUDFLARE AUTO-DEPLOYMENT READINESS CHECK\n');

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

// Check 1: Build Configuration
console.log('⚙️ 1. CHECKING BUILD CONFIGURATION...');

if (existsSync('next.config.js')) {
  const config = readFileSync('next.config.js', 'utf8');
  const hasOutput = config.includes('output');
  const hasExport = config.includes('export');
  const hasTrailingSlash = config.includes('trailingSlash');
  
  console.log(`   ${hasOutput ? '✅' : '❌'} Static output configured`);
  console.log(`   ${hasExport ? '✅' : '❌'} Export mode enabled`);
  console.log(`   ${hasTrailingSlash ? '✅' : '❌'} Trailing slash configured`);
} else {
  console.log('   ❌ next.config.js missing');
}

// Check 2: Package.json Scripts
console.log('\n📦 2. CHECKING PACKAGE.JSON SCRIPTS...');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const hasDevScript = pkg.scripts?.dev;
const hasBuildScript = pkg.scripts?.build;
const hasStartScript = pkg.scripts?.start;

console.log(`   ${hasDevScript ? '✅' : '❌'} dev script: ${hasDevScript || 'missing'}`);
console.log(`   ${hasBuildScript ? '✅' : '❌'} build script: ${hasBuildScript || 'missing'}`);
console.log(`   ${hasStartScript ? '✅' : '❌'} start script: ${hasStartScript || 'missing'}`);

// Check 3: Environment Variables
console.log('\n🔧 3. CHECKING ENVIRONMENT VARIABLES...');
if (existsSync('.env.local')) {
  const env = readFileSync('.env.local', 'utf8');
  const hasORS = env.includes('NEXT_PUBLIC_ORS_API_KEY');
  const hasOpenAI = env.includes('OPENAI_API_KEY') || env.includes('NEXT_PUBLIC_OPENAI_API_KEY');
  
  console.log(`   ✅ .env.local exists`);
  console.log(`   ${hasORS ? '✅' : '❌'} OpenRouteService API key`);
  console.log(`   ${hasOpenAI ? '✅' : '❌'} OpenAI API key`);
} else {
  console.log('   ❌ .env.local missing');
}

// Check 4: Git Repository Status
console.log('\n📂 4. CHECKING GIT REPOSITORY...');
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  const gitRemote = execSync('git remote -v', { encoding: 'utf8' });
  
  console.log(`   ${gitStatus.trim() === '' ? '✅' : '⚠️'} Working directory ${gitStatus.trim() === '' ? 'clean' : 'has uncommitted changes'}`);
  console.log(`   ${gitRemote.includes('github.com') ? '✅' : '❌'} GitHub remote configured`);
  console.log(`   ${gitRemote.includes('samanthaschaffer322/logistics') ? '✅' : '❌'} Correct repository URL`);
} catch (error) {
  console.log('   ❌ Git repository not initialized');
}

// Check 5: Build Test
console.log('\n🏗️ 5. TESTING BUILD PROCESS...');
try {
  console.log('   🔄 Running build test...');
  execSync('npm run build', { stdio: 'pipe' });
  
  if (existsSync('out')) {
    const outFiles = execSync('find out -type f | wc -l', { encoding: 'utf8' }).trim();
    console.log(`   ✅ Build successful - ${outFiles} files generated`);
    console.log(`   ✅ Static export ready in 'out/' directory`);
  } else {
    console.log('   ❌ Build completed but no output directory found');
  }
} catch (error) {
  console.log('   ❌ Build failed - check build configuration');
}

// Summary
console.log('\n🎯 CLOUDFLARE READINESS SUMMARY:');
console.log('');
console.log('📋 REQUIRED CLOUDFLARE PAGES SETTINGS:');
console.log('   Framework preset: Next.js (Static HTML Export)');
console.log('   Build command: npm run build');
console.log('   Build output directory: out');
console.log('   Root directory: (leave empty)');
console.log('   Node.js version: 18');
console.log('');
console.log('🔑 ENVIRONMENT VARIABLES TO ADD:');
console.log('   NODE_ENV=production');
console.log('   NEXT_PUBLIC_ORS_API_KEY=5b3ce3597851110001cf6248a6a4c7b8b8b4e4e4e4e4e4e4');
console.log('   NEXT_PUBLIC_OPENAI_API_KEY=sk-Is6s1p1BqoYf21xBywtG2w');
console.log('');
console.log('🚀 NEXT STEPS:');
console.log('   1. Go to https://dash.cloudflare.com/pages');
console.log('   2. Click "Create a project"');
console.log('   3. Connect to GitHub repository: samanthaschaffer322/logistics');
console.log('   4. Use the settings above');
console.log('   5. Deploy and enjoy auto-deployment!');
console.log('');
console.log('✨ Your LogiAI application will auto-deploy on every GitHub commit!');
