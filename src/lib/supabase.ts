import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  max_distance?: number;
  availability?: any;
  interests?: string[];
  skills?: string[];
  languages?: string[];
  impact_score?: number;
  total_missions_completed?: number;
  total_hours_volunteered?: number;
  role: 'benevole' | 'association';
};

export type Mission = {
  id: string;
  association_id: string;
  title: string;
  description: string;
  short_description: string;
  category: string;
  image_url?: string;
  address: string;
  city: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  spots_available: number;
  spots_taken: number;
  min_age?: number;
  requirements?: string[];
  skills_needed?: string[];
  languages_needed?: string[];
  materials_provided?: string[];
  materials_to_bring?: string[];
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  is_recurring: boolean;
  recurring_pattern?: any;
  impact_description?: string;
  impact_metrics?: any;
}; 