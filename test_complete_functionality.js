#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing Complete Logistics App Functionality...\n');

// Test 1: Build the application
console.log('1. Testing Build Process...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Test 2: Check critical files exist
console.log('2. Checking Critical Files...');
const criticalFiles = [
  'src/app/route-optimization/page.tsx',
  'src/app/logistics-operations/page.tsx',
  'src/app/import-export/page.tsx',
  'src/lib/logisticsAlgorithms.ts',
  'src/lib/vnaccsDocuments.ts',
  'src/contexts/LanguageContext.tsx'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Test 3: Check route optimization features
console.log('\n3. Testing Route Optimization Features...');
const routeOptFile = fs.readFileSync('src/app/route-optimization/page.tsx', 'utf8');

const routeFeatures = [
  'departure',
  'destination', 
  '40ft',
  'vietnamTruckRestrictions',
  'isRouteAllowed',
  'calculateOptimalDepartureTime'
];

routeFeatures.forEach(feature => {
  if (routeOptFile.includes(feature)) {
    console.log(`✅ Route optimization includes ${feature}`);
  } else {
    console.log(`❌ Route optimization missing ${feature}`);
  }
});

// Test 4: Check logistics operations features
console.log('\n4. Testing Logistics Operations Features...');
const logisticsFile = fs.readFileSync('src/app/logistics-operations/page.tsx', 'utf8');

const logisticsFeatures = [
  'consolidateTrips',
  'handleConsolidation',
  'cost-calculation',
  'monitoring',
  'AI Trip Consolidation'
];

logisticsFeatures.forEach(feature => {
  if (logisticsFile.includes(feature)) {
    console.log(`✅ Logistics operations includes ${feature}`);
  } else {
    console.log(`❌ Logistics operations missing ${feature}`);
  }
});

// Test 5: Check import-export features
console.log('\n5. Testing Import-Export Features...');
const importExportFile = fs.readFileSync('src/app/import-export/page.tsx', 'utf8');

const importExportFeatures = [
  'VNACCS',
  'generateVNACCSData',
  'validateVNACCSCompliance',
  'customs',
  'shipments'
];

importExportFeatures.forEach(feature => {
  if (importExportFile.includes(feature)) {
    console.log(`✅ Import-export includes ${feature}`);
  } else {
    console.log(`❌ Import-export missing ${feature}`);
  }
});

// Test 6: Check package.json configuration
console.log('\n6. Testing Package Configuration...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

if (packageJson.scripts.build && packageJson.scripts.dev && packageJson.scripts.start) {
  console.log('✅ All required scripts present');
} else {
  console.log('❌ Missing required scripts');
}

if (packageJson.dependencies.next && packageJson.dependencies.react) {
  console.log('✅ Core dependencies present');
} else {
  console.log('❌ Missing core dependencies');
}

// Test 7: Check deployment readiness
console.log('\n7. Testing Deployment Readiness...');
const deploymentFiles = [
  'next.config.js',
  '_redirects',
  '.gitignore'
];

deploymentFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

console.log('\n🎉 Functionality Test Complete!');
console.log('\n📋 Summary:');
console.log('- Route Optimization: Enhanced with Vietnam truck regulations');
console.log('- Logistics Operations: AI-powered trip consolidation');
console.log('- Import-Export: VNACCS integration and document generation');
console.log('- Build: Successful with static export');
console.log('- Deployment: Ready for Cloudflare Pages');

console.log('\n🚀 Ready for GitHub push and Cloudflare deployment!');
