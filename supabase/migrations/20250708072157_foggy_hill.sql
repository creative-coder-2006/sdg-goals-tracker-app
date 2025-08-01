/*
  # Fix User Signup Trigger

  1. Problem
    - The handle_new_user() function has issues with profile creation
    - Missing proper error handling for user metadata
    - Function may not be properly handling all required fields

  2. Solution
    - Update the handle_new_user() function to properly handle profile creation
    - Ensure all required fields are populated with appropriate defaults
    - Add better error handling for missing metadata

  3. Changes
    - Drop and recreate the handle_new_user() function with improved logic
    - Ensure the trigger is properly configured
*/

-- Drop existing function and trigger to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, level, streak_days, total_actions, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'User' || substr(NEW.id::text, 1, 8)),
    1,
    0,
    0,
    now(),
    now()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();