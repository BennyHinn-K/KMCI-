const fs = require('fs')
const https = require('https')
try {
  require('dotenv').config({ path: '.env.local' })
} catch (e) {
  // dotenv optional
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rxtiwgfwxqvzscqbgnqk.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local')
  console.error('Get it from: Supabase Dashboard → Settings → API → Service Role Key')
  process.exit(1)
}

function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL)
    const data = JSON.stringify({ sql_query: sql })
    
    const options = {
      hostname: url.hostname,
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
      res.on('data', chunk => body += chunk)
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

async function fixProducts() {
  console.log('🚀 Auto-fixing products database...\n')
  
  try {
    if (!fs.existsSync('FIX-PRODUCTS-DATABASE.sql')) {
      throw new Error('FIX-PRODUCTS-DATABASE.sql not found')
    }
    
    const sql = fs.readFileSync('FIX-PRODUCTS-DATABASE.sql', 'utf8')
    console.log('📝 Executing SQL fix...')
    await runSQL(sql)
    console.log('✅ Fix applied successfully!')
    console.log('✅ Products can now be saved!\n')
    return true
  } catch (error) {
    console.error('❌ Auto-execution failed:', error.message)
    console.log('\n📋 Manual fix: Run FIX-PRODUCTS-DATABASE.sql in Supabase SQL Editor')
    return false
  }
}

fixProducts().catch(console.error)

