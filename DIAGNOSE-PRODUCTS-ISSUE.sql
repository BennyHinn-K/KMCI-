-- =====================================================
-- DIAGNOSE PRODUCTS DATABASE ISSUE
-- Run this in Supabase SQL Editor to identify the problem
-- =====================================================

-- 1. Check if products table exists
SELECT 
  '1. Products Table Check' as check_type,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'products'
  ) as table_exists;

-- 2. Check products table structure
SELECT 
  '2. Products Table Structure' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- 3. Check if RLS is enabled
SELECT 
  '3. RLS Status' as check_type,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'products';

-- 4. List ALL policies on products table
SELECT 
  '4. Existing Policies' as check_type,
  policyname,
  permissive,
  roles,
  cmd as operation,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- 5. Check for duplicate/conflicting policies
SELECT 
  '5. Policy Conflicts' as check_type,
  cmd,
  COUNT(*) as policy_count,
  string_agg(policyname, ', ') as policy_names
FROM pg_policies
WHERE tablename = 'products'
GROUP BY cmd
HAVING COUNT(*) > 1;

-- 6. Check if profiles table exists
SELECT 
  '6. Profiles Table Check' as check_type,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) as table_exists;

-- 7. Check current user's profile and role
SELECT 
  '7. Current User Profile' as check_type,
  u.id as user_id,
  u.email,
  p.role,
  p.full_name,
  CASE 
    WHEN p.role IN ('super_admin', 'editor') THEN '✅ CAN MANAGE PRODUCTS'
    WHEN p.role IS NULL THEN '❌ NO PROFILE - CANNOT MANAGE'
    ELSE '❌ INSUFFICIENT PERMISSIONS'
  END as permission_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
   OR u.id = auth.uid();

-- 8. Test SELECT policy (what products can be seen)
SELECT 
  '8. Products Count by Status' as check_type,
  status,
  COUNT(*) as count
FROM products
GROUP BY status;

-- 9. Check if there's an INSERT policy specifically
SELECT 
  '9. INSERT Policy Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'products' 
      AND cmd = 'INSERT'
    ) THEN '✅ INSERT policy exists'
    ELSE '❌ NO INSERT POLICY - This is the problem!'
  END as insert_policy_status;

-- 10. Show what policies cover INSERT (through FOR ALL)
SELECT 
  '10. Policies Covering INSERT' as check_type,
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'INSERT' THEN '✅ Direct INSERT policy'
    WHEN cmd = 'ALL' THEN '✅ Covers INSERT (via FOR ALL)'
    ELSE '❌ Does not cover INSERT'
  END as covers_insert
FROM pg_policies
WHERE tablename = 'products'
AND (cmd = 'INSERT' OR cmd = 'ALL');


