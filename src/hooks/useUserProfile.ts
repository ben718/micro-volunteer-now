import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { UserStats, Badge, Category, Association } from '@/types/mission';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({ missions: 0, timeGiven: '0h', associations: 0 });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [preferredCategories, setPreferredCategories] = useState<Category[]>([]);
  const [maxDistance, setMaxDistance] = useState([3]);
  const [preferredDuration, setPreferredDuration] = useState('15 min');
  const [userAssociations, setUserAssociations] = useState<Association[]>([]);

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
          missions: profile.missions_count || 0,
          timeGiven: profile.time_given || '0h',
          associations: profile.associations_count || 0
        });
        setPreferredCategories(profile.preferred_categories || []);
        setMaxDistance([profile.max_distance || 3]);
        setPreferredDuration(profile.preferred_duration || '15 min');
      }
      // Récupérer les badges
      const { data: userBadges } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', user.id);
      setBadges(userBadges || []);
      // Récupérer les associations de l'utilisateur
      const { data: associations } = await supabase
        .from('associations')
        .select('*')
        .in('id', profile?.association_ids || []);
      setUserAssociations(associations || []);
    }
    fetchProfileData();
  }, [user]);

  const updateStats = useCallback((newStats: Partial<UserStats>) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  }, []);

  const toggleCategory = useCallback((categoryName: string) => {
    setPreferredCategories(prev => prev.map(cat => 
      cat.name === categoryName ? { ...cat, active: !cat.active } : cat
    ));
  }, []);

  const setDuration = useCallback((duration: string) => {
    setPreferredDuration(duration);
  }, []);

  return {
    userStats,
    badges,
    preferredCategories,
    maxDistance,
    preferredDuration,
    userAssociations,
    updateStats,
    toggleCategory,
    setMaxDistance,
    setDuration
  };
};
