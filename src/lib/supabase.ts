
import { supabase } from '@/integrations/supabase/client'
import { logger } from './logger'

// Types d'erreurs standardisés
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, code?: string, originalError?: any) {
    super(message, code, 401, originalError);
    this.name = 'AuthError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, originalError?: any) {
    super(message, 'NETWORK_ERROR', 0, originalError);
    this.name = 'NetworkError';
  }
}

// Utilitaire pour gérer les erreurs Supabase
const handleSupabaseError = (error: any, context: string): never => {
  logger.error(`Supabase error in ${context}`, error);
  
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    throw new NetworkError('Problème de connexion. Vérifiez votre connexion internet.', error);
  }
  
  if (error.status === 401 || error.message?.includes('auth')) {
    throw new AuthError('Problème d\'authentification. Veuillez vous reconnecter.', error.code, error);
  }
  
  throw new AppError(
    error.message || 'Une erreur inattendue s\'est produite',
    error.code,
    error.status,
    error
  );
};

// Fonctions d'aide pour les missions
export const missionService = {
  // Récupérer les missions disponibles
  getAvailableMissions: async () => {
    try {
      logger.debug('Fetching available missions');
      
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: true })
      
      if (error) handleSupabaseError(error, 'getAvailableMissions');
      
      logger.debug(`Retrieved ${data?.length || 0} available missions`);
      return data || []
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'getAvailableMissions');
    }
  },

  // Récupérer les missions à venir pour l'utilisateur connecté
  getUserUpcomingMissions: async () => {
    try {
      logger.debug('Fetching user upcoming missions');
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError('Non authentifié');

      const { data, error } = await supabase
        .from('mission_registrations')
        .select(`
          *,
          mission:missions(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })

      if (error) handleSupabaseError(error, 'getUserUpcomingMissions');
      
      const missions = data?.map(reg => reg.mission) || [];
      logger.debug(`Retrieved ${missions.length} upcoming missions for user`);
      return missions;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'getUserUpcomingMissions');
    }
  },

  // Récupérer les missions passées pour l'utilisateur connecté
  getUserPastMissions: async () => {
    try {
      logger.debug('Fetching user past missions');
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError('Non authentifié');

      const { data, error } = await supabase
        .from('mission_registrations')
        .select(`
          *,
          mission:missions(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (error) handleSupabaseError(error, 'getUserPastMissions');
      
      const missions = data?.map(reg => reg.mission) || [];
      logger.debug(`Retrieved ${missions.length} past missions for user`);
      return missions;
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'getUserPastMissions');
    }
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
    try {
      logger.debug('Searching nearby missions', params);
      
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
      
      if (error) handleSupabaseError(error, 'searchNearbyMissions');
      
      logger.debug(`Found ${data?.length || 0} nearby missions`);
      return data || []
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'searchNearbyMissions');
    }
  },

  // S'inscrire à une mission
  registerForMission: async (missionId: string) => {
    try {
      logger.debug('Registering for mission', { missionId });
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError('Non authentifié');

      const { data, error } = await supabase
        .from('mission_registrations')
        .insert({
          mission_id: missionId,
          user_id: user.id,
          status: 'confirmed'
        })
        .select()
      
      if (error) handleSupabaseError(error, 'registerForMission');
      
      logger.info('Successfully registered for mission', { missionId, userId: user.id });
      return data
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'registerForMission');
    }
  },

  // Annuler une inscription
  cancelRegistration: async (missionId: string, reason?: string) => {
    try {
      logger.debug('Cancelling mission registration', { missionId, reason });
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError('Non authentifié');

      const { data, error } = await supabase
        .from('mission_registrations')
        .update({ 
          status: 'cancelled',
          cancelled_reason: reason 
        })
        .eq('mission_id', missionId)
        .eq('user_id', user.id)
        .select()
      
      if (error) handleSupabaseError(error, 'cancelRegistration');
      
      logger.info('Successfully cancelled mission registration', { missionId, userId: user.id });
      return data
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'cancelRegistration');
    }
  }
}

// Fonctions d'aide pour les profils
export const profileService = {
  // Récupérer le profil de l'utilisateur connecté
  getCurrentProfile: async () => {
    try {
      logger.debug('Fetching current user profile');
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError('Non authentifié');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) handleSupabaseError(error, 'getCurrentProfile');
      
      logger.debug('Retrieved current user profile');
      return data
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'getCurrentProfile');
    }
  },

  // Mettre à jour le profil
  updateProfile: async (updates: any) => {
    try {
      logger.debug('Updating user profile', updates);
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new AuthError('Non authentifié');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) handleSupabaseError(error, 'updateProfile');
      
      logger.info('Successfully updated user profile', { userId: user.id });
      return data
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'updateProfile');
    }
  }
}

// Fonctions d'aide pour l'authentification
export const authService = {
  // Inscription
  signUp: async (email: string, password: string, metadata: any) => {
    try {
      logger.debug('Attempting user sign up', { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      
      if (error) handleSupabaseError(error, 'signUp');
      
      logger.info('User signed up successfully', { email, userId: data.user?.id });
      return data
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'signUp');
    }
  },

  // Connexion
  signIn: async (email: string, password: string) => {
    try {
      logger.debug('Attempting user sign in', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) handleSupabaseError(error, 'signIn');
      
      logger.info('User signed in successfully', { email, userId: data.user?.id });
      return data
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'signIn');
    }
  },

  // Déconnexion
  signOut: async () => {
    try {
      logger.debug('Attempting user sign out');
      
      const { error } = await supabase.auth.signOut()
      if (error) handleSupabaseError(error, 'signOut');
      
      logger.info('User signed out successfully');
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'signOut');
    }
  }
}

export const categoryService = {
  async getCategories() {
    try {
      logger.debug('Fetching categories');
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) handleSupabaseError(error, 'getCategories');
      
      logger.debug(`Retrieved ${data?.length || 0} categories`);
      return data || [];
    } catch (error) {
      if (error instanceof AppError) throw error;
      handleSupabaseError(error, 'getCategories');
    }
  }
}

export { supabase }
