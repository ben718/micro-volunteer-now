export interface Mission {
  id: string;
  title: string;
  description: string;
  association: string;
  association_name?: string;
  association_logo?: string;
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
  spots_taken: number;
  spots_available: number;
  min_age?: number;
  requirements?: string[];
  skills_needed?: string[];
  languages_needed?: string[];
  materials_provided?: string[];
  materials_to_bring?: string[];
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  is_recurring?: boolean;
  recurring_pattern?: any;
  impact_description?: string;
  impact_metrics?: any;
  created_at: string;
  updated_at: string;
  isUrgent?: boolean;
  registration_status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  feedback?: string;
  rating?: number;
}

export interface UserStats {
  missions: number;
  timeGiven: string;
  associations: number;
}

export interface Badge {
  name: string;
  icon: string;
  color: string;
  earned: boolean;
}

export interface Category {
  name: string;
  icon: string;
  color: string;
  active?: boolean;
}

export interface Association {
  name: string;
  missions: number;
  avatar: string;
}
