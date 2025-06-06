
import { useState, useCallback } from 'react';
import { UserStats, Badge, Category, Association } from '@/types/mission';

export const useUserProfile = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    missions: 5,
    timeGiven: "3h",
    associations: 2
  });

  const [badges, setBadges] = useState<Badge[]>([
    { name: "Premier pas", icon: "⭐", color: "bg-yellow-400", earned: true },
    { name: "Alimentaire", icon: "🍽️", color: "bg-green-400", earned: true },
    { name: "Réactif", icon: "⚡", color: "bg-blue-400", earned: true },
    { name: "À débloquer", icon: "🔒", color: "bg-gray-300", earned: false }
  ]);

  const [preferredCategories, setPreferredCategories] = useState<Category[]>([
    { name: "Alimentaire", icon: "🍽️", color: "bg-blue-500 text-white", active: true },
    { name: "Social", icon: "😊", color: "bg-green-500 text-white", active: true },
    { name: "Education", icon: "📚", color: "bg-yellow-500 text-white", active: true },
    { name: "+ Ajouter", icon: "+", color: "border-dashed", active: false }
  ]);

  const [maxDistance, setMaxDistance] = useState([3]);
  const [preferredDuration, setPreferredDuration] = useState("15 min");

  const [userAssociations] = useState<Association[]>([
    { name: "Les Restos du Cœur", missions: 3, avatar: "👨‍🍳" },
    { name: "Secours Populaire", missions: 2, avatar: "👩‍⚕️" }
  ]);

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
