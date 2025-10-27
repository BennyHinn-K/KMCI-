const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rxtiwgfwxqvzscqbgnqk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dGl3Z2Z3eHF2enNjcWJnbnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMyODAyNCwiZXhwIjoyMDc1OTA0MDI0fQ.RWYvwc5SC7lSDXvxwsqlF3i5poHii4NJg3N6NF9w7IA';

async function verify() {
  console.log('🔍 Verifying admin user and database...\n');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    // Check auth users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;
    
    console.log(`✓ Found ${users.length} user(s) in auth:`);
    users.forEach(u => console.log(`  - ${u.email}`));

    // Check if profiles table exists
    const { data: profiles, error: profError } = await supabase.from('profiles').select('*');
    
    if (profError) {
      console.log(`\n❌ Profiles table error: ${profError.message}`);
      console.log('   💡 Need to create profiles table first.');
      return;
    }

    console.log(`\n✓ Found ${profiles?.length || 0} profile(s):`);
    if (profiles && profiles.length > 0) {
      profiles.forEach(p => console.log(`  - ${p.email} (${p.role})`));
    }

    // Try to create profile for existing user
    const adminUser = users.find(u => u.email === 'KMCI@admin');
    if (adminUser && (!profiles || !profiles.find(p => p.id === adminUser.id))) {
      console.log('\n⚠ Admin user exists but no profile. Creating profile...');
      const { error: insertError } = await supabase.from('profiles').insert({
        id: adminUser.id,
        email: 'KMCI@admin',
        full_name: 'KMCI Admin',
        role: 'super_admin'
      });
      
      if (insertError) {
        console.log(`❌ Could not create profile: ${insertError.message}`);
      } else {
        console.log('✅ Profile created successfully!');
      }
    }

    console.log('\n✅ Verification complete. User can now login!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

verify();

