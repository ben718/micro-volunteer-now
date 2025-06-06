import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Mission } from '@/types/mission'; // Assurez-vous que ce type est correct

export const useRecommendedMissions = () => {
  const { user } = useAuth();
  // Utiliser l'objet userProfile complet retourné par useUserProfile
  const { userProfile, loading: profileLoading, error: profileError } = useUserProfile(); 

  const [recommendedMissions, setRecommendedMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendedMissions() {
      // Attendre que l'utilisateur soit chargé ET que le profil soit chargé (et sans erreur)
      if (!user || profileLoading || profileError) {
         setLoading(false); // Arrêter l'état de chargement si utilisateur ou profil non prêts/erreur
         return;
      }

      // Vérifier si la localisation de l'utilisateur est disponible dans userProfile
      if (!userProfile?.latitude || !userProfile?.longitude) {
        console.warn("Localisation de l'utilisateur non disponible dans le profil. Impossible de recommander des missions par proximité.");
        setRecommendedMissions([]); // Aucune recommandation basée sur la proximité
        setError("Localisation non définie pour les recommandations"); // Optionnel: définir une erreur si localisation requise
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Appeler la fonction RPC search_nearby_missions
        const { data, error: rpcError } = await supabase.rpc('search_nearby_missions', {
          p_latitude: userProfile.latitude,
          p_longitude: userProfile.longitude,
          p_distance: userProfile.max_distance || 15, // Utiliser la préférence max_distance du profil ou 15 par défaut
          // Utiliser les catégories préférées du profil si useUserProfile les renvoie sous forme de tableau de strings
          p_category: userProfile.interests?.length > 0 ? userProfile.interests[0] : null, // Exemple avec la première catégorie d'intérêt
          // Ajouter d'autres préférences si nécessaire (durée, langue, etc.) basées sur userProfile
          // p_date_start: new Date().toISOString().split('T')[0], 
          // p_duration_max: userProfile.preferredDuration ? parseInt(userProfile.preferredDuration) : null, // Exemple si duration est un nombre
          // p_language: userProfile.languages?.length > 0 ? userProfile.languages[0] : null, // Exemple avec la première langue parlée
        });

        if (rpcError) {
             console.error("Erreur RPC search_nearby_missions:", rpcError);
             throw rpcError;
        }

        setRecommendedMissions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des missions recommandées.');
        setRecommendedMissions([]);
      } finally {
        setLoading(false);
      }
    }
    
    // Déclencher la récupération uniquement quand l'utilisateur ou le profil change (et n'est pas en cours de chargement/erreur)
    if (user && userProfile && !profileLoading && !profileError) {
        fetchRecommendedMissions();
    } else if (!user || profileError) {
         // Gérer le cas où la récupération ne doit pas se faire (ex: pas d'utilisateur, erreur profil)
         setLoading(false);
         setRecommendedMissions([]);
         if(profileError) setError('Impossible de charger les recommandations sans profil utilisateur.');
    }

  }, [user, userProfile, profileLoading, profileError]); // Dépendances du useEffect

  // Combine les états de loading/error du profil et des missions
  const overallLoading = loading || profileLoading;
  const overallError = error || profileError;

  return { recommendedMissions, loading: overallLoading, error: overallError };
}; 