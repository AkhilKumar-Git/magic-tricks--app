# Supabase Database Setup Instructions

## Environment Variables
Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Database Schema

Run the following SQL commands in your Supabase SQL Editor to create the required tables:

### 1. Create Users Table

```sql
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

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
```

### 2. Create Magic Tricks Table

```sql
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

-- Create policies
CREATE POLICY "Magic tricks are viewable by everyone." ON magic_tricks
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own magic tricks." ON magic_tricks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own magic tricks." ON magic_tricks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own magic tricks." ON magic_tricks
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger for magic_tricks
CREATE TRIGGER magic_tricks_updated_at
  BEFORE UPDATE ON magic_tricks
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create index for better performance
CREATE INDEX magic_tricks_user_id_idx ON magic_tricks(user_id);
CREATE INDEX magic_tricks_difficulty_idx ON magic_tricks(difficulty);
CREATE INDEX magic_tricks_created_at_idx ON magic_tricks(created_at DESC);
```

### 3. Create a View for Magic Tricks with User Info

```sql
-- Create a view that joins magic tricks with user information
CREATE VIEW magic_tricks_with_users AS
SELECT 
  mt.*,
  u.name as user_name,
  u.profile as user_profile
FROM magic_tricks mt
JOIN users u ON mt.user_id = u.id;
```

## Authentication Setup

1. In your Supabase dashboard, go to Authentication > Settings
2. Enable email confirmations if desired
3. Configure any social auth providers you want to use
4. Set up email templates as needed

## Testing the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/auth` to test sign up/sign in
3. Navigate to `/magic-tricks` to test the magic tricks functionality

## Notes

- The `instructions` field uses JSONB to store an array of instruction steps
- Row Level Security (RLS) is enabled to ensure users can only modify their own data
- The database includes proper indexing for performance
- All timestamps are stored in UTC
- The `overall_rating` field is set up for future rating functionality
