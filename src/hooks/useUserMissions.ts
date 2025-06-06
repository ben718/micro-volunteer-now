import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext'; // Importer le hook d'authentification

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
  const { user } = useAuth(); // Utiliser le hook d'authentification pour obtenir l'utilisateur
  const [upcomingMissions, setUpcomingMissions] = useState<UpcomingMission[]>([]);
  const [pastMissions, setPastMissions] = useState<PastMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserMissions() {
      if (!user) { // Ne pas charger si l'utilisateur n'est pas connecté
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
        setUpcomingMissions(upcomingData || []);

        // Récupérer les missions passées
        const { data: pastData, error: pastError } = await supabase
          .from('user_past_missions')
          .select('*')
          .eq('user_id', user.id);

        if (pastError) throw pastError;
        setPastMissions(pastData || []);

      } catch (err: any) {
        console.error("Erreur lors du chargement des missions utilisateur:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserMissions();
  }, [user]); // Recharger quand l'utilisateur change

  return {
    upcomingMissions,
    pastMissions,
    loading,
    error,
  };
}

// export default useUserMissions; // Utilisation d'un export nommé pour être cohérent avec d'autres hooks