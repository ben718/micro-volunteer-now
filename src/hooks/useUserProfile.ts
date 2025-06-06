import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    total_missions_completed: 0,
    total_hours_volunteered: 0,
    impact_score: 0,
    associations_helped: 0,
    languages: [] as string[],
  });
  const [badges, setBadges] = useState<any[]>([]);
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [preferredDuration, setPreferredDuration] = useState('15 min');
  const [userAssociations, setUserAssociations] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      // Récupérer le profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profile && !profileError) {
        setUserStats({
          total_missions_completed: profile.total_missions_completed || 0,
          total_hours_volunteered: profile.total_hours_volunteered || 0,
          impact_score: profile.impact_score || 0,
          languages: profile.languages || [],
          associations_helped: 0, // calculé plus bas
        });
        setPreferredCategories(profile.interests || []);
        setMaxDistance(profile.max_distance || 15);
        // Pas de preferred_duration dans la BDD, valeur par défaut
      }
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
          const badge = badgesData.find((b: any) => b.id === ub.badge_id);
          return badge
            ? {
                id: badge.id,
                name: badge.name,
                icon_url: badge.icon_url,
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
      // Récupérer les associations de l'utilisateur (optionnel)
      // ...
    }
    fetchProfileData();
  }, [user]);

  const updateStats = useCallback((newStats: Partial<typeof userStats>) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  }, []);

  return {
    userStats,
    badges,
    preferredCategories,
    maxDistance,
    preferredDuration,
    userAssociations,
    updateStats,
    setMaxDistance,
    setPreferredCategories,
    setPreferredDuration,
  };
};
