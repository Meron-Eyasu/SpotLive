import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  venue: string;
  date: string;
  time: string;
  category: string;
  image_url: string;
  created_at: string;
  organizer?: string;
  detailed_about?: string;
  user_id?: string;
}
