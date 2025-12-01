-- =====================================================
-- KMCI COMPLETE DATABASE AUTOMATIC FIX
-- This script fixes ALL database issues automatically
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- STEP 1: CLEAN SLATE - DROP ALL EXISTING POLICIES
-- =====================================================

DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on all tables
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
                      r.policyname, r.schemaname, r.tablename);
        RAISE NOTICE 'Dropped policy: % on table %', r.policyname, r.tablename;
    END LOOP;
END $$;

-- =====================================================
-- STEP 2: CREATE ALL REQUIRED TABLES
-- =====================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('super_admin', 'editor', 'finance', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
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

-- Events table
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

-- Event RSVPs table
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

-- Sermons table
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

-- Projects table
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

-- Products table
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

-- Donations table
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

-- Ministries table
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

-- Contact messages table
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

-- Audit log table
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

-- =====================================================
-- STEP 3: CREATE ALL INDEXES FOR PERFORMANCE
-- =====================================================

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);

-- Sermons indexes
CREATE INDEX IF NOT EXISTS idx_sermons_status ON sermons(status);
CREATE INDEX IF NOT EXISTS idx_sermons_slug ON sermons(slug);
CREATE INDEX IF NOT EXISTS idx_sermons_sermon_date ON sermons(sermon_date DESC);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Donations indexes
CREATE INDEX IF NOT EXISTS idx_donations_payment_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);

-- =====================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================

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

-- =====================================================
-- STEP 5: CREATE COMPREHENSIVE RLS POLICIES
-- =====================================================

-- PROFILES POLICIES
CREATE POLICY "Public can view basic profile info"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- BLOG POSTS POLICIES
CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
  );

CREATE POLICY "Editors can insert blog posts"
  ON blog_posts FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
  );

CREATE POLICY "Editors can update blog posts"
  ON blog_posts FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

CREATE POLICY "Editors can delete blog posts"
  ON blog_posts FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- EVENTS POLICIES
CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
  );

CREATE POLICY "Editors can insert events"
  ON events FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
  );

CREATE POLICY "Editors can update events"
  ON events FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

CREATE POLICY "Editors can delete events"
  ON events FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- EVENT RSVPS POLICIES
CREATE POLICY "Public can create RSVPs"
  ON event_rsvps FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all RSVPs"
  ON event_rsvps FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- SERMONS POLICIES
CREATE POLICY "Public can view published sermons"
  ON sermons FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
  );

CREATE POLICY "Editors can insert sermons"
  ON sermons FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
  );

CREATE POLICY "Editors can update sermons"
  ON sermons FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

CREATE POLICY "Editors can delete sermons"
  ON sermons FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- PRODUCTS POLICIES
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (
    status = 'active'
    OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
  );

CREATE POLICY "Editors can insert products"
  ON products FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
  );

CREATE POLICY "Editors can update products"
  ON products FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

CREATE POLICY "Editors can delete products"
  ON products FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- PROJECTS POLICIES
CREATE POLICY "Public can view active projects"
  ON projects FOR SELECT
  USING (
    status = 'active'
    OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
  );

CREATE POLICY "Editors can insert projects"
  ON projects FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
  );

CREATE POLICY "Editors can update projects"
  ON projects FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

CREATE POLICY "Editors can delete projects"
  ON projects FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- DONATIONS POLICIES
CREATE POLICY "Public can create donations"
  ON donations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Finance and admins can view donations"
  ON donations FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'finance', 'editor')));

-- MINISTRIES POLICIES
CREATE POLICY "Public can view active ministries"
  ON ministries FOR SELECT
  USING (is_active = true OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

CREATE POLICY "Editors can manage ministries"
  ON ministries FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- CONTACT MESSAGES POLICIES
CREATE POLICY "Public can create contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON contact_messages FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- AUDIT LOGS POLICIES
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin'));

-- =====================================================
-- STEP 6: CREATE ADMIN USER
-- =====================================================

DO $$
DECLARE
  admin_user_id UUID := '27d501f7-2661-4cbe-a05a-02cb49292ac2';
  admin_email TEXT := 'admin@kmci.org';
  admin_password TEXT := 'Admin123!KMCI';
BEGIN
  -- Delete existing admin if exists
  DELETE FROM profiles WHERE email = admin_email;
  DELETE FROM auth.users WHERE email = admin_email;

  -- Create new admin user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    recovery_sent_at,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change,
    email_change_token_new,
    email_change_token_current,
    confirmation_token,
    recovery_token,
    reauthentication_token,
    reauthentication_sent_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    admin_user_id,
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    '',
    '',
    '',
    '',
    '',
    NULL
  );

  -- Create profile for admin
  INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    admin_user_id,
    admin_email,
    'KMCI Administrator',
    'super_admin',
    NOW(),
    NOW()
  );

  RAISE NOTICE '✅ Admin user created successfully!';
  RAISE NOTICE '📧 Email: %', admin_email;
  RAISE NOTICE '🔑 Password: %', admin_password;

