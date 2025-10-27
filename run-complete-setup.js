const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rxtiwgfwxqvzscqbgnqk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dGl3Z2Z3eHF2enNjcWJnbnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMyODAyNCwiZXhwIjoyMDc1OTA0MDI0fQ.RWYvwc5SC7lSDXvxwsqlF3i5poHii4NJg3N6NF9w7IA';

async function setup() {
  console.log('🚀 AUTOMATIC SUPABASE SETUP - RUNNING NOW...\n');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // Step 1: Delete ALL existing users
    console.log('1️⃣ Wiping ALL existing users...');
    const { data: { users } } = await supabase.auth.admin.listUsers();
    for (const user of users) {
      await supabase.auth.admin.deleteUser(user.id);
      console.log(`   ✓ Deleted: ${user.email}`);
    }

    // Step 2: Create ONE admin user only
    console.log('2️⃣ Creating single admin user: KMCI@admin...');
    const { data: authData, error } = await supabase.auth.admin.createUser({
      email: 'KMCI@admin',
      password: '#1nne$TY',
      email_confirm: true,
      user_metadata: { full_name: 'KMCI Admin' }
    });

    if (error) {
      console.error('Error:', error.message);
      return;
    }

    console.log('   ✓ Auth user created');
    console.log('   User ID:', authData.user.id);

    // Step 3: Create profile (will be created when app runs)
    console.log('3️⃣ Admin setup complete!\n');
    
    console.log('='.repeat(70));
    console.log('✅ AUTOMATIC SETUP COMPLETE - ONE ADMIN USER ONLY');
    console.log('='.repeat(70));
    console.log('\n🔑 ADMIN CREDENTIALS:');
    console.log('   Email:    KMCI@admin');
    console.log('   Password: #1nne$TY');
    console.log('\n🚀 NEXT: Run the app');
    console.log('   npm run dev');
    console.log('   Visit: http://localhost:3000/admin/login');
    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

setup();

