# =====================================================
# KMCI Admin User Duplicate Fix - PowerShell Script
# This script fixes the duplicate admin user constraint violation
# =====================================================

Write-Host "🔧 KMCI Admin User Duplicate Fix" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if .env.local file exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host "   Please create .env.local with your Supabase credentials:" -ForegroundColor Yellow
    Write-Host "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" -ForegroundColor Gray
    Write-Host "   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ Environment file found" -ForegroundColor Green

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🚀 Running Admin User Fix..." -ForegroundColor Cyan
Write-Host "   This will resolve the duplicate key constraint violation." -ForegroundColor Gray

# Method 1: Try running the JavaScript fix
Write-Host ""
Write-Host "Method 1: Automated JavaScript Fix" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow

try {
    node fix-admin-duplicate.js
    Write-Host "✅ JavaScript fix completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Your admin credentials are:" -ForegroundColor Cyan
    Write-Host "📧 Email: admin@kmci.org" -ForegroundColor White
    Write-Host "👤 Username: AdminKMCI" -ForegroundColor White
    Write-Host "🔑 Password: @adminKMCI" -ForegroundColor White
    Write-Host "🌐 Admin URL: /admin" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Change password after first login!" -ForegroundColor Red
    exit 0
} catch {
    Write-Host "⚠️  JavaScript method failed, trying manual approach..." -ForegroundColor Yellow
}

# Method 2: Manual SQL instructions
Write-Host ""
Write-Host "Method 2: Manual SQL Fix" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow
Write-Host ""
Write-Host "The automated fix didn't work. Please follow these manual steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to your Supabase Dashboard" -ForegroundColor White
Write-Host "2. Navigate to SQL Editor" -ForegroundColor White
Write-Host "3. Copy and paste this SQL query:" -ForegroundColor White
Write-Host ""

$manualSQL = @"
-- Fix Admin User Duplicate Issue
DO `$`$
DECLARE
    admin_email TEXT := 'admin@kmci.org';
    admin_password TEXT := '@adminKMCI';
    admin_name TEXT := 'AdminKMCI';
    existing_id UUID;
BEGIN
    -- Check if user exists and get their ID
    SELECT id INTO existing_id FROM auth.users WHERE email = admin_email LIMIT 1;

    IF existing_id IS NOT NULL THEN
        -- Update existing user
        UPDATE auth.users
        SET encrypted_password = crypt(admin_password, gen_salt('bf')),
            updated_at = NOW()
        WHERE id = existing_id;

        -- Update or insert profile
        INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (existing_id, admin_email, admin_name, 'super_admin', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
            full_name = admin_name,
            role = 'super_admin',
            updated_at = NOW();

        RAISE NOTICE '✅ Existing admin user updated successfully!';
    ELSE
        -- Create new user with random UUID
        existing_id := gen_random_uuid();

        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password,
            email_confirmed_at, created_at, updated_at,
            raw_app_meta_data, raw_user_meta_data, is_super_admin
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            existing_id, 'authenticated', 'authenticated', admin_email,
            crypt(admin_password, gen_salt('bf')), NOW(), NOW(), NOW(),
            '{"provider": "email", "providers": ["email"]}', '{}', FALSE
        );

        INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (existing_id, admin_email, admin_name, 'super_admin', NOW(), NOW());

        RAISE NOTICE '✅ New admin user created successfully!';
    END IF;

    RAISE NOTICE '📧 Email: %', admin_email;
    RAISE NOTICE '🔑 Password: %', admin_password;
    RAISE NOTICE '🆔 User ID: %', existing_id;
END `$`$;
"@

Write-Host $manualSQL -ForegroundColor Cyan

Write-Host ""
Write-Host "4. Run the query by clicking 'Run'" -ForegroundColor White
Write-Host "5. You should see success messages in the results" -ForegroundColor White
Write-Host ""
Write-Host "After running the SQL:" -ForegroundColor Yellow
Write-Host "📧 Email: admin@kmci.org" -ForegroundColor White
Write-Host "👤 Username: AdminKMCI" -ForegroundColor White
Write-Host "🔑 Password: @adminKMCI" -ForegroundColor White
Write-Host "🌐 Admin URL: /admin" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: Change password after first login!" -ForegroundColor Red

Write-Host ""
Write-Host "📝 Alternative: Copy FIX_ADMIN_USER_DUPLICATE.sql" -ForegroundColor Yellow
Write-Host "   You can also copy the entire content of FIX_ADMIN_USER_DUPLICATE.sql" -ForegroundColor Gray
Write-Host "   and paste it into Supabase SQL Editor for a more comprehensive fix." -ForegroundColor Gray

Write-Host ""
Write-Host "🎯 Fix completed! Try logging in with the credentials above." -ForegroundColor Green
