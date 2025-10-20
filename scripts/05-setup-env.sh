#!/bin/bash

# KMCI Website Environment Setup Script
# This script helps set up the environment variables for the KMCI website

echo "🚀 Setting up KMCI Website Environment..."

# Check if .env file exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Copy example file
cp env.example .env

echo "✅ Created .env file from template"
echo ""
echo "📝 Please update the following required variables in your .env file:"
echo ""
echo "🔐 SUPABASE CONFIGURATION:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "💳 PAYMENT CONFIGURATION:"
echo "   - STRIPE_PUBLISHABLE_KEY"
echo "   - STRIPE_SECRET_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
echo "   - MPESA_CONSUMER_KEY"
echo "   - MPESA_CONSUMER_SECRET"
echo "   - MPESA_SHORTCODE"
echo "   - MPESA_PASSKEY"
echo ""
echo "📧 EMAIL CONFIGURATION:"
echo "   - SMTP_HOST"
echo "   - SMTP_USERNAME"
echo "   - SMTP_PASSWORD"
echo ""
echo "🔒 SECURITY:"
echo "   - NEXTAUTH_SECRET"
echo "   - JWT_SECRET"
echo "   - ENCRYPTION_KEY"
echo ""
echo "📊 ANALYTICS (Optional):"
echo "   - GOOGLE_ANALYTICS_ID"
echo "   - FACEBOOK_PIXEL_ID"
echo ""
echo "🎯 Next steps:"
echo "1. Update the .env file with your actual values"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo "📚 For detailed setup instructions, see SETUP_GUIDE.md"
