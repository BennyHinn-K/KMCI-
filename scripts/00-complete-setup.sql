-- =====================================================
-- KMCI COMPLETE DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Users/Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('super_admin', 'editor', 'finance', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ministries table
CREATE TABLE IF NOT EXISTS ministries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_content TEXT,
  icon TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  image_url TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs table
CREATE TABLE IF NOT EXISTS event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  number_of_guests INTEGER DEFAULT 1,
  message TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sermons table
CREATE TABLE IF NOT EXISTS sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  speaker TEXT NOT NULL,
  description TEXT,
  sermon_date DATE NOT NULL,
  video_url TEXT,
  audio_url TEXT,
  thumbnail_url TEXT,
  study_guide_url TEXT,
  scripture_reference TEXT,
  tags TEXT[],
  duration INTEGER,
  views INTEGER DEFAULT 0,
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
  full_content TEXT,
  category TEXT CHECK (category IN ('missionary_base', 'childrens_home', 'outreach_vehicles', 'other')),
  goal_amount DECIMAL(12, 2) DEFAULT 0,
  raised_amount DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  image_url TEXT,
  gallery_urls TEXT[],
  families_reached INTEGER DEFAULT 0,
  communities_served INTEGER DEFAULT 0,
  start_date DATE,
  target_completion_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'on_hold')),
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
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  payment_method TEXT CHECK (payment_method IN ('stripe', 'mpesa', 'bank_transfer', 'cash')),
  payment_reference TEXT,
  project_id UUID REFERENCES projects(id),
  is_anonymous BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  frequency TEXT CHECK (frequency IN ('one_time', 'weekly', 'monthly', 'yearly')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category TEXT CHECK (category IN ('testimonies', 'outreach', 'leadership', 'news', 'updates')),
  tags TEXT[],
  author_id UUID REFERENCES profiles(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
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

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(sermon_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_project ON donations(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Public read access for most content
CREATE POLICY IF NOT EXISTS "Public can view published blog posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY IF NOT EXISTS "Public can view active ministries" ON ministries FOR SELECT USING (is_active = true);
CREATE POLICY IF NOT EXISTS "Public can view sermons" ON sermons FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view events" ON events FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view products" ON products FOR SELECT USING (status = 'active');

-- Authenticated users can do more
CREATE POLICY IF NOT EXISTS "Authenticated users can manage all" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can manage events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can manage sermons" ON sermons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can manage ministries" ON ministries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can view donations" ON donations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can view messages" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can manage messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can view profiles" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can manage profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can view audit logs" ON audit_logs FOR SELECT USING (auth.role() = 'authenticated');

-- Public can submit
CREATE POLICY IF NOT EXISTS "Anyone can submit contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Anyone can RSVP to events" ON event_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Anyone can donate" ON donations FOR INSERT WITH CHECK (true);

-- =====================================================
-- CREATE ADMIN PROFILE
-- =====================================================

-- Insert admin profile for the user we created
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  'super_admin' as role
FROM auth.users
WHERE email = 'KMCI@admin'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin',
    full_name = EXCLUDED.full_name;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '✅ Admin user profile created';
  RAISE NOTICE '📧 Login: KMCI@admin';
  RAISE NOTICE '🔑 Password: #1nne$TY';
END $$;



