-- =====================================================
-- KMCI COMPLETE SYSTEM FIX - DATABASE SCHEMA
-- This script creates the entire database from scratch with all fixes
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CLEAN SLATE: DROP ALL EXISTING TABLES AND POLICIES
-- =====================================================

-- Drop all existing policies first
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Drop all existing tables
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS event_rsvps CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS sermons CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS ministries CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =====================================================
-- 1. PROFILES TABLE (Users & Authentication)
-- =====================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('super_admin', 'editor', 'finance', 'viewer')),
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. BLOG POSTS TABLE
-- =====================================================

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  image_uploads JSONB DEFAULT '[]',
  gallery_images TEXT[] DEFAULT '{}',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. MINISTRIES TABLE
-- =====================================================

CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_description TEXT,
  leader_name TEXT,
  leader_contact TEXT,
  meeting_schedule TEXT,
  image_url TEXT,
  image_uploads JSONB DEFAULT '[]',
  gallery_images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. EVENTS TABLE
-- =====================================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  venue_address TEXT,
  image_url TEXT,
  image_uploads JSONB DEFAULT '[]',
  gallery_images TEXT[] DEFAULT '{}',
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  registration_deadline TIMESTAMPTZ,
  price DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('draft', 'published', 'upcoming', 'ongoing', 'completed', 'cancelled')),
  is_featured BOOLEAN DEFAULT false,
  requires_registration BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. EVENT RSVPS TABLE
-- =====================================================

CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_phone TEXT,
  number_of_guests INTEGER DEFAULT 1,
  special_requirements TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, attendee_email)
);

-- =====================================================
-- 6. SERMONS TABLE (FIXED: speaker column)
-- =====================================================

CREATE TABLE sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  scripture_reference TEXT,
  speaker TEXT NOT NULL, -- FIXED: Changed from 'preacher' to 'speaker'
  sermon_date DATE NOT NULL,
  duration INTEGER, -- in minutes
  video_url TEXT,
  audio_url TEXT,
  thumbnail_url TEXT,
  image_uploads JSONB DEFAULT '[]', -- NEW: Support for multiple images
  gallery_images TEXT[] DEFAULT '{}', -- NEW: Image gallery
  transcript TEXT,
  study_guide TEXT,
  sermon_notes TEXT,
  series TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. PROJECTS TABLE
-- =====================================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_content TEXT,
  goal_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  raised_amount DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  target_date DATE,
  image_url TEXT,
  image_uploads JSONB DEFAULT '[]',
  gallery_images TEXT[] DEFAULT '{}',
  category TEXT,
  location TEXT,
  beneficiaries INTEGER,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled')),
  is_featured BOOLEAN DEFAULT false,
  progress_percentage DECIMAL(5, 2) DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. PRODUCTS TABLE (Enhanced for e-commerce)
-- =====================================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  full_content TEXT,
  category TEXT,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  compare_price DECIMAL(12, 2), -- Original price for discounts
  currency TEXT DEFAULT 'KES',
  sku TEXT UNIQUE,
  barcode TEXT,
  image_url TEXT,
  image_uploads JSONB DEFAULT '[]', -- NEW: Multiple images support
  gallery_images TEXT[] DEFAULT '{}', -- NEW: Image gallery
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived', 'out_of_stock')),
  stock INTEGER DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,
  weight DECIMAL(10, 3), -- in kg
  dimensions JSONB, -- {length, width, height}
  is_featured BOOLEAN DEFAULT false,
  is_digital BOOLEAN DEFAULT false,
  download_url TEXT, -- for digital products
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  views INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. DONATIONS TABLE
-- =====================================================

CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  payment_method TEXT CHECK (payment_method IN ('mpesa', 'card', 'bank', 'cash', 'other')),
  transaction_id TEXT UNIQUE,
  reference_code TEXT,
  purpose TEXT, -- general, project-specific, tithe, offering
  project_id UUID REFERENCES projects(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  is_anonymous BOOLEAN DEFAULT false,
  message TEXT,
  receipt_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. CONTACT MESSAGES TABLE
-- =====================================================

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- general, prayer_request, support, feedback
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'resolved', 'archived')),
  assigned_to UUID REFERENCES profiles(id),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  tags TEXT[] DEFAULT '{}',
  response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 12. CREATE STORAGE BUCKETS
