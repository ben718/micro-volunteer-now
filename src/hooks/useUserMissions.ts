
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Use specific types for the mission data we expect from the database views
interface BaseMissionData {
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
}

interface UpcomingMissionData extends BaseMissionData {
  user_id?: string;
}

interface PastMissionData extends BaseMissionData {
  user_id?: string;
  feedback?: string;
  rating?: number;
}

interface UseUserMissionsResult {
  upcomingMissions: UpcomingMissionData[];
  pastMissions: PastMissionData[];
  loading: boolean;
  error: string | null;
}

export function useUserMissions(): UseUserMissionsResult {
  const { user } = useAuth();
  const [upcomingMissions, setUpcomingMissions] = useState<UpcomingMissionData[]>([]);
  const [pastMissions, setPastMissions] = useState<PastMissionData[]>([]);
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
        // Fetch upcoming missions with explicit typing
        const { data: upcomingData, error: upcomingError } = await supabase
          .from('user_upcoming_missions')
          .select('*')
          .eq('user_id', user.id)
          .returns<UpcomingMissionData[]>();

        if (upcomingError) throw upcomingError;
        
        setUpcomingMissions(upcomingData || []);

        // Fetch past missions with explicit typing
        const { data: pastData, error: pastError } = await supabase
          .from('user_past_missions')
          .select('*')
          .eq('user_id', user.id)
          .returns<PastMissionData[]>();

        if (pastError) throw pastError;
        
        setPastMissions(pastData || []);

      } catch (err: any) {
        console.error("Error loading user missions:", err);
        setError(err.message);
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
