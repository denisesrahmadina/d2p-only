/*
  # Add Authentication User ID to Users Table

  1. Changes
    - Add `auth_user_id` column to link with auth.users
    - Make auth_user_id nullable initially to allow existing data
    - Add unique constraint on auth_user_id
    - Add index for faster lookups
    - Add function to automatically create public.users record when auth user is created

  2. Security
    - Maintain existing RLS policies
    - Add trigger to sync auth.users with public.users table
*/

-- Add auth_user_id column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE users ADD COLUMN auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add unique constraint on auth_user_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_auth_user_id_key'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_auth_user_id_key UNIQUE (auth_user_id);
  END IF;
END $$;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Function to handle new user creation in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user already exists in public.users
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = NEW.email) THEN
    -- Insert new user record
    INSERT INTO public.users (
      user_id,
      auth_user_id,
      email,
      name,
      organization_id,
      department_id,
      role,
      department,
      permissions
    ) VALUES (
      'user-' || substring(NEW.id::text, 1, 8),
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'organization_id', 'indonesia-power'),
      COALESCE(NEW.raw_user_meta_data->>'department_id', 'ip-procurement'),
      COALESCE(NEW.raw_user_meta_data->>'role', 'User'),
      COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
      COALESCE((NEW.raw_user_meta_data->>'permissions')::jsonb, '["procurement-operations"]'::jsonb)
    );
  ELSE
    -- Update existing user with auth_user_id
    UPDATE public.users 
    SET auth_user_id = NEW.id,
        updated_at = now()
    WHERE email = NEW.email AND auth_user_id IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Add comment
COMMENT ON COLUMN users.auth_user_id IS 'Links to auth.users table for authentication';