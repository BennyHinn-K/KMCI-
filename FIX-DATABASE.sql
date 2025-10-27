-- =====================================================
-- FIX DATABASE - Run this in Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/rxtiwgfwxqvzscqbgnqk/sql
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Create profile for existing KMCI@admin user
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  id,
  email,
  'KMCI Admin',
  'super_admin'
FROM auth.users
WHERE email = 'kmci@admin'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin',
    full_name = 'KMCI Admin';

-- Verify
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'kmci@admin';

-- =====================================================
-- ✅ After running this, login will work with:
-- Email: KMCI@admin (or kmci@admin)
-- Password: #1nne$TY
-- =====================================================

