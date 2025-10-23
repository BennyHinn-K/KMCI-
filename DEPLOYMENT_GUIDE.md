# KMCI Website Deployment Guide

## 🚀 **VERCEL DEPLOYMENT**

### **1. Environment Variables Setup**
In your Vercel dashboard, add these environment variables:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
SITE_URL=https://your-domain.vercel.app
SITE_NAME=Kingdom Missions Center International
SITE_DESCRIPTION=A Christian missions organization dedicated to discipling communities and transforming lives for Christ's service.

# Admin Configuration
ADMIN_EMAIL=admin@kmci.org
ADMIN_PASSWORD=KMCI@2025

# Optional: Payment & Email (if needed)
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### **2. Deploy to Vercel**
1. **Connect GitHub Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

## 🗄️ **SUPABASE SETUP**

### **1. Create Supabase Project**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and enter project details
4. Set database password (save it securely)

### **2. Run Database Scripts**
Execute these SQL scripts in order:

```sql
-- 1. Create tables
-- Run: scripts/01-create-tables.sql

-- 2. Create policies
-- Run: scripts/02-create-policies.sql

-- 3. Seed data
-- Run: scripts/03-seed-data.sql

-- 4. Create admin user
-- Run: scripts/04-create-admin-user.sql
```

### **3. Create Admin User**
1. Go to **Authentication** → **Users**
2. Click **"Add User"** → **"Create new user"**
3. Enter:
   - Email: `admin@kmci.org`
   - Password: `KMCI@2025`
4. Click **"Create user"**

### **4. Get API Keys**
1. Go to **Settings** → **API**
2. Copy:
   - Project URL
   - Anon public key
   - Service role key (keep secret!)

## 🔐 **ADMIN ACCESS**

### **Login Credentials**
- **URL**: `https://your-domain.vercel.app/admin/login`
- **Email**: `admin@kmci.org`
- **Password**: `KMCI@2025`

### **Admin Features**
- ✅ Dashboard with real-time statistics
- ✅ Blog post management
- ✅ Event management
- ✅ Sermon management
- ✅ Project management
- ✅ Donation tracking
- ✅ User management
- ✅ Analytics and reports
- ✅ Site settings

## 📱 **GITHUB DEPLOYMENT**

### **1. Repository Setup**
```bash
# Initialize git (if not already done)
git init

# Add remote origin
git remote add origin https://github.com/your-username/kmci-website.git

# Add all files
git add .

# Commit changes
git commit -m "Initial KMCI website setup"

# Push to main branch
git push -u origin main
```

### **2. GitHub Actions (Optional)**
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🔧 **POST-DEPLOYMENT CHECKLIST**

### **1. Test Admin Access**
- [ ] Visit `/admin/login`
- [ ] Login with `admin@kmci.org` / `KMCI@2025`
- [ ] Verify dashboard loads with statistics
- [ ] Test logout functionality

### **2. Test Public Pages**
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Events page displays (may be empty initially)
- [ ] Sermons page displays (may be empty initially)
- [ ] Projects page displays (may be empty initially)
- [ ] Contact form works
- [ ] Donation page loads

### **3. Database Verification**
- [ ] Admin can create blog posts
- [ ] Admin can create events
- [ ] Admin can upload sermons
- [ ] Admin can manage projects
- [ ] Donations are tracked properly

### **4. Performance Check**
- [ ] Page load times are acceptable
- [ ] Images are optimized
- [ ] Mobile responsiveness works
- [ ] SEO metadata is present

## 🚨 **TROUBLESHOOTING**

### **Build Errors**
- **Issue**: Supabase connection errors
- **Solution**: Ensure all environment variables are set in Vercel

### **Admin Login Issues**
- **Issue**: Cannot login to admin
- **Solution**: Verify admin user exists in Supabase Auth

### **Database Errors**
- **Issue**: Tables not found
- **Solution**: Run the SQL scripts in correct order

### **Deployment Issues**
- **Issue**: Build fails on Vercel
- **Solution**: Check build logs and ensure all dependencies are in package.json

## 📞 **SUPPORT**

For technical support:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review browser console for errors
4. Verify environment variables are set correctly

## 🔄 **UPDATES & MAINTENANCE**

### **Regular Updates**
- Update dependencies monthly
- Monitor Supabase usage
- Review admin user access quarterly
- Backup database regularly

### **Security**
- Change admin password regularly
- Monitor admin access logs
- Keep dependencies updated
- Use strong environment variable values

---

**🎉 Your KMCI website is now ready for production!**
