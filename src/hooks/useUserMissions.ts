import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/supabase';

// Simple interfaces for mission data
interface UpcomingMission {
  id: string;
  association_id: string;
  association_name: string;
  association_logo?: string;
  title: string;
  description: string;
  short_description: string;
  category?: string;
  image_url?: string;
  address: string;
  city?: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  date?: string;
  start_time?: string;
  end_time?: string;
  duration: number;
  spots_available: number;
  spots_taken: number;
  min_age: number;
  requirements?: string[];
  skills_needed?: string[];
  languages_needed?: string[];
  materials_provided?: string[];
  materials_to_bring?: string[];
  status?: string;
  is_recurring?: boolean;
  recurring_pattern?: any;
  impact_description?: string;
  impact_metrics?: any;
  created_at?: string;
  updated_at?: string;
  registration_status?: string;
  user_id?: string;
}

interface PastMission {
  id: string;
  association_id: string;
  association_name: string;
  association_logo?: string;
  title: string;
  description: string;
  short_description: string;
  category?: string;
  image_url?: string;
  address: string;
  city?: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  date?: string;
  start_time?: string;
  end_time?: string;
  duration: number;
  spots_available: number;
  spots_taken: number;
  min_age: number;
  requirements?: string[];
  skills_needed?: string[];
  languages_needed?: string[];
  materials_provided?: string[];
  materials_to_bring?: string[];
  status?: string;
  is_recurring?: boolean;
  recurring_pattern?: any;
  impact_description?: string;
  impact_metrics?: any;
  created_at?: string;
  updated_at?: string;
  registration_status?: string;
  user_id?: string;
  feedback?: string;
  rating?: number;
  completion_date?: string;
  hours_logged?: number;
}

interface UseUserMissionsResult {
  upcomingMissions: UpcomingMission[];
  pastMissions: PastMission[];
  loading: boolean;
  error: string | null;
}

export function useUserMissions(): UseUserMissionsResult {
  const { user } = useAuth();
  const [upcomingMissions, setUpcomingMissions] = useState<UpcomingMission[]>([]);
  const [pastMissions, setPastMissions] = useState<PastMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserMissions() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        logger.debug('Fetching user missions', { userId: user.id });

        // Fetch upcoming missions
        const upcomingResponse: any = await (supabase as any)
          .from('user_upcoming_missions')
          .select('*')
          .eq('user_id', user.id);

        if (upcomingResponse.error) {
          throw new AppError(
            'Erreur lors du chargement des missions à venir',
            'FETCH_UPCOMING_MISSIONS_ERROR',
            undefined,
            upcomingResponse.error
          );
        }
        
        const upcomingData: UpcomingMission[] = upcomingResponse.data || [];
        setUpcomingMissions(upcomingData);
        logger.debug(`Retrieved ${upcomingData.length} upcoming missions`);

        // Fetch past missions
        const pastResponse: any = await (supabase as any)
          .from('user_past_missions')
          .select('*')
          .eq('user_id', user.id);

        if (pastResponse.error) {
          throw new AppError(
            'Erreur lors du chargement des missions passées',
            'FETCH_PAST_MISSIONS_ERROR',
            undefined,
            pastResponse.error
          );
        }
        
        const pastData: PastMission[] = pastResponse.data || [];
        setPastMissions(pastData);
        logger.debug(`Retrieved ${pastData.length} past missions`);

      } catch (err: any) {
        let errorMessage = 'Erreur lors du chargement des missions';
        
        if (err instanceof AppError) {
          errorMessage = err.message;
          logger.error('AppError in useUserMissions', err);
        } else {
          logger.error('Unexpected error in useUserMissions', err);
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchUserMissions();
  }, [user]);

  return {
    upcomingMissions,
    pastMissions,
    loading,
    error,
  };
}
