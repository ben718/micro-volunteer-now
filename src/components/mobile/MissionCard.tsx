
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users } from 'lucide-react';
import { Mission } from '@/types/mission';
import { useCategories } from '@/hooks/useCategories';

interface MissionCardProps {
  mission: Mission;
  onParticipate?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
  variant?: 'default' | 'today' | 'upcoming';
}

const MobileMissionCard: React.FC<MissionCardProps> = ({
  mission,
  onParticipate,
  onCancel,
  showActions = true,
  variant = 'default'
}) => {
  const { getCategoryColor } = useCategories();

  const getBorderColor = () => {
    if (mission.isUrgent) return 'border-l-4 border-destructive';
    if (variant === 'today') return 'border-l-4 border-warning';
    if (variant === 'upcoming') return 'border-l-4 border-primary';
    return 'border-l-4 border-primary';
  };

  return (
    <div className={`bg-card rounded-lg shadow-sm overflow-hidden ${getBorderColor()}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground">{mission.title}</h3>
            <p className="text-sm text-muted-foreground">{mission.association_name}</p>
          </div>
          <Badge className={getCategoryColor(mission.category)}>
            {mission.category}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{mission.short_description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {mission.duration} minutes
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {mission.city}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{mission.spots_taken}/{mission.spots_available}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {onParticipate && (
              <Button
                onClick={onParticipate}
                className="flex-1"
                disabled={mission.spots_taken >= mission.spots_available}
              >
                Participer
              </Button>
            )}
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Annuler
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMissionCard;
