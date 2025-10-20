# Kingdom Missions Center International (KMCI) Website

A modern, premium website for Kingdom Missions Center International - a Christian missions organization dedicated to discipling communities and transforming lives for Christ's service.

## Features

### Public Website
- **Home Page**: Hero section with animated globe, core pillars, statistics, upcoming events, latest sermon, donation banner, and newsletter signup
- **About Page**: Vision, mission, SATIUMEC values, founding story, animated timeline, leadership profiles, and strategic plan download
- **Ministries Page**: Six ministry cards (Children, Youth, Women, Men, Missions, Worship) with expandable details
- **Events Page**: Calendar and list views with RSVP functionality
- **Sermons Page**: Video/audio gallery with filters, search, and study guides
- **Projects Page**: Interactive project cards with progress tracking and impact statistics
- **Donate Page**: Comprehensive donation form with Stripe and M-Pesa integration
- **Blog Page**: Stories and updates with category filtering
- **Contact Page**: Contact form, location map, and service times

### Admin Dashboard
- **Authentication**: Secure login with Supabase Auth
- **Role-Based Access**: Super Admin, Editor, and Finance roles
- **Content Management**: Create and edit blog posts, events, sermons, projects
- **Analytics**: Donation charts, statistics panels, and activity tracking
- **Audit Log**: Complete record of all admin actions
- **User Management**: Manage admin users and permissions (Super Admin only)

### Design System
- **Colors**: Calm ivory background, dark-blue foundation, white sections, gold accents
- **Typography**: Playfair Display for headings, Inter for body text
- **Animations**: Subtle 3D effects, parallax scrolling, fade-in transitions, hover effects
- **Accessibility**: WCAG AA compliant, keyboard navigation, reduce motion toggle, high contrast mode

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository or download the ZIP file

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL scripts in the `/scripts` folder in order:
     - `01-create-tables.sql`
     - `02-create-policies.sql`
     - `03-seed-data.sql`

4. Configure environment variables:
   - Add your Supabase credentials in the Vercel dashboard or `.env.local`:
     \`\`\`
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     \`\`\`
   - Add Stripe keys:
     \`\`\`
     STRIPE_SECRET_KEY=your_stripe_secret_key
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
     \`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

### First Admin User

After running the seed script, you can log in to the admin dashboard at `/admin/login` with:
- Email: `admin@kmci.org`
- Password: `kmci_admin_2024`

**Important**: Change this password immediately after first login.

## Database Schema

### Core Tables
- `profiles` - User profiles with roles
- `blog_posts` - Blog articles and testimonies
- `events` - Church events and conferences
- `event_rsvps` - Event registrations
- `sermons` - Sermon recordings and study guides
- `projects` - Development projects with progress tracking
- `donations` - Donation records
- `ministries` - Ministry information
- `audit_logs` - System activity tracking

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based access control (Super Admin, Editor, Finance)
- Audit logging for all admin actions

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Post-Deployment

1. Run database scripts in Supabase dashboard
2. Configure Stripe webhook endpoints
3. Update site URL in Supabase Auth settings
4. Test all integrations

## Accessibility

The site follows WCAG AA guidelines:
- Semantic HTML structure
- Keyboard navigation support
- Skip links for screen readers
- Alt text for all images
- Proper color contrast ratios
- Reduce motion toggle
- High contrast mode
- Large text option

## Performance

- Lazy loading for images and media
- Optimized fonts with `display: swap`
- Code splitting and dynamic imports
- Lighthouse score target: 90+

## Customization

### Colors
Edit the color tokens in `app/globals.css`:
\`\`\`css
:root {
  --ivory: oklch(0.97 0.01 85);
  --dark-blue: oklch(0.25 0.08 250);
  --gold: oklch(0.75 0.12 85);
}
\`\`\`

### Fonts
Change fonts in `app/layout.tsx`:
\`\`\`tsx
import { Cute_Font as Your_Font } from 'next/font/google'
\`\`\`

### Content
All content can be managed through the admin dashboard at `/admin`

## Support

For issues or questions:
- Email: admin@kmci.org
- Phone: +254 XXX XXX XXX

## License

Copyright © 2025 Kingdom Missions Center International. All rights reserved.
