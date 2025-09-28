import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on your schema
export interface User {
  id: string;
  name: string;
  profile: string;
  email: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface MagicTrick {
  id: string;
  user_id: string;
  instructions: string[];
  description: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  overall_rating: number;
  created_at: string;
  updated_at: string;
  user?: User;
}
