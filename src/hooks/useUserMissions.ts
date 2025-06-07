
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Simplified types that match exactly what the database views return
interface UpcomingMission {
  id: string;
  user_id: string;
  association_id: string;
  association_name: string;
  association_logo: string | null;
  title: string;
  description: string;
  short_description: string;
  category: string | null;
  image_url: string | null;
  address: string;
  city: string | null;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  duration: number;
  spots_available: number;
  spots_taken: number;
  min_age: number;
  requirements: string[] | null;
  skills_needed: string[] | null;
  languages_needed: string[] | null;
  materials_provided: string[] | null;
  materials_to_bring: string[] | null;
  status: string;
  is_recurring: boolean;
  recurring_pattern: any;
  impact_description: string | null;
  impact_metrics: any;
  created_at: string;
  updated_at: string;
  registration_status: string;
}

interface PastMission {
  id: string;
  user_id: string;
  association_id: string;
  association_name: string;
  association_logo: string | null;
  title: string;
  description: string;
  short_description: string;
  category: string | null;
  image_url: string | null;
  address: string;
  city: string | null;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  duration: number;
  spots_available: number;
  spots_taken: number;
  min_age: number;
  requirements: string[] | null;
  skills_needed: string[] | null;
  languages_needed: string[] | null;
  materials_provided: string[] | null;
  materials_to_bring: string[] | null;
  status: string;
  is_recurring: boolean;
  recurring_pattern: any;
  impact_description: string | null;
  impact_metrics: any;
  created_at: string;
  updated_at: string;
  registration_status: string;
  completion_date: string | null;
  feedback: string | null;
  rating: number | null;
  hours_logged: number | null;
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
        // Fetch upcoming missions
        const { data: upcomingData, error: upcomingError } = await supabase
          .from('user_upcoming_missions')
          .select('*')
          .eq('user_id', user.id);

        if (upcomingError) throw upcomingError;
        
        setUpcomingMissions(upcomingData || []);

        // Fetch past missions
        const { data: pastData, error: pastError } = await supabase
          .from('user_past_missions')
          .select('*')
          .eq('user_id', user.id);

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
