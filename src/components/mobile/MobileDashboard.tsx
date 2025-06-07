
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import MobileMissionCard from './MissionCard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useMissions } from '@/hooks/useMissions';
import { useUserMissions } from '@/hooks/useUserMissions';

const MobileDashboard = () => {
  const { userProfile } = useUserProfile();
  const { missions, loading: missionsLoading } = useMissions();
  const { upcomingMissions, loading: userMissionsLoading } = useUserMissions();

  // Prendre les 2 premières missions pour les "missions instantanées"
  const instantMissions = missions.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header de bienvenue */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Bonjour, {userProfile?.first_name || 'Jean'} 👋
        </h1>
        <p className="text-gray-600 text-sm">
          Prêt à aider près de chez vous aujourd'hui ?
        </p>
      </div>

      {/* Votre impact */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="section-header">
          <h2 className="section-title">Votre impact</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="impact-stat">
            <div className="impact-number text-blue-500">{userProfile?.total_missions_completed || 0}</div>
            <div className="impact-label">Missions</div>
          </div>
          <div className="impact-stat">
            <div className="impact-number text-green-500">{userProfile?.total_hours_volunteered || 0}h</div>
            <div className="impact-label">Temps donné</div>
          </div>
          <div className="impact-stat">
            <div className="impact-number text-orange-500">{userProfile?.impact_score || 0}</div>
            <div className="impact-label">Impact</div>
          </div>
        </div>
      </div>

      {/* Missions instantanées */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Missions instantanées</h2>
          <button className="section-action">
            Voir tout
          </button>
        </div>

        <div className="space-y-3">
          {missionsLoading ? (
            <div className="text-center text-gray-500">Chargement...</div>
          ) : instantMissions.length > 0 ? (
            instantMissions.map((mission) => (
              <MobileMissionCard
                key={mission.id}
                mission={mission}
                variant="today"
                onParticipate={() => console.log('Participer à:', mission.title)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500">Aucune mission disponible</div>
          )}
        </div>
      </div>

      {/* Catégories */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Catégories</h2>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { name: 'Alimentaire', icon: '🍽️', color: 'bg-green-100' },
            { name: 'Éducation', icon: '📚', color: 'bg-blue-100' },
            { name: 'Social', icon: '😊', color: 'bg-orange-100' },
            { name: 'Plus', icon: '➕', color: 'bg-gray-100' }
          ].map((category, index) => (
            <button
              key={index}
              className={`${category.color} rounded-2xl p-4 flex flex-col items-center space-y-2 transition-transform active:scale-95`}
            >
              <div className="text-2xl">{category.icon}</div>
              <span className="text-xs font-medium text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vos missions à venir */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Vos missions à venir</h2>
          <button className="section-action">
            Voir tout
          </button>
        </div>

        {userMissionsLoading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : upcomingMissions.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            {upcomingMissions.slice(0, 1).map((mission) => (
              <div key={mission.id}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="status-dot status-today"></div>
                      <span className="text-sm font-medium text-gray-900">
                        {mission.date ? new Date(mission.date).toLocaleDateString() : 'Date à définir'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                    <p className="text-sm text-gray-500">
                      {mission.start_time} - {mission.end_time}
                    </p>
                  </div>
                  <div className="duration-badge duration-15">
                    {mission.duration} min
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{mission.association_name || 'Association'}</span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1">
                    Détails
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    Annuler
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center text-gray-500">
            Aucune mission planifiée
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDashboard;