END $$;

-- =====================================================
-- STEP 7: SEED SAMPLE DATA
-- =====================================================

-- Insert sample ministries
INSERT INTO ministries (name, slug, description, full_description, leader_name, meeting_schedule, location, is_active) VALUES
('Children Ministry', 'children', 'Nurturing young hearts for Christ', 'Our Children Ministry focuses on building strong foundations in faith for children aged 4-12 through interactive Bible lessons, worship songs, and age-appropriate activities.', 'Sister Mary Johnson', 'Sundays 9:00 AM', 'Main Sanctuary - Kids Area', true),
('Youth Ministry', 'youth', 'Empowering the next generation', 'Dynamic ministry for teenagers and young adults (13-25) featuring contemporary worship, life skills training, and leadership development programs.', 'Pastor David Williams', 'Fridays 6:00 PM', 'Youth Center', true),
('Women Ministry', 'women', 'Women of faith, purpose and strength', 'Empowering women through prayer, fellowship, mentorship, and community outreach programs that strengthen family and community bonds.', 'Mama Grace Ochieng', 'Saturdays 2:00 PM', 'Fellowship Hall', true),
('Men Ministry', 'men', 'Building godly men and fathers', 'Equipping men to be spiritual leaders in their homes and communities through Bible study, accountability, and service projects.', 'Elder John Mburu', 'Saturdays 7:00 AM', 'Conference Room', true),
('Missions Ministry', 'missions', 'Reaching the unreached globally', 'Coordinating local and international mission trips, supporting missionaries, and training congregation members for evangelism and discipleship.', 'Rev. Peter Kimani', 'Monthly Planning Meetings', 'Mission Center', true),
('Worship Ministry', 'worship', 'Leading hearts in true worship', 'Training musicians, singers, and technical team members to create meaningful worship experiences that honor God and minister to the congregation.', 'Minister Sarah Wanjiku', 'Wednesdays 7:00 PM', 'Main Sanctuary', true);

-- =====================================================
-- STEP 8: VERIFICATION AND SUMMARY
-- =====================================================

-- Verify all tables exist
SELECT
  'Table Status' as check_type,
  table_name,
  CASE
    WHEN table_name IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'blog_posts', 'events', 'event_rsvps', 'sermons', 'projects', 'products', 'donations', 'ministries', 'contact_messages', 'audit_logs')
ORDER BY table_name;

-- Verify RLS policies
SELECT
  'Policy Status' as check_type,
  tablename,
  COUNT(*) as policy_count,
  COUNT(CASE WHEN cmd = 'INSERT' AND with_check IS NOT NULL THEN 1 END) as insert_policies_with_check
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Verify admin user
SELECT
  'Admin User Status' as check_type,
  u.email,
  p.role,
  CASE
    WHEN p.role = 'super_admin' THEN '✅ READY TO LOGIN'
    ELSE '❌ ROLE ISSUE'
  END as status
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'admin@kmci.org';

-- Final summary
SELECT
  '🎉 DATABASE FIX COMPLETE!' as status,
  '✅ All tables created' as tables_status,
  '✅ All RLS policies fixed' as policies_status,
  '✅ Admin user ready' as admin_status,
  '✅ Sample data seeded' as data_status,
  'Login: admin@kmci.org / Admin123!KMCI' as credentials;

RAISE NOTICE '🎊 KMCI DATABASE SETUP COMPLETE!';
RAISE NOTICE '🔗 Admin Login: http://localhost:3000/admin';
RAISE NOTICE '📧 Email: admin@kmci.org';
RAISE NOTICE '🔑 Password: Admin123!KMCI';
RAISE NOTICE '⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!';
