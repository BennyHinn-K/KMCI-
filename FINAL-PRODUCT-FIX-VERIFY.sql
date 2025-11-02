-- =====================================================
-- FINAL VERIFICATION - Check if products can be saved
-- Run this AFTER FIX-PRODUCTS-DATABASE.sql
-- =====================================================

-- Check 1: Table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products')
    THEN '✅ Products table exists'
    ELSE '❌ Products table missing - RUN FIX-PRODUCTS-DATABASE.sql'
  END as table_check;

-- Check 2: INSERT policy exists with WITH CHECK
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'INSERT' AND with_check IS NOT NULL THEN '✅ HAS WITH CHECK - CAN INSERT'
    WHEN cmd = 'INSERT' THEN '❌ MISSING WITH CHECK - CANNOT INSERT'
    ELSE 'OK'
  END as insert_capability
FROM pg_policies 
WHERE tablename = 'products' AND cmd = 'INSERT';

-- Check 3: Test current user permissions
DO $$
DECLARE
    current_user_id UUID;
    current_user_email TEXT;
    user_role TEXT;
BEGIN
    -- Get authenticated user
    SELECT auth.uid() INTO current_user_id;
    
    IF current_user_id IS NULL THEN
        RAISE NOTICE '⚠️  No authenticated user - Cannot test permissions';
        RETURN;
    END IF;
    
    -- Get user email and role
    SELECT u.email, COALESCE(p.role, 'NO PROFILE') 
    INTO current_user_email, user_role
    FROM auth.users u
    LEFT JOIN profiles p ON u.id = p.id
    WHERE u.id = current_user_id;
    
    RAISE NOTICE 'User: %', current_user_email;
    RAISE NOTICE 'Role: %', user_role;
    
    IF user_role IN ('super_admin', 'editor') THEN
        RAISE NOTICE '✅ User CAN INSERT products';
    ELSIF user_role = 'NO PROFILE' THEN
        RAISE NOTICE '❌ User has NO PROFILE - CANNOT INSERT products';
        RAISE NOTICE 'Fix: Create profile with super_admin or editor role';
    ELSE
        RAISE NOTICE '❌ User role is % - CANNOT INSERT products', user_role;
        RAISE NOTICE 'Required: super_admin or editor';
    END IF;
END $$;

-- Check 4: Summary
SELECT 
  'FINAL STATUS' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'products' 
      AND cmd = 'INSERT' 
      AND with_check IS NOT NULL
    ) 
    THEN '✅ READY - Products can be saved'
    ELSE '❌ NOT READY - Run FIX-PRODUCTS-DATABASE.sql'
  END as status;

