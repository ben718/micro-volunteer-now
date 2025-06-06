import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Heart } from 'lucide-react';
import { Mission } from '@/types/mission'; // Importer l'interface Mission mise à jour
import { useCategories } from '@/hooks/useCategories'; // Assurez-vous que ce hook est importé si getCategoryColor l'utilise
import { Badge } from '@/components/ui/badge'; // Assurez-vous que Badge est importé si utilisé

interface MissionCardProps {
  mission: Mission; // Utiliser l'interface Mission mise à jour
  onParticipate?: () => void;
  // isUrgent is now part of the Mission type if needed, remove from here
}

const MissionCard = ({
  mission,
  onParticipate,
}: MissionCardProps) => {
  // Assuming useCategories is needed for getCategoryColor
  const { getCategoryColor } = useCategories();

  return (
    // Utiliser mission.isUrgent directement
    <div className={`mission-card ${mission.isUrgent ? 'ring-2 ring-accent animate-pulse-gentle' : ''}`}>
      {mission.isUrgent && (
        <div className="badge-earned text-xs mb-2 inline-block">
          🚨 Mission urgente
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1 leading-tight">{mission.title}</h3>
          {/* Utiliser association_name de la mission */}
          <p className="text-sm text-muted-foreground mb-2">{mission.association_name}</p>

          {/* Utiliser category de la mission */}
          {mission.category && (
             <Badge className={getCategoryColor(mission.category)}>
               {mission.category}
             </Badge>
          )}
        </div>

        <div className="text-right">
          <div className="flex items-center text-sm text-success font-medium mb-1">
            <Clock className="h-4 w-4 mr-1" />
            {/* Afficher la durée en minutes */}
            {mission.duration} minutes
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {/* Utiliser city de la mission pour la localisation */}
            {mission.city}
          </div>
        </div>
      </div>

      {/* Utiliser short_description de la mission */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{mission.short_description}</p>

      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        {/* Utiliser start_time de la mission */}
        <span className="font-medium text-primary">{mission.start_time}</span>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {/* Utiliser spots_taken et spots_available */}
          <span>{mission.spots_taken}/{mission.spots_available}</span>
        </div>
      </div>

      <Button
        onClick={onParticipate}
        className="btn-primary text-sm px-4 py-2 hover:shadow-lg"
        // Désactiver si spots_taken >= spots_available
        disabled={mission.spots_taken >= mission.spots_available}
      >
        <Heart className="h-4 w-4 mr-1" />
        Participer
      </Button>
    </div>
  );
};

export default MissionCard;