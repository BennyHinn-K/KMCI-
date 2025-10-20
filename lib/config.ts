// Environment configuration with validation
export const config = {
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },

  // Database
  database: {
    url: process.env.DATABASE_URL!,
  },

  // Authentication
  auth: {
    nextAuthUrl: process.env.NEXTAUTH_URL!,
    nextAuthSecret: process.env.NEXTAUTH_SECRET!,
  },

  // Payment Processing
  payments: {
    stripe: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
      secretKey: process.env.STRIPE_SECRET_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    },
    mpesa: {
      consumerKey: process.env.MPESA_CONSUMER_KEY!,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
      shortcode: process.env.MPESA_SHORTCODE!,
      passkey: process.env.MPESA_PASSKEY!,
      environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
    },
  },

  // Email
  email: {
    smtp: {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || '587'),
      username: process.env.SMTP_USERNAME!,
      password: process.env.SMTP_PASSWORD!,
    },
    from: {
      name: process.env.SMTP_FROM_NAME || 'KMCI Team',
      email: process.env.SMTP_FROM_EMAIL || 'noreply@kmci.org',
    },
  },

  // File Upload
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760'), // 10MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,pdf,doc,docx,mp4,mp3').split(','),
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
    facebookPixelId: process.env.FACEBOOK_PIXEL_ID,
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET!,
    encryptionKey: process.env.ENCRYPTION_KEY!,
  },

  // Site Configuration
  site: {
    url: process.env.SITE_URL || 'http://localhost:3000',
    name: process.env.SITE_NAME || 'Kingdom Missions Center International',
    description: process.env.SITE_DESCRIPTION || 'A Christian missions organization dedicated to discipling communities and transforming lives for Christ\'s service.',
  },

  // Admin
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@kmci.org',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },

  // Environment
  env: {
    nodeEnv: process.env.NODE_ENV || 'development',
    appEnv: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
}

// Validation function
export function validateConfig() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Export individual configs for easier imports
export const {
  supabase,
  database,
  auth,
  payments,
  email,
  upload,
  analytics,
  security,
  site,
  admin,
  env,
} = config
