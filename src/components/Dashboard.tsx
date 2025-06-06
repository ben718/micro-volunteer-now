import React from 'react';
import { useMissions } from '@/hooks/useMissions';
import { Button } from '@/components/ui/button';
import MissionCard from './MissionCard';
import ImpactStats from './ImpactStats';
import MyMissions from './MyMissions';
import Explorer from './Explorer';
import Profile from './Profile';
import { useUserProfile } from '@/hooks/useUserProfile';

interface DashboardProps {
  view: 'dashboard' | 'explore' | 'missions' | 'profile';
  onViewChange: (view: 'dashboard' | 'explore' | 'missions' | 'profile') => void;
}

const Dashboard = ({ view, onViewChange }: DashboardProps) => {
  const { missions, loading } = useMissions();
  const { userStats } = useUserProfile();

  const urgentMissions = missions.filter(m => m.isUrgent);
  const nearbyMissions = missions.filter(m => m.distance && parseFloat(m.distance) < 2); // exemple : moins de 2km

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
          <h2 className="text-xl font-semibold text-foreground">Votre impact</h2>
          <Button 
            variant="outline" 
            onClick={() => onViewChange('profile')}
            className="text-sm"
          >
            Voir détails
          </Button>
        </div>
        <ImpactStats />
      </div>

      {/* Prochaines missions */}
      <div>
        <MyMissions />
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
