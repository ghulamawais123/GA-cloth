-- ==============================================================================
-- GA CLOTH E-COMMERCE PLATFORM - SUPABASE UTILITY SCRIPT
-- File: 11_make_admin.sql
-- Description: Template script to promote a registered user to 'super_admin'.
-- Instructions:
--   1. Register or sign in first via the frontend application or Supabase Auth.
--   2. Replace 'your_email_here@example.com' below with your actual registered email.
--   3. Run this script in the Supabase SQL Editor.
-- Idempotency: Safe to re-run multiple times; handles upserts and checks existence.
-- ==============================================================================

DO $$
DECLARE
  -- >>> REPLACE THIS WITH YOUR REGISTERED EMAIL ADDRESS <<<
  target_email text := 'your_email_here@example.com';

  v_user_id uuid;
  v_full_name text;
BEGIN
  -- Normalize email
  target_email := lower(trim(target_email));

  -- 1. Find user in Supabase auth.users
  SELECT id, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', target_email)
  INTO v_user_id, v_full_name
  FROM auth.users
  WHERE lower(email) = target_email;

  IF v_user_id IS NULL THEN
    RAISE WARNING 'User with email "%" was NOT found in auth.users. Please sign up or create the account in Supabase Auth first, then run this script again.', target_email;
    RETURN;
  END IF;

  -- 2. Ensure user has a profile record
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (v_user_id, v_full_name, target_email)
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    updated_at = now();

  -- 3. Upsert super_admin role into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'super_admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'SUCCESS: User "%" (UUID: %) has been successfully elevated to "super_admin" for GA Cloth!', target_email, v_user_id;
END $$;

-- Verify query: list all elevated staff members
SELECT
  p.id,
  p.full_name,
  p.email,
  ur.role,
  ur.created_at AS assigned_at
FROM public.profiles p
JOIN public.user_roles ur ON ur.user_id = p.id
ORDER BY ur.created_at ASC;
