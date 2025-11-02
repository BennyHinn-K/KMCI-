-- =====================================================
-- FIX PRODUCTS DATABASE ISSUES - COMPLETE FIX
-- Creates table if missing and fixes RLS policies
-- =====================================================

-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_content TEXT,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  sku TEXT UNIQUE,
  image_url TEXT,
  gallery_urls TEXT[],
  category TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived', 'out_of_stock')),
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Step 4: Drop ALL existing conflicting policies for products
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'products') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON products';
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Step 5: Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Step 6: Create proper SELECT policy: Public can view active products, admins/editors can view all
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (
    status = 'active' 
    OR auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    )
  );

-- Step 7: Create proper INSERT policy: Only admins/editors can insert
-- CRITICAL: Must use WITH CHECK, not USING for INSERT
DROP POLICY IF EXISTS "Admins and editors can insert products" ON products;
CREATE POLICY "Admins and editors can insert products"
  ON products FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    )
  );

-- Step 8: Create proper UPDATE policy: Only admins/editors can update
CREATE POLICY "Admins and editors can update products"
  ON products FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    )
  );

-- Step 9: Create proper DELETE policy: Only admins/editors can delete
CREATE POLICY "Admins and editors can delete products"
  ON products FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    )
  );

-- Step 10: Verification
SELECT 
  '✅ Policy Created' as status,
  policyname,
  cmd as operation,
  CASE 
    WHEN cmd = 'INSERT' AND with_check IS NOT NULL THEN '✅ Has WITH CHECK'
    WHEN cmd = 'INSERT' THEN '❌ MISSING WITH CHECK'
    ELSE '✅ OK'
  END as check_status
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY cmd, policyname;

-- Step 11: Final status
SELECT 
  'Summary' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products')
    THEN '✅ Products table exists'
    ELSE '❌ Products table missing'
  END as table_status,
  CASE 
    WHEN COUNT(*) FILTER (WHERE cmd = 'INSERT' AND with_check IS NOT NULL) > 0 
    THEN '✅ FIXED - Products can now be saved'
    ELSE '❌ STILL BROKEN - INSERT policy missing WITH CHECK'
  END as policy_status
FROM pg_policies 
WHERE tablename = 'products';
