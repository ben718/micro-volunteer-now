import React from 'react';
import { useMissions } from '@/hooks/useMissions';
import { Button } from '@/components/ui/button';
import MissionCard from './MissionCard';
import ImpactStats from './ImpactStats';
import MyMissions from './MyMissions';
import Explorer from './Explorer';
import Profile from './Profile';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecommendedMissions } from '@/hooks/useRecommendedMissions';
import { MapPin } from 'lucide-react';

interface DashboardProps {
  view: 'dashboard' | 'explore' | 'missions' | 'profile';
  onViewChange: (view: 'dashboard' | 'explore' | 'missions' | 'profile') => void;
}

const Dashboard = ({ view, onViewChange }: DashboardProps) => {
  const { missions, loading: missionsLoading } = useMissions();
  const { userProfile, loading: profileLoading, error: profileError } = useUserProfile();
  const { recommendedMissions, loading: recommendedLoading, error: recommendedError } = useRecommendedMissions();

  // Filtrer les missions urgentes (peut-être à terme basé sur un flag en BDD ou une date proche)
  const urgentMissions = missions.filter(m => m.isUrgent);

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Salutation personnalisée */}
      <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Bonjour {userProfile?.first_name || ''} 👋
        </h1>
        <p className="text-muted-foreground">
          Prêt à faire la différence aujourd'hui ? Découvrez des missions près de chez vous.
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

      {/* Missions recommandées / à proximité */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
             Missions recommandées près de vous
          </h2>
          <Button 
            variant="outline" 
            onClick={() => onViewChange('explore')}
            className="text-sm"
          >
            Voir toutes
          </Button>
        </div>
        {recommendedLoading || profileLoading ? (
          <div>Chargement des recommandations...</div>
        ) : recommendedError ? (
           <div className="text-center py-8">
             <p className="text-destructive">Erreur lors du chargement des recommandations : {recommendedError}</p>
           </div>
        ) : recommendedMissions.length === 0 ? (
           <div className="text-center py-8 text-muted-foreground">
             <MapPin className="h-12 w-12 mx-auto mb-4" />
             <p>Aucune mission recommandée pour le moment ou localisation non renseignée.</p>
             <p className="text-sm mt-2">Mettez à jour votre profil pour des recommandations personnalisées.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedMissions.slice(0, 3).map((mission, index) => (
              <MissionCard
                key={mission.id} // Utiliser l'ID de la mission comme clé
                mission={mission}
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

      {/* Prochaines missions de l'utilisateur */}
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
