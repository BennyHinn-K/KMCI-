-- =====================================================
-- URGENT FIX - Products Not Saving
-- Run this IMMEDIATELY in Supabase SQL Editor
-- =====================================================

-- Step 1: Verify table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        CREATE TABLE products (
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
        RAISE NOTICE 'Products table created';
    ELSE
        RAISE NOTICE 'Products table already exists';
    END IF;
END $$;

-- Step 2: Drop ALL existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'products') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON products';
    END LOOP;
END $$;

-- Step 3: Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Step 4: Create INSERT policy with WITH CHECK (CRITICAL FOR INSERT)
CREATE POLICY "admins_editors_insert_products"
  ON products FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'editor')
    )
  );

-- Step 5: Create SELECT policy
CREATE POLICY "public_view_active_products"
  ON products FOR SELECT
  USING (
    status = 'active' 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'editor')
    )
  );

-- Step 6: Create UPDATE policy
CREATE POLICY "admins_editors_update_products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'editor')
    )
  );

-- Step 7: Create DELETE policy
CREATE POLICY "admins_editors_delete_products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'editor')
    )
  );

-- Step 8: VERIFICATION - Check if INSERT policy has WITH CHECK
SELECT 
  'VERIFICATION' as check_type,
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'INSERT' AND with_check IS NOT NULL THEN '✅ HAS WITH CHECK - INSERT WILL WORK'
    WHEN cmd = 'INSERT' THEN '❌ MISSING WITH CHECK - INSERT WILL FAIL'
    ELSE 'OK'
  END as status
FROM pg_policies 
WHERE tablename = 'products' AND cmd = 'INSERT';

-- Step 9: Final status
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'products' 
      AND cmd = 'INSERT' 
      AND with_check IS NOT NULL
    ) 
    THEN '✅✅✅ FIXED - Products can now be saved! ✅✅✅'
    ELSE '❌❌❌ STILL BROKEN - INSERT policy missing WITH CHECK ❌❌❌'
  END as final_status;

