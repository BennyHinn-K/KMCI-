const https = require('https');

const SUPABASE_URL = 'https://rxtiwgfwxqvzscqbgnqk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dGl3Z2Z3eHF2enNjcWJnbnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMyODAyNCwiZXhwIjoyMDc1OTA0MDI0fQ.RWYvwc5SC7lSDXvxwsqlF3i5poHii4NJg3N6NF9w7IA';

function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    
    const options = {
      hostname: 'rxtiwgfwxqvzscqbgnqk.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('🚀 Automatically running SQL setup...\n');
  
  try {
    // First run the complete setup
    console.log('1️⃣ Creating database tables...');
    const setupSQL = require('fs').readFileSync('scripts/00-complete-setup.sql', 'utf8');
    await executeSQL(setupSQL);
    console.log('   ✓ Tables created');
    
    // Then create admin user
    console.log('2️⃣ Creating admin user...');
    const adminSQL = require('fs').readFileSync('SUPABASE_FINAL_SETUP.sql', 'utf8');
    await executeSQL(adminSQL);
    console.log('   ✓ Admin user created');
    
    console.log('\n✅ COMPLETE! Login: KMCI@admin / #1nne$TY');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

run();

