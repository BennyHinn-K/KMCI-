-- Create admin users for KMCI website
-- This script creates initial admin users and sample data

-- Note: These users should be created in Supabase Auth first
-- The UUIDs below are placeholders - replace with actual UUIDs from Supabase Auth

-- Insert admin profiles
INSERT INTO profiles (id, email, full_name, role, avatar_url) VALUES
('00000000-0000-0000-0000-000000000000', 'admin@kmci.org', 'KMCI Administrator', 'super_admin', null),
('11111111-1111-1111-1111-111111111111', 'editor@kmci.org', 'Content Editor', 'editor', null),
('22222222-2222-2222-2222-222222222222', 'finance@kmci.org', 'Finance Manager', 'finance', null),
('33333333-3333-3333-3333-333333333333', 'viewer@kmci.org', 'Content Viewer', 'viewer', null)
ON CONFLICT (email) DO NOTHING;

-- Insert sample donations for testing
INSERT INTO donations (donor_name, donor_email, donor_phone, amount, currency, payment_method, payment_reference, project_id, is_anonymous, is_recurring, frequency, status, notes) VALUES
('John Mwangi', 'john.mwangi@example.com', '+254 700 123 456', 5000.00, 'KES', 'mpesa', 'MPESA123456789', (SELECT id FROM projects WHERE slug = 'missionary-training-base' LIMIT 1), false, false, 'one_time', 'completed', 'Thank you for your ministry'),
('Anonymous Donor', 'anonymous@example.com', null, 2000.00, 'KES', 'stripe', 'stripe_123456789', (SELECT id FROM projects WHERE slug = 'childrens-home-expansion' LIMIT 1), true, false, 'one_time', 'completed', 'God bless your work'),
('Mary Wanjiku', 'mary.wanjiku@example.com', '+254 700 987 654', 10000.00, 'KES', 'bank_transfer', 'BT789456123', (SELECT id FROM projects WHERE slug = 'outreach-vehicle-fund' LIMIT 1), false, true, 'monthly', 'completed', 'Monthly support for missions'),
('Peter Kimani', 'peter.kimani@example.com', '+254 700 555 777', 1500.00, 'KES', 'mpesa', 'MPESA987654321', null, false, false, 'one_time', 'completed', 'General fund donation'),
('Grace Akinyi', 'grace.akinyi@example.com', '+254 700 333 999', 7500.00, 'KES', 'stripe', 'stripe_987654321', (SELECT id FROM projects WHERE slug = 'missionary-training-base' LIMIT 1), false, false, 'one_time', 'pending', 'Supporting missionary training');

-- Insert sample event RSVPs
INSERT INTO event_rsvps (event_id, full_name, email, phone, number_of_guests, message, status) VALUES
((SELECT id FROM events WHERE slug = 'sunday-worship-2025-01-12' LIMIT 1), 'James Kiprotich', 'james.kiprotich@example.com', '+254 700 111 222', 2, 'Looking forward to the service', 'confirmed'),
((SELECT id FROM events WHERE slug = 'youth-conference-2025' LIMIT 1), 'Faith Muthoni', 'faith.muthoni@example.com', '+254 700 333 444', 1, 'Excited to attend the conference', 'confirmed'),
((SELECT id FROM events WHERE slug = 'womens-prayer-breakfast-jan' LIMIT 1), 'Esther Wanjiku', 'esther.wanjiku@example.com', '+254 700 555 666', 1, 'Will be there with friends', 'confirmed'),
((SELECT id FROM events WHERE slug = 'community-outreach-muthiga' LIMIT 1), 'David Mwangi', 'david.mwangi@example.com', '+254 700 777 888', 3, 'Bringing my family to help', 'confirmed');

-- Insert sample audit logs
INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data, ip_address, user_agent) VALUES
((SELECT id FROM profiles WHERE email = 'admin@kmci.org' LIMIT 1), 'create', 'blog_posts', (SELECT id FROM blog_posts WHERE slug = 'testimony-darkness-to-light' LIMIT 1), '{"title": "Testimony: From Darkness to Light", "slug": "testimony-darkness-to-light"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
((SELECT id FROM profiles WHERE email = 'editor@kmci.org' LIMIT 1), 'update', 'events', (SELECT id FROM events WHERE slug = 'sunday-worship-2025-01-12' LIMIT 1), '{"title": "Sunday Worship Service", "location": "KMCI Main Sanctuary, Kinoo"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
((SELECT id FROM profiles WHERE email = 'admin@kmci.org' LIMIT 1), 'create', 'projects', (SELECT id FROM projects WHERE slug = 'missionary-training-base' LIMIT 1), '{"title": "Missionary Training Base", "goal_amount": 5000000.00}', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');

-- Instructions for creating users in Supabase Auth:
-- 1. Go to your Supabase dashboard
-- 2. Navigate to Authentication > Users
-- 3. Click "Add user" and create users with the following emails:
--    - admin@kmci.org (Super Admin)
--    - editor@kmci.org (Editor)
--    - finance@kmci.org (Finance)
--    - viewer@kmci.org (Viewer)
-- 4. Copy the UUIDs from the created users
-- 5. Replace the placeholder UUIDs above with the actual UUIDs
-- 6. Run this script again to update the profiles table
