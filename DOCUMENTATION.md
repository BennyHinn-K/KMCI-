# KMCI Website - Technical Documentation

## Architecture Overview

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Rendering**: Server Components by default, Client Components for interactivity
- **State Management**: React hooks, SWR for data fetching
- **Styling**: Tailwind CSS v4 with custom design tokens

### Backend Architecture
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with middleware
- **API Routes**: Next.js Route Handlers
- **File Storage**: Vercel Blob (for media uploads)

### Security Architecture
- **Row Level Security**: Enabled on all Supabase tables
- **Role-Based Access Control**: Three roles (Super Admin, Editor, Finance)
- **Audit Logging**: All admin actions tracked
- **CSRF Protection**: Built into Next.js
- **XSS Prevention**: React's built-in escaping

## Database Schema Details

### Profiles Table
Stores user information and roles.
\`\`\`sql
- id (uuid, primary key)
- email (text, unique)
- full_name (text)
- role (text: 'super_admin', 'editor', 'finance')
- created_at (timestamp)
- updated_at (timestamp)
\`\`\`

### Blog Posts Table
\`\`\`sql
- id (uuid, primary key)
- title (text)
- slug (text, unique)
- content (text)
- excerpt (text)
- featured_image (text)
- category (text)
- author_id (uuid, foreign key to profiles)
- published (boolean)
- created_at (timestamp)
- updated_at (timestamp)
\`\`\`

### Events Table
\`\`\`sql
- id (uuid, primary key)
- title (text)
- description (text)
- start_date (timestamp)
- end_date (timestamp)
- location (text)
- image (text)
- capacity (integer)
- category (text)
- created_at (timestamp)
\`\`\`

### Sermons Table
\`\`\`sql
- id (uuid, primary key)
- title (text)
- speaker (text)
- date (date)
- video_url (text)
- audio_url (text)
- thumbnail (text)
- description (text)
- scripture (text)
- study_guide_url (text)
- tags (text[])
- created_at (timestamp)
\`\`\`

### Projects Table
\`\`\`sql
- id (uuid, primary key)
- title (text)
- description (text)
- goal_amount (numeric)
- raised_amount (numeric)
- image (text)
- category (text)
- status (text)
- start_date (date)
- end_date (date)
- created_at (timestamp)
\`\`\`

### Donations Table
\`\`\`sql
- id (uuid, primary key)
- donor_name (text)
- donor_email (text)
- amount (numeric)
- currency (text)
- payment_method (text)
- project_id (uuid, nullable)
- recurring (boolean)
- status (text)
- stripe_payment_id (text)
- created_at (timestamp)
\`\`\`

## API Endpoints

### Public Endpoints
- `GET /api/events` - List all upcoming events
- `POST /api/events/rsvp` - Submit event RSVP
- `GET /api/sermons` - List sermons with filters
- `GET /api/blog` - List blog posts
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Subscribe to newsletter
- `POST /api/donate` - Process donation

### Admin Endpoints (Protected)
- `POST /api/admin/blog` - Create blog post
- `PUT /api/admin/blog/[id]` - Update blog post
- `DELETE /api/admin/blog/[id]` - Delete blog post
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/[id]` - Update event
- `POST /api/admin/sermons` - Create sermon
- `GET /api/admin/donations` - List donations (Finance/Super Admin only)
- `GET /api/admin/audit` - View audit log (Super Admin only)

## Authentication Flow

### User Login
1. User submits email/password at `/admin/login`
2. Client calls `supabase.auth.signInWithPassword()`
3. Supabase returns session tokens
4. Middleware validates session on protected routes
5. User redirected to `/admin` dashboard

### Session Management
- Sessions stored in HTTP-only cookies
- Middleware refreshes tokens automatically
- Sessions expire after 1 hour of inactivity
- Refresh tokens valid for 7 days

### Role-Based Access
\`\`\`typescript
// Check user role in Server Component
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile.role !== 'super_admin') {
  // Restrict access
}
\`\`\`

## Component Structure

### Page Components (Server Components)
- Fetch data directly from Supabase
- Pass data to Client Components as props
- Handle initial page load

### Client Components
- Handle user interactions
- Manage local state
- Perform client-side data mutations

### Shared Components
- UI components from shadcn/ui
- Custom components in `/components`
- Reusable across pages

## Styling Guidelines

### Design Tokens
All colors defined in `globals.css`:
\`\`\`css
--ivory: oklch(0.97 0.01 85)
--dark-blue: oklch(0.25 0.08 250)
--gold: oklch(0.75 0.12 85)
\`\`\`

### Typography Scale
- Display: 3xl-6xl (Playfair Display)
- Headings: xl-2xl (Playfair Display)
- Body: sm-base (Inter)
- Small: xs (Inter)

### Spacing Scale
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### Animation Guidelines
- Duration: 300-600ms for most transitions
- Easing: ease-out for entrances, ease-in for exits
- Respect `prefers-reduced-motion`
- Use `animate-fade-in-up` for section entrances

## Performance Optimization

### Image Optimization
\`\`\`tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
\`\`\`

### Code Splitting
\`\`\`tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false
})
\`\`\`

### Data Fetching
- Use Server Components for initial data
- Use SWR for client-side data that needs revalidation
- Implement pagination for large lists

## Deployment Checklist

### Pre-Deployment
- [ ] Run database migrations
- [ ] Test all forms and submissions
- [ ] Verify payment integration
- [ ] Check mobile responsiveness
- [ ] Test accessibility features
- [ ] Run Lighthouse audit
- [ ] Test admin dashboard

### Environment Variables
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=
\`\`\`

### Post-Deployment
- [ ] Configure Stripe webhooks
- [ ] Set up email notifications
- [ ] Configure backup schedule
- [ ] Monitor error logs
- [ ] Test production build

## Maintenance

### Regular Tasks
- Weekly: Review audit logs
- Monthly: Database backup verification
- Quarterly: Security audit
- Annually: Dependency updates

### Monitoring
- Vercel Analytics for traffic
- Supabase Dashboard for database health
- Error tracking with Vercel
- Uptime monitoring

## Troubleshooting

### Common Issues

**Issue**: Admin login fails
- Check Supabase credentials
- Verify user exists in profiles table
- Check browser console for errors

**Issue**: Donations not processing
- Verify Stripe keys are correct
- Check Stripe webhook configuration
- Review Stripe dashboard for errors

**Issue**: Images not loading
- Check Vercel Blob configuration
- Verify image URLs are correct
- Check file size limits

## Future Enhancements

### Planned Features
- Multi-language support (Kiswahili)
- Mobile app (React Native)
- Live streaming integration
- Advanced analytics dashboard
- Email campaign integration
- SMS notifications for events

### Technical Debt
- Add comprehensive test suite
- Implement caching strategy
- Optimize database queries
- Add error boundary components
- Improve loading states
\`\`\`

```json file="" isHidden
