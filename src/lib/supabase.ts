
import { supabase } from '@/integrations/supabase/client'

// Fonctions d'aide pour les missions
export const missionService = {
  // Récupérer les missions disponibles
  getAvailableMissions: async () => {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // Récupérer les missions à venir pour l'utilisateur connecté
  getUserUpcomingMissions: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { data, error } = await supabase
      .from('mission_registrations')
      .select(`
        *,
        mission:missions(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(reg => reg.mission) || []
  },

  // Récupérer les missions passées pour l'utilisateur connecté
  getUserPastMissions: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { data, error } = await supabase
      .from('mission_registrations')
      .select(`
        *,
        mission:missions(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(reg => reg.mission) || []
  },

  // Rechercher des missions à proximité
  searchNearbyMissions: async (params: {
    latitude?: number
    longitude?: number
    distance?: number
    category?: string
    dateStart?: string
    dateEnd?: string
    durationMax?: number
    language?: string
  }) => {
    let query = supabase
      .from('missions')
      .select('*')
      .eq('status', 'published')

    if (params.category && params.category !== 'all') {
      query = query.eq('category', params.category)
    }

    if (params.durationMax) {
      query = query.lte('duration', params.durationMax)
    }

    const { data, error } = await query.order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // S'inscrire à une mission
  registerForMission: async (missionId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { data, error } = await supabase
      .from('mission_registrations')
      .insert({
        mission_id: missionId,
        user_id: user.id,
        status: 'confirmed'
      })
      .select()
    
    if (error) throw error
    return data
  },

  // Annuler une inscription
  cancelRegistration: async (missionId: string, reason?: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { data, error } = await supabase
      .from('mission_registrations')
      .update({ 
        status: 'cancelled',
        cancelled_reason: reason 
      })
      .eq('mission_id', missionId)
      .eq('user_id', user.id)
      .select()
    
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
  updateProfile: async (updates: any) => {
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
  }
}

// Fonctions d'aide pour l'authentification
export const authService = {
  // Inscription
  signUp: async (email: string, password: string, metadata: any) => {
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
      .eq('active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }
}

export { supabase }
