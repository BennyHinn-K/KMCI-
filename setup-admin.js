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
    console.log('👤 Creating admin user...')
    
    const adminEmail = 'admin@kmci.org'
    const adminPassword = 'Admin123!KMCI'
    const adminName = 'KMCI Admin'

    // Try to create admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminName
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('   ✓ Admin user already exists')
        
        // Get existing user
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
        
        if (!listError && users) {
          const existingUser = users.find(u => u.email === adminEmail)
          
          if (existingUser) {
            console.log('   ✓ Found existing user:', existingUser.id)
            
            // Try to update/create profile
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: existingUser.id,
                email: adminEmail,
                full_name: adminName,
                role: 'super_admin'
              }, {
                onConflict: 'id'
              })
            
            if (profileError) {
              console.log('   ⚠ Profile:', profileError.message)
            } else {
              console.log('   ✅ Admin profile verified')
            }
          }
        }
      } else {
        throw authError
      }
    } else {
      console.log('   ✅ Auth user created:', authData.user.id)
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: adminEmail,
          full_name: adminName,
          role: 'super_admin'
        })

      if (profileError) {
        console.log('   ⚠ Profile:', profileError.message)
      } else {
        console.log('   ✅ Admin profile created')
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ ADMIN SETUP COMPLETE!')
    console.log('='.repeat(60))
    console.log('\n📧 Admin Login Credentials:')
    console.log(`   Email:    ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('\n🌐 Access Points:')
    console.log('   Admin Panel: http://localhost:3000/admin')
    console.log('   Supabase:    https://supabase.com/dashboard/project/rxtiwgfwxqvzscqbgnqk')
    console.log('\n🚀 Start Server:')
    console.log('   Run: npm run dev')
    console.log('   Then visit: http://localhost:3000/admin')
    console.log('\n' + '='.repeat(60) + '\n')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.log('\n💡 Note: Database tables must be created first.')
    console.log('   Visit: https://supabase.com/dashboard/project/rxtiwgfwxqvzscqbgnqk/sql')
    console.log('   Run: scripts/01-create-tables.sql\n')
  }
}

setup()
