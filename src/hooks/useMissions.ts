import { useState, useCallback, useEffect } from 'react';
import { Mission } from '@/types/mission';
import { missionService } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userMissions, setUserMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAllMissions() {
      setLoading(true);
      try {
        const allMissions = await missionService.getAvailableMissions();
        setMissions(allMissions || []);
        if (user) {
          const myMissions = await missionService.getUserMissions(user.id);
          setUserMissions(myMissions || []);
        }
      } catch (e) {
        setMissions([]);
        setUserMissions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAllMissions();
  }, [user]);

  const participateInMission = useCallback(async (missionId: string) => {
    await missionService.registerForMission(missionId);
    // Recharger les missions de l'utilisateur
    if (user) {
      const myMissions = await missionService.getUserMissions(user.id);
      setUserMissions(myMissions || []);
    }
  }, [user]);

  const cancelMission = useCallback(async (missionId: string) => {
    await missionService.cancelRegistration(missionId);
    if (user) {
      const myMissions = await missionService.getUserMissions(user.id);
      setUserMissions(myMissions || []);
    }
  }, [user]);

  return {
    missions,
    userMissions,
    participateInMission,
    cancelMission,
    loading
  };
};
