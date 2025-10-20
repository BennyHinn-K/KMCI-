# KMCI Website Setup Guide

This guide will walk you through setting up the Kingdom Missions Center International website from scratch.

## Step 1: Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- A Supabase account (free tier is fine)
- A Stripe account (for payment processing)
- Git installed on your computer

## Step 2: Project Installation

1. **Download the project**
   - Download the ZIP file from v0
   - Extract it to your desired location
   - Open terminal/command prompt in the project folder

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

## Step 3: Supabase Setup

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: "KMCI Website"
   - Generate a strong database password (save this!)
   - Select a region close to your users
   - Click "Create new project"

2. **Run database scripts**
   - In your Supabase dashboard, go to SQL Editor
   - Click "New Query"
   - Copy the contents of `scripts/01-create-tables.sql`
   - Paste and click "Run"
   - Repeat for `scripts/02-create-policies.sql`
   - Repeat for `scripts/03-seed-data.sql`

3. **Get your Supabase credentials**
   - In Supabase dashboard, go to Settings > API
   - Copy the "Project URL" (this is your NEXT_PUBLIC_SUPABASE_URL)
   - Copy the "anon public" key (this is your NEXT_PUBLIC_SUPABASE_ANON_KEY)

4. **Configure authentication**
   - Go to Authentication > URL Configuration
   - Add your site URL (e.g., http://localhost:3000 for development)
   - Add redirect URLs:
     - http://localhost:3000/admin
     - https://yourdomain.com/admin (for production)

## Step 4: Stripe Setup

1. **Create a Stripe account**
   - Go to [stripe.com](https://stripe.com)
   - Sign up for an account
   - Complete verification

2. **Get your API keys**
   - In Stripe dashboard, go to Developers > API keys
   - Copy the "Publishable key" (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
   - Click "Reveal test key" and copy the "Secret key" (STRIPE_SECRET_KEY)

3. **Configure M-Pesa (Optional)**
   - Contact Stripe support to enable M-Pesa for Kenya
   - Follow their setup instructions

## Step 5: Environment Variables

1. **Create environment file**
   - In your project root, create a file named `.env.local`
   - Add the following (replace with your actual values):

   \`\`\`env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

   # Site URL (change for production)
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Development redirect URL for Supabase auth
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/admin
   \`\`\`

## Step 6: Run the Development Server

1. **Start the server**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Open your browser**
   - Navigate to http://localhost:3000
   - You should see the KMCI homepage

3. **Test the admin login**
   - Go to http://localhost:3000/admin/login
   - Use the default credentials:
     - Email: admin@kmci.org
     - Password: kmci_admin_2024
   - **IMPORTANT**: Change this password immediately!

## Step 7: Customize Content

1. **Update site information**
   - Log into the admin dashboard
   - Go to Settings (if you're a Super Admin)
   - Update church information, contact details, etc.

2. **Add your content**
   - Create blog posts
   - Add events
   - Upload sermons
   - Create projects
   - Add team members

3. **Update images**
   - Replace placeholder images with your own
   - Use the admin dashboard to upload media
   - Recommended image sizes:
     - Hero images: 1920x1080px
     - Event images: 800x600px
     - Team photos: 400x400px
     - Blog featured images: 1200x630px

## Step 8: Deploy to Production

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-github-repo-url
   git push -u origin main
   \`\`\`

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (same as .env.local)
   - Click "Deploy"

3. **Update Supabase settings**
   - In Supabase dashboard, go to Authentication > URL Configuration
   - Add your production URL (e.g., https://kmci.org)
   - Add redirect URL: https://kmci.org/admin

4. **Configure Stripe webhooks**
   - In Stripe dashboard, go to Developers > Webhooks
   - Click "Add endpoint"
   - Enter: https://yourdomain.com/api/webhooks/stripe
   - Select events: payment_intent.succeeded, payment_intent.failed
   - Copy the webhook signing secret
   - Add to Vercel environment variables as STRIPE_WEBHOOK_SECRET

## Step 9: Post-Deployment Checklist

- [ ] Test all forms (contact, RSVP, donation, newsletter)
- [ ] Verify admin dashboard access
- [ ] Test payment processing with Stripe test cards
- [ ] Check mobile responsiveness
- [ ] Test accessibility features
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Set up Google Analytics (optional)
- [ ] Configure email notifications
- [ ] Set up regular database backups
- [ ] Update DNS records to point to Vercel

## Step 10: Ongoing Maintenance

**Weekly:**
- Review audit logs in admin dashboard
- Check for new donations
- Respond to contact form submissions

**Monthly:**
- Update content (blog posts, events, sermons)
- Review analytics
- Check for security updates

**Quarterly:**
- Update dependencies: `npm update`
- Review and update privacy policy
- Backup database manually

## Troubleshooting

### Issue: Can't log into admin
**Solution:**
- Check that you ran all database scripts
- Verify Supabase credentials in .env.local
- Check browser console for errors
- Try resetting password in Supabase dashboard

### Issue: Donations not working
**Solution:**
- Verify Stripe keys are correct
- Check that you're using test mode keys for testing
- Review Stripe dashboard for error messages
- Ensure webhook is configured correctly

### Issue: Images not loading
**Solution:**
- Check image URLs are correct
- Verify file sizes aren't too large (max 5MB)
- Check browser console for CORS errors
- Ensure images are in the public folder

### Issue: Slow page load
**Solution:**
- Optimize images (use WebP format)
- Enable caching in Vercel
- Check database query performance
- Review Lighthouse report for suggestions

## Getting Help

If you encounter issues:
1. Check the DOCUMENTATION.md file
2. Review error messages in browser console
3. Check Vercel deployment logs
4. Review Supabase logs
5. Contact support at admin@kmci.org

## Security Best Practices

1. **Never commit .env.local to Git**
2. **Change default admin password immediately**
3. **Use strong passwords for all accounts**
4. **Enable 2FA on Supabase and Stripe**
5. **Regularly update dependencies**
6. **Monitor audit logs for suspicious activity**
7. **Keep production and test environments separate**
8. **Regularly backup your database**

## Next Steps

Once your site is live:
1. Submit sitemap to Google Search Console
2. Set up Google Analytics
3. Configure email marketing (Mailchimp, SendGrid, etc.)
4. Set up social media accounts
5. Create a content calendar
6. Train staff on using the admin dashboard
7. Set up monitoring and alerts

Congratulations! Your KMCI website is now live and ready to serve your community.
