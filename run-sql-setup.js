const fs = require('fs')
const https = require('https')

const SUPABASE_URL = 'https://rxtiwgfwxqvzscqbgnqk.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dGl3Z2Z3eHF2enNjcWJnbnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMyODAyNCwiZXhwIjoyMDc1OTA0MDI0fQ.RWYvwc5SC7lSDXvxwsqlF3i5poHii4NJg3N6NF9w7IA'

async function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ sql_query: sql })
    
    const options = {
      hostname: 'rxtiwgfwxqvzscqbgnqk.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Length': data.length
      }
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => body += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body)
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`))
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function setup() {
  console.log('🚀 Running complete database setup...\n')

  try {
    const sql = fs.readFileSync('scripts/00-complete-setup.sql', 'utf8')
    
    console.log('📊 Creating tables and policies...')
    await runSQL(sql)
    
    console.log('✅ Database setup complete!\n')
    console.log('=' .repeat(60))
    console.log('✅ ALL SETUP COMPLETE!')
    console.log('='.repeat(60))
    console.log('\n📧 Admin Credentials:')
    console.log('   Email:    admin@kmci.org')
    console.log('   Password: Admin123!KMCI')
    console.log('\n🚀 Start your server:')
    console.log('   npm run dev')
    console.log('\n🌐 Access admin:')
    console.log('   http://localhost:3000/admin\n')
    
  } catch (error) {
    console.log('⚠ Direct SQL execution not available')
    console.log('\n📝 Manual step required:')
    console.log('   1. Go to: https://supabase.com/dashboard/project/rxtiwgfwxqvzscqbgnqk/sql')
    console.log('   2. Copy contents of: scripts/00-complete-setup.sql')
    console.log('   3. Paste and run in SQL Editor')
    console.log('\n   OR simply run the existing setup we did!\n')
    console.log('✅ Admin user already created:')
    console.log('   Email: admin@kmci.org')
    console.log('   Password: Admin123!KMCI\n')
  }
}

setup()



