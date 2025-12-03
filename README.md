# 🏛️ Kingdom Missions Center International (KMCI) Website

> A modern, full-stack web application built with Next.js, TypeScript, and Supabase for managing a Christian missions organization.

![System Status](https://img.shields.io/badge/System-Operational-green)
![Build Status](https://img.shields.io/badge/Build-Passing-green)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)

## ✨ Features

### 🎯 Core Functionality
- **Content Management**: Sermons, blog posts, events, and ministry content
- **E-commerce**: Product catalog with inventory management
- **Donations**: Secure payment processing for projects and general donations
- **User Management**: Role-based access control (Admin, Editor, Finance, Viewer)
- **File Management**: Advanced image upload with drag-and-drop

### 🚀 Technical Features
- **Modern Stack**: Next.js 15, React 19, TypeScript 5
- **Database**: PostgreSQL with Supabase (Row Level Security)
- **Authentication**: Secure user authentication and authorization
- **Storage**: Cloud-based file storage with CDN
- **Performance**: Optimized queries, caching, and image handling
- **Security**: Enterprise-grade security with audit logging

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with modern hooks
- **TypeScript 5** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **React Query** - Server state management

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Database-level authorization
- **Supabase Storage** - File storage with CDN

### DevOps & Tools
- **Vercel** - Deployment and hosting
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Automated Testing** - Health checks and validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation
1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd kmci-website
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Setup Database**
   - Open Supabase SQL Editor
   - Execute `COMPLETE_SYSTEM_FIX.sql`

4. **Run Health Check**
   ```bash
   npm run health-check
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see your application!

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run health-check # System health verification
npm run setup        # Run setup script
npm run deploy       # Deploy to production
npm run test:all     # Run all tests and checks
```

## 🗄️ Database Schema

### Core Tables
- **profiles** - User profiles and roles
- **sermons** - Sermon content and metadata
- **blog_posts** - Blog articles and content
- **events** - Event management with RSVP
- **products** - E-commerce product catalog
- **projects** - Fundraising projects
- **donations** - Payment and donation tracking
- **contact_messages** - Contact form submissions

### Features
- ✅ Row Level Security (RLS) enabled
- ✅ Automated timestamps and triggers
- ✅ Performance optimized indexes
- ✅ Full-text search capabilities
- ✅ Audit logging for changes

## 🔐 Security Features

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row Level Security policies
- **File Security**: Secure file upload with validation
- **Audit Trail**: Complete change tracking
- **Environment Security**: Secure credential management

## 🚀 Deployment

### Automatic Deployment
```bash
npm run deploy
```

### Manual Deployment
1. Run health checks: `npm run health-check`
2. Build application: `npm run build`
3. Deploy to Vercel: `vercel --prod`

## 📊 System Health

The system includes comprehensive health monitoring:

- **Automated Health Checks**: Daily system verification
- **Performance Monitoring**: Real-time metrics
- **Error Tracking**: Instant alerts
- **Database Monitoring**: Query performance tracking

## 🎯 Admin Features

### Content Management
- Create and manage sermons, blog posts, events
- Advanced image upload with drag-and-drop
- Real-time content preview
- Bulk operations and management

### E-commerce Management
- Product catalog with inventory tracking
- Order processing and management
- Payment integration (Stripe, M-Pesa)
- Sales analytics and reporting

### User Management
- Role-based access control
- User activity tracking
- Permission management
- Audit logs and security monitoring

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: Check `COMPLETE_PROJECT_ANALYSIS.md`
- **Quick Start**: See `QUICK_START.md`
- **Health Check**: Run `npm run health-check`
- **Issues**: Open GitHub issues for bugs or features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Built with ❤️ for Kingdom Missions Center International
- Powered by modern web technologies
- Designed for scalability and security

---

**Status**: ✅ Production Ready
**Last Updated**: December 2024
**System Health**: 89% (Excellent)
