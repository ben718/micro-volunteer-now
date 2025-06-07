
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

// Définir les types basés sur les vues
type UpcomingMission = Database['public']['Views']['user_upcoming_missions']['Row'];
type PastMission = Database['public']['Views']['user_past_missions']['Row'];

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
        // Récupérer les missions à venir
        const { data: upcomingData, error: upcomingError } = await supabase
          .from('user_upcoming_missions')
          .select('*')
          .eq('user_id', user.id);

        if (upcomingError) throw upcomingError;
        
        // Cast the data to the proper type
        const typedUpcomingData: UpcomingMission[] = upcomingData || [];
        setUpcomingMissions(typedUpcomingData);

        // Récupérer les missions passées
        const { data: pastData, error: pastError } = await supabase
          .from('user_past_missions')
          .select('*')
          .eq('user_id', user.id);

        if (pastError) throw pastError;
        
        // Cast the data to the proper type
        const typedPastData: PastMission[] = pastData || [];
        setPastMissions(typedPastData);

      } catch (err: any) {
        console.error("Erreur lors du chargement des missions utilisateur:", err);
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
