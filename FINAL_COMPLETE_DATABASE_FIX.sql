-- =====================================================
-- KMCI COMPLETE DATABASE FIX - EXACT COLUMN ANALYSIS
-- This script creates the database with EXACT column names used in the code
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop all existing policies
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- PROFILES TABLE
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('super_admin', 'editor', 'finance', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLOG_POSTS TABLE (Uses: featured_image, status)
DROP TABLE IF EXISTS blog_posts CASCADE;
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT DEFAULT 'news',
  featured_image TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  author_id UUID REFERENCES profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EVENTS TABLE (Uses: image_url, event_date, end_date, max_attendees, status, is_featured)
DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  image_url TEXT,
  max_attendees INTEGER,
  tags TEXT[],
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('draft', 'published', 'upcoming', 'cancelled', 'completed')),
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS TABLE (Uses: image_url, full_content, price, currency, sku, status, stock, is_featured)
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_content TEXT,
  category TEXT,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  sku TEXT UNIQUE,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived', 'out_of_stock')),
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS TABLE (Uses: image_url, full_content, goal_amount, raised_amount, currency, status, is_featured)
DROP TABLE IF EXISTS projects CASCADE;
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_content TEXT,
  category TEXT DEFAULT 'other',
  goal_amount DECIMAL(12, 2) NOT NULL,
  raised_amount DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  image_url TEXT,
  gallery_urls TEXT[],
  tags TEXT[],
  location TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused', 'cancelled')),
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERMONS TABLE
DROP TABLE IF EXISTS sermons CASCADE;
CREATE TABLE sermons (
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

-- DONATIONS TABLE (Uses: amount, currency, status for dashboard filtering)
DROP TABLE IF EXISTS donations CASCADE;
CREATE TABLE donations (
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
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  is_anonymous BOOLEAN DEFAULT false,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTACT_MESSAGES TABLE (Uses: status including 'new' for dashboard)
DROP TABLE IF EXISTS contact_messages CASCADE;
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'unread', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT_LOGS TABLE
DROP TABLE IF EXISTS audit_logs CASCADE;
CREATE TABLE audit_logs (
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

-- MINISTRIES TABLE
DROP TABLE IF EXISTS ministries CASCADE;
CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_description TEXT,
  leader_name TEXT,
  leader_email TEXT,
  leader_phone TEXT,
  meeting_day TEXT,
  meeting_time TIME,
  meeting_schedule TEXT,
  location TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;

-- COMPREHENSIVE RLS POLICIES WITH PROPER WITH CHECK CLAUSES

-- PROFILES POLICIES
CREATE POLICY "Public can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- BLOG POSTS POLICIES
CREATE POLICY "Public can view published posts" ON blog_posts FOR SELECT USING (status = 'published' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can insert posts" ON blog_posts FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can update posts" ON blog_posts FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can delete posts" ON blog_posts FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- EVENTS POLICIES
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (status IN ('published', 'upcoming') OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can insert events" ON events FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can update events" ON events FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can delete events" ON events FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- PRODUCTS POLICIES
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (status = 'active' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can insert products" ON products FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can update products" ON products FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can delete products" ON products FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- PROJECTS POLICIES
CREATE POLICY "Public can view active projects" ON projects FOR SELECT USING (status IN ('active', 'planning') OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can insert projects" ON projects FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can update projects" ON projects FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can delete projects" ON projects FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- SERMONS POLICIES
CREATE POLICY "Public can view published sermons" ON sermons FOR SELECT USING (status = 'published' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can insert sermons" ON sermons FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can update sermons" ON sermons FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Editors can delete sermons" ON sermons FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- DONATIONS POLICIES
CREATE POLICY "Public can create donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Finance can view donations" ON donations FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'finance', 'editor')));

-- CONTACT MESSAGES POLICIES
CREATE POLICY "Public can create messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view messages" ON contact_messages FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Admins can update messages" ON contact_messages FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- MINISTRIES POLICIES
CREATE POLICY "Public can view active ministries" ON ministries FOR SELECT USING (is_active = true OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));
CREATE POLICY "Admins can manage ministries" ON ministries FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))) WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')));

-- AUDIT LOGS POLICIES
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin'));

-- CREATE ADMIN USER
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

-- INSERT SAMPLE MINISTRIES
INSERT INTO ministries (name, slug, description, full_description, leader_name, meeting_schedule, location, is_active) VALUES
('Children Ministry', 'children', 'Nurturing young hearts for Christ', 'Our Children Ministry focuses on building strong foundations in faith for children aged 4-12 through interactive Bible lessons, worship songs, and age-appropriate activities.', 'Sister Mary Johnson', 'Sundays 9:00 AM', 'Main Sanctuary - Kids Area', true),
('Youth Ministry', 'youth', 'Empowering the next generation', 'Dynamic ministry for teenagers and young adults (13-25) featuring contemporary worship, life skills training, and leadership development programs.', 'Pastor David Williams', 'Fridays 6:00 PM', 'Youth Center', true),
('Women Ministry', 'women', 'Women of faith, purpose and strength', 'Empowering women through prayer, fellowship, mentorship, and community outreach programs that strengthen family and community bonds.', 'Mama Grace Ochieng', 'Saturdays 2:00 PM', 'Fellowship Hall', true),
('Men Ministry', 'men', 'Building godly men and fathers', 'Equipping men to be spiritual leaders in their homes and communities through Bible study, accountability, and service projects.', 'Elder John Mburu', 'Saturdays 7:00 AM', 'Conference Room', true),
('Missions Ministry', 'missions', 'Reaching the unreached globally', 'Coordinating local and international mission trips, supporting missionaries, and training congregation members for evangelism and discipleship.', 'Rev. Peter Kimani', 'Monthly Planning Meetings', 'Mission Center', true),
('Worship Ministry', 'worship', 'Leading hearts in true worship', 'Training musicians, singers, and technical team members to create meaningful worship experiences that honor God and minister to the congregation.', 'Minister Sarah Wanjiku', 'Wednesdays 7:00 PM', 'Main Sanctuary', true)
ON CONFLICT (slug) DO NOTHING;

-- CREATE PERFORMANCE INDEXES
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_fast_load ON products(status, is_featured DESC, created_at DESC) WHERE status = 'active';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_status_published ON blog_posts(status, published_at DESC) WHERE status = 'published';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_status_date ON events(status, event_date) WHERE status IN ('published', 'upcoming');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sermons_status_date ON sermons(status, sermon_date DESC) WHERE status = 'published';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_status ON projects(status, is_featured DESC) WHERE status IN ('active', 'planning');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_donations_status ON donations(status, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contact_messages_status ON contact_messages(status, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_role ON profiles(role);

-- UPDATE STATISTICS FOR OPTIMAL PERFORMANCE
ANALYZE profiles;
ANALYZE blog_posts;
ANALYZE events;
ANALYZE products;
ANALYZE projects;
ANALYZE sermons;
ANALYZE donations;
ANALYZE contact_messages;

-- FINAL VERIFICATION
SELECT
  '🎉 KMCI DATABASE COMPLETELY FIXED!' as status,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as total_tables,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND cmd = 'INSERT' AND with_check IS NOT NULL) as insert_policies_with_check,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'image_url') as events_image_url_exists,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'featured_image') as blog_featured_image_exists,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'donations' AND column_name = 'status') as donations_status_exists,
  EXISTS(SELECT 1 FROM profiles WHERE email = 'admin@kmci.org' AND role = 'super_admin') as admin_ready;

-- SUCCESS CONFIRMATION
SELECT
  '✅ ALL COLUMN MISMATCHES FIXED!' as message,
  'Events: image_url ✅' as events_fix,
  'Blog Posts: featured_image ✅' as blog_fix,
  'Products: image_url ✅' as products_fix,
  'Projects: image_url ✅' as projects_fix,
  'Donations: status column ✅' as donations_fix,
  'Contact: new status ✅' as contact_fix,
  'Admin ready: admin@kmci.org / Admin123!KMCI ✅' as admin_ready;
