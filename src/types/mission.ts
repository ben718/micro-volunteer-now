
export interface Mission {
  id: string
  association_id: string
  title: string
  description: string
  short_description: string
  category: string
  image_url?: string
  address: string
  city: string
  postal_code: string
  latitude?: number
  longitude?: number
  date: string
  start_time: string
  end_time: string
  duration: number
  spots_available: number
  spots_taken: number
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  requirements?: string[]
  skills_needed?: string[]
  languages_needed?: string[]
  materials_provided?: string[]
  materials_to_bring?: string[]
  is_recurring?: boolean
  recurring_pattern?: any
  impact_metrics?: any
  min_age?: number
  impact_description?: string
  created_at: string
  updated_at: string
  // Champs calculés
  association_name?: string
  association_logo?: string
  distance?: number
  is_urgent?: boolean
  location?: string
}

export interface UserMission extends Mission {
  registration_status: 'confirmed' | 'cancelled' | 'completed'
  registered_at: string
}
