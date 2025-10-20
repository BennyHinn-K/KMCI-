-- Row Level Security Policies for KMCI Database

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Ministries policies (public read, admin write)
CREATE POLICY "Ministries are viewable by everyone"
  ON ministries FOR SELECT
  USING (is_active = true OR auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
  ));

CREATE POLICY "Admins can manage ministries"
  ON ministries FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
  ));

-- Events policies
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
  ));

-- Event RSVPs policies
CREATE POLICY "Anyone can create RSVP"
  ON event_rsvps FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all RSVPs"
  ON event_rsvps FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
  ));

-- Sermons policies
CREATE POLICY "Sermons are viewable by everyone"
  ON sermons FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage sermons"
  ON sermons FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
  ));

-- Projects policies
CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
  ));

-- Donations policies
CREATE POLICY "Anyone can create donation"
  ON donations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Finance and admins can view donations"
  ON donations FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'finance')
  ));

CREATE POLICY "Admins can manage donations"
  ON donations FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  ));

-- Blog posts policies
CREATE POLICY "Published posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (is_published = true OR auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
  ));

CREATE POLICY "Editors can manage blog posts"
  ON blog_posts FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
  ));

-- Contact messages policies
CREATE POLICY "Anyone can create contact message"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON contact_messages FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
  ));

-- Newsletter subscribers policies
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
  ));

-- Site settings policies
CREATE POLICY "Settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Only super admins can manage settings"
  ON site_settings FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  ));

-- Audit logs policies
CREATE POLICY "Only super admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'super_admin'
  ));
