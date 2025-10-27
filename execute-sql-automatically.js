const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rxtiwgfwxqvzscqbgnqk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dGl3Z2Z3eHF2enNjcWJnbnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMyODAyNCwiZXhwIjoyMDc1OTA0MDI0fQ.RWYvwc5SC7lSDXvxwsqlF3i5poHii4NJg3N6NF9w7IA';

async function executeSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });
  return response.json();
}

async function setup() {
  console.log('🚀 Running automatic SQL setup...\n');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // Step 1: List all users and delete them
    console.log('1️⃣ Deleting all existing users...');
    const { data: { users } } = await supabase.auth.admin.listUsers();
    
    for (const user of users) {
      await supabase.auth.admin.deleteUser(user.id);
      console.log(`   ✓ Deleted: ${user.email}`);
    }

    // Step 2: Clear profiles table
    console.log('2️⃣ Clearing profiles table...');
    await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('   ✓ Profiles cleared');

    // Step 3: Create new admin user
    console.log('3️⃣ Creating admin user: KMCI@admin...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'KMCI@admin',
      password: '#1nne$TY',
      email_confirm: true,
      user_metadata: { full_name: 'KMCI Admin' }
    });

    if (authError) throw authError;
    console.log(`   ✓ Auth user created: ${authData.user.id}`);

    // Step 4: Create admin profile
    console.log('4️⃣ Creating admin profile...');
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email: 'KMCI@admin',
      full_name: 'KMCI Admin',
      role: 'super_admin'
    });

    if (profileError) throw profileError;
    console.log('   ✓ Admin profile created');

    // Step 5: Verify
    const { data: profiles } = await supabase.from('profiles').select('*');
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ AUTOMATIC SETUP COMPLETE - ONLY ONE ADMIN USER!');
    console.log('='.repeat(70));
    console.log('\n📧 Admin Login:');
    console.log('   Email:    KMCI@admin');
    console.log('   Password: #1nne$TY');
    console.log(`\n✅ Total users in system: ${profiles?.length || 0}`);
    console.log('\n🚀 Next: npm run dev');
    console.log('   Visit: http://localhost:3000/admin/login');
    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('profiles')) {
      console.log('\n💡 Run database setup first:');
      console.log('   Visit: https://supabase.com/dashboard/project/rxtiwgfwxqvzscqbgnqk/sql');
      console.log('   Run: scripts/00-complete-setup.sql\n');
    }
    process.exit(1);
  }
}

setup();

