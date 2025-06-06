import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/types/database';

// Définir le type pour la disponibilité (peut être ajusté selon le format JSON utilisé)
interface Availability {
  [day: string]: { // par exemple, 'lundi', 'mardi'
    morning?: boolean;
    afternoon?: boolean;
    evening?: boolean;
  };
}

// Définir le type partiel pour les mises à jour du profil bénévole
type ProfileUpdate = Partial<Database['public']['Tables']['profiles']['Update']> & { availability?: Availability | null };

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [userStats, setUserStats] = useState({
    total_missions_completed: 0,
    total_hours_volunteered: 0,
    impact_score: 0,
    associations_helped: 0,
    languages: [] as string[],
  });
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Ajouter l'état pour la disponibilité
  const [availability, setAvailability] = useState<Availability | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Récupérer le profil utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileError) throw profileError;

        setUserProfile(profile);
        // Définir la disponibilité récupérée
        setAvailability(profile.availability as Availability || null);

        setUserStats({
          total_missions_completed: profile.total_missions_completed || 0,
          total_hours_volunteered: profile.total_hours_volunteered || 0,
          impact_score: profile.impact_score || 0,
          languages: profile.languages || [],
          associations_helped: 0, // calculé plus bas
        });

        // Récupérer les badges obtenus
        const { data: userBadges } = await supabase
          .from('user_badges')
          .select('badge_id, awarded_at')
          .eq('user_id', user.id)
          .order('awarded_at', { ascending: false });
        const badgeIds = userBadges?.map((b: any) => b.badge_id) || [];
        let badgeList: any[] = [];
        if (badgeIds.length > 0) {
          const { data: badgesData } = await supabase
            .from('badges')
            .select('id, name, icon_url, category')
            .in('id', badgeIds);
          badgeList = userBadges.map((ub: any) => {
            const badge = badgesData?.find((b: any) => b.id === ub.badge_id);
            return badge
              ? {
                  id: badge.id,
                  name: badge.name,
                  icon_url: badge.icon_url, // Assurez-vous que ce champ est correct
                  category: badge.category,
                  awarded_at: ub.awarded_at,
                }
              : null;
          }).filter(Boolean);
        }
        setBadges(badgeList);

        // Récupérer les associations aidées (distinct association_id sur missions complétées)
        const { data: completedMissions } = await supabase
          .from('mission_registrations')
          .select('mission_id')
          .eq('user_id', user.id)
          .eq('status', 'completed');
        const missionIds = completedMissions?.map((mr: any) => mr.mission_id) || [];
        let associationsHelped = 0;
        if (missionIds.length > 0) {
          const { data: missions } = await supabase
            .from('missions')
            .select('association_id')
            .in('id', missionIds);
          const uniqueAssociations = new Set(missions?.map((m: any) => m.association_id));
          associationsHelped = uniqueAssociations.size;
        }
        setUserStats(prev => ({ ...prev, associations_helped: associationsHelped }));

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, [user]);

  // Nouvelle fonction générique pour mettre à jour le profil
  const updateUserProfile = useCallback(async (updates: ProfileUpdate) => {
    if (!user) return false;

    try {
      const { error: updateError, data: updatedProfile } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setUserProfile(updatedProfile);
      // Mettre à jour aussi la disponibilité si elle fait partie des mises à jour
      if (updates.hasOwnProperty('availability')) {
        setAvailability(updates.availability || null);
      }

      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour du profil.");
      return false;
    }
  }, [user]);

  // Les préférences de mission comme maxDistance et preferredCategories devraient
  // être dérivées de userProfile.interests et userProfile.max_distance si elles existent.
  // Sinon, utiliser des valeurs par défaut.
  const preferredCategories = userProfile?.interests || [];
  const maxDistance = userProfile?.max_distance || 15;

  const setMaxDistance = useCallback(async (distance: number) => {
      const success = await updateUserProfile({ max_distance: distance });
      return success;
  }, [updateUserProfile]);

  const setPreferredCategories = useCallback(async (categories: string[]) => {
       const success = await updateUserProfile({ interests: categories });
       return success;
  }, [updateUserProfile]);

  return {
    userProfile,
    userStats,
    badges,
    preferredCategories,
    maxDistance,
    availability, // Exposer la disponibilité
    updateUserProfile, // Exposer la fonction générique de mise à jour
    updateStats: setUserStats, // Permettre la mise à jour locale si nécessaire
    setMaxDistance,
    setPreferredCategories,
    loading,
    error
  };
};
