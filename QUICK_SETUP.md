# 🚀 KMCI Website - Quick Production Setup

## Problem: Can't Login to Dashboard? 
**Your database isn't configured in production yet!**

## ⚡ FASTEST FIX (5 minutes):

### Step 1: Get Database (Choose One)

#### Option A: Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `kmci-website` project
3. Go to **Storage** tab → **Create Database** → **Postgres**
4. Copy the connection strings provided

#### Option B: Free External Database
- **Railway**: https://railway.app (Free PostgreSQL)
- **Neon**: https://neon.tech (Free serverless PostgreSQL)
- **Supabase**: https://supabase.com (Use database only)

### Step 2: Set Environment Variables in Vercel

1. Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

2. Add these variables:

```env
# Database (use your actual credentials)
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-secure-password

# OR use Vercel Postgres URL format:
POSTGRES_URL=postgresql://username:password@hostname:5432/database

# Authentication (REQUIRED!)
JWT_SECRET=your-super-secure-random-32-character-string-here-abcdef123456

# App URLs
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
SITE_URL=https://your-vercel-app.vercel.app

# Logging
LOG_LEVEL=info
NODE_ENV=production
```

### Step 3: Initialize Database

Run this SQL in your database (using database GUI or SQL editor):

```sql
-- Create admin user table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(150),
    role VARCHAR(20) NOT NULL DEFAULT 'viewer',
    phone VARCHAR(20),
    bio TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT role_check CHECK (role IN ('super_admin', 'editor', 'viewer'))
);

-- Insert admin user (password: AdminPass123!)
INSERT INTO users (id, email, password_hash, email_verified) 
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'admin@kmci.org', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1IYaF6V.1W',
    true
) ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (user_id, first_name, last_name, display_name, role, is_active)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'System',
    'Administrator',
    'System Administrator',
    'super_admin',
    true
) ON CONFLICT (user_id) DO NOTHING;
```

### Step 4: Redeploy
After setting environment variables, your app will automatically redeploy. If not:
```bash
# Trigger redeploy (optional)
git commit --allow-empty -m "Trigger redeploy with database config"
git push origin main
```

### Step 5: Login
1. Go to: `https://your-vercel-app.vercel.app/admin/login`
2. **Email**: `admin@kmci.org`
3. **Password**: `AdminPass123!`

---

## 🔧 Alternative: Use Your Existing Supabase Database

If you have a Supabase project already:

1. Go to Supabase → Settings → Database
2. Copy the connection string
3. In Vercel environment variables, set:
   ```env
   POSTGRES_URL=postgresql://postgres:[password]@[host]:5432/postgres
   JWT_SECRET=random-32-character-string
   ```

---

## 🆘 Still Having Issues?

### Common Problems:

1. **"JWT_SECRET not set"**
   - Add `JWT_SECRET` environment variable in Vercel
   - Must be at least 32 characters long

2. **"Database connection failed"**
   - Check your database credentials
   - Ensure database is running and accessible

3. **"Invalid credentials"**
   - Run the SQL script above to create admin user
   - Password is: `AdminPass123!`

4. **"User not found"**
   - Make sure the SQL INSERT statements ran successfully
   - Check if user exists: `SELECT * FROM users WHERE email = 'admin@kmci.org';`

### Quick Test:
Visit: `https://your-app.vercel.app/api/health-check`
- Should show database health status
- If shows "unhealthy", database connection is the issue

---

## 📞 Emergency Support:

If still stuck after 10 minutes:
1. Check Vercel deployment logs
2. Check database connectivity
3. Verify all environment variables are set correctly
4. Make sure SQL script ran without errors

**Your website should be working within 5-10 minutes with database access! 🚀**