
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
  start_time: string
  end_time: string
  duration: number
  spots_available: number
  spots_taken: number
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  requirements?: string
  language?: string
  is_urgent: boolean
  created_at: string
  updated_at: string
  // Champs calculés
  association_name?: string
  distance?: number
  isUrgent?: boolean
}

export interface UserMission extends Mission {
  registration_status: 'confirmed' | 'cancelled' | 'completed'
  registered_at: string
}
