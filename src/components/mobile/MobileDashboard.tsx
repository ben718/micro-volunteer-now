
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import MobileMissionCard from './MissionCard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecommendedMissions } from '@/hooks/useRecommendedMissions';

const MobileDashboard = () => {
  const { userProfile } = useUserProfile();
  const { recommendedMissions, loading } = useRecommendedMissions();

  // Missions instantanées simulées
  const instantMissions = [
    {
      id: 1,
      title: "Distribution alimentaire",
      short_description: "Aider à distribuer des repas aux personnes sans-abri",
      duration: 15,
      city: "Paris 19ème",
      distance: "500m",
      category: "alimentaire",
      spots_taken: 2,
      spots_available: 4,
      is_urgent: false
    },
    {
      id: 2,
      title: "Lecture aux seniors",
      short_description: "Lire le journal à des personnes âgées",
      duration: 30,
      city: "Paris 19ème",
      distance: "1.2 km",
      category: "social",
      spots_taken: 1,
      spots_available: 2,
      is_urgent: false
    }
  ];

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
            <div className="impact-number text-blue-500">5</div>
            <div className="impact-label">Missions</div>
          </div>
          <div className="impact-stat">
            <div className="impact-number text-green-500">3h</div>
            <div className="impact-label">Temps donné</div>
          </div>
          <div className="impact-stat">
            <div className="impact-number text-orange-500">2</div>
            <div className="impact-label">Associations</div>
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
          {instantMissions.map((mission) => (
            <MobileMissionCard
              key={mission.id}
              mission={mission}
              variant="today"
              onParticipate={() => console.log('Participer à:', mission.title)}
            />
          ))}
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="status-dot status-today"></div>
                <span className="text-sm font-medium text-gray-900">Aujourd'hui</span>
              </div>
              <h3 className="font-semibold text-gray-900">Distribution alimentaire</h3>
              <p className="text-sm text-gray-500">12:30 - 12:45</p>
            </div>
            <div className="duration-badge duration-15">
              15 min
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Centre d'accueil Paris 19</span>
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
      </div>
    </div>
  );
};

export default MobileDashboard;
