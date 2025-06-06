
import { useState, useCallback } from 'react';
import { Mission } from '@/types/mission';

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      title: "Distribution alimentaire",
      description: "Aider à distribuer des repas aux personnes sans-abri",
      association: "Restos du Cœur",
      duration: "15 min",
      distance: "500m",
      startTime: "Dans 10 min",
      category: "alimentaire",
      isUrgent: true,
      participants: { current: 2, max: 3 },
      location: "Centre d'accueil Paris 19",
      status: 'today'
    },
    {
      id: '2',
      title: "Lecture aux seniors",
      description: "Lire le journal à des personnes âgées",
      association: "Les Petites Sœurs",
      duration: "30 min",
      distance: "1.2 km",
      startTime: "Maintenant",
      category: "social",
      participants: { current: 1, max: 2 },
      location: "Résidence Les Lilas"
    },
    {
      id: '3',
      title: "Nettoyage du parc",
      description: "Participez au nettoyage et à l'entretien du parc",
      association: "Éco-Quartier",
      duration: "1h",
      distance: "1.5 km",
      startTime: "Samedi 16h00",
      category: "environnement",
      participants: { current: 3, max: 8 },
      location: "Parc des Buttes-Chaumont",
      status: 'upcoming',
      date: "Samedi 12 juin",
      time: "10:00 - 11:00"
    },
    {
      id: '4',
      title: "Aide aux devoirs",
      description: "Aidez les enfants avec leurs devoirs",
      association: "Aide aux Enfants",
      duration: "45 min",
      distance: "1.8 km",
      startTime: "Mardi 17h00",
      category: "éducation",
      participants: { current: 2, max: 4 },
      location: "Centre social du 19ème",
      status: 'upcoming',
      date: "Mardi 15 juin",
      time: "16:30 - 17:00"
    }
  ]);

  const [userMissions, setUserMissions] = useState<Mission[]>([
    {
      id: '1',
      title: "Distribution alimentaire",
      description: "Aider à distribuer des repas",
      association: "Restos du Cœur",
      duration: "15 min",
      distance: "500m",
      startTime: "12:30",
      category: "alimentaire",
      participants: { current: 2, max: 3 },
      location: "Centre d'accueil Paris 19",
      status: 'today',
      time: "12:30 - 12:45"
    }
  ]);

  const participateInMission = useCallback((missionId: string) => {
    setMissions(prev => prev.map(mission => {
      if (mission.id === missionId) {
        const updatedMission = {
          ...mission,
          participants: {
            ...mission.participants,
            current: Math.min(mission.participants.current + 1, mission.participants.max)
          }
        };
        
        // Add to user missions
        setUserMissions(prevUser => [...prevUser, {
          ...updatedMission,
          status: 'upcoming' as const
        }]);
        
        return updatedMission;
      }
      return mission;
    }));
  }, []);

  const cancelMission = useCallback((missionId: string) => {
    setUserMissions(prev => prev.filter(mission => mission.id !== missionId));
    setMissions(prev => prev.map(mission => {
      if (mission.id === missionId) {
        return {
          ...mission,
          participants: {
            ...mission.participants,
            current: Math.max(mission.participants.current - 1, 0)
          }
        };
      }
      return mission;
    }));
  }, []);

  return {
    missions,
    userMissions,
    participateInMission,
    cancelMission
  };
};
