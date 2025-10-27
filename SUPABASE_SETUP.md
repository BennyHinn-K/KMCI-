# 🔌 Connect Admin to Supabase - Quick Guide

## ✅ Step 1: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard

2. **Select your KMCI project** (or create one if you haven't)

3. **Navigate to**: Settings → API

4. **Copy these values**:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

---

## ✅ Step 2: Update Environment Variables

1. **Open the file**: `.env.local` (in your project root)

2. **Replace the placeholder values** with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key
```

3. **Save the file**

---

## ✅ Step 3: Set Up Database Tables

1. **Go to**: Supabase Dashboard → SQL Editor

2. **Run your existing database scripts** (in order):
   - `scripts/01-create-tables.sql`
   - `scripts/02-create-policies.sql`
   - `scripts/03-seed-data.sql`

3. **Verify tables were created**: Go to Table Editor

---

## ✅ Step 4: Create Your First Admin User

### Option A: Using SQL Script (Recommended)

1. **Open**: `scripts/create-admin-user.sql`

2. **Edit these lines** (near the top):
   ```sql
   admin_email TEXT := 'admin@kmci.org'; -- CHANGE THIS
   admin_password TEXT := 'SecurePassword123!'; -- CHANGE THIS
   admin_name TEXT := 'Admin User'; -- CHANGE THIS
   ```

3. **Copy the entire script**

4. **Go to**: Supabase Dashboard → SQL Editor

5. **Paste and run** the script

6. **Verify**: You should see "Admin user created successfully!"

### Option B: Using Supabase Dashboard

1. **Go to**: Authentication → Users

2. **Click**: "Add user" → "Create new user"

3. **Enter**:
   - Email: `admin@kmci.org` (your choice)
   - Password: Create a strong password
   - Check "Auto Confirm User"

4. **Click**: "Create user"

5. **Copy the User ID** that appears

6. **Go to**: SQL Editor and run:
   ```sql
   INSERT INTO profiles (id, email, full_name, role)
   VALUES (
     'paste-user-id-here',
     'admin@kmci.org',
     'Admin User',
     'super_admin'
   );
   ```

---

## ✅ Step 5: Test the Connection

1. **Restart your dev server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Open**: http://localhost:3000/admin

3. **You should be redirected to**: http://localhost:3000/admin/login

4. **Login with**:
   - Email: The email you created
   - Password: The password you set

5. **Success!** You should see the admin dashboard

---

## ✅ Step 6: Deploy to Vercel (Production)

### Push to GitHub:
```bash
git add .
git commit -m "Connect admin to Supabase"
git push origin main
```

### Deploy on Vercel:

1. **Go to**: https://vercel.com/new

2. **Import your repository**

3. **Add Environment Variables**:
   - Variable: `NEXT_PUBLIC_SUPABASE_URL`
     Value: `https://your-project-id.supabase.co`
   
   - Variable: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     Value: `your-anon-key`

4. **Click**: "Deploy"

5. **Wait for deployment** (2-3 minutes)

6. **Test**: Visit `https://your-project.vercel.app/admin`

---

## 🔍 Troubleshooting

### Can't login?
- ✅ Verify `.env.local` has correct Supabase URL and key
- ✅ Check that user exists in Supabase → Authentication → Users
- ✅ Verify user has a profile with `super_admin` role in profiles table
- ✅ Restart your dev server after changing `.env.local`

### "Network error" or "Failed to fetch"?
- ✅ Check Supabase URL is correct (no trailing slash)
- ✅ Verify anon key is the PUBLIC key, not the service role key
- ✅ Check your internet connection
- ✅ Verify Supabase project is active (not paused)

### Middleware redirect loop?
- ✅ Make sure `/admin/login` is accessible without auth
- ✅ Clear browser cookies and try again
- ✅ Check middleware.ts configuration

### Database errors?
- ✅ Run all SQL scripts in order (01, 02, 03)
- ✅ Verify RLS policies are enabled
- ✅ Check table permissions in Supabase

---

## 📊 Verify Everything Works

After logging in, test these features:

1. ✅ **Dashboard** - View stats and metrics
2. ✅ **Blog** - Create a test blog post
3. ✅ **Sermons** - Add a sermon
4. ✅ **Events** - Create an event
5. ✅ **Projects** - Add a project
6. ✅ **Donations** - View donations page
7. ✅ **Messages** - Check messages (if any)
8. ✅ **Settings** - Update your profile
9. ✅ **Audit Log** - See your actions logged

---

## 🎉 You're Connected!

Your admin dashboard is now **fully connected to Supabase** and ready to use!

**Local Development**: http://localhost:3000/admin  
**Production**: https://your-domain.vercel.app/admin

---

## 🔐 Security Checklist

- [ ] Changed default admin password to something strong
- [ ] Added `.env.local` to `.gitignore` (already done)
- [ ] Set up Vercel environment variables separately
- [ ] Enabled RLS policies on all tables
- [ ] Verified only authorized users can access admin panel
- [ ] Reviewed audit logs regularly

---

## 📞 Need Help?

Check the logs in:
- **Browser Console**: Right-click → Inspect → Console
- **Supabase Dashboard**: Logs & Analytics
- **Vercel Dashboard**: Deployment logs

---

**Connection Status**: ✅ Ready to connect!  
**Next Step**: Update `.env.local` with your credentials and create admin user!



