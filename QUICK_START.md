# 🚀 KMCI Website - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account and project

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
1. Copy `.env.local` and update with your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 3. Setup Database
1. Open Supabase SQL Editor
2. Run the complete database setup:
   ```sql
   -- Copy and paste content from: COMPLETE_SYSTEM_FIX.sql
   ```

### 4. Run System Health Check
```bash
node system-health-check.js
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Access Admin Panel
1. Go to `http://localhost:3000/admin`
2. Login with your admin credentials
3. Start managing content!

## Deployment

### Auto Deploy
```bash
node deploy.js
```

### Manual Deploy
```bash
npm run build
vercel --prod
```

## Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Check Supabase credentials in `.env.local`
   - Verify database is running

2. **Build Errors**
   - Run `npm run type-check`
   - Check for TypeScript errors

3. **Image Upload Issues**
   - Verify storage buckets exist
   - Check RLS policies

### Support
- Check `system-health-report.json` for detailed diagnostics
- Review `COMPLETE_PROJECT_ANALYSIS.md` for comprehensive documentation

## Success Criteria
✅ Health check score > 80%
✅ All tests passing
✅ Database fully functional
✅ Image uploads working
✅ Admin panel accessible

Your KMCI website is now ready for production! 🎉
