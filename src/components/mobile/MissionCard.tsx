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

const MissionCard: React.FC<MissionCardProps> = ({ 
  mission, 
  onParticipate, 
  onCancel, 
  showActions = true,
  variant = 'default'
}) => {
  const { getCategoryColor } = useCategories();

  const getBorderColor = () => {
    if (mission.isUrgent) return 'border-l-4 border-red-400';
    if (variant === 'today') return 'border-l-4 border-orange-400';
    return 'border-l-4 border-blue-400';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${getBorderColor()}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{mission.title}</h3>
            <p className="text-sm text-gray-600">{mission.association}</p>
          </div>
          <Badge className={getCategoryColor(mission.category)}>
            {mission.category}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mb-4">{mission.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {mission.duration}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {mission.distance}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {mission.participants.current}/{mission.participants.max}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {onParticipate && (
              <Button 
                onClick={onParticipate}
                className="flex-1"
                disabled={mission.participants.current >= mission.participants.max}
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

export default MissionCard;
