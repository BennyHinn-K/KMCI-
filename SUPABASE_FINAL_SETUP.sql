-- =====================================================
-- KMCI FINAL ADMIN SETUP - ONE ADMIN USER ONLY
-- Run this ENTIRE script in Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/rxtiwgfwxqvzscqbgnqk/sql
-- =====================================================

-- Step 1: DELETE ALL EXISTING USERS (Clean Slate)
DELETE FROM profiles;
DELETE FROM auth.users WHERE email IS NOT NULL;

-- Step 2: CREATE THE SINGLE ADMIN USER
DO $$
DECLARE
  new_user_id UUID;
  admin_email TEXT := 'KMCI@admin';
  admin_password TEXT := '#1nne$TY';
  admin_name TEXT := 'KMCI Admin';
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', admin_name),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Create profile with super_admin role
  INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    new_user_id,
    admin_email,
    admin_name,
    'super_admin',
    NOW(),
    NOW()
  );

  RAISE NOTICE '✅ Single admin user created!';
  RAISE NOTICE '📧 Email: %', admin_email;
  RAISE NOTICE '🔑 Password: %', admin_password;
  RAISE NOTICE '👤 User ID: %', new_user_id;
  
END $$;

-- Step 3: VERIFY ONLY ONE ADMIN EXISTS
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id;

-- Expected: ONLY ONE ROW with email = 'KMCI@admin' and role = 'super_admin'
-- =====================================================

