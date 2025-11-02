# ============================================
# COMPLETE PROJECT SETUP SCRIPT
# Runs all required setup automatically
# ============================================

Write-Host "🚀 KMCI Website - Complete Setup" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

# Step 1: Check Node.js
Write-Host "`n📦 Step 1: Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Step 2: Install Dependencies
Write-Host "`n📦 Step 2: Installing dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "Running npm install..." -ForegroundColor White
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Step 3: Check Environment Variables
Write-Host "`n🔐 Step 3: Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file exists" -ForegroundColor Green
    
    $envContent = Get-Content ".env.local" -Raw
    $hasSupabaseUrl = $envContent -match "NEXT_PUBLIC_SUPABASE_URL\s*="
    $hasSupabaseKey = $envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY\s*="
    
    if ($hasSupabaseUrl -and $hasSupabaseKey) {
        Write-Host "✅ Supabase credentials configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Supabase credentials may be missing" -ForegroundColor Yellow
        Write-Host "   Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  .env.local not found" -ForegroundColor Yellow
    Write-Host "   Creating from env.example..." -ForegroundColor White
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env.local"
        Write-Host "✅ Created .env.local - Please configure your credentials" -ForegroundColor Green
    }
}

# Step 4: Try to auto-fix products database
Write-Host "`n🔧 Step 4: Fixing products database..." -ForegroundColor Yellow
if (Test-Path "run-fix-products.js") {
    Write-Host "Attempting to auto-fix products..." -ForegroundColor White
    node run-fix-products.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Products database fixed automatically!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Auto-fix failed - Manual step required" -ForegroundColor Yellow
        Write-Host "   Please run FIX-PRODUCTS-DATABASE.sql in Supabase SQL Editor" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  run-fix-products.js not found" -ForegroundColor Yellow
}

# Step 5: Type Check
Write-Host "`n🔍 Step 5: Running type check..." -ForegroundColor Yellow
npm run type-check 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Type check passed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Type check found issues (non-blocking)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Ensure .env.local has correct Supabase credentials" -ForegroundColor White
Write-Host "   2. If products fix failed, run FIX-PRODUCTS-DATABASE.sql in Supabase" -ForegroundColor White
Write-Host "   3. Run: npm run dev" -ForegroundColor White
Write-Host "   4. Open: http://localhost:3000" -ForegroundColor White
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan

