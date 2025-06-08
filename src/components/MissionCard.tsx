import { Link } from 'react-router-dom';
import { Mission } from '../types';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface MissionCardProps {
  mission: Mission;
}

export default function MissionCard({ mission }: MissionCardProps) {
  return (
    <Link
      to={`/mission/${mission.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
          {mission.category}
        </span>
        <span className="text-sm text-gray-500">
          {mission.spots_taken}/{mission.spots_available} places
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-primary-700 mb-2">{mission.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{mission.short_description}</p>
      
      <div className="flex items-center text-sm text-gray-500">
        <MapPinIcon className="w-4 h-4 mr-2" />
        {mission.city}
        {mission.distance && (
          <span className="ml-2 text-primary-600">
            ({mission.distance} km)
          </span>
        )}
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mt-2">
        <CalendarIcon className="w-4 h-4 mr-2" />
        {new Date(mission.date).toLocaleDateString('fr-FR')}
      </div>
    </Link>
  );
}
