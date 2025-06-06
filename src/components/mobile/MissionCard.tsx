
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';
import { Mission } from '@/types/mission';

interface MissionCardProps {
  mission: Mission;
  onParticipate?: (missionId: string) => void;
  onCancel?: (missionId: string) => void;
  showActions?: boolean;
  variant?: 'default' | 'upcoming' | 'today';
}

const MissionCard: React.FC<MissionCardProps> = ({ 
  mission, 
  onParticipate, 
  onCancel, 
  showActions = true,
  variant = 'default'
}) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'alimentaire':
        return 'bg-orange-100 text-orange-700';
      case 'social':
        return 'bg-green-100 text-green-700';
      case 'accompagnement':
        return 'bg-blue-100 text-blue-700';
      case 'environnement':
        return 'bg-emerald-100 text-emerald-700';
      case 'éducation':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getBorderColor = () => {
    if (mission.isUrgent) return 'border-l-4 border-red-400';
    if (variant === 'today') return 'border-l-4 border-orange-400';
    return 'border-l-4 border-blue-400';
  };

  return (
    <div className={`bg-white rounded-xl p-4 ${getBorderColor()}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-800 flex-1">{mission.title}</h4>
        <div className="flex items-center space-x-2">
          {mission.isUrgent && (
            <Badge className="bg-red-100 text-red-600 text-xs animate-pulse">
              🚨 Urgent
            </Badge>
          )}
          <Badge className={`text-xs px-2 py-1 ${getCategoryColor(mission.category)}`}>
            {mission.duration}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-1">{mission.association}</p>
      <p className="text-sm text-gray-600 mb-3">{mission.description}</p>

      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {mission.distance}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {mission.startTime}
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {mission.participants.current}/{mission.participants.max}
        </div>
      </div>

      {variant === 'upcoming' && mission.date && (
        <div className="text-sm text-gray-600 mb-3">
          <p>{mission.date}</p>
          {mission.time && <p>{mission.time}</p>}
          <p>{mission.location}</p>
        </div>
      )}

      {showActions && (
        <div className="flex items-center justify-between">
          {variant === 'upcoming' ? (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">
                Détails
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="text-xs"
                onClick={() => onCancel?.(mission.id)}
              >
                Annuler
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm"
              onClick={() => onParticipate?.(mission.id)}
              disabled={mission.participants.current >= mission.participants.max}
            >
              {mission.participants.current >= mission.participants.max ? 'Complet' : 'Je participe'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MissionCard;
