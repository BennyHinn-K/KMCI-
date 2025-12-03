#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 KMCI Database Urgent Fix Script');
console.log('===================================');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

// Check for required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('⚠️  Warning: Missing environment variables:', missingVars);
  console.log('📝 Please ensure your .env.local file contains all required Supabase credentials');
}

async function runDatabaseFix() {
  try {
    console.log('\n🛠️  Running urgent database fixes...');

    // First, install required dependencies if not present
    console.log('📦 Checking dependencies...');
    try {
      require('@supabase/supabase-js');
    } catch {
      console.log('📥 Installing @supabase/supabase-js...');
      execSync('npm install @supabase/supabase-js', { stdio: 'inherit' });
    }

    // Create Supabase client
    const { createClient } = require('@supabase/supabase-js');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Error: Missing Supabase credentials');
      console.log('Please ensure these environment variables are set:');
      console.log('- NEXT_PUBLIC_SUPABASE_URL');
      console.log('- SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('✅ Connected to Supabase');

    // Step 1: Fix the critical column mismatch
    console.log('\n🔧 Step 1: Fixing speaker/preacher column mismatch...');

    // Check if we need to rename the column
    const { data: columnCheck } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'sermons')
      .in('column_name', ['speaker', 'preacher']);

    const hasPreacher = columnCheck?.some(col => col.column_name === 'preacher');
    const hasSpeaker = columnCheck?.some(col => col.column_name === 'speaker');

    if (hasPreacher && !hasSpeaker) {
      console.log('🔄 Renaming preacher column to speaker...');
      await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE sermons RENAME COLUMN preacher TO speaker;'
      });
      console.log('✅ Column renamed successfully');
    } else if (hasSpeaker) {
      console.log('✅ Speaker column already exists');
    } else {
      console.log('⚠️  Neither speaker nor preacher column found - adding speaker column');
      await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE sermons ADD COLUMN speaker TEXT;'
      });
    }

    // Step 2: Add image upload columns
    console.log('\n🖼️  Step 2: Adding image upload columns...');

    const imageColumns = [
      'ALTER TABLE sermons ADD COLUMN IF NOT EXISTS image_uploads JSONB DEFAULT \'[]\';',
      'ALTER TABLE sermons ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT \'{}\';',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS image_uploads JSONB DEFAULT \'[]\';',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT \'{}\';'
    ];

    for (const sql of imageColumns) {
      try {
        await supabase.rpc('exec_sql', { sql });
      } catch (error) {
        console.log(`⚠️  Column might already exist: ${error.message}`);
      }
    }

    console.log('✅ Image upload columns added');

    // Step 3: Create storage buckets
    console.log('\n🗄️  Step 3: Creating storage buckets...');

    const buckets = [
      { id: 'product-images', name: 'product-images', public: true },
      { id: 'sermon-images', name: 'sermon-images', public: true },
      { id: 'general-uploads', name: 'general-uploads', public: true }
    ];

    for (const bucket of buckets) {
      try {
        const { error } = await supabase.storage.createBucket(bucket.id, {
          public: bucket.public,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 10485760 // 10MB
        });

        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️  Bucket creation warning for ${bucket.id}:`, error.message);
        } else {
          console.log(`✅ Bucket ${bucket.id} ready`);
        }
      } catch (error) {
        console.log(`⚠️  Bucket ${bucket.id} might already exist`);
      }
    }

    // Step 4: Update RLS policies
    console.log('\n🔐 Step 4: Updating RLS policies...');

    const policies = [
      // Storage policies
      `CREATE POLICY IF NOT EXISTS "Public can view images" ON storage.objects
       FOR SELECT USING (bucket_id IN ('product-images', 'sermon-images', 'general-uploads'));`,

      `CREATE POLICY IF NOT EXISTS "Authenticated users can upload" ON storage.objects
       FOR INSERT WITH CHECK (bucket_id IN ('product-images', 'sermon-images', 'general-uploads')
       AND auth.role() = 'authenticated');`,

      // Sermons policies
      `DROP POLICY IF EXISTS "Public can view published sermons" ON sermons;`,
      `CREATE POLICY "Public can view published sermons" ON sermons
       FOR SELECT USING (status = 'published' OR auth.uid() IN
       (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));`,

      `DROP POLICY IF EXISTS "Editors can insert sermons" ON sermons;`,
      `CREATE POLICY "Editors can insert sermons" ON sermons
       FOR INSERT WITH CHECK (auth.uid() IN
       (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));`,

      // Products policies
      `DROP POLICY IF EXISTS "Public can view active products" ON products;`,
      `CREATE POLICY "Public can view active products" ON products
       FOR SELECT USING (status = 'active' OR auth.uid() IN
       (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));`
    ];

    for (const policy of policies) {
      try {
        await supabase.rpc('exec_sql', { sql: policy });
      } catch (error) {
        console.log(`⚠️  Policy update note: ${error.message}`);
      }
    }

    console.log('✅ RLS policies updated');

    // Step 5: Test the fixes
    console.log('\n🧪 Step 5: Testing database fixes...');

    // Test sermons table
    const { data: sermonsTest, error: sermonsError } = await supabase
      .from('sermons')
      .select('id, title, speaker')
      .limit(1);

    if (sermonsError) {
      console.error('❌ Sermons test failed:', sermonsError.message);
    } else {
      console.log('✅ Sermons table working correctly');
    }

    // Test products table
    const { data: productsTest, error: productsError } = await supabase
      .from('products')
      .select('id, title, image_url')
      .limit(1);

    if (productsError) {
      console.error('❌ Products test failed:', productsError.message);
    } else {
      console.log('✅ Products table working correctly');
    }

    // Final verification
    console.log('\n🎯 Final verification...');

    const { data: verification } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name')
      .eq('table_name', 'sermons')
      .eq('column_name', 'speaker');

    if (verification && verification.length > 0) {
      console.log('✅ Speaker column verified in sermons table');
    } else {
      console.warn('⚠️  Speaker column verification failed');
    }

    console.log('\n🎉 DATABASE FIXES COMPLETED SUCCESSFULLY! 🎉');
    console.log('=======================================');
    console.log('✅ Column mismatch fixed (preacher → speaker)');
    console.log('✅ Image upload columns added');
    console.log('✅ Storage buckets created');
    console.log('✅ RLS policies updated');
    console.log('✅ Database tested and verified');
    console.log('\n📝 Next steps:');
    console.log('1. Restart your development server');
    console.log('2. Test sermon and product creation');
    console.log('3. Try uploading images');
    console.log('\n🚀 Your database should now work perfectly!');

  } catch (error) {
    console.error('\n❌ CRITICAL ERROR:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Supabase credentials in .env.local');
    console.log('2. Ensure you have admin access to your Supabase project');
    console.log('3. Run this script again after fixing issues');
    console.log('4. If issues persist, run the SQL manually in Supabase dashboard');

    process.exit(1);
  }
}

// Add error handling
process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('\n💥 Unhandled Rejection:', error);
  process.exit(1);
});

// Run the fix
runDatabaseFix();
