import React, { useState } from 'react';
import { useMissions } from '@/hooks/useMissions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Calendar, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

const MyMissions = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const { userMissions, loading } = useMissions();
  const { getCategoryColor } = useCategories();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-4 w-4 text-accent" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'À venir';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const filteredMissions = userMissions.filter(mission => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return mission.status === 'upcoming';
    if (activeTab === 'completed') return mission.status === 'completed';
    return true;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-warning fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Mes missions</h1>
        <Button variant="outline" onClick={() => window.location.hash = '#explore'}>
          Découvrir plus
        </Button>
      </div>
      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{userMissions.filter(m => m.status === 'upcoming').length}</div>
          <div className="text-sm text-muted-foreground">À venir</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{userMissions.filter(m => m.status === 'completed').length}</div>
          <div className="text-sm text-muted-foreground">Terminées</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">
            {userMissions.filter(m => m.status === 'completed').reduce((acc, m) => acc + (m.points || 0), 0)}
          </div>
          <div className="text-sm text-muted-foreground">Points gagnés</div>
        </div>
      </div>
      {/* Onglets */}
      <div className="flex space-x-2 my-4">
        {[
          { key: 'upcoming', label: 'À venir' },
          { key: 'completed', label: 'Terminées' },
          { key: 'all', label: 'Toutes' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Liste des missions */}
      <div className="space-y-4">
        {filteredMissions.map(mission => (
          <div key={mission.id} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(mission.status)}
                  <h3 className="font-semibold text-foreground">{mission.title}</h3>
                  <Badge className={getCategoryColor(mission.category)}>
                    {mission.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{mission.association_name}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {mission.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {mission.time}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {mission.location}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={mission.status === 'completed' ? 'secondary' : 'outline'}>
                  {getStatusText(mission.status)}
                </Badge>
                {mission.points && (
                  <div className="text-sm font-medium text-success mt-1">
                    +{mission.points} points
                  </div>
                )}
              </div>
            </div>
            {/* Évaluation pour les missions terminées */}
            {mission.status === 'completed' && mission.rating && (
              <div className="flex items-center mt-2">
                {renderStars(mission.rating)}
                {mission.feedback && (
                  <span className="ml-2 text-sm text-muted-foreground">{mission.feedback}</span>
                )}
              </div>
            )}
          </div>
        ))}
        {filteredMissions.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Aucune mission {activeTab === 'upcoming' ? 'à venir' : activeTab === 'completed' ? 'terminée' : ''}
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === 'upcoming' 
                ? 'Explorez les missions disponibles pour vous engager'
                : 'Commencez votre première mission de bénévolat'
              }
            </p>
            <Button onClick={() => window.location.hash = '#explore'}>
              Explorer les missions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMissions;
