# Admin Setup Guide

## Creating the Admin User

To set up the admin account with password `KMCI@5202`:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter:
   - Email: `admin@kmci.org`
   - Password: `KMCI@5202`
   - Confirm password: `KMCI@5202`
5. Click **Create user**
6. Run the SQL script `scripts/04-create-admin-user.sql` to add the user to the admin_users table

### Option 2: Using Supabase Auth API

You can also create the user programmatically by visiting `/api/setup-admin` (create this endpoint if needed).

## Logging In

1. Navigate to `/admin/login`
2. Enter:
   - Email: `admin@kmci.org`
   - Password: `KMCI@5202`
3. Click **Sign In**
4. You'll be redirected to the admin dashboard

## Admin Features

Once logged in, you can:

- **Dashboard**: View statistics and recent activity
- **Events**: Create, edit, and delete events
- **Sermons**: Manage sermon library with videos and audio
- **Blog**: Publish and manage blog posts
- **Projects**: Track development projects and donations
- **Settings**: Configure site settings (coming soon)

## Security Notes

- Change the default password after first login
- Use strong, unique passwords for all admin accounts
- Enable two-factor authentication when available
- Regularly review admin user access and permissions
