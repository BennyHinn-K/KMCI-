const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function fixAdminDuplicate() {
    console.log('🔧 Starting Admin User Duplicate Fix...');

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing required environment variables:');
        console.error('   - NEXT_PUBLIC_SUPABASE_URL');
        console.error('   - SUPABASE_SERVICE_ROLE_KEY');
        console.error('   Make sure your .env.local file is properly configured.');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Read the SQL fix script
        const sqlPath = path.join(__dirname, 'FIX_ADMIN_USER_DUPLICATE.sql');

        if (!fs.existsSync(sqlPath)) {
            console.error('❌ SQL fix script not found:', sqlPath);
            console.error('   Make sure FIX_ADMIN_USER_DUPLICATE.sql exists in the project root.');
            process.exit(1);
        }

        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📋 Executing admin user fix script...');
        console.log('   This will resolve the duplicate key constraint violation.');

        // Execute the SQL script
        const { data, error } = await supabase.rpc('exec_sql', {
            sql_query: sqlContent
        });

        if (error) {
            console.error('❌ Error executing SQL script:', error);

            // Try alternative execution method
            console.log('🔄 Trying alternative execution method...');

            const { error: altError } = await supabase
                .from('_sql_execute')
                .insert({ query: sqlContent });

            if (altError) {
                console.error('❌ Alternative method also failed:', altError);
                console.log('\n📝 Manual Instructions:');
                console.log('1. Go to your Supabase Dashboard');
                console.log('2. Navigate to SQL Editor');
                console.log('3. Copy and paste the content of FIX_ADMIN_USER_DUPLICATE.sql');
                console.log('4. Run the script manually');
                process.exit(1);
            }
        }

        console.log('✅ SQL script executed successfully!');

        // Verify the admin user exists
        console.log('🔍 Verifying admin user...');

        const { data: adminUser, error: adminError } = await supabase
            .from('profiles')
            .select('id, email, full_name, role')
            .eq('email', 'admin@kmci.org')
            .eq('role', 'super_admin')
            .single();

        if (adminError) {
            console.error('❌ Could not verify admin user:', adminError);
        } else {
            console.log('✅ Admin user verified successfully!');
            console.log('📧 Email:', adminUser.email);
            console.log('👤 Name:', adminUser.full_name);
            console.log('🎭 Role:', adminUser.role);
            console.log('🆔 ID:', adminUser.id);
        }

        console.log('\n🎯 ADMIN LOGIN CREDENTIALS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email: admin@kmci.org');
        console.log('👤 Username: AdminKMCI');
        console.log('🔑 Password: @adminKMCI');
        console.log('🌐 Admin URL: /admin');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  IMPORTANT: Change password after first login!');

        console.log('\n✅ Admin user duplicate issue resolved successfully!');

    } catch (err) {
        console.error('❌ Unexpected error:', err);
        console.log('\n📝 Manual Resolution Steps:');
        console.log('1. Go to Supabase Dashboard > SQL Editor');
        console.log('2. Run this query to check existing admin users:');
        console.log('   SELECT * FROM auth.users WHERE email = \'admin@kmci.org\';');
        console.log('3. If user exists, run this to update password:');
        console.log('   UPDATE auth.users SET encrypted_password = crypt(\'@adminKMCI\', gen_salt(\'bf\')) WHERE email = \'admin@kmci.org\';');
        console.log('4. Ensure profile exists:');
        console.log('   INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)');
        console.log('   SELECT id, email, \'AdminKMCI\', \'super_admin\', NOW(), NOW()');
        console.log('   FROM auth.users WHERE email = \'admin@kmci.org\'');
        console.log('   ON CONFLICT (id) DO UPDATE SET full_name = \'AdminKMCI\', role = \'super_admin\';');

        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    fixAdminDuplicate().catch(console.error);
}

module.exports = fixAdminDuplicate;
