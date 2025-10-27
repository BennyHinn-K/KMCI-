-- =====================================================
-- KMCI Admin User Creation Script
-- =====================================================
-- Run this in your Supabase SQL Editor after setting up the database
-- This will create your first admin user

-- Step 1: Create the auth user
-- IMPORTANT: Change the email and password below!
DO $$
DECLARE
  new_user_id UUID;
  admin_email TEXT := 'admin@kmci.org'; -- CHANGE THIS EMAIL
  admin_password TEXT := 'SecurePassword123!'; -- CHANGE THIS PASSWORD
  admin_name TEXT := 'Admin User'; -- CHANGE THIS NAME
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

  -- Insert into profiles with super_admin role
  INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    new_user_id,
    admin_email,
    admin_name,
    'super_admin',
    NOW(),
    NOW()
  );

  -- Output success message
  RAISE NOTICE 'Admin user created successfully!';
  RAISE NOTICE 'Email: %', admin_email;
  RAISE NOTICE 'User ID: %', new_user_id;
  
END $$;

-- Step 2: Verify the user was created
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'admin@kmci.org'; -- CHANGE THIS to match your email above

-- =====================================================
-- Alternative: Manual Creation (if the above doesn't work)
-- =====================================================

-- 1. First, create the user in Supabase Dashboard:
--    Go to Authentication > Users > Add user
--    Enter email and password

-- 2. Then get the user ID and run this:
/*
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  'paste-user-id-here',
  'admin@kmci.org',
  'Admin User',
  'super_admin'
);
*/



