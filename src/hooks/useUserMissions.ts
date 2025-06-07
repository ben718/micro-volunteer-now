
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
        // Fetch upcoming missions - use explicit any to avoid all type inference
        const upcomingResponse: any = await (supabase as any)
          .from('user_upcoming_missions')
          .select('*')
          .eq('user_id', user.id);

        if (upcomingResponse.error) throw upcomingResponse.error;
        
        const upcomingData: UpcomingMission[] = upcomingResponse.data || [];
        setUpcomingMissions(upcomingData);

        // Fetch past missions - use explicit any to avoid all type inference
        const pastResponse: any = await (supabase as any)
          .from('user_past_missions')
          .select('*')
          .eq('user_id', user.id);

        if (pastResponse.error) throw pastResponse.error;
        
        const pastData: PastMission[] = pastResponse.data || [];
        setPastMissions(pastData);

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
