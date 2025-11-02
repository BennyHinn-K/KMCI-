#!/usr/bin/env node

/**
 * Complete Project Setup Script
 * Automatically runs all required setup steps
 */

const fs = require('fs')
const { execSync } = require('child_process')

console.log('🚀 KMCI Website - Complete Setup')
console.log('='.repeat(60))

// Step 1: Check Node.js
console.log('\n📦 Step 1: Checking Node.js...')
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim()
  console.log(`✅ Node.js: ${nodeVersion}`)
} catch {
  console.error('❌ Node.js not found. Please install Node.js 18+ first.')
  process.exit(1)
}

// Step 2: Install Dependencies
console.log('\n📦 Step 2: Installing dependencies...')
if (!fs.existsSync('node_modules')) {
  console.log('Running npm install...')
  try {
    execSync('npm install', { stdio: 'inherit' })
    console.log('✅ Dependencies installed')
  } catch {
    console.error('❌ Failed to install dependencies')
    process.exit(1)
  }
} else {
  console.log('✅ Dependencies already installed')
}

// Step 3: Check Environment
console.log('\n🔐 Step 3: Checking environment configuration...')
if (!fs.existsSync('.env.local')) {
  console.log('⚠️  .env.local not found')
  if (fs.existsSync('env.example')) {
    console.log('Creating .env.local from env.example...')
    fs.copyFileSync('env.example', '.env.local')
    console.log('✅ Created .env.local - Please configure your credentials')
  }
} else {
  console.log('✅ .env.local file exists')
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const hasSupabaseUrl = /NEXT_PUBLIC_SUPABASE_URL\s*=/.test(envContent)
  const hasSupabaseKey = /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/.test(envContent)
  
  if (hasSupabaseUrl && hasSupabaseKey) {
    console.log('✅ Supabase credentials configured')
  } else {
    console.log('⚠️  Supabase credentials may be missing')
  }
}

// Step 4: Fix Products Database
console.log('\n🔧 Step 4: Fixing products database...')
if (fs.existsSync('run-fix-products.js')) {
  try {
    console.log('Attempting to auto-fix products...')
    execSync('node run-fix-products.js', { stdio: 'inherit' })
    console.log('✅ Products database fix attempted')
  } catch {
    console.log('⚠️  Auto-fix failed - Manual step required')
    console.log('   Please run FIX-PRODUCTS-DATABASE.sql in Supabase SQL Editor')
  }
}

// Step 5: Type Check
console.log('\n🔍 Step 5: Running type check...')
try {
  execSync('npm run type-check', { stdio: 'pipe' })
  console.log('✅ Type check passed')
} catch {
  console.log('⚠️  Type check found issues (non-blocking)')
}

// Summary
console.log('\n' + '='.repeat(60))
console.log('✅ SETUP COMPLETE!')
console.log('\n📋 Next Steps:')
console.log('   1. Ensure .env.local has correct Supabase credentials')
console.log('   2. If products fix failed, run FIX-PRODUCTS-DATABASE.sql in Supabase')
console.log('   3. Run: npm run dev')
console.log('   4. Open: http://localhost:3000')
console.log('\n' + '='.repeat(60))

