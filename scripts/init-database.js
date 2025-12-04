const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'kmci_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// Console colors for better output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function createDatabase() {
  // First, connect without specifying database to create it
  const adminConfig = {
    ...config,
    database: 'postgres' // Connect to default postgres database
  };

  const adminClient = new Client(adminConfig);

  try {
    await adminClient.connect();
    log('📡 Connected to PostgreSQL server', 'blue');

    // Check if database exists
    const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = '${config.database}'`;
    const dbExists = await adminClient.query(checkDbQuery);

    if (dbExists.rows.length === 0) {
      // Create database
      await adminClient.query(`CREATE DATABASE "${config.database}"`);
      log(`✅ Database '${config.database}' created successfully`, 'green');
    } else {
      log(`📦 Database '${config.database}' already exists`, 'yellow');
    }

  } catch (error) {
    log(`❌ Error creating database: ${error.message}`, 'red');
    throw error;
  } finally {
    await adminClient.end();
  }
}

async function runSchema() {
  const client = new Client(config);

  try {
    await client.connect();
    log('🔗 Connected to KMCI database', 'blue');

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');

    if (!fs.existsSync(schemaPath)) {
      // Create schema content since file doesn't exist
      const schemaSQL = `
-- =====================================================
-- KMCI INTERNAL DATABASE SCHEMA
-- Complete database design for internal system
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,

    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(150),
    role VARCHAR(20) NOT NULL DEFAULT 'viewer',
    phone VARCHAR(20),
    bio TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT role_check CHECK (role IN ('super_admin', 'editor', 'viewer')),
    CONSTRAINT phone_format CHECK (phone IS NULL OR phone ~* '^\\+?[\\d\\s\\-\\(\\)]{10,}$')
);

-- =====================================================
-- CONTENT MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    author_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    view_count INTEGER DEFAULT 0,
    tags TEXT[],

    CONSTRAINT status_check CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT slug_format CHECK (slug ~* '^[a-z0-9\\-]+$')
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    location VARCHAR(255),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    featured_image_url TEXT,
    max_attendees INTEGER,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    organizer_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tags TEXT[],

    CONSTRAINT status_check CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    CONSTRAINT event_date_check CHECK (end_date IS NULL OR event_date <= end_date),
    CONSTRAINT max_attendees_check CHECK (max_attendees IS NULL OR max_attendees > 0)
);

CREATE TABLE IF NOT EXISTS event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    attendees INTEGER DEFAULT 1,
    message TEXT,
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT attendees_check CHECK (attendees > 0),
    CONSTRAINT status_check CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    UNIQUE(event_id, email)
);

CREATE TABLE IF NOT EXISTS sermons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    pastor VARCHAR(150),
    scripture_reference VARCHAR(255),
    audio_url TEXT,
    video_url TEXT,
    transcript TEXT,
    sermon_date DATE NOT NULL,
    series VARCHAR(150),
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_by UUID NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    download_count INTEGER DEFAULT 0,
    tags TEXT[],

    CONSTRAINT status_check CHECK (status IN ('draft', 'published', 'archived'))
);

-- =====================================================
-- PRODUCTS & E-COMMERCE
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    category VARCHAR(100),
    subcategory VARCHAR(100),
    tags TEXT[],
    weight DECIMAL(8,3),
    dimensions JSONB,
    inventory_quantity INTEGER DEFAULT 0,
    track_inventory BOOLEAN DEFAULT TRUE,
    allow_backorders BOOLEAN DEFAULT FALSE,
    low_stock_threshold INTEGER DEFAULT 10,
    featured_image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    visibility VARCHAR(20) DEFAULT 'visible',
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_by UUID NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT status_check CHECK (status IN ('draft', 'active', 'archived', 'out_of_stock')),
    CONSTRAINT visibility_check CHECK (visibility IN ('visible', 'hidden')),
    CONSTRAINT price_check CHECK (price >= 0),
    CONSTRAINT compare_price_check CHECK (compare_price IS NULL OR compare_price >= price),
    CONSTRAINT inventory_check CHECK (inventory_quantity >= 0)
);

CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROJECTS & MINISTRIES
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    goal_amount DECIMAL(12,2),
    raised_amount DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    start_date DATE,
    end_date DATE,
    featured_image_url TEXT,
    gallery_images TEXT[],
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    priority VARCHAR(10) DEFAULT 'medium',
    created_by UUID NOT NULL REFERENCES profiles(user_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT status_check CHECK (status IN ('draft', 'active', 'completed', 'cancelled', 'on_hold')),
    CONSTRAINT priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CONSTRAINT date_check CHECK (end_date IS NULL OR start_date <= end_date),
    CONSTRAINT amount_check CHECK (goal_amount IS NULL OR goal_amount > 0)
);

