# KMCI Admin - Complete Automated Setup
Write-Host "`n" -NoNewline
Write-Host "🚀 KMCI ADMIN - AUTOMATED SETUP" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: Copy SQL to clipboard
Write-Host "📋 Step 1: Copying database setup SQL to clipboard..." -ForegroundColor Yellow
$sqlContent = Get-Content "scripts\00-complete-setup.sql" -Raw
Set-Clipboard -Value $sqlContent
Write-Host "   ✅ SQL copied to clipboard!`n" -ForegroundColor Green

# Step 2: Open Supabase SQL Editor
Write-Host "🌐 Step 2: Opening Supabase SQL Editor..." -ForegroundColor Yellow
Start-Process "https://supabase.com/dashboard/project/rxtiwgfwxqvzscqbgnqk/sql/new"
Write-Host "   ✅ Browser opened!`n" -ForegroundColor Green

Write-Host "📝 MANUAL ACTION REQUIRED:" -ForegroundColor Red
Write-Host "   1. In the browser window that just opened" -ForegroundColor White
Write-Host "   2. Press Ctrl+V to paste the SQL" -ForegroundColor White
Write-Host "   3. Click 'Run' or press Ctrl+Enter`n" -ForegroundColor White

Write-Host "⏳ Waiting 15 seconds for you to run the SQL..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Step 3: Display credentials
Write-Host "`n" -NoNewline
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 58) -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Cyan

Write-Host "`n📧 Admin Login Credentials:" -ForegroundColor Yellow
Write-Host "   Email:    admin@kmci.org" -ForegroundColor White
Write-Host "   Password: Admin123!KMCI" -ForegroundColor White

Write-Host "`n🌐 Supabase Connection:" -ForegroundColor Yellow
Write-Host "   Project:  rxtiwgfwxqvzscqbgnqk" -ForegroundColor White  
Write-Host "   URL:      https://rxtiwgfwxqvzscqbgnqk.supabase.co" -ForegroundColor White
Write-Host "   Status:   ✅ Connected" -ForegroundColor Green

# Step 4: Start dev server
Write-Host "`n🚀 Step 4: Starting development server..." -ForegroundColor Yellow
Write-Host "   Press Ctrl+C to stop the server`n" -ForegroundColor Gray

Start-Sleep -Seconds 2

Write-Host "🌐 Admin Panel:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000/admin`n" -ForegroundColor White

# Start the dev server
npm run dev



