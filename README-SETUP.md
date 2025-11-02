# 🚀 Quick Setup Guide

## Automatic Setup (Recommended)

Run one command to set up everything:

```bash
npm run setup
```

Or use PowerShell:
```powershell
.\setup-all.ps1
```

## Manual Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `env.example` to `.env.local` and fill in your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for auto-fixing products)

### 3. Fix Products Database
**Option A: Automatic (if you have SERVICE_ROLE_KEY)**
```bash
npm run fix-products
```

**Option B: Manual (Recommended)**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `FIX-PRODUCTS-DATABASE.sql`
3. Paste and execute

### 4. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## ✅ What's Fixed

- ✅ Products database RLS policies
- ✅ Enhanced error logging
- ✅ User permission verification
- ✅ Comprehensive setup scripts

## 📝 Troubleshooting

**Products not saving?**
- Run `FIX-PRODUCTS-DATABASE.sql` in Supabase SQL Editor
- Check browser console for detailed error logs
- Verify user has `super_admin` or `editor` role in profiles table

**Missing dependencies?**
```bash
npm install
```

**Environment issues?**
- Ensure `.env.local` exists with Supabase credentials
- Copy from `env.example` if needed

