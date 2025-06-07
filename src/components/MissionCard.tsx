
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Heart } from 'lucide-react';
import { Mission } from '@/types/mission';
import { useCategories } from '@/hooks/useCategories';
import { Badge } from '@/components/ui/badge';

interface MissionCardProps {
  mission: Mission;
  onParticipate?: () => void;
}

const MissionCard = ({
  mission,
  onParticipate,
}: MissionCardProps) => {
  const { getCategoryColor } = useCategories();

  return (
    // Utiliser mission.is_urgent au lieu de mission.isUrgent
    <div className={`mission-card ${mission.is_urgent ? 'ring-2 ring-accent animate-pulse-gentle' : ''}`}>
      {mission.is_urgent && (
        <div className="badge-earned text-xs mb-2 inline-block">
          🚨 Mission urgente
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1 leading-tight">{mission.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{mission.association_name}</p>

          {mission.category && (
             <Badge className={getCategoryColor(mission.category)}>
               {mission.category}
             </Badge>
          )}
        </div>

        <div className="text-right">
          <div className="flex items-center text-sm text-success font-medium mb-1">
            <Clock className="h-4 w-4 mr-1" />
            {mission.duration} minutes
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {mission.city}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{mission.short_description}</p>

      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <span className="font-medium text-primary">{mission.start_time}</span>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          <span>{mission.spots_taken}/{mission.spots_available}</span>
        </div>
      </div>

      <Button
        onClick={onParticipate}
        className="btn-primary text-sm px-4 py-2 hover:shadow-lg"
        disabled={mission.spots_taken >= mission.spots_available}
      >
        <Heart className="h-4 w-4 mr-1" />
        Participer
      </Button>
    </div>
  );
};

export default MissionCard;
