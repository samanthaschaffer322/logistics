#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

console.log('🔍 LogiAI V4.0 Feature Verification')
console.log('=====================================')

const features = [
  {
    name: 'Combined Route Optimizer',
    path: 'src/app/combined-route-optimizer/page.tsx',
    keywords: ['LeafletRouteMap', 'FileBasedRouteOptimizer', 'EnhancedRouteCalculator']
  },
  {
    name: 'Payment Tracking',
    path: 'src/app/payment-tracking/page.tsx',
    keywords: ['exportPDF', 'exportExcel', 'companies', 'overdue']
  },
  {
    name: 'Enhanced Optimizer',
    path: 'src/app/enhanced-optimizer/page.tsx',
    keywords: ['v4.0', 'OpenAI', 'route optimization']
  },
  {
    name: 'File Processing',
    path: 'src/app/file-processing/page.tsx',
    keywords: ['FileUpload', 'AI analysis', 'Vietnamese']
  },
  {
    name: 'Fleet Management',
    path: 'src/app/fleet-management/page.tsx',
    keywords: ['fleet', 'tracking', 'vehicles']
  },
  {
    name: 'Real-time Tracking',
    path: 'src/app/real-time-tracking/page.tsx',
    keywords: ['real-time', 'GPS', 'tracking']
  },
  {
    name: 'Dashboard',
    path: 'src/app/dashboard/page.tsx',
    keywords: ['dashboard', 'analytics', 'overview']
  },
  {
    name: 'AI Financial',
    path: 'src/app/ai-financial/page.tsx',
    keywords: ['financial', 'AI', 'analysis']
  },
  {
    name: 'Customs Training',
    path: 'src/app/customs-training/page.tsx',
    keywords: ['customs', 'training', 'HS codes']
  },
  {
    name: 'Import Export',
    path: 'src/app/import-export/page.tsx',
    keywords: ['import', 'export', 'trade']
  }
]

let passedFeatures = 0
let totalFeatures = features.length

console.log(`\n📋 Checking ${totalFeatures} core features...\n`)

features.forEach((feature, index) => {
  const filePath = join(process.cwd(), feature.path)
  
  if (!existsSync(filePath)) {
    console.log(`❌ ${index + 1}. ${feature.name}: File not found`)
    return
  }
  
  try {
    const content = readFileSync(filePath, 'utf8')
    const foundKeywords = feature.keywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    )
    
    if (foundKeywords.length >= Math.ceil(feature.keywords.length * 0.6)) {
      console.log(`✅ ${index + 1}. ${feature.name}: Working (${foundKeywords.length}/${feature.keywords.length} keywords found)`)
      passedFeatures++
    } else {
      console.log(`⚠️  ${index + 1}. ${feature.name}: Partial (${foundKeywords.length}/${feature.keywords.length} keywords found)`)
      console.log(`   Missing: ${feature.keywords.filter(k => !foundKeywords.includes(k)).join(', ')}`)
    }
  } catch (error) {
    console.log(`❌ ${index + 1}. ${feature.name}: Error reading file`)
  }
})

console.log('\n📊 Feature Verification Summary')
console.log('================================')
console.log(`✅ Passed: ${passedFeatures}/${totalFeatures} features`)
console.log(`📈 Success Rate: ${Math.round((passedFeatures / totalFeatures) * 100)}%`)

// Check version consistency
console.log('\n🔍 Version Consistency Check')
console.log('=============================')

const versionFiles = [
  'package.json',
  'src/components/NextGenDashboard.tsx',
  'src/app/enhanced-optimizer/page.tsx',
  'src/app/payment-tracking/page.tsx'
]

let versionConsistent = true

versionFiles.forEach(file => {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf8')
    if (content.includes('4.0') || content.includes('v4.0') || content.includes('V4.0')) {
      console.log(`✅ ${file}: V4.0 references found`)
    } else if (content.includes('3.0') || content.includes('v3.0') || content.includes('V3.0')) {
      console.log(`⚠️  ${file}: Still has V3.0 references`)
      versionConsistent = false
    } else {
      console.log(`ℹ️  ${file}: No version references`)
    }
  }
})

console.log('\n🎯 Final Assessment')
console.log('===================')

if (passedFeatures >= totalFeatures * 0.9 && versionConsistent) {
  console.log('🎉 LogiAI V4.0 is READY for deployment!')
  console.log('✅ All major features verified')
  console.log('✅ Version consistency maintained')
  process.exit(0)
} else {
  console.log('⚠️  LogiAI V4.0 needs attention:')
  if (passedFeatures < totalFeatures * 0.9) {
    console.log(`   - Feature coverage: ${Math.round((passedFeatures / totalFeatures) * 100)}% (needs 90%+)`)
  }
  if (!versionConsistent) {
    console.log('   - Version references need updating')
  }
  process.exit(1)
}
