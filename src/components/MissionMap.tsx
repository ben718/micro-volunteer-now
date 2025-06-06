import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Correction des icônes par défaut de Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MissionMap({ missions, userPosition }) {
  const navigate = useNavigate();

  if (!userPosition) return <div>Localisation en cours...</div>;

  return (
    <MapContainer center={userPosition} zoom={14} style={{ height: 400, width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={userPosition}>
        <Popup>Vous êtes ici</Popup>
      </Marker>
      {missions.map(mission => (
        <Marker key={mission.id} position={[mission.latitude, mission.longitude]}>
          <Popup>
            <div>
              <strong>{mission.title}</strong><br />
              {mission.location}<br />
              <button
                className="text-blue-600 underline"
                onClick={() => navigate(`/missions/${mission.id}`)}
              >
                Voir le détail
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 