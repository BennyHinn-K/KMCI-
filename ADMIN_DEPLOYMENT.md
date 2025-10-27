# KMCI Admin Dashboard - Deployment Guide

## 🚀 Complete Admin Dashboard Setup

Your professional admin dashboard has been created with the following features:

### ✅ Features Implemented

1. **Authentication System**
   - Secure login page with Supabase Auth
   - Role-based access control (super_admin, editor, finance, viewer)
   - Protected routes with middleware
   - Session management

2. **Dashboard Pages**
   - **Overview** - Analytics, stats cards, quick actions, recent activity
   - **Blog Posts** - Full CRUD operations with category management
   - **Sermons** - Video/audio management, scripture references
   - **Events** - Event scheduling, RSVP tracking, status management
   - **Projects** - Fundraising projects with progress tracking
   - **Donations** - Transaction history, stats, donor management
   - **Messages** - Contact form submissions with status tracking
   - **Users** - Admin user management with role assignment
   - **Settings** - Profile management, password change
   - **Audit Log** - Complete activity tracking

3. **UI Components**
   - Professional sidebar navigation
   - User-friendly header with notifications
   - Modern card layouts
   - Data tables with search and filters
   - Modal dialogs for create/edit operations
   - Toast notifications for feedback
   - Responsive design (mobile & desktop)

---

## 📋 Deployment Steps

### Step 1: Supabase Setup

1. **Go to your Supabase Dashboard** (https://supabase.com/dashboard)

2. **Create First Admin User**
   
   In Supabase SQL Editor, run:
   ```sql
   -- Create admin user in auth
   INSERT INTO auth.users (
     instance_id,
     id,
     aud,
     role,
     email,
     encrypted_password,
     email_confirmed_at,
     created_at,
     updated_at
   ) VALUES (
     '00000000-0000-0000-0000-000000000000',
     gen_random_uuid(),
     'authenticated',
     'authenticated',
     'admin@kmci.org', -- Change this email
     crypt('YourSecurePassword123!', gen_salt('bf')), -- Change this password
     NOW(),
     NOW(),
     NOW()
   );

   -- Get the user ID
   SELECT id, email FROM auth.users WHERE email = 'admin@kmci.org';

   -- Create profile with super_admin role
   INSERT INTO profiles (id, email, full_name, role)
   SELECT 
     id,
     email,
     'Admin User', -- Change this name
     'super_admin'
   FROM auth.users 
   WHERE email = 'admin@kmci.org';
   ```

3. **Verify RLS Policies are Enabled**
   
   Your database should already have RLS enabled from the setup scripts. Verify by checking:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

### Step 2: Environment Variables

Create or update your `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

**To get your Supabase credentials:**
1. Go to your Supabase project
2. Click "Settings" → "API"
3. Copy "Project URL" and "anon public" key

### Step 3: Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add complete admin dashboard"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Configure Domain** (Optional)
   - Go to your Vercel project → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Step 4: Verify Deployment

1. **Test Login**
   - Navigate to `https://your-domain.com/admin`
   - You'll be redirected to `/admin/login`
   - Login with your admin credentials

2. **Test Each Feature**
   - Create a test blog post
   - Add a sermon
   - Create an event
   - Check donations page
   - View messages
   - Update your profile in settings

---

## 🔐 Security Checklist

- [x] Middleware protects all /admin routes
- [x] Row Level Security (RLS) enabled on all tables
- [x] Role-based access control implemented
- [x] Passwords are hashed (handled by Supabase Auth)
- [x] Audit logging for all admin actions
- [x] HTTPS enabled (automatic on Vercel)
- [x] Environment variables secured

---

## 🎨 Customization

### Change Theme Colors
Edit `app/globals.css` to customize the color scheme.

### Add More Admin Roles
Update the profile check constraint:
```sql
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('super_admin', 'editor', 'finance', 'viewer', 'your_new_role'));
```

### Customize Sidebar
Edit `components/admin/admin-sidebar.tsx` to add/remove navigation items.

---

## 📊 Admin Access URLs

- **Login**: https://your-domain.com/admin/login
- **Dashboard**: https://your-domain.com/admin
- **Blog**: https://your-domain.com/admin/blog
- **Sermons**: https://your-domain.com/admin/sermons
- **Events**: https://your-domain.com/admin/events
- **Projects**: https://your-domain.com/admin/projects
- **Donations**: https://your-domain.com/admin/donations
- **Messages**: https://your-domain.com/admin/messages
- **Users**: https://your-domain.com/admin/users
- **Settings**: https://your-domain.com/admin/settings
- **Audit Log**: https://your-domain.com/admin/audit

---

## 🆘 Troubleshooting

### Can't Login?
1. Verify user exists in `auth.users` and `profiles` tables
2. Check that `role` is one of: super_admin, editor, finance
3. Verify Supabase credentials in environment variables

### 404 on Admin Pages?
1. Ensure all files were created correctly
2. Restart dev server: `npm run dev`
3. Clear Next.js cache: `rm -rf .next`

### Middleware Not Working?
1. Check that `middleware.ts` is in the root directory
2. Verify Supabase client is properly configured
3. Check browser console for errors

### Data Not Showing?
1. Verify database has data in Supabase dashboard
2. Check RLS policies are not too restrictive
3. Open browser console to see API errors

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)

---

## ✨ What's Next?

1. **Add Email Notifications** - Integrate with Resend or SendGrid
2. **File Uploads** - Add Supabase Storage for images/videos
3. **Advanced Analytics** - Integrate charts with real-time data
4. **Export Features** - Add CSV/PDF export for reports
5. **Multi-language Support** - Add i18n for international users

---

**Admin Dashboard Created By:** AI Assistant
**Date:** October 27, 2025
**Status:** ✅ Production Ready



