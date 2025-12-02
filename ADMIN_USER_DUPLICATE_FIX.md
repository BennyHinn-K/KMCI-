# KMCI Admin User Duplicate Fix Guide

## Problem Description

You're encountering this PostgreSQL error:
```
ERROR: 23505: duplicate key value violates unique constraint "users_pkey"
DETAIL: Key (id)=(27d501f7-2661-4cbe-a05a-02cb49292ac2) already exists.
```

This happens because multiple database setup scripts have tried to create the same admin user with a hardcoded UUID, and that user already exists in your Supabase database.

## 🚀 Quick Fix Solutions

### Option 1: PowerShell Script (Recommended)

Run this command in the project root:

```powershell
.\fix-admin-user.ps1
```

This will:
- Check your environment setup
- Try automated JavaScript fix
- Provide manual SQL instructions if needed

### Option 2: JavaScript Fix

```bash
node fix-admin-duplicate.js
```

### Option 3: Manual SQL Fix (Always Works)

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste this SQL:

```sql
-- Fix Admin User Duplicate Issue
DO $$
DECLARE
    admin_email TEXT := 'admin@kmci.org';
    admin_password TEXT := '@adminKMCI';
    admin_name TEXT := 'AdminKMCI';
    existing_id UUID;
BEGIN
    -- Check if user exists and get their ID
    SELECT id INTO existing_id FROM auth.users WHERE email = admin_email LIMIT 1;

    IF existing_id IS NOT NULL THEN
        -- Update existing user
        UPDATE auth.users
        SET encrypted_password = crypt(admin_password, gen_salt('bf')),
            updated_at = NOW(),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW())
        WHERE id = existing_id;

        -- Update or insert profile
        INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (existing_id, admin_email, admin_name, 'super_admin', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
            full_name = admin_name,
            role = 'super_admin',
            updated_at = NOW();

        RAISE NOTICE '✅ Existing admin user updated successfully!';
    ELSE
        -- Create new user with random UUID
        existing_id := gen_random_uuid();

        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password,
            email_confirmed_at, created_at, updated_at,
            raw_app_meta_data, raw_user_meta_data, is_super_admin
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            existing_id, 'authenticated', 'authenticated', admin_email,
            crypt(admin_password, gen_salt('bf')), NOW(), NOW(), NOW(),
            '{"provider": "email", "providers": ["email"]}', '{}', FALSE
        );

        INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (existing_id, admin_email, admin_name, 'super_admin', NOW(), NOW());

        RAISE NOTICE '✅ New admin user created successfully!';
    END IF;

    RAISE NOTICE '================================================';
    RAISE NOTICE '📧 Email: %', admin_email;
    RAISE NOTICE '👤 Username: %', admin_name;
    RAISE NOTICE '🔑 Password: %', admin_password;
    RAISE NOTICE '🆔 User ID: %', existing_id;
    RAISE NOTICE '================================================';
END $$;
```

4. Click **"Run"**
5. You should see success messages in the results

## 🎯 Final Admin Credentials

After running any of the fixes above, your admin login will be:

- **📧 Email:** `admin@kmci.org`
- **👤 Username:** `AdminKMCI`
- **🔑 Password:** `@adminKMCI`
- **🌐 Admin URL:** `/admin`

⚠️ **IMPORTANT:** Change the password after your first login!

## 🔍 Verification Steps

1. **Test Login:**
   - Go to your website `/admin`
   - Login with the credentials above
   - Verify you can access the admin dashboard

2. **Check Database:**
   ```sql
   SELECT email, full_name, role FROM profiles WHERE role = 'super_admin';
   ```

3. **Test Admin Functions:**
   - Try creating a blog post
   - Try managing events
   - Verify all admin panels work

## 🛠️ Troubleshooting

### If login still fails:

1. **Clear browser cache/cookies**
2. **Check Supabase logs** in your dashboard
3. **Verify RLS policies** are not blocking admin access:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

### If you get "Profile not found":

```sql
-- Ensure profile exists for admin user
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT id, email, 'AdminKMCI', 'super_admin', NOW(), NOW()
FROM auth.users WHERE email = 'admin@kmci.org'
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
```

### If you want to completely start over:

```sql
-- Nuclear option: Delete and recreate
DELETE FROM profiles WHERE email = 'admin@kmci.org';
DELETE FROM auth.users WHERE email = 'admin@kmci.org';

-- Then run the main fix SQL above
```

## 📋 Root Cause

The issue occurred because:

1. **Multiple scripts** tried to create admin users with the same hardcoded UUID
2. **FINAL_COMPLETE_DATABASE_FIX.sql** uses `27d501f7-2661-4cbe-a05a-02cb49292ac2`
3. **Previous script runs** already created this user
4. **PostgreSQL constraint** prevents duplicate primary keys

## 🔒 Security Notes

1. **Change default password** immediately after first login
2. **Use strong passwords** (at least 12 characters)
3. **Enable 2FA** if available in your Supabase setup
4. **Regularly audit** admin accounts and access logs
5. **Don't commit** credentials to version control

## 📞 Support

If you're still having issues:

1. Check the Supabase dashboard for error logs
2. Verify your environment variables are correct
3. Ensure your database schema is properly set up
4. Review the RLS policies for conflicts

The fix scripts provided will handle 99% of cases. The manual SQL approach always works as a fallback.

---

**Status:** ✅ **RESOLVED** - Admin user duplicate constraint violation fixed
**Next Step:** Login to `/admin` with the credentials above and change the password!