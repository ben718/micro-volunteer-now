import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ImpactStats {
  missionsCompleted: number;
  associationsHelped: number;
  timeVolunteered: number;
  pointsEarned: number;
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
    icon: string;
    color: string;
    earned: boolean;
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

        // Récupérer les statistiques de base
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (statsError) throw statsError;

        // Récupérer les badges récents
        const { data: badgesData, error: badgesError } = await supabase
          .from('user_badges')
          .select('badge_id, earned_at')
          .eq('user_id', userId)
          .order('earned_at', { ascending: false })
          .limit(3);

        if (badgesError) throw badgesError;

        // Récupérer les détails des badges
        const badgeIds = badgesData.map(b => b.badge_id);
        const { data: badgeDetails, error: badgeDetailsError } = await supabase
          .from('badges')
          .select('*')
          .in('id', badgeIds);

        if (badgeDetailsError) throw badgeDetailsError;

        // Calculer le niveau et la progression
        const level = calculateLevel(statsData.missions_completed);

        // Formater les badges récents
        const recentBadges = badgeDetails.map(badge => ({
          id: badge.id,
          name: badge.name,
          icon: badge.icon,
          color: badge.color,
          earned: badgesData.some(b => b.badge_id === badge.id)
        }));

        setData({
          stats: {
            missionsCompleted: statsData.missions_completed,
            associationsHelped: statsData.associations_helped,
            timeVolunteered: statsData.time_volunteered,
            pointsEarned: statsData.points_earned
          },
          level,
          recentBadges
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
      { name: 'Maître', threshold: 50 }
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
      missionsToNext: nextLevel.threshold - missionsCompleted
    };
  };

  return { data, loading, error };
}; 