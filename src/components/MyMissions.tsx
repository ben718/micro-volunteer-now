
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Calendar, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserMissions } from '@/hooks/useUserMissions';

const MyMissions = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const { upcomingMissions, pastMissions, loading, error } = useUserMissions();
  const { getCategoryColor } = useCategories();
  const { userStats } = useUserProfile();

  const getStatusIcon = (status: string | undefined | null) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string | undefined | null) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Inconnu';
    }
  };

  const renderStars = (rating: number | null | undefined) => {
    if (rating === null || rating === undefined) return null;
    const ratingNumber = typeof rating === 'number' ? rating : 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < ratingNumber ? 'text-warning fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return <div>Chargement de vos missions...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement de vos missions : {error}</div>;
  }

  const missionsToDisplay = activeTab === 'upcoming' ? upcomingMissions : pastMissions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Mes missions</h1>
        <Button variant="outline" onClick={() => window.location.hash = '#explore'}>
          Découvrir plus
        </Button>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{upcomingMissions.length}</div>
          <div className="text-sm text-muted-foreground">À venir</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{pastMissions.filter(m => m.registration_status === 'completed').length}</div>
          <div className="text-sm text-muted-foreground">Terminées</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{userStats?.total_missions_completed || 0}</div>
          <div className="text-sm text-muted-foreground">Total (Profil)</div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 max-w-md">
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'upcoming' ? 'bg-white text-blue-600 rounded-md shadow-sm' : 'text-gray-600'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          À venir ({upcomingMissions.length})
        </button>
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'past' ? 'bg-white text-blue-600 rounded-md shadow-sm' : 'text-gray-600'}`}
          onClick={() => setActiveTab('past')}
        >
          Passées ({pastMissions.length})
        </button>
      </div>
      
      {/* Mission list */}
      <div className="space-y-4">
        {missionsToDisplay.length > 0 ? (
          missionsToDisplay.map(mission => (
            <div key={mission.id} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(mission.registration_status)}
                    <h3 className="font-semibold text-foreground">{mission.title}</h3>
                    {mission.category && (
                      <Badge className={getCategoryColor(mission.category)}>
                        {mission.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{mission.association_name}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {mission.date ? new Date(mission.date).toLocaleDateString() : 'N/A'}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {`${mission.start_time || 'N/A'} - ${mission.end_time || 'N/A'}`}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {mission.city || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={mission.registration_status === 'completed' ? 'secondary' : 'outline'}>
                    {getStatusText(mission.registration_status)}
                  </Badge>
                </div>
              </div>
              
              {/* Rating for completed missions (past missions view) */}
              {activeTab === 'past' && mission.registration_status === 'completed' && ('rating' in mission || 'feedback' in mission) && (
                <div className="flex items-start mt-2 space-x-2">
                  {'rating' in mission && mission.rating && renderStars(mission.rating)}
                  {'feedback' in mission && mission.feedback && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {typeof mission.feedback === 'string' ? mission.feedback : ''}
                    </span>
                  )}
                </div>
              )}
              
              {/* Action buttons for upcoming missions */}
              {activeTab === 'upcoming' && mission.registration_status !== 'cancelled' && (
                <div className="mt-4 flex justify-end">
                  {/* Cancel button can be added here if needed */}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {activeTab === 'upcoming' ? 'Aucune mission à venir' : 'Aucune mission passée'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === 'upcoming' 
                ? 'Explorez les missions disponibles pour vous engager !'
                : 'Vos missions terminées apparaîtront ici.'
              }
            </p>
            {activeTab === 'upcoming' && (
              <Button onClick={() => window.location.hash = '#explore'}>
                Explorer les missions
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMissions;
