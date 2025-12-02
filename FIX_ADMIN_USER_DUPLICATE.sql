-- =====================================================
-- FIX ADMIN USER DUPLICATE ERROR
-- This script safely handles the duplicate admin user issue
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
    existing_admin_id UUID := '27d501f7-2661-4cbe-a05a-02cb49292ac2';
    admin_email TEXT := 'admin@kmci.org';
    admin_password TEXT := '@adminKMCI';  -- Updated password as per latest requirements
    admin_name TEXT := 'AdminKMCI';       -- Updated username as per latest requirements
    user_exists BOOLEAN := FALSE;
    profile_exists BOOLEAN := FALSE;
BEGIN
    -- Check if the user already exists in auth.users
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = existing_admin_id OR email = admin_email)
    INTO user_exists;

    -- Check if profile exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = existing_admin_id OR email = admin_email)
    INTO profile_exists;

    RAISE NOTICE 'User exists: %, Profile exists: %', user_exists, profile_exists;

    -- If user exists, update their credentials instead of creating new
    IF user_exists THEN
        RAISE NOTICE 'Updating existing admin user...';

        -- Update the existing user's password and ensure they're active
        UPDATE auth.users
        SET
            encrypted_password = crypt(admin_password, gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            updated_at = NOW(),
            raw_app_meta_data = '{"provider": "email", "providers": ["email"]}',
            raw_user_meta_data = '{}'
        WHERE id = existing_admin_id OR email = admin_email;

        -- Update or create profile
        IF profile_exists THEN
            UPDATE profiles
            SET
                full_name = admin_name,
                role = 'super_admin',
                updated_at = NOW()
            WHERE id = existing_admin_id OR email = admin_email;
        ELSE
            -- Get the actual user ID in case it's different
            SELECT id INTO existing_admin_id FROM auth.users WHERE email = admin_email LIMIT 1;

            INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
            VALUES (existing_admin_id, admin_email, admin_name, 'super_admin', NOW(), NOW());
        END IF;

        RAISE NOTICE '✅ Admin user updated successfully!';

    ELSE
        RAISE NOTICE 'Creating new admin user...';

        -- Generate a new UUID to avoid conflicts
        existing_admin_id := gen_random_uuid();

        -- Create new admin user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password,
            email_confirmed_at, confirmation_sent_at, recovery_sent_at,
            email_change_sent_at, last_sign_in_at, raw_app_meta_data,
            raw_user_meta_data, is_super_admin, created_at, updated_at,
            phone, phone_confirmed_at, phone_change, phone_change_token,
            phone_change_sent_at, email_change, email_change_token_new,
            email_change_token_current, confirmation_token, recovery_token,
            reauthentication_token, reauthentication_sent_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            existing_admin_id,
            'authenticated',
            'authenticated',
            admin_email,
            crypt(admin_password, gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{}',
            FALSE,
            NOW(),
            NOW(),
            NULL,
            NULL,
            '',
            '',
            NULL,
            '',
            '',
            '',
            '',
            '',
            '',
            NULL
        );

        -- Create profile
        INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (existing_admin_id, admin_email, admin_name, 'super_admin', NOW(), NOW());

        RAISE NOTICE '✅ New admin user created successfully!';
    END IF;

    -- Output final credentials
    RAISE NOTICE '================================================';
    RAISE NOTICE '🎯 ADMIN LOGIN CREDENTIALS:';
    RAISE NOTICE '📧 Email: %', admin_email;
    RAISE NOTICE '👤 Username: %', admin_name;
    RAISE NOTICE '🔑 Password: %', admin_password;
    RAISE NOTICE '🆔 User ID: %', existing_admin_id;
    RAISE NOTICE '🌐 Admin URL: /admin';
    RAISE NOTICE '================================================';
    RAISE NOTICE '⚠️  IMPORTANT: Change password after first login!';
    RAISE NOTICE '================================================';

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Error occurred: %', SQLERRM;
    RAISE NOTICE 'Attempting alternative approach...';

    -- Alternative approach: Delete everything and recreate
    DELETE FROM profiles WHERE email = admin_email;
    DELETE FROM auth.users WHERE email = admin_email;

    -- Generate new UUID
    existing_admin_id := gen_random_uuid();

    -- Create fresh admin user
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, confirmation_sent_at, recovery_sent_at,
        email_change_sent_at, last_sign_in_at, raw_app_meta_data,
        raw_user_meta_data, is_super_admin, created_at, updated_at,
        phone, phone_confirmed_at, phone_change, phone_change_token,
        phone_change_sent_at, email_change, email_change_token_new,
        email_change_token_current, confirmation_token, recovery_token,
        reauthentication_token, reauthentication_sent_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        existing_admin_id,
        'authenticated',
        'authenticated',
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{}',
        FALSE,
        NOW(),
        NOW(),
        NULL,
        NULL,
        '',
        '',
        NULL,
        '',
        '',
        '',
        '',
        '',
        '',
        NULL
    );

    -- Create profile
    INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (existing_admin_id, admin_email, admin_name, 'super_admin', NOW(), NOW());

    RAISE NOTICE '✅ Fresh admin user created via alternative method!';
    RAISE NOTICE '📧 Email: %', admin_email;
    RAISE NOTICE '🔑 Password: %', admin_password;
    RAISE NOTICE '🆔 New User ID: %', existing_admin_id;

END $$;

-- Ensure profiles table has the correct structure
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;

    -- Ensure role constraint is correct
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
        CHECK (role IN ('super_admin', 'editor', 'finance', 'viewer'));

    RAISE NOTICE '✅ Profiles table structure verified';

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Profiles table adjustment: %', SQLERRM;
END $$;

-- Verify the admin user was created/updated successfully
DO $$
DECLARE
    admin_count INTEGER;
    admin_id UUID;
BEGIN
    SELECT COUNT(*), MIN(id)
    INTO admin_count, admin_id
    FROM profiles
    WHERE role = 'super_admin' AND email = 'admin@kmci.org';

    IF admin_count > 0 THEN
        RAISE NOTICE '✅ VERIFICATION PASSED: % super admin(s) found', admin_count;
        RAISE NOTICE '👤 Admin User ID: %', admin_id;
    ELSE
        RAISE NOTICE '❌ VERIFICATION FAILED: No super admin found';
    END IF;
END $$;
