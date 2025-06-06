
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Heart } from 'lucide-react';

interface MissionCardProps {
  title: string;
  association: string;
  duration: string;
  distance: string;
  startTime: string;
  description: string;
  participants: {
    current: number;
    max: number;
  };
  category: string;
  onParticipate?: () => void;
  isUrgent?: boolean;
}

const MissionCard = ({
  title,
  association,
  duration,
  distance,
  startTime,
  description,
  participants,
  category,
  onParticipate,
  isUrgent = false
}: MissionCardProps) => {
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'aide alimentaire':
        return 'bg-green-100 text-green-700';
      case 'accompagnement':
        return 'bg-blue-100 text-blue-700';
      case 'environnement':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`mission-card ${isUrgent ? 'ring-2 ring-accent animate-pulse-gentle' : ''}`}>
      {isUrgent && (
        <div className="badge-earned text-xs mb-2 inline-block">
          🚨 Mission urgente
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1 leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{association}</p>
          
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
            {category}
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center text-sm text-success font-medium mb-1">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {distance}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="font-medium text-primary">{startTime}</span>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{participants.current}/{participants.max}</span>
          </div>
        </div>

        <Button 
          onClick={onParticipate}
          className="btn-primary text-sm px-4 py-2 hover:shadow-lg"
        >
          <Heart className="h-4 w-4 mr-1" />
          Participer
        </Button>
      </div>
    </div>
  );
};

export default MissionCard;