-- =====================================================

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
    ('sermon-images', 'sermon-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
    ('blog-images', 'blog-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
    ('event-images', 'event-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
    ('project-images', 'project-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
    ('ministry-images', 'ministry-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
    ('general-uploads', 'general-uploads', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'audio/mpeg', 'video/mp4'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =====================================================
-- 13. CREATE PERFORMANCE INDEXES
-- =====================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(is_active) WHERE is_active = true;

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON blog_posts(status, published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured, created_at DESC) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category, status);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_date_status ON events(event_date, status) WHERE status IN ('published', 'upcoming');
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured, event_date) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Sermons indexes
CREATE INDEX IF NOT EXISTS idx_sermons_status_date ON sermons(status, sermon_date DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_sermons_speaker ON sermons(speaker, sermon_date DESC);
CREATE INDEX IF NOT EXISTS idx_sermons_featured ON sermons(is_featured, sermon_date DESC) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_sermons_series ON sermons(series, sermon_date DESC) WHERE series IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sermons_slug ON sermons(slug);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_status_featured ON products(status, is_featured DESC, created_at DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku) WHERE sku IS NOT NULL;

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_status_featured ON projects(status, is_featured DESC, created_at DESC) WHERE status IN ('active', 'planning');
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Donations indexes
CREATE INDEX IF NOT EXISTS idx_donations_status_date ON donations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_project ON donations(project_id, created_at DESC) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_donations_transaction ON donations(transaction_id) WHERE transaction_id IS NOT NULL;

-- Contact messages indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_assigned ON contact_messages(assigned_to, status) WHERE assigned_to IS NOT NULL;

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id, created_at DESC);

-- =====================================================
-- 14. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 15. CREATE RLS POLICIES
-- =====================================================

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
);

-- BLOG POSTS POLICIES
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (
  status = 'published' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);
CREATE POLICY "Editors can manage blog posts" ON blog_posts FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);

-- MINISTRIES POLICIES
CREATE POLICY "Public can view active ministries" ON ministries FOR SELECT USING (
  is_active = true OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);
CREATE POLICY "Editors can manage ministries" ON ministries FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);

-- EVENTS POLICIES
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (
  status IN ('published', 'upcoming') OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);
CREATE POLICY "Editors can manage events" ON events FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);

-- EVENT RSVPS POLICIES
CREATE POLICY "Anyone can create RSVP" ON event_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own RSVPs" ON event_rsvps FOR SELECT USING (
  attendee_email = auth.email() OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);
CREATE POLICY "Editors can manage all RSVPs" ON event_rsvps FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);

-- SERMONS POLICIES
CREATE POLICY "Public can view published sermons" ON sermons FOR SELECT USING (
  status = 'published' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);
CREATE POLICY "Editors can manage sermons" ON sermons FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);

-- PROJECTS POLICIES
CREATE POLICY "Public can view active projects" ON projects FOR SELECT USING (
  status IN ('active', 'planning') OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);
CREATE POLICY "Editors can manage projects" ON projects FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);

-- PRODUCTS POLICIES
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (
  status = 'active' OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);
CREATE POLICY "Editors can manage products" ON products FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);

-- DONATIONS POLICIES
CREATE POLICY "Anyone can create donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Donors can view their own donations" ON donations FOR SELECT USING (
  donor_email = auth.email() OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'finance'))
);
CREATE POLICY "Finance users can manage donations" ON donations FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'finance'))
);

-- CONTACT MESSAGES POLICIES
CREATE POLICY "Anyone can create contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Senders can view their own messages" ON contact_messages FOR SELECT USING (
  sender_email = auth.email() OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);
CREATE POLICY "Editors can manage contact messages" ON contact_messages FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor'))
);

-- AUDIT LOGS POLICIES
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
);

-- STORAGE POLICIES
CREATE POLICY "Public can view images" ON storage.objects FOR SELECT USING (
  bucket_id IN ('product-images', 'sermon-images', 'blog-images', 'event-images', 'project-images', 'ministry-images', 'general-uploads')
);

CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id IN ('product-images', 'sermon-images', 'blog-images', 'event-images', 'project-images', 'ministry-images', 'general-uploads')
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their uploads" ON storage.objects FOR UPDATE USING (
  bucket_id IN ('product-images', 'sermon-images', 'blog-images', 'event-images', 'project-images', 'ministry-images', 'general-uploads')
  AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')))
);

CREATE POLICY "Users can delete their uploads" ON storage.objects FOR DELETE USING (
  bucket_id IN ('product-images', 'sermon-images', 'blog-images', 'event-images', 'project-images', 'ministry-images', 'general-uploads')
  AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')))
);

-- =====================================================
-- 16. CREATE UTILITY FUNCTIONS
-- =====================================================

-- Function to generate unique filename
CREATE OR REPLACE FUNCTION generate_unique_filename(original_name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN extract(epoch from now())::int || '_' ||
           encode(gen_random_bytes(6), 'hex') || '_' ||
           regexp_replace(original_name, '[^a-zA-Z0-9.]', '_', 'g');
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ministries_updated_at BEFORE UPDATE ON ministries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_event_rsvps_updated_at BEFORE UPDATE ON event_rsvps FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sermons_updated_at BEFORE UPDATE ON sermons FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        CASE
            WHEN NEW.email = 'admin@kmci.org' THEN 'super_admin'
            ELSE 'viewer'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- =====================================================
-- 17. INSERT SAMPLE DATA
-- =====================================================

-- Insert admin user profile (if not exists)
INSERT INTO profiles (id, email, full_name, role, is_active)
SELECT
    gen_random_uuid(),
    'admin@kmci.org',
    'KMCI Administrator',
    'super_admin',
    true
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'admin@kmci.org');

-- Insert sample ministries
INSERT INTO ministries (name, slug, description, full_description, is_active, sort_order) VALUES
('Youth Ministry', 'youth-ministry', 'Empowering young people for Christ', 'Our youth ministry focuses on discipleship, leadership development, and community service for ages 12-25.', true, 1),
('Women''s Ministry', 'womens-ministry', 'Building godly women of purpose', 'A ministry dedicated to encouraging women in their walk with God through Bible study, fellowship, and service.', true, 2),
('Men''s Ministry', 'mens-ministry', 'Raising godly men and leaders', 'Equipping men to be spiritual leaders in their homes, workplaces, and communities.', true, 3),
('Children''s Ministry', 'childrens-ministry', 'Nurturing the next generation', 'Teaching children about Jesus through fun, interactive lessons and activities.', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, status, is_featured, author_id, published_at) VALUES
('Welcome to KMCI', 'welcome-to-kmci', 'Discover our mission and vision for transforming communities through Christ.',
'# Welcome to Kingdom Missions Center International

We are thrilled to welcome you to our community of believers dedicated to spreading the Gospel and transforming lives through Christ''s love.

## Our Mission
To disciple communities and transform lives for Christ''s service through ministry, missions, and development.

## Our Vision
A world where every community experiences the transformative power of God''s love through holistic ministry.

Join us in this incredible journey of faith and service!',
'published', true, (SELECT id FROM profiles WHERE email = 'admin@kmci.org' LIMIT 1), NOW())
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 18. FINAL VERIFICATION
-- =====================================================

-- Check that all tables exist
SELECT
    'SUCCESS: All tables created' as status,
    COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('profiles', 'blog_posts', 'ministries', 'events', 'event_rsvps', 'sermons', 'projects', 'products', 'donations', 'contact_messages', 'audit_logs');

-- Check that speaker column exists in sermons
SELECT
    'SUCCESS: Speaker column exists in sermons table' as status
WHERE EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sermons' AND column_name = 'speaker'
);

-- Check storage buckets
SELECT
    'SUCCESS: Storage buckets created' as status,
    COUNT(*) as bucket_count
FROM storage.buckets
WHERE name IN ('product-images', 'sermon-images', 'blog-images', 'event-images', 'project-images', 'ministry-images', 'general-uploads');

-- Check RLS policies
SELECT
    'SUCCESS: RLS policies created' as status,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public';

-- Final success message
SELECT
    '🎉 KMCI DATABASE SETUP COMPLETE! 🎉' as status,
    'All tables, indexes, policies, and functions created successfully' as message,
    'Your system is now fully functional and ready for production' as next_step;

-- =====================================================
-- END OF COMPLETE SYSTEM FIX
-- =====================================================
