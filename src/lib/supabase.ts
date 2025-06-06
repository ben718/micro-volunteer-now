import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables d\'environnement Supabase sont manquantes')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Fonctions d'aide pour les missions
export const missionService = {
  // Récupérer les missions disponibles
  getAvailableMissions: async () => {
    const { data, error } = await supabase
      .from('available_missions')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Récupérer les missions à venir pour l'utilisateur connecté (utilise la vue RLS)
  getUserUpcomingMissions: async () => {
    const { data, error } = await supabase
      .from('user_upcoming_missions')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Récupérer les missions passées pour l'utilisateur connecté (utilise la vue RLS)
  getUserPastMissions: async () => {
    const { data, error } = await supabase
      .from('user_past_missions')
      .select('*')
      .order('date', { ascending: false }); // Trier par date descendante pour les missions passées

    if (error) throw error;
    return data;
  },

  // Rechercher des missions à proximité
  searchNearbyMissions: async (params: {
    latitude: number
    longitude: number
    distance?: number
    category?: string
    dateStart?: string
    dateEnd?: string
    durationMax?: number
    language?: string
  }) => {
    const { data, error } = await supabase
      .rpc('search_nearby_missions', {
        p_latitude: params.latitude,
        p_longitude: params.longitude,
        p_distance: params.distance,
        p_category: params.category,
        p_date_start: params.dateStart,
        p_date_end: params.dateEnd,
        p_duration_max: params.durationMax,
        p_language: params.language
      })
    
    if (error) throw error
    return data
  },

  // S'inscrire à une mission
  registerForMission: async (missionId: string) => {
    const { data, error } = await supabase
      .rpc('register_for_mission', {
        p_mission_id: missionId
      })
    
    if (error) throw error
    return data
  },

  // Annuler une inscription
  cancelRegistration: async (missionId: string, reason?: string) => {
    const { data, error } = await supabase
      .rpc('cancel_mission_registration', {
        p_mission_id: missionId,
        p_reason: reason
      })
    
    if (error) throw error
    return data
  }
}

// Fonctions d'aide pour les profils
export const profileService = {
  // Récupérer le profil de l'utilisateur connecté
  getCurrentProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) throw error
    return data
  },

  // Mettre à jour le profil
  updateProfile: async (updates: Database['public']['Tables']['profiles']['Update']) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Ajouter une langue au profil
  addLanguage: async (language: string, level: string, isPrimary: boolean = false) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { data, error } = await supabase
      .rpc('add_language_to_profile', {
        p_language: language,
        p_level: level,
        p_is_primary: isPrimary
      })
    
    if (error) throw error
    return data
  }
}

// Fonctions d'aide pour l'authentification
export const authService = {
  // Inscription
  signUp: async (email: string, password: string, metadata: {
    firstName: string
    lastName: string
    role: 'benevole' | 'association'
    languages?: string[]
    associationName?: string
    siret?: string
    description?: string
    address?: string
    city?: string
    postalCode?: string
    phone?: string
    contactName?: string
    contactRole?: string
    contactEmail?: string
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    return data
  },

  // Connexion
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Déconnexion
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getCategoryById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createCategory(category: {
    name: string;
    icon: string;
    color: string;
    description?: string;
  }) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, category: {
    name?: string;
    icon?: string;
    color?: string;
    description?: string;
  }) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}; 