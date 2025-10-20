-- Seed data for KMCI website

-- Insert ministries
INSERT INTO ministries (title, slug, description, full_content, icon, order_index) VALUES
('Children Ministry', 'children', 'Nurturing young hearts to know and love Jesus', 'Our Children Ministry is dedicated to creating a safe, fun, and spiritually enriching environment where children can learn about God''s love. Through engaging Bible stories, worship, crafts, and games, we help children build a strong foundation of faith that will guide them throughout their lives.', 'users', 1),
('Youth Ministry', 'youth', 'Empowering the next generation for Kingdom impact', 'The Youth Ministry focuses on discipling teenagers and young adults, helping them navigate life''s challenges while growing in their relationship with Christ. We provide mentorship, leadership training, and opportunities for service that prepare them to be world-changers for God.', 'zap', 2),
('Women Ministry', 'women', 'Building strong, faith-filled women of God', 'Our Women Ministry creates a supportive community where women can grow spiritually, emotionally, and relationally. Through Bible studies, prayer groups, and fellowship events, we encourage women to discover their God-given purpose and walk in their calling with confidence.', 'heart', 3),
('Men Ministry', 'men', 'Raising godly men who lead with integrity', 'The Men Ministry equips men to be spiritual leaders in their homes, workplaces, and communities. We focus on accountability, biblical manhood, and developing character that reflects Christ in every area of life.', 'shield', 4),
('Missions & Outreach', 'missions', 'Taking the Gospel beyond our walls', 'Our Missions & Outreach ministry is committed to sharing the love of Christ with unreached communities. Through evangelism, community development, and compassionate service, we bring hope and transformation to those who need it most.', 'globe', 5),
('Worship Ministry', 'worship', 'Leading hearts into God''s presence', 'The Worship Ministry creates an atmosphere where people can encounter God through music, prayer, and creative expression. Our team is dedicated to excellence in worship that honors God and draws people closer to Him.', 'music', 6);

-- Insert sample events
INSERT INTO events (title, slug, description, event_date, end_date, location, is_featured, status) VALUES
('Sunday Worship Service', 'sunday-worship-2025-01-12', 'Join us for powerful worship and life-changing teaching', '2025-01-12 09:00:00+03', '2025-01-12 12:00:00+03', 'KMCI Main Sanctuary, Kinoo', true, 'upcoming'),
('Youth Conference 2025', 'youth-conference-2025', 'Three days of worship, teaching, and fellowship for young people', '2025-02-14 08:00:00+03', '2025-02-16 18:00:00+03', 'KMCI Conference Center', true, 'upcoming'),
('Women''s Prayer Breakfast', 'womens-prayer-breakfast-jan', 'A morning of prayer, worship, and encouragement', '2025-01-20 07:00:00+03', '2025-01-20 10:00:00+03', 'KMCI Fellowship Hall', false, 'upcoming'),
('Community Outreach - Muthiga', 'community-outreach-muthiga', 'Medical camp and food distribution', '2025-01-25 09:00:00+03', '2025-01-25 16:00:00+03', 'Muthiga Community Center', false, 'upcoming');

-- Insert sample sermons
INSERT INTO sermons (title, slug, speaker, description, sermon_date, scripture_reference, tags, is_featured) VALUES
('The Power of Transformation', 'power-of-transformation', 'Pastor John Kamau', 'Discover how God transforms lives and communities through His power', '2025-01-05', 'Romans 12:1-2', ARRAY['transformation', 'discipleship', 'renewal'], true),
('Walking in Purpose', 'walking-in-purpose', 'Pastor Sarah Wanjiru', 'Understanding and fulfilling your God-given purpose', '2024-12-29', 'Jeremiah 29:11', ARRAY['purpose', 'calling', 'vision'], false),
('Faith That Moves Mountains', 'faith-moves-mountains', 'Pastor John Kamau', 'Building unshakeable faith in challenging times', '2024-12-22', 'Matthew 17:20', ARRAY['faith', 'miracles', 'trust'], false);

-- Insert sample projects
INSERT INTO projects (title, slug, description, full_content, category, goal_amount, raised_amount, families_reached, communities_served, status, is_featured) VALUES
('Missionary Training Base', 'missionary-training-base', 'Building a center to train and equip missionaries', 'The Missionary Training Base will serve as a hub for preparing missionaries for effective ministry. This facility will include classrooms, dormitories, a library, and practical training spaces. Our goal is to train 100 missionaries annually who will serve in unreached communities across Kenya and beyond.', 'missionary_base', 5000000.00, 1250000.00, 0, 0, 'active', true),
('Children''s Home Expansion', 'childrens-home-expansion', 'Providing safe homes for vulnerable children', 'Our Children''s Home provides shelter, education, and spiritual nurture for orphaned and vulnerable children. This expansion project will add capacity for 30 more children, including new dormitories, a dining hall, and recreational facilities.', 'childrens_home', 3000000.00, 800000.00, 45, 3, 'active', true),
('Outreach Vehicle Fund', 'outreach-vehicle-fund', 'Mobile ministry to reach remote communities', 'A dedicated vehicle will enable our teams to reach remote communities with the Gospel, medical care, and humanitarian aid. This project will significantly expand our outreach capacity and allow us to serve areas that are currently inaccessible.', 'outreach_vehicles', 2500000.00, 500000.00, 120, 8, 'active', false);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, is_published, published_at) VALUES
('Testimony: From Darkness to Light', 'testimony-darkness-to-light', 'How God transformed my life and gave me hope', 'My name is Grace, and this is my story of transformation. Five years ago, I was lost, broken, and without hope. But God had other plans...', 'testimonies', ARRAY['testimony', 'transformation', 'hope'], true, '2024-12-15 10:00:00+03'),
('Muthiga Outreach Report', 'muthiga-outreach-report-dec', 'Reaching 200 families with food and the Gospel', 'Last month, our team conducted a major outreach in Muthiga, providing food packages and sharing the Gospel with over 200 families. The response was overwhelming...', 'outreach', ARRAY['outreach', 'community', 'evangelism'], true, '2024-12-20 14:00:00+03');

-- Insert site settings
INSERT INTO site_settings (key, value, description) VALUES
('site_info', '{"name": "Kingdom Missions Center International", "tagline": "A Centre of Transformation, Mission, and Hope", "email": "info@kmci.org", "phone": "+254 700 000 000", "address": "Kinoo/Muthiga, Kiambu County, Kenya"}', 'Basic site information'),
('service_times', '{"sunday_service": "9:00 AM - 12:00 PM", "midweek_service": "Wednesday 6:00 PM - 8:00 PM", "prayer_meeting": "Friday 6:00 AM - 7:00 AM"}', 'Church service times'),
('social_media', '{"facebook": "https://facebook.com/kmci", "instagram": "https://instagram.com/kmci", "twitter": "https://twitter.com/kmci", "youtube": "https://youtube.com/@kmci"}', 'Social media links'),
('stats', '{"years_of_ministry": 15, "lives_touched": 5000, "communities_reached": 25}', 'Ministry statistics');
