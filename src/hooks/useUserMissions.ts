
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Use generic types that will work with whatever the database returns
type DatabaseRow = Record<string, any>;

interface UseUserMissionsResult {
  upcomingMissions: DatabaseRow[];
  pastMissions: DatabaseRow[];
  loading: boolean;
  error: string | null;
}

export function useUserMissions(): UseUserMissionsResult {
  const { user } = useAuth();
  const [upcomingMissions, setUpcomingMissions] = useState<DatabaseRow[]>([]);
  const [pastMissions, setPastMissions] = useState<DatabaseRow[]>([]);
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
