import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Mission, MissionRegistration } from '../types';
import toast from 'react-hot-toast';

export function MissionManagement() {
  const { user, profile } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<MissionRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les inscriptions
      const { data: registrationsData, error: registrationsError } = await supabase
        .from('mission_registrations')
        .select('*, mission:missions(*)')
        .eq('user_id', user?.id);

      if (registrationsError) throw registrationsError;

      // Transformer les données pour correspondre au type MissionRegistration
      const transformedRegistrations = (registrationsData || []).map(reg => ({
        ...reg,
        user_id: user?.id || '',
        created_at: reg.created_at || new Date().toISOString(),
        updated_at: reg.updated_at || new Date().toISOString()
      }));

      setMyRegistrations(transformedRegistrations);

      // Charger les missions
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select('*, association:associations(*)')
        .eq('association_id', user?.id);

      if (missionsError) throw missionsError;

      // Transformer les données pour correspondre au type Mission
      const transformedMissions = (missionsData || []).map(mission => ({
        ...mission,
        short_description: mission.description?.substring(0, 100) || '',
        address: mission.address || '',
        city: mission.city || '',
        postal_code: mission.postal_code || '',
        latitude: mission.latitude || 0,
        longitude: mission.longitude || 0,
        created_at: mission.created_at || new Date().toISOString(),
        updated_at: mission.updated_at || new Date().toISOString()
      }));

      setMissions(transformedMissions);
    } catch (error: any) {
      setError(error.message);
      toast.error('Erreur lors du chargement des données: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // S'inscrire à une mission
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleRegister = async (missionId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour vous inscrire');
      return;
    }

    try {
      const { error } = await supabase.rpc('register_for_mission', {
        p_mission_id: missionId
      });

      if (error) throw error;
      
      await loadData();
      toast.success('Inscription réussie !');
    } catch (error: any) {
      toast.error('Erreur lors de l\'inscription: ' + error.message);
    }
  };
  // Annuler une inscription
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleCancelRegistration = async (missionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('cancel_mission_registration', {
        p_mission_id: missionId
      });

      if (error) throw error;
      
      await loadData();
      toast.success('Inscription annulée !');
    } catch (error: any) {
      toast.error('Erreur lors de l\'annulation: ' + error.message);
    }
  };

  // Mettre à jour le statut d'une mission
  const handleUpdateMissionStatus = async (missionId: string, newStatus: Mission['status']) => {
    try {
      const { error } = await supabase
        .from('missions')
        .update({ status: newStatus })
        .eq('id', missionId);

      if (error) throw error;

      // Mettre à jour l'état local
      setMissions(prevMissions =>
        prevMissions.map(mission =>
          mission.id === missionId ? { ...mission, status: newStatus } : mission
        )
      );

      toast.success('Statut de la mission mis à jour avec succès');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour du statut: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vs-blue-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-vs-blue-primary text-white rounded-md hover:bg-vs-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-vs-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-vs-gray-800 mb-6">Gestion des Missions</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <div key={mission.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{mission.title}</h3>
                {profile?.role === 'association' && mission.association_id === user?.id && (
                  <select
                    value={mission.status}
                    onChange={(e) => handleUpdateMissionStatus(mission.id, e.target.value as Mission['status'])}
                    className="text-sm rounded-md border-gray-300"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publiée</option>
                    <option value="completed">Terminée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                )}
              </div>
              <p className="text-gray-600 mb-4">{mission.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div>
                  <i className="fas fa-calendar mr-1"></i>
                  {new Date(mission.date).toLocaleDateString('fr-FR')}
                </div>
                <div>
                  <i className="fas fa-clock mr-1"></i>
                  {mission.start_time} - {mission.end_time}
                </div>
                {mission.distance && (
                  <div>
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {mission.distance} km
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm mb-4">
                <div className="text-gray-500">
                  <i className="fas fa-users mr-1"></i>
                  {mission.spots_taken}/{mission.spots_available} places
                </div>
                <div className="text-vs-blue-primary">
                  <i className="fas fa-tag mr-1"></i>
                  {mission.category}
                </div>
              </div>

              {mission.association && (
                <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
                  {mission.association.logo_url ? (
                    <img
                      src={mission.association.logo_url}
                      alt={mission.association.name}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-vs-gray-200 flex items-center justify-center mr-2">
                      <span className="text-vs-gray-400">
                        {mission.association.name[0]}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-600">{mission.association.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mes inscriptions */}
        {myRegistrations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-vs-gray-800 mb-6">Mes inscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRegistrations.map((registration) => (
                <div key={registration.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-2">{registration.mission?.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div>
                      <i className="fas fa-calendar mr-1"></i>
                      {registration.mission && new Date(registration.mission.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      <i className="fas fa-clock mr-1"></i>
                      {registration.mission && `${registration.mission.start_time} - ${registration.mission.end_time}`}
                    </div>
                    {registration.mission?.distance && (
                      <div>
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {registration.mission.distance} km
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      registration.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {registration.status === 'confirmed' ? 'Confirmée' :
                       registration.status === 'pending' ? 'En attente' :
                       registration.status === 'completed' ? 'Terminée' :
                       'Annulée'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Inscrit le {new Date(registration.registration_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 