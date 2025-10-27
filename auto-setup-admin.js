const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://rxtiwgfwxqvzscqbgnqk.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dGl3Z2Z3eHF2enNjcWJnbnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMyODAyNCwiZXhwIjoyMDc1OTA0MDI0fQ.RWYvwc5SC7lSDXvxwsqlF3i5poHii4NJg3N6NF9w7IA'

async function setup() {
  console.log('🚀 Starting automatic admin setup...\n')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    console.log('👤 Creating admin user with credentials: KMCI@admin / #1nne$TY...')
    
    const adminEmail = 'KMCI@admin'
    const adminPassword = '#1nne$TY'
    const adminName = 'KMCI Admin'

    // Step 1: Delete any existing admin users
    console.log('   → Checking for existing admin users...')
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (!listError && users) {
      console.log(`   → Found ${users.length} existing user(s)`)
      
      // Delete all users to ensure clean slate
      for (const user of users) {
        console.log(`   → Removing user: ${user.email}`)
        await supabase.auth.admin.deleteUser(user.id)
      }
      
      // Delete all profiles
      console.log('   → Clearing existing profiles...')
      await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    }

    // Step 2: Create new admin user
    console.log('   → Creating new admin user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminName
      }
    })

    if (authError) {
      throw authError
    }

    console.log('   ✅ Auth user created:', authData.user.id)
    
    // Step 3: Create profile
    console.log('   → Creating admin profile...')
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: adminEmail,
        full_name: adminName,
        role: 'super_admin'
      })

    if (profileError) {
      throw profileError
    }

    console.log('   ✅ Admin profile created')

    // Step 4: Verify
    const { data: profiles, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'super_admin')

    if (verifyError) {
      throw verifyError
    }

    console.log(`   ✅ Verification: Found ${profiles?.length || 0} admin user(s)`)

    // Summary
    console.log('\n' + '='.repeat(70))
    console.log('✅ ADMIN SETUP COMPLETE! - ONLY ONE ADMIN USER EXISTS')
    console.log('='.repeat(70))
    console.log('\n📧 Admin Login Credentials:')
    console.log(`   Email:    ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('\n✅ Total Admin Users: 1')
    console.log('\n🌐 Access Points:')
    console.log('   Admin Panel: http://localhost:3000/admin/login')
    console.log('   Supabase:    https://supabase.com/dashboard/project/rxtiwgfwxqvzscqbgnqk')
    console.log('\n🚀 Start Server:')
    console.log('   Run: npm run dev')
    console.log('   Then visit: http://localhost:3000/admin/login')
    console.log('\n' + '='.repeat(70) + '\n')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('   1. Ensure Supabase project is active')
    console.log('   2. Check service role key is valid')
    console.log('   3. Verify database tables exist')
    console.log('\n📝 Manual Setup:')
    console.log('   Visit: https://supabase.com/dashboard/project/rxtiwgfwxqvzscqbgnqk/sql')
    console.log('   Run: scripts/00-complete-setup.sql\n')
    process.exit(1)
  }
}

setup()

