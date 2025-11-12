/*
  # Add Password Authentication System

  1. Changes
    - Enable pgcrypto extension for bcrypt password hashing
    - Add password_hash column to users table
    - Add last_password_change timestamp column
    - Create secure password hashing and verification functions
    - Create user authentication function
    - Create password change and reset functions

  2. Security
    - Passwords are hashed using bcrypt (via pgcrypto)
    - Functions are marked as SECURITY DEFINER for controlled access
    - Last password change tracking for security auditing
*/

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add password_hash column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ADD COLUMN password_hash text;
  END IF;
END $$;

-- Add last_password_change column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'last_password_change'
  ) THEN
    ALTER TABLE users ADD COLUMN last_password_change timestamptz DEFAULT now();
  END IF;
END $$;

-- Function to hash a password using bcrypt
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify a password against a hash
CREATE OR REPLACE FUNCTION public.verify_password(password text, password_hash text)
RETURNS boolean AS $$
BEGIN
  RETURN password_hash = crypt(password, password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to authenticate a user
CREATE OR REPLACE FUNCTION public.authenticate_user(
  user_email text,
  user_password text
)
RETURNS TABLE (
  success boolean,
  user_id uuid,
  user_data jsonb,
  error_message text
) AS $$
DECLARE
  v_user record;
  v_password_valid boolean;
BEGIN
  -- Find user by email
  SELECT * INTO v_user
  FROM users
  WHERE email = user_email
  LIMIT 1;

  -- Check if user exists
  IF v_user.id IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::jsonb, 'Invalid email or password'::text;
    RETURN;
  END IF;

  -- Check if password hash exists
  IF v_user.password_hash IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::jsonb, 'Password not set for this user'::text;
    RETURN;
  END IF;

  -- Verify password
  v_password_valid := public.verify_password(user_password, v_user.password_hash);

  IF NOT v_password_valid THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::jsonb, 'Invalid email or password'::text;
    RETURN;
  END IF;

  -- Update last login timestamp
  UPDATE users 
  SET last_login = now()::text,
      updated_at = now()
  WHERE id = v_user.id;

  -- Return success with user data
  RETURN QUERY SELECT 
    true,
    v_user.id,
    jsonb_build_object(
      'id', v_user.user_id,
      'email', v_user.email,
      'name', v_user.name,
      'organizationId', v_user.organization_id,
      'departmentId', v_user.department_id,
      'role', v_user.role,
      'department', v_user.department,
      'permissions', v_user.permissions,
      'lastLogin', now()::text
    ),
    NULL::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to change user password
CREATE OR REPLACE FUNCTION public.change_user_password(
  user_email text,
  old_password text,
  new_password text
)
RETURNS TABLE (
  success boolean,
  error_message text
) AS $$
DECLARE
  v_user record;
  v_password_valid boolean;
BEGIN
  -- Find user by email
  SELECT * INTO v_user
  FROM users
  WHERE email = user_email
  LIMIT 1;

  -- Check if user exists
  IF v_user.id IS NULL THEN
    RETURN QUERY SELECT false, 'User not found'::text;
    RETURN;
  END IF;

  -- Verify old password
  v_password_valid := public.verify_password(old_password, v_user.password_hash);

  IF NOT v_password_valid THEN
    RETURN QUERY SELECT false, 'Current password is incorrect'::text;
    RETURN;
  END IF;

  -- Update password
  UPDATE users 
  SET password_hash = public.hash_password(new_password),
      last_password_change = now(),
      updated_at = now()
  WHERE id = v_user.id;

  RETURN QUERY SELECT true, NULL::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset user password (admin function)
CREATE OR REPLACE FUNCTION public.reset_user_password(
  user_email text,
  new_password text
)
RETURNS TABLE (
  success boolean,
  error_message text
) AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Find user by email
  SELECT id INTO v_user_id
  FROM users
  WHERE email = user_email
  LIMIT 1;

  -- Check if user exists
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User not found'::text;
    RETURN;
  END IF;

  -- Update password
  UPDATE users 
  SET password_hash = public.hash_password(new_password),
      last_password_change = now(),
      updated_at = now()
  WHERE id = v_user_id;

  RETURN QUERY SELECT true, NULL::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON FUNCTION public.hash_password IS 'Hashes a password using bcrypt';
COMMENT ON FUNCTION public.verify_password IS 'Verifies a password against a bcrypt hash';
COMMENT ON FUNCTION public.authenticate_user IS 'Authenticates a user with email and password';
COMMENT ON FUNCTION public.change_user_password IS 'Allows users to change their own password';
COMMENT ON FUNCTION public.reset_user_password IS 'Admin function to reset a user password';