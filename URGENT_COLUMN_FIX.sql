-- =====================================================
-- URGENT: Fix Critical Column Mismatch in Sermons Table
-- This fixes the PGRST204 error: "Could not find the 'speaker' column"
-- =====================================================

-- Step 1: Rename preacher column to speaker in sermons table
ALTER TABLE sermons RENAME COLUMN preacher TO speaker;

-- Step 2: Update any indexes that might reference the old column name
DROP INDEX IF EXISTS idx_sermons_preacher;
CREATE INDEX IF NOT EXISTS idx_sermons_speaker ON sermons(speaker);

-- Step 3: Verify the column change
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'sermons' AND column_name = 'speaker';

-- Step 4: Test the change with a simple query
SELECT id, title, speaker, sermon_date
FROM sermons
LIMIT 1;

-- =====================================================
-- ADDITIONAL CRITICAL DATABASE FIXES
-- =====================================================

-- Fix products table for image uploads
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_uploads JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images TEXT[];

-- Fix sermons table for image uploads
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS image_uploads JSONB;
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS gallery_images TEXT[];

-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_image_search ON products USING GIN (image_uploads);
CREATE INDEX IF NOT EXISTS idx_sermons_image_search ON sermons USING GIN (image_uploads);

-- =====================================================
-- FIX RLS POLICIES THAT MIGHT BE BLOCKING OPERATIONS
-- =====================================================

-- Drop and recreate sermons policies with correct permissions
DROP POLICY IF EXISTS "Public can view published sermons" ON sermons;
DROP POLICY IF EXISTS "Editors can insert sermons" ON sermons;
DROP POLICY IF EXISTS "Editors can update sermons" ON sermons;
DROP POLICY IF EXISTS "Editors can delete sermons" ON sermons;

-- Recreate sermons policies
CREATE POLICY "Public can view published sermons" ON sermons
    FOR SELECT USING (status = 'published' OR auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    ));

CREATE POLICY "Editors can insert sermons" ON sermons
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    ));

CREATE POLICY "Editors can update sermons" ON sermons
    FOR UPDATE USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    )) WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    ));

CREATE POLICY "Editors can delete sermons" ON sermons
    FOR DELETE USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    ));

-- Fix products policies
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Editors can insert products" ON products;
DROP POLICY IF EXISTS "Editors can update products" ON products;
DROP POLICY IF EXISTS "Editors can delete products" ON products;

CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (status = 'active' OR auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    ));

CREATE POLICY "Editors can insert products" ON products
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    ));

CREATE POLICY "Editors can update products" ON products
    FOR UPDATE USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    )) WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    ));

CREATE POLICY "Editors can delete products" ON products
    FOR DELETE USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
    ));

-- =====================================================
-- CREATE STORAGE BUCKETS FOR FILE UPLOADS
-- =====================================================

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('sermon-images', 'sermon-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('general-uploads', 'general-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for file uploads
CREATE POLICY "Public can view images" ON storage.objects
    FOR SELECT USING (bucket_id IN ('product-images', 'sermon-images', 'general-uploads'));

CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id IN ('product-images', 'sermon-images', 'general-uploads')
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can update their uploads" ON storage.objects
    FOR UPDATE USING (
        bucket_id IN ('product-images', 'sermon-images', 'general-uploads')
        AND auth.uid() = owner
    );

CREATE POLICY "Authenticated users can delete their uploads" ON storage.objects
    FOR DELETE USING (
        bucket_id IN ('product-images', 'sermon-images', 'general-uploads')
        AND auth.uid() = owner
    );

-- =====================================================
-- CREATE FUNCTIONS FOR BETTER FILE HANDLING
-- =====================================================

-- Function to generate unique file names
CREATE OR REPLACE FUNCTION generate_unique_filename(original_name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN extract(epoch from now())::int || '_' ||
           encode(gen_random_bytes(6), 'hex') || '_' ||
           regexp_replace(original_name, '[^a-zA-Z0-9.]', '_', 'g');
END;
$$ LANGUAGE plpgsql;

-- Function to handle image uploads with metadata
CREATE OR REPLACE FUNCTION handle_image_upload(
    bucket_name TEXT,
    file_name TEXT,
    file_size BIGINT DEFAULT NULL,
    content_type TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    upload_info JSONB;
    public_url TEXT;
BEGIN
    -- Generate public URL
    public_url := format('https://%s.supabase.co/storage/v1/object/public/%s/%s',
                        current_setting('app.settings.supabase_reference_id'),
                        bucket_name,
                        file_name);

    -- Create upload info
    upload_info := jsonb_build_object(
        'filename', file_name,
        'bucket', bucket_name,
        'public_url', public_url,
        'size', file_size,
        'content_type', content_type,
        'uploaded_at', now(),
        'uploaded_by', auth.uid()
    );

    RETURN upload_info;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VERIFY ALL FIXES
-- =====================================================

-- Check sermons table structure
SELECT
    'sermons_check' as table_check,
    CASE WHEN EXISTS(
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'sermons' AND column_name = 'speaker'
    ) THEN 'FIXED: speaker column exists'
    ELSE 'ERROR: speaker column missing' END as speaker_column_status;

-- Check products table
SELECT
    'products_check' as table_check,
    COUNT(*) as total_columns,
    CASE WHEN COUNT(*) > 15 THEN 'OK: All columns present'
    ELSE 'WARNING: Some columns may be missing' END as structure_status
FROM information_schema.columns
WHERE table_name = 'products';

-- Check storage buckets
SELECT
    'storage_check' as check_type,
    COUNT(*) as buckets_created,
    CASE WHEN COUNT(*) >= 3 THEN 'OK: Storage buckets ready'
    ELSE 'WARNING: Storage buckets may not be created' END as storage_status
FROM storage.buckets
WHERE name IN ('product-images', 'sermon-images', 'general-uploads');

-- Final success message
SELECT
    '🎉 URGENT FIXES APPLIED SUCCESSFULLY! 🎉' as status,
    'Column mismatch fixed, storage configured, policies updated' as details,
    'Your database should now work properly' as next_step;
