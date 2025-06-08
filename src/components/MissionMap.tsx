import React, { useEffect, useRef } from 'react';
import { Mission } from '../types';

interface MissionMapProps {
  missions: Mission[];
  onMissionClick?: (mission: Mission) => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

declare global {
  interface Window {
    google: any;
  }
}

const MissionMap: React.FC<MissionMapProps> = ({ missions, onMissionClick, userLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Charger l'API Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [missions]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const defaultCenter = userLocation
      ? { lat: userLocation.latitude, lng: userLocation.longitude }
      : { lat: 48.8566, lng: 2.3522 }; // Paris par défaut

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Ajouter un marqueur pour la position de l'utilisateur
    if (userLocation) {
      new window.google.maps.Marker({
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        }
      });
    }

    updateMarkers();
  };

  const updateMarkers = () => {
    // Supprimer les marqueurs existants
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs
    missions.forEach(mission => {
      if (mission.latitude && mission.longitude) {
        const marker = new window.google.maps.Marker({
          position: { lat: mission.latitude, lng: mission.longitude },
          map: mapInstanceRef.current,
          title: mission.title,
          icon: {
            url: '/marker.svg',
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        // Ajouter une info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-lg">${mission.title}</h3>
              <p class="text-sm text-gray-600">${mission.short_description}</p>
              <div class="flex items-center mt-2 text-sm text-gray-500">
                <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                ${mission.distance ? `${mission.distance} km` : mission.address}
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
          if (onMissionClick) {
            onMissionClick(mission);
          }
        });

        markersRef.current.push(marker);
      }
    });

    // Ajuster la vue pour montrer tous les marqueurs
    if (markersRef.current.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markersRef.current.forEach(marker => bounds.extend(marker.getPosition()));
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MissionMap;
