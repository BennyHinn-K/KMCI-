const https = require('https')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

function execSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ sql_query: sql })
    const url = new URL(SUPABASE_URL)

    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Prefer': 'tx=commit'
      }
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(body)) } catch { resolve(body || 'OK') }
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

async function main() {
  const file = process.argv[2]
  if (!file || !fs.existsSync(file)) {
    console.error('Usage: node execute-file-sql.js <path-to-sql-file>')
    process.exit(1)
  }
  const sql = fs.readFileSync(file, 'utf8')
  console.log(`📝 Executing ${file} ...`)
  const result = await execSQL(sql)
  if (Array.isArray(result)) {
    console.table(result)
  } else {
    console.log(result)
  }
  console.log('✅ Done')
}

main().catch((e) => {
  console.error('❌ Error:', e.message)
  process.exit(1)
})


