# 🚀 KMCI Website - Complete Deployment Guide

## Complete Internal Database System Deployment

This guide covers the full deployment of your KMCI website with the new internal PostgreSQL database system, replacing Supabase entirely.

---

## 📋 Pre-Deployment Checklist

### 1. System Requirements
- [ ] Node.js 18.0.0 or higher
- [ ] PostgreSQL database (local or hosted)
- [ ] GitHub repository
- [ ] Vercel account
- [ ] Domain name (optional)

### 2. Database Requirements
- [ ] PostgreSQL 12+ database instance
- [ ] Database credentials (host, port, username, password)
- [ ] Network access to database from Vercel

### 3. Environment Setup
- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] JWT secret generated
- [ ] Admin credentials ready

---

## 🗄️ Database Setup

### Option 1: Local PostgreSQL (Development)

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```bash
   # Connect as postgres user
   sudo -u postgres psql
   
   # Create database and user
   CREATE DATABASE kmci_db;
   CREATE USER kmci_user WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE kmci_db TO kmci_user;
   \q
   ```

### Option 2: Hosted PostgreSQL (Production)

#### Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Select your project
3. Go to Storage tab
4. Create a new Postgres database
5. Copy the connection strings

#### Alternative Providers
- **Supabase Database Only**: Use just the database, not auth
- **Railway**: Great for PostgreSQL hosting
- **Neon**: Serverless PostgreSQL
- **Amazon RDS**: Enterprise solution
- **DigitalOcean Managed Database**

---

## 🔐 Environment Variables

### Local Development (.env.local)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kmci_db
DB_USER=kmci_user
DB_PASSWORD=your_secure_password
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-256-bits-long
JWT_EXPIRES_IN=24h

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
SITE_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug
NODE_ENV=development
```

### Production (Vercel Environment Variables)
Set these in your Vercel dashboard under Settings > Environment Variables:

```env
# Database Configuration (Vercel Postgres)
POSTGRES_URL=postgresql://username:password@hostname:5432/database
POSTGRES_PRISMA_URL=postgresql://username:password@hostname:5432/database?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://username:password@hostname:5432/database

# Or Custom Database
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=kmci_production
DB_USER=kmci_prod_user
DB_PASSWORD=your_production_password
DB_POOL_MAX=50

# Authentication
JWT_SECRET=your-production-jwt-secret-key-must-be-different-from-dev
JWT_EXPIRES_IN=24h

# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
SITE_URL=https://your-domain.vercel.app

# Logging
LOG_LEVEL=info
NODE_ENV=production

# Optional: Payment Integration
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_key

# Optional: Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 🚀 Deployment Steps

### Step 1: Prepare Your Code

1. **Clone/Update Repository**
   ```bash
   git clone https://github.com/yourusername/kmci-website.git
   cd kmci-website
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your database credentials
   ```

### Step 2: Initialize Database