CREATE TABLE IF NOT EXISTS ministries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    leader VARCHAR(150),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    meeting_schedule TEXT,
    location VARCHAR(255),
    featured_image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DONATIONS & FINANCIAL
-- =====================================================

CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_name VARCHAR(150),
    donor_email VARCHAR(255),
    donor_phone VARCHAR(20),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    donation_type VARCHAR(50) DEFAULT 'general',
    project_id UUID REFERENCES projects(id),
    payment_method VARCHAR(50),
    payment_status VARCHAR(30) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_provider VARCHAR(50),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency VARCHAR(20),
    is_anonymous BOOLEAN DEFAULT FALSE,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT payment_status_check CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
    CONSTRAINT amount_check CHECK (amount > 0),
    CONSTRAINT recurring_check CHECK (
        (is_recurring = FALSE) OR
        (is_recurring = TRUE AND recurring_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly'))
    )
);

-- =====================================================
-- COMMUNICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'general',
    status VARCHAR(20) DEFAULT 'unread',
    assigned_to UUID REFERENCES profiles(user_id),
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT type_check CHECK (type IN ('general', 'prayer_request', 'partnership', 'volunteer', 'complaint', 'suggestion')),
    CONSTRAINT status_check CHECK (status IN ('unread', 'read', 'responded', 'archived'))
);

-- =====================================================
-- AUDIT & LOGGING
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(user_id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT action_check CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'FAILED_LOGIN'))
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users & Profiles
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- Content
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);

