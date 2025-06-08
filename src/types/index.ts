export interface Profile {
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
  created_at: string;
  updated_at: string;
}

export interface Association {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  logo_url?: string;
  website?: string;
  siret?: string;
  verified: boolean;
  categories: string[];
  impact_score?: number;
  total_missions_created?: number;
  total_volunteers_engaged?: number;
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  spots_available: number;
  spots_taken: number;
  category: string;
  association_id: string;
  association?: Association;
  address?: string;
  city?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  image_url?: string;
  requirements?: string[];
  materials_to_bring?: string[];
  materials_provided?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface MissionRegistration {
  id: string;
  mission_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  registration_date: string;
  mission?: Mission;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  related_entity_type?: 'mission' | 'registration' | 'association';
  related_entity_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  category: string;
  requirements: any;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
}

export interface LanguageLevel {
  id: string;
  user_id: string;
  language: string;
  level: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
} 