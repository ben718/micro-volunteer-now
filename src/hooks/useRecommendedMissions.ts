
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Mission } from '@/types/mission';

export const useRecommendedMissions = () => {
  const { user } = useAuth();
  const { userProfile, loading: profileLoading, error: profileError } = useUserProfile(); 

  const [recommendedMissions, setRecommendedMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendedMissions() {
      if (!user || profileLoading || profileError) {
         setLoading(false);
         return;
      }

      if (!userProfile?.latitude || !userProfile?.longitude) {
        console.warn("Localisation de l'utilisateur non disponible dans le profil. Impossible de recommander des missions par proximité.");
        setRecommendedMissions([]);
        setError("Localisation non définie pour les recommandations");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: rpcError } = await supabase.rpc('search_nearby_missions', {
          p_latitude: userProfile.latitude,
          p_longitude: userProfile.longitude,
          p_distance: userProfile.max_distance || 15,
          p_category: userProfile.interests?.length > 0 ? userProfile.interests[0] : null,
        });

        if (rpcError) {
             console.error("Erreur RPC search_nearby_missions:", rpcError);
             throw rpcError;
        }

        const typedMissions: Mission[] = (data || []).map(mission => ({
          ...mission,
          is_urgent: false, // Default value since it's not in the database
          association_name: 'Association', // Default value since it's not in the database
          status: mission.status as 'draft' | 'published' | 'completed' | 'cancelled'
        }));

        setRecommendedMissions(typedMissions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des missions recommandées.');
        setRecommendedMissions([]);
      } finally {
        setLoading(false);
      }
    }
    
    if (user && userProfile && !profileLoading && !profileError) {
        fetchRecommendedMissions();
    } else if (!user || profileError) {
         setLoading(false);
         setRecommendedMissions([]);
         if(profileError) setError('Impossible de charger les recommandations sans profil utilisateur.');
    }

  }, [user, userProfile, profileLoading, profileError]);

  const overallLoading = loading || profileLoading;
  const overallError = error || profileError;

  return { recommendedMissions, loading: overallLoading, error: overallError };
};