CREATE INDEX IF NOT EXISTS idx_sermons_status ON sermons(status);
CREATE INDEX IF NOT EXISTS idx_sermons_slug ON sermons(slug);
CREATE INDEX IF NOT EXISTS idx_sermons_sermon_date ON sermons(sermon_date DESC);
CREATE INDEX IF NOT EXISTS idx_sermons_series ON sermons(series);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);
CREATE INDEX IF NOT EXISTS idx_products_published_at ON products(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- Projects & Ministries
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_ministries_slug ON ministries(slug);
CREATE INDEX IF NOT EXISTS idx_ministries_is_active ON ministries(is_active);

-- Donations & Communication
CREATE INDEX IF NOT EXISTS idx_donations_payment_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_project_id ON donations(project_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Audit
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
      `;

      log('📄 Schema file not found, using embedded schema', 'yellow');
      await client.query(schemaSQL);
    } else {
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      log('📄 Running database schema...', 'blue');
      await client.query(schemaSQL);
    }

    log('✅ Database schema created successfully', 'green');

  } catch (error) {
    log(`❌ Error running schema: ${error.message}`, 'red');
    throw error;
  } finally {
    await client.end();
  }
}

async function createAdminUser() {
  const client = new Client(config);

  try {
    await client.connect();
    log('👤 Creating admin user...', 'blue');

    // Check if admin user exists
    const checkAdminQuery = 'SELECT id FROM users WHERE email = $1';
    const adminExists = await client.query(checkAdminQuery, ['admin@kmci.org']);

    if (adminExists.rows.length === 0) {
      // Create admin user with transaction
      await client.query('BEGIN');

      try {
        // Create user
        const userQuery = `
          INSERT INTO users (email, password_hash, email_verified, created_at, updated_at)
          VALUES ($1, crypt($2, gen_salt('bf')), true, NOW(), NOW())
          RETURNING id
        `;
        const userResult = await client.query(userQuery, ['admin@kmci.org', 'AdminPass123!']);
        const userId = userResult.rows[0].id;

        // Create profile
        const profileQuery = `
          INSERT INTO profiles (
            user_id, first_name, last_name, display_name, role, is_active, created_at, updated_at
          ) VALUES ($1, 'System', 'Administrator', 'System Administrator', 'super_admin', true, NOW(), NOW())
        `;
        await client.query(profileQuery, [userId]);

        await client.query('COMMIT');
        log('✅ Admin user created successfully', 'green');
        log('📧 Email: admin@kmci.org', 'blue');
        log('🔑 Password: AdminPass123!', 'blue');
        log('⚠️  Please change the admin password after first login!', 'yellow');

      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    } else {
      log('👤 Admin user already exists', 'yellow');
    }

  } catch (error) {
    log(`❌ Error creating admin user: ${error.message}`, 'red');
    throw error;
  } finally {
    await client.end();
  }
}

async function seedSampleData() {
  const client = new Client(config);

  try {
    await client.connect();
    log('🌱 Seeding sample data...', 'blue');

    // Get admin user ID
    const adminQuery = 'SELECT id FROM users WHERE email = $1';
    const adminResult = await client.query(adminQuery, ['admin@kmci.org']);

    if (adminResult.rows.length === 0) {
      log('⚠️  Admin user not found, skipping sample data', 'yellow');
      return;
    }

    const adminId = adminResult.rows[0].id;

    // Sample products
    const sampleProducts = [
      {
        title: 'KMCI T-Shirt',
        slug: 'kmci-t-shirt',
        description: 'Official KMCI branded t-shirt in various sizes',
        sku: 'KMCI-SHIRT-001',
        price: 25.00,
        category: 'apparel',
        inventory_quantity: 50,
        status: 'active'
      },
      {
        title: 'Faith & Hope Book',
        slug: 'faith-hope-book',
        description: 'Inspirational book about faith and hope in modern times',
        sku: 'KMCI-BOOK-001',
        price: 15.99,
        category: 'books',
        inventory_quantity: 100,
        status: 'active'
      },
      {
        title: 'Prayer Journal',
        slug: 'prayer-journal',
        description: 'Beautiful leather-bound prayer journal',
        sku: 'KMCI-JOURNAL-001',
        price: 19.99,
        category: 'stationery',
        inventory_quantity: 25,
        status: 'active'
      }
    ];

    // Insert sample products
    for (const product of sampleProducts) {
      const checkProductQuery = 'SELECT id FROM products WHERE slug = $1';
      const productExists = await client.query(checkProductQuery, [product.slug]);

      if (productExists.rows.length === 0) {
        const insertProductQuery = `
          INSERT INTO products (
            title, slug, description, sku, price, category, inventory_quantity,
            status, created_by, created_at, updated_at, published_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), NOW())
        `;

        await client.query(insertProductQuery, [
          product.title, product.slug, product.description, product.sku,
          product.price, product.category, product.inventory_quantity,
          product.status, adminId
        ]);

        log(`📦 Created sample product: ${product.title}`, 'green');
      }
    }

    log('✅ Sample data seeded successfully', 'green');

  } catch (error) {
    log(`❌ Error seeding sample data: ${error.message}`, 'red');
    // Don't throw error here, sample data is optional
  } finally {
    await client.end();
  }
}

async function testConnection() {
  const client = new Client(config);

  try {
    await client.connect();
    log('🔍 Testing database connection...', 'blue');

    // Test basic query
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    const { current_time, pg_version } = result.rows[0];

    log('✅ Database connection successful!', 'green');
    log(`🕒 Current time: ${current_time}`, 'blue');
    log(`🐘 PostgreSQL version: ${pg_version.split(' ')[1]}`, 'blue');

    // Test tables exist
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    const tablesResult = await client.query(tablesQuery);

    log(`📋 Tables created: ${tablesResult.rows.length}`, 'blue');
    tablesResult.rows.forEach(row => {
      log(`  - ${row.table_name}`, 'blue');
    });

  } catch (error) {
    log(`❌ Database connection failed: ${error.message}`, 'red');
    throw error;
  } finally {
    await client.end();
  }
}

async function main() {
  console.log(`${colors.bold}${colors.blue}
╔══════════════════════════════════════════════════════════════╗
║                    KMCI Database Initializer                 ║
║              Internal PostgreSQL Database Setup              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  try {
    log('🚀 Starting database initialization...', 'bold');

    // Step 1: Create database
    log('\n📋 Step 1: Creating database...', 'bold');
    await createDatabase();

    // Step 2: Run schema
    log('\n📋 Step 2: Setting up database schema...', 'bold');
    await runSchema();

    // Step 3: Create admin user
    log('\n📋 Step 3: Creating admin user...', 'bold');
    await createAdminUser();

    // Step 4: Seed sample data
    log('\n📋 Step 4: Seeding sample data...', 'bold');
    await seedSampleData();

    // Step 5: Test connection
    log('\n📋 Step 5: Testing database connection...', 'bold');
    await testConnection();

    log(`\n${colors.bold}${colors.green}
╔══════════════════════════════════════════════════════════════╗
║                 ✅ INITIALIZATION COMPLETE!                  ║
║                                                              ║
║  Your KMCI internal database is ready for production!       ║
║                                                              ║
║  Next steps:                                                 ║
║  1. Update your .env file with database credentials         ║
║  2. Deploy to Vercel with proper environment variables      ║
║  3. Change admin password after first login                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  } catch (error) {
    log(`\n${colors.bold}${colors.red}
╔══════════════════════════════════════════════════════════════╗
║                    ❌ INITIALIZATION FAILED                  ║
║                                                              ║
║  Error: ${error.message.padEnd(50)} ║
║                                                              ║
║  Please check your database configuration and try again.    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\n🛑 Process interrupted by user', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n🛑 Process terminated', 'yellow');
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = {
  createDatabase,
  runSchema,
  createAdminUser,
  seedSampleData,
  testConnection,
  main
};
