#!/bin/bash

# KMCI Website Complete Setup Script
# This script sets up the entire KMCI website from scratch

echo "🚀 Starting KMCI Website Complete Setup..."
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Set up environment
echo "🔧 Setting up environment variables..."
if [ ! -f ".env" ]; then
    cp env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please update your .env file with actual values before running the application"
else
    echo "✅ .env file already exists"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public/uploads
mkdir -p public/images
mkdir -p public/videos
mkdir -p public/documents

echo "✅ Directories created"

# Build the application
echo "🏗️  Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo "✅ Application built successfully"

echo ""
echo "🎉 Setup completed successfully!"
echo "=============================================="
echo ""
echo "📋 Next steps:"
echo "1. Update your .env file with actual values:"
echo "   - Supabase credentials"
echo "   - Stripe keys"
echo "   - M-Pesa credentials"
echo "   - Email settings"
echo ""
echo "2. Set up your Supabase database:"
echo "   - Run scripts/01-create-tables.sql"
echo "   - Run scripts/02-create-policies.sql"
echo "   - Run scripts/03-seed-data.sql"
echo "   - Run scripts/04-create-admin-user.sql"
echo ""
echo "3. Create admin users in Supabase Auth:"
echo "   - admin@kmci.org (Super Admin)"
echo "   - editor@kmci.org (Editor)"
echo "   - finance@kmci.org (Finance)"
echo "   - viewer@kmci.org (Viewer)"
echo ""
echo "4. Start the development server:"
echo "   npm run dev"
echo ""
echo "5. Visit your website:"
echo "   http://localhost:3000"
echo "   http://localhost:3000/admin"
echo ""
echo "📚 For detailed instructions, see SETUP_GUIDE.md"
echo "🔧 For configuration help, see DOCUMENTATION.md"
echo ""
echo "🌟 Welcome to KMCI Website!"