1. **Run Database Setup**
   ```bash
   npm run db:init
   ```

   This will:
   - Create the database (if it doesn't exist)
   - Run all schema migrations
   - Create indexes and constraints
   - Create admin user
   - Seed sample data

2. **Verify Database Setup**
   ```bash
   npm run health-check
   ```

### Step 3: Test Locally

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Admin Login**
   - Go to `http://localhost:3000/admin/login`
   - Email: `admin@kmci.org`
   - Password: `AdminPass123!`

3. **Test API Endpoints**
   ```bash
   # Test health check
   curl http://localhost:3000/api/health-check
   
   # Test products API
   curl http://localhost:3000/api/products
   ```

### Step 4: Deploy to Vercel

#### Option A: Automated Deployment Script
```bash
# Deploy to preview
npm run deploy

# Deploy to production
npm run deploy:prod

# Auto-commit and deploy
npm run deploy:auto
```

#### Option B: Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # First deployment (interactive)
   vercel

   # Production deployment
   vercel --prod
   ```

### Step 5: Configure Vercel Settings

1. **Environment Variables**
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add all production environment variables
   - Make sure to set for "Production" environment

2. **Custom Domain (Optional)**
   - Go to Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

3. **Build Settings**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm ci",
     "devCommand": "npm run dev"
   }
   ```

---

## 🗃️ Database Migration (Production)

### For Production Database Setup

1. **Connect to Production Database**
   ```bash
   # Set production environment variables
   export DB_HOST=your-production-host
   export DB_NAME=your-production-db
   export DB_USER=your-production-user
   export DB_PASSWORD=your-production-password
   export NODE_ENV=production
   
   # Run initialization
   npm run db:init
   ```

2. **Verify Production Database**
   ```bash
   # Check tables
   psql -h your-host -U your-user -d your-db -c "\dt"
   
   # Check admin user
   psql -h your-host -U your-user -d your-db -c "SELECT email, role FROM users u JOIN profiles p ON u.id = p.user_id WHERE email = 'admin@kmci.org';"
   ```

---

## 🔧 Post-Deployment Configuration

### 1. Admin Setup

1. **Login to Admin Panel**
   - Go to `https://your-domain.vercel.app/admin/login`
   - Use default credentials: `admin@kmci.org` / `AdminPass123!`

2. **Change Admin Password**
   - Go to Admin > Settings
   - Change default password immediately
   - Update profile information

3. **Create Additional Users**
   - Go to Admin > Users
   - Create editor and viewer accounts as needed

### 2. Content Setup

1. **Add Sample Products**
   - Go to Admin > Products
   - Create your first products
   - Test CRUD operations

2. **Configure Site Settings**
   - Update site information
   - Configure payment methods
   - Set up email templates

### 3. Security Configuration

1. **Update JWT Secret**
   - Generate new JWT secret for production
   - Update Vercel environment variables
   - Redeploy application

2. **Configure CORS**
   - Update allowed origins
   - Set proper headers

3. **Enable Rate Limiting**
   - Configure API rate limits
   - Set up monitoring

---

## 🔍 Monitoring & Maintenance

### Health Checks

1. **Application Health**
   ```bash
   curl https://your-domain.vercel.app/api/health-check
   ```

2. **Database Health**
   - Monitor connection pool
   - Check query performance
   - Monitor error logs

### Logging

1. **Application Logs**
   - Vercel Function logs
   - Database query logs
   - Authentication logs

2. **Log Files Location**
   - Development: `./logs/`
   - Production: Vercel Function logs

### Backup Strategy

1. **Database Backups**
   ```bash
   # Manual backup
   pg_dump -h your-host -U your-user -d your-db > backup-$(date +%Y%m%d).sql
   
   # Automated backups (cron job)
   0 2 * * * pg_dump -h your-host -U your-user -d your-db > /backups/kmci-$(date +\%Y\%m\%d).sql
   ```

2. **Code Backups**
   - Git repository (primary)
   - GitHub releases
   - Vercel deployments history

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check environment variables
echo $DB_HOST $DB_PORT $DB_NAME

# Test connection
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();"

# Check network access
telnet $DB_HOST $DB_PORT
```

#### 2. Build Errors
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build

# Check TypeScript errors
npm run type-check
```

#### 3. Authentication Issues
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check admin user exists
npm run db:init
```

#### 4. API Errors
```bash
# Check logs
vercel logs

# Test endpoints locally
npm run dev
curl http://localhost:3000/api/health-check
```

### Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| DB_CONNECTION_FAILED | Database connection failed | Check DB credentials and network |
| JWT_SECRET_MISSING | JWT secret not configured | Set JWT_SECRET environment variable |
| ADMIN_USER_NOT_FOUND | Admin user doesn't exist | Run `npm run db:init` |
| BUILD_FAILED | Next.js build failed | Check TypeScript and lint errors |
| SCHEMA_ERROR | Database schema issues | Drop and recreate database |

---

## 📞 Support & Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Getting Help
1. Check deployment logs in Vercel dashboard
2. Review database logs for connection issues
3. Test API endpoints with curl or Postman
4. Check environment variables in Vercel settings

### Performance Optimization
1. **Database Indexing**: Already optimized in schema
2. **Connection Pooling**: Configured with limits
3. **Caching**: Implement Redis for sessions if needed
4. **CDN**: Vercel provides global CDN automatically

---

## 🎉 Deployment Complete!

Your KMCI website is now running with:

✅ **Complete Internal Database System**
- PostgreSQL database with full schema
- User authentication and authorization
- Role-based access control
- Comprehensive audit logging

✅ **Full CRUD Operations**
- Products management
- Content management
- User management
- Real-time inventory tracking

✅ **Production-Ready Features**
- Health monitoring
- Performance logging
- Error handling
- Security best practices

✅ **Vercel Integration**
- Automatic deployments
- Environment configuration
- Global CDN
- SSL certificates

### Next Steps:
1. 🔐 Change default admin password
2. 👥 Create additional user accounts
3. 📦 Add your products and content
4. 🎨 Customize branding and styling
5. 📧 Configure email services
6. 💳 Set up payment processing
7. 📈 Monitor application performance

**Your website is live at: https://your-domain.vercel.app**

Welcome to your new independent, scalable church management system! 🎊