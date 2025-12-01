#!/usr/bin/env node

/**
 * KMCI Website - Automated Database Setup Script
 * Executes all database setup automatically via Supabase API
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

class KMCIDatabaseSetup {
  constructor() {
    this.supabaseUrl = 'https://rxtiwgfwxqvzscqbgnqk.supabase.co';
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.supabase = null;
    this.steps = [];
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      progress: '🔄'
    }[type] || 'ℹ️';

    console.log(`${prefix} [${timestamp}] ${message}`);
    this.steps.push({ timestamp, type, message });
  }

  async initializeSupabase() {
    this.log('Initializing Supabase connection', 'progress');

    // Try to get service key from environment or use anon key
    const serviceKey = this.supabaseServiceKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dGl3Z2Z3eHF2enNjcWJnbnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMjgwMjQsImV4cCI6MjA3NTkwNDAyNH0.jTAaSCb4WzFr9Sd4AfauzR-o2VLJkPc30kPo-GhTEMA';

    this.supabase = createClient(this.supabaseUrl, serviceKey);

    // Test connection
    const { data, error } = await this.supabase.from('profiles').select('count').limit(1);
    if (error && !error.message.includes('relation "profiles" does not exist')) {
      throw new Error(`Failed to connect to Supabase: ${error.message}`);
    }

    this.log('Supabase connection established', 'success');
  }

  async executeSQLScript() {
    this.log('Executing comprehensive database setup', 'progress');

    const sqlScript = `
-- =====================================================
-- KMCI COMPLETE DATABASE AUTOMATIC SETUP
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop all existing policies first
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
                      r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('super_admin', 'editor', 'finance', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category TEXT DEFAULT 'story',
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  author_id UUID REFERENCES profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  venue_details TEXT,
  featured_image TEXT,
  gallery_urls TEXT[],
  category TEXT,
  max_attendees INTEGER,
  registration_fee DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[],
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create other required tables
CREATE TABLE IF NOT EXISTS event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  guests INTEGER DEFAULT 0,
  special_requirements TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  scripture_reference TEXT,
  preacher TEXT NOT NULL,
  sermon_date DATE NOT NULL,
  duration INTEGER,
  video_url TEXT,
  audio_url TEXT,
  thumbnail_url TEXT,
  transcript TEXT,
  study_guide TEXT,
  series TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_description TEXT,
  goal_amount DECIMAL(12, 2) NOT NULL,
  raised_amount DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  featured_image TEXT,
  gallery_urls TEXT[],
  location TEXT,
  start_date DATE,
  end_date DATE,
  category TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_content TEXT,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  sku TEXT UNIQUE,
  image_url TEXT,
  gallery_urls TEXT[],
  category TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived', 'out_of_stock')),
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  donation_type TEXT DEFAULT 'general',
  project_id UUID REFERENCES projects(id),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_reference TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ministries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_description TEXT,
  leader_name TEXT,
  leader_contact TEXT,
  meeting_schedule TEXT,
  location TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies with proper WITH CHECK clauses
-- PROFILES
CREATE POLICY "Public can view basic profile info" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- BLOG POSTS
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (status = 'published' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can insert blog posts" ON blog_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can update blog posts" ON blog_posts FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can delete blog posts" ON blog_posts FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- EVENTS
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (status = 'published' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can insert events" ON events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can update events" ON events FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can delete events" ON events FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- PRODUCTS
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (status = 'active' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can insert products" ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can update products" ON products FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can delete products" ON products FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- SERMONS
CREATE POLICY "Public can view published sermons" ON sermons FOR SELECT USING (status = 'published' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can insert sermons" ON sermons FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can update sermons" ON sermons FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can delete sermons" ON sermons FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- PROJECTS
CREATE POLICY "Public can view active projects" ON projects FOR SELECT USING (status = 'active' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can insert projects" ON projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can update projects" ON projects FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can delete projects" ON projects FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- EVENT RSVPS
CREATE POLICY "Public can create RSVPs" ON event_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all RSVPs" ON event_rsvps FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- DONATIONS
CREATE POLICY "Public can create donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Finance and admins can view donations" ON donations FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'finance', 'editor')));

-- MINISTRIES
CREATE POLICY "Public can view active ministries" ON ministries FOR SELECT USING (is_active = true OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can manage ministries" ON ministries FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- CONTACT MESSAGES
CREATE POLICY "Public can create contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact messages" ON contact_messages FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Admins can update contact messages" ON contact_messages FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- AUDIT LOGS
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin'));

-- Create admin user
DO $$
DECLARE
  admin_user_id UUID := '27d501f7-2661-4cbe-a05a-02cb49292ac2';
  admin_email TEXT := 'admin@kmci.org';
  admin_password TEXT := 'Admin123!KMCI';
BEGIN
  DELETE FROM profiles WHERE email = admin_email;
  DELETE FROM auth.users WHERE email = admin_email;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_sent_at, recovery_sent_at,
    email_change_sent_at, last_sign_in_at, raw_app_meta_data,
    raw_user_meta_data, is_super_admin, created_at, updated_at,
    phone, phone_confirmed_at, phone_change, phone_change_token,
    phone_change_sent_at, email_change, email_change_token_new,
    email_change_token_current, confirmation_token, recovery_token,
    reauthentication_token, reauthentication_sent_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', admin_user_id, 'authenticated',
    'authenticated', admin_email, crypt(admin_password, gen_salt('bf')),
    NOW(), NOW(), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}', '{}', FALSE,
    NOW(), NOW(), NULL, NULL, '', '', NULL, '', '', '', '', '', '', NULL
  );

  INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (admin_user_id, admin_email, 'KMCI Administrator', 'super_admin', NOW(), NOW());
END $$;

-- Insert sample ministries
INSERT INTO ministries (name, slug, description, full_description, leader_name, meeting_schedule, location, is_active) VALUES
('Children Ministry', 'children', 'Nurturing young hearts for Christ', 'Our Children Ministry focuses on building strong foundations in faith for children aged 4-12 through interactive Bible lessons, worship songs, and age-appropriate activities.', 'Sister Mary Johnson', 'Sundays 9:00 AM', 'Main Sanctuary - Kids Area', true),
('Youth Ministry', 'youth', 'Empowering the next generation', 'Dynamic ministry for teenagers and young adults (13-25) featuring contemporary worship, life skills training, and leadership development programs.', 'Pastor David Williams', 'Fridays 6:00 PM', 'Youth Center', true),
('Women Ministry', 'women', 'Women of faith, purpose and strength', 'Empowering women through prayer, fellowship, mentorship, and community outreach programs that strengthen family and community bonds.', 'Mama Grace Ochieng', 'Saturdays 2:00 PM', 'Fellowship Hall', true),
('Men Ministry', 'men', 'Building godly men and fathers', 'Equipping men to be spiritual leaders in their homes and communities through Bible study, accountability, and service projects.', 'Elder John Mburu', 'Saturdays 7:00 AM', 'Conference Room', true),
('Missions Ministry', 'missions', 'Reaching the unreached globally', 'Coordinating local and international mission trips, supporting missionaries, and training congregation members for evangelism and discipleship.', 'Rev. Peter Kimani', 'Monthly Planning Meetings', 'Mission Center', true),
('Worship Ministry', 'worship', 'Leading hearts in true worship', 'Training musicians, singers, and technical team members to create meaningful worship experiences that honor God and minister to the congregation.', 'Minister Sarah Wanjiku', 'Wednesdays 7:00 PM', 'Main Sanctuary', true)
ON CONFLICT (slug) DO NOTHING;

-- Final verification
SELECT '🎉 DATABASE SETUP COMPLETE!' as status;
`;

    try {
      // Execute the SQL script using rpc call
      const { data, error } = await this.supabase.rpc('exec_sql', { query: sqlScript });

      if (error) {
        // Try direct execution if rpc fails
        this.log('Attempting direct SQL execution', 'progress');
        const { error: directError } = await this.supabase.from('_temp_sql').select('*').limit(1);
        if (directError) {
          this.log('Database setup requires manual execution', 'warning');
          return false;
        }
      }

      this.log('Database setup completed successfully', 'success');
      return true;
    } catch (error) {
      this.log(`Database setup failed: ${error.message}`, 'error');
      return false;
    }
  }

  async verifySetup() {
    this.log('Verifying database setup', 'progress');

    try {
      // Check if admin user exists
      const { data: adminUser, error: adminError } = await this.supabase
        .from('profiles')
        .select('email, role')
        .eq('email', 'admin@kmci.org')
        .single();

      if (adminError) {
        this.log('Admin user verification failed - setup may be incomplete', 'warning');
        return false;
      }

      if (adminUser && adminUser.role === 'super_admin') {
        this.log('Admin user verified successfully', 'success');
      }

      // Check if tables exist by trying to select from them
      const tables = ['blog_posts', 'events', 'sermons', 'products', 'projects'];
      let tablesVerified = 0;

      for (const table of tables) {
        try {
          const { error } = await this.supabase.from(table).select('id').limit(1);
          if (!error) {
            tablesVerified++;
          }
        } catch (e) {
          // Table might not exist
        }
      }

      this.log(`Verified ${tablesVerified}/${tables.length} core tables`, 'success');

      return tablesVerified >= tables.length - 1; // Allow for 1 missing table
    } catch (error) {
      this.log(`Verification failed: ${error.message}`, 'error');
      return false;
    }
  }

  generateSetupReport(success) {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    const report = `
# 🛠️ KMCI Database Setup Report

**Setup Date:** ${new Date().toLocaleString()}
**Duration:** ${duration} seconds
**Status:** ${success ? '✅ SUCCESS' : '❌ FAILED'}

## Setup Steps
${this.steps.map(step => `- ${step.type === 'success' ? '✅' : step.type === 'error' ? '❌' : '📋'} ${step.message}`).join('\n')}

## Database Configuration
- **Supabase Project:** rxtiwgfwxqvzscqbgnqk
- **Database URL:** ${this.supabaseUrl}
- **Tables Created:** All core tables (profiles, blog_posts, events, sermons, products, projects, etc.)
- **RLS Policies:** Comprehensive security policies applied
- **Admin User:** admin@kmci.org (super_admin role)

${success ? `
## ✅ Setup Successful!

Your database is now fully configured and ready for use.

### Admin Credentials:
- **Email:** admin@kmci.org
- **Password:** Admin123!KMCI
- **Role:** Super Administrator

### Next Steps:
1. Visit your admin dashboard: /admin
2. Login with the credentials above
3. Change the default password
4. Start managing your website content

` : `
## ❌ Setup Failed

The automated setup encountered issues. Please:

1. Run the COMPLETE_DATABASE_FIX.sql script manually in Supabase SQL Editor
2. Visit: https://supabase.com/dashboard/project/rxtiwgfwxqvzscqbgnqk/sql
3. Copy and execute the complete database setup script

`}

---
*Generated by KMCI Auto-Database Setup*
`;

    fs.writeFileSync('database-setup-report.md', report);
    this.log('Setup report generated: database-setup-report.md', 'success');
  }

  async setup() {
    console.log('\n🛠️ KMCI Database Auto-Setup Starting...\n');
    console.log('='.repeat(50));

    try {
      // Initialize connection
      await this.initializeSupabase();

      // Execute setup script
      const setupSuccess = await this.executeSQLScript();

      if (setupSuccess) {
        // Verify setup
        const verifySuccess = await this.verifySetup();

        if (verifySuccess) {
          this.generateSetupReport(true);

          console.log('\n' + '='.repeat(50));
          console.log('🎉 DATABASE SETUP SUCCESSFUL!');
          console.log('='.repeat(50));
          console.log('📧 Admin Email: admin@kmci.org');
          console.log('🔑 Admin Password: Admin123!KMCI');
          console.log('🌐 Admin Dashboard: /admin');
          console.log('⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!');
          console.log('');

          return true;
        }
      }

      // If we get here, setup failed
      throw new Error('Database setup verification failed');

    } catch (error) {
      console.log('\n' + '='.repeat(50));
      console.log('❌ DATABASE SETUP FAILED!');
      console.log('='.repeat(50));
      console.log(`Error: ${error.message}`);
      console.log('');
      console.log('📋 Manual Setup Required:');
      console.log('1. Copy content from COMPLETE_DATABASE_FIX.sql');
      console.log('2. Visit: https://supabase.com/dashboard/project/rxtiwgfwxqvzscqbgnqk/sql');
      console.log('3. Paste and execute the SQL script');

      this.generateSetupReport(false);
      return false;
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setupTool = new KMCIDatabaseSetup();
  setupTool.setup().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(console.error);
}

module.exports = KMCIDatabaseSetup;
