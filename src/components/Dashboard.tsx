import React, { useState } from 'react';
import { useMissions } from '@/hooks/useMissions';
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
  const { missions, loading } = useMissions();

  const urgentMissions = missions.filter(m => m.isUrgent);
  const nearbyMissions = missions.filter(m => m.distance && parseFloat(m.distance) < 2); // exemple : moins de 2km

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

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Salutation personnalisée */}
      <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Bonjour ! 👋
        </h1>
        <p className="text-muted-foreground">
          Prêt à faire la différence aujourd'hui ? {urgentMissions.length} missions urgentes vous attendent.
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
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentMissions.slice(0, 3).map((mission, index) => (
              <MissionCard
                key={index}
                {...mission}
                onParticipate={() => onViewChange('missions')}
              />
            ))}
          </div>
        )}
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

  if (view === 'dashboard') return renderDashboard();
  if (view === 'explore') return <Explorer />;
  if (view === 'missions') return <MyMissions />;
  if (view === 'profile') return <Profile />;
  return null;
};

export default Dashboard;
