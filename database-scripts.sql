-- =====================================================
-- SUPABASE DATABASE SETUP SCRIPTS
-- =====================================================
-- Run these scripts in your Supabase SQL Editor
-- Make sure to run them in order!

-- =====================================================
-- 1. CREATE USERS TABLE
-- =====================================================

-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  profile TEXT DEFAULT '',
  email TEXT UNIQUE NOT NULL,
  bio TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Public profiles are viewable by everyone." ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON users
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- 2. CREATE MAGIC_TRICKS TABLE
-- =====================================================

-- Create magic_tricks table
CREATE TABLE magic_tricks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions JSONB NOT NULL DEFAULT '[]',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  overall_rating DECIMAL(3,2) DEFAULT 0.00 CHECK (overall_rating >= 0 AND overall_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE magic_tricks ENABLE ROW LEVEL SECURITY;

-- Create policies for magic_tricks table
CREATE POLICY "Magic tricks are viewable by everyone." ON magic_tricks
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own magic tricks." ON magic_tricks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own magic tricks." ON magic_tricks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own magic tricks." ON magic_tricks
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. CREATE UPDATED_AT TRIGGER FUNCTION
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. CREATE TRIGGERS
-- =====================================================

-- Create updated_at trigger for users
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create updated_at trigger for magic_tricks
CREATE TRIGGER magic_tricks_updated_at
  BEFORE UPDATE ON magic_tricks
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- =====================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Create indexes for better performance
CREATE INDEX magic_tricks_user_id_idx ON magic_tricks(user_id);
CREATE INDEX magic_tricks_difficulty_idx ON magic_tricks(difficulty);
CREATE INDEX magic_tricks_created_at_idx ON magic_tricks(created_at DESC);
CREATE INDEX users_email_idx ON users(email);

-- =====================================================
-- 6. CREATE VIEW FOR MAGIC TRICKS WITH USER INFO
-- =====================================================

-- Create a view that joins magic tricks with user information
CREATE VIEW magic_tricks_with_users AS
SELECT 
  mt.*,
  u.name as user_name,
  u.profile as user_profile,
  u.bio as user_bio
FROM magic_tricks mt
JOIN users u ON mt.user_id = u.id;

-- =====================================================
-- 7. INSERT SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Insert sample magic tricks (you can remove this section if you don't want sample data)
-- Note: These will only work after you have users in the system

-- Sample magic tricks (uncomment and modify user_id after creating a user)
/*
INSERT INTO magic_tricks (user_id, title, description, instructions, difficulty, overall_rating) VALUES
(
  'your-user-id-here', -- Replace with actual user ID
  'The Vanishing Coin',
  'Make a coin disappear right before your audience''s eyes!',
  '["Hold the coin between your thumb and index finger", "Pretend to place it in your other hand", "Actually keep it hidden in your original hand", "Open your \"empty\" hand to show the coin has vanished"]',
  'Easy',
  4.5
),
(
  'your-user-id-here', -- Replace with actual user ID
  'Mind Reading Numbers',
  'Guess any number your audience is thinking of!',
  '["Ask someone to think of a number between 1-10", "Have them multiply by 2", "Add 8 to the result", "Divide by 2", "Subtract their original number", "The answer will always be 4!"]',
  'Easy',
  4.2
),
(
  'your-user-id-here', -- Replace with actual user ID
  'The Floating Card',
  'Make a playing card float in mid-air!',
  '["Hold a card between your thumb and middle finger", "Use your index finger to gently push the card up", "Practice the motion to make it look like the card is floating", "Add a slight wrist movement for extra effect"]',
  'Medium',
  4.0
);
*/

-- =====================================================
-- 8. CREATE STORAGE BUCKETS
-- =====================================================

-- Create profile_pictures bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile_pictures',
  'profile_pictures',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create user_videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user_videos',
  'user_videos',
  true,
  52428800, -- 50MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 9. CREATE STORAGE POLICIES
-- =====================================================

-- Profile pictures policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Profile pictures are publicly accessible" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;
  
  -- Create new policies
  CREATE POLICY "Profile pictures are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile_pictures');

  CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile_pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

  CREATE POLICY "Users can update their own profile pictures" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile_pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

  CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile_pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
END $$;

-- User videos policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "User videos are publicly accessible" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload their own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;
  
  -- Create new policies
  CREATE POLICY "User videos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'user_videos');

  CREATE POLICY "Users can upload their own videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user_videos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

  CREATE POLICY "Users can update their own videos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user_videos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

  CREATE POLICY "Users can delete their own videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user_videos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
END $$;

-- =====================================================
-- 10. UPDATE USERS TABLE FOR STORAGE URLS
-- =====================================================

-- Add a comment to clarify that profile field now stores Supabase storage URLs
COMMENT ON COLUMN users.profile IS 'Supabase storage URL for profile picture';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these queries to verify your setup:

-- Check if tables were created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'magic_tricks');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'magic_tricks');

-- Check if policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'magic_tricks');

-- Check if indexes were created
SELECT indexname, tablename, indexdef 
FROM pg_indexes 
WHERE tablename IN ('users', 'magic_tricks');

-- Check if storage buckets were created
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets 
WHERE id IN ('profile_pictures', 'user_videos');

-- Check if storage policies were created (if storage schema exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    -- Check storage policies
    PERFORM 1 FROM pg_policies WHERE policyname LIKE '%profile_pictures%' OR policyname LIKE '%user_videos%';
    IF FOUND THEN
      RAISE NOTICE 'Storage policies created successfully';
    ELSE
      RAISE NOTICE 'No storage policies found - this might be normal if storage is not fully configured';
    END IF;
  ELSE
    RAISE NOTICE 'Storage schema does not exist - this is normal for some Supabase setups';
  END IF;
END $$;
