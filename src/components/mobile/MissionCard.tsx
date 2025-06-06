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
  variant?: 'default' | 'today' | 'upcoming'; // Assurez-vous que ces variants sont gérés dans le hook si nécessaire
}

const MobileMissionCard: React.FC<MissionCardProps> = ({
  mission,
  onParticipate,
  onCancel,
  showActions = true,
  variant = 'default' // Peut être utilisé pour la logique d'affichage si besoin
}) => {
  const { getCategoryColor } = useCategories();

  // Logique de couleur de bordure basée sur isUrgent ou variant
  const getBorderColor = () => {
    if (mission.isUrgent) return 'border-l-4 border-red-400';
    // Ajoutez d'autres conditions basées sur 'variant' si nécessaire
    // if (variant === 'today') return 'border-l-4 border-orange-400';
    // if (variant === 'upcoming') return 'border-l-4 border-blue-400';

    // Par défaut ou si variant n'est pas géré spécifiquement
     return 'border-l-4 border-blue-400'; // Couleur par défaut
  };


  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${getBorderColor()}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{mission.title}</h3>
            {/* Utiliser association_name de la mission */}
            <p className="text-sm text-gray-600">{mission.association_name}</p>
          </div>
           {/* Utiliser category de la mission */}
          <Badge className={getCategoryColor(mission.category)}>
            {mission.category}
          </Badge>
        </div>

        {/* Utiliser short_description de la mission */}
        <p className="text-sm text-gray-600 mb-4">{mission.short_description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {/* Afficher la durée en minutes */}
            {mission.duration} minutes
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {/* Utiliser city de la mission pour la localisation */}
            {mission.city}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {/* Utiliser spots_taken et spots_available */}
            <span>{mission.spots_taken}/{mission.spots_available}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {onParticipate && (
              <Button
                onClick={onParticipate}
                className="flex-1"
                // Désactiver si spots_taken >= spots_available
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

// Exportez le composant mobile
export default MobileMissionCard;