import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ImpactStats {
  total_missions_completed: number;
  total_hours_volunteered: number;
  impact_score: number;
  associations_helped: number;
}

export interface UserLevel {
  current: string;
  progress: number;
  nextLevel: string;
  missionsToNext: number;
}

export interface ImpactData {
  stats: ImpactStats;
  level: UserLevel;
  recentBadges: Array<{
    id: string;
    name: string;
    icon_url: string;
    category: string;
    awarded_at: string;
  }>;
}

export const useImpactStats = (userId: string) => {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImpactStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer le profil utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (profileError) throw profileError;

        // Calculer le nombre d'associations aidées (distinct association_id sur missions complétées)
        const { data: completedMissions, error: missionsError } = await supabase
          .from('mission_registrations')
          .select('mission_id')
          .eq('user_id', userId)
          .eq('status', 'completed');
        if (missionsError) throw missionsError;
        const missionIds = completedMissions.map((mr: any) => mr.mission_id);
        let associationsHelped = 0;
        if (missionIds.length > 0) {
          const { data: missions, error: missionsDetailError } = await supabase
            .from('missions')
            .select('association_id')
            .in('id', missionIds);
          if (missionsDetailError) throw missionsDetailError;
          const uniqueAssociations = new Set(missions.map((m: any) => m.association_id));
          associationsHelped = uniqueAssociations.size;
        }

        // Récupérer les badges récents (user_badges + badges)
        const { data: userBadges, error: userBadgesError } = await supabase
          .from('user_badges')
          .select('badge_id, awarded_at')
          .eq('user_id', userId)
          .order('awarded_at', { ascending: false })
          .limit(3);
        if (userBadgesError) throw userBadgesError;
        const badgeIds = userBadges.map((b: any) => b.badge_id);
        let recentBadges: ImpactData['recentBadges'] = [];
        if (badgeIds.length > 0) {
          const { data: badges, error: badgesError } = await supabase
            .from('badges')
            .select('id, name, icon_url, category')
            .in('id', badgeIds);
          if (badgesError) throw badgesError;
          recentBadges = userBadges.map((ub: any) => {
            const badge = badges.find((b: any) => b.id === ub.badge_id);
            return badge
              ? {
                  id: badge.id,
                  name: badge.name,
                  icon_url: badge.icon_url,
                  category: badge.category,
                  awarded_at: ub.awarded_at,
                }
              : null;
          }).filter(Boolean) as ImpactData['recentBadges'];
        }

        // Calculer le niveau et la progression
        const level = calculateLevel(profile.total_missions_completed || 0);

        setData({
          stats: {
            total_missions_completed: profile.total_missions_completed || 0,
            total_hours_volunteered: profile.total_hours_volunteered || 0,
            impact_score: profile.impact_score || 0,
            associations_helped: associationsHelped,
          },
          level,
          recentBadges,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchImpactStats();
    }
  }, [userId]);

  const calculateLevel = (missionsCompleted: number): UserLevel => {
    const levels = [
      { name: 'Débutant', threshold: 0 },
      { name: 'Voisin Solidaire', threshold: 5 },
      { name: 'Voisin Solidaire Intermédiaire', threshold: 15 },
      { name: 'Expert', threshold: 30 },
      { name: 'Maître', threshold: 50 },
    ];
    let currentLevel = levels[0];
    let nextLevel = levels[1];
    for (let i = 0; i < levels.length - 1; i++) {
      if (missionsCompleted >= levels[i].threshold && missionsCompleted < levels[i + 1].threshold) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1];
        break;
      }
    }
    const progress = ((missionsCompleted - currentLevel.threshold) /
      (nextLevel.threshold - currentLevel.threshold)) * 100;
    return {
      current: currentLevel.name,
      progress: Math.min(100, Math.max(0, progress)),
      nextLevel: nextLevel.name,
      missionsToNext: nextLevel.threshold - missionsCompleted,
    };
  };

  return { data, loading, error };
}; 