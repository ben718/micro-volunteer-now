
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import MissionCard from './MissionCard';
import ImpactStats from './ImpactStats';
import MyMissions from './MyMissions';
import Explorer from './Explorer';
import Profile from './Profile';

interface DashboardProps {
  view: 'dashboard' | 'explore' | 'missions' | 'profile';
  onViewChange: (view: 'dashboard' | 'explore' | 'missions' | 'profile') => void;
}

const Dashboard = ({ view, onViewChange }: DashboardProps) => {
  const userStats = {
    missionsCompleted: 8,
    associationsHelped: 5,
    timeVolunteered: 285,
    pointsEarned: 420
  };

  const userLevel = {
    current: "Voisin Solidaire Intermédiaire",
    progress: 75,
    nextLevel: "Expert",
    missionsToNext: 2
  };

  const nearbyMissions = [
    {
      title: "Aide aux courses",
      association: "Épicerie Solidaire du 11ème",
      duration: "15 min",
      distance: "0.5 km",
      startTime: "Dans 10 min",
      description: "Aidez à porter les courses des bénéficiaires jusqu'à leur domicile",
      participants: { current: 2, max: 3 },
      category: "Aide alimentaire",
      isUrgent: true
    },
    {
      title: "Distribution de repas",
      association: "Secours Populaire",
      duration: "30 min",
      distance: "1.2 km",
      startTime: "Maintenant",
      description: "Participez à la distribution de repas chauds aux personnes dans le besoin",
      participants: { current: 4, max: 6 },
      category: "Aide alimentaire"
    },
    {
      title: "Accompagnement senior",
      association: "Les Petites Sœurs",
      duration: "45 min",
      distance: "0.8 km",
      startTime: "15h30",
      description: "Accompagnez une personne âgée pour ses courses hebdomadaires",
      participants: { current: 1, max: 2 },
      category: "Accompagnement"
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Salutation personnalisée */}
      <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Bonjour Marie ! 👋
        </h1>
        <p className="text-muted-foreground">
          Prête à faire la différence aujourd'hui ? {nearbyMissions.filter(m => m.isUrgent).length} missions urgentes vous attendent.
        </p>
        <div className="flex items-center space-x-4 mt-4">
          <Button 
            onClick={() => onViewChange('explore')}
            className="btn-primary"
          >
            Explorer les missions
          </Button>
          <Button 
            variant="outline"
            onClick={() => onViewChange('missions')}
          >
            Mes missions
          </Button>
        </div>
      </div>

      {/* Missions urgentes / à proximité */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            🚨 Missions urgentes près de vous
          </h2>
          <Button 
            variant="outline" 
            onClick={() => onViewChange('explore')}
            className="text-sm"
          >
            Voir toutes
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyMissions.slice(0, 3).map((mission, index) => (
            <MissionCard
              key={index}
              {...mission}
              onParticipate={() => console.log(`Participer à: ${mission.title}`)}
            />
          ))}
        </div>
      </div>

      {/* Votre impact */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Votre impact cette semaine</h2>
          <Button 
            variant="outline" 
            onClick={() => onViewChange('profile')}
            className="text-sm"
          >
            Voir détails
          </Button>
        </div>
        <ImpactStats stats={userStats} level={userLevel} />
      </div>

      {/* Prochaines missions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Vos prochaines missions</h2>
          <Button 
            variant="outline" 
            onClick={() => onViewChange('missions')}
            className="text-sm"
          >
            Gérer mes missions
          </Button>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Aide aux devoirs</h3>
              <p className="text-sm text-muted-foreground mb-2">Aide aux Enfants</p>
              <p className="text-sm text-primary font-medium">Demain à 16h00 • 45 minutes</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Détails</Button>
              <Button size="sm">Confirmer</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation mobile */}
        <div className="md:hidden mb-6">
          <div className="flex space-x-2 p-1 bg-white rounded-lg border border-border">
            {[
              { key: 'dashboard', label: 'Accueil' },
              { key: 'explore', label: 'Explorer' },
              { key: 'missions', label: 'Missions' },
              { key: 'profile', label: 'Profil' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => onViewChange(tab.key as any)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  view === tab.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-6xl mx-auto">
          {view === 'dashboard' && renderDashboard()}
          {view === 'explore' && <Explorer />}
          {view === 'missions' && <MyMissions />}
          {view === 'profile' && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
