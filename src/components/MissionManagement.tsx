import { useState } from 'react';
import { useAssociationMissions } from '@/hooks/useAssociationMissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, X, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const MissionManagement = () => {
  const { missionId } = useParams<{ missionId: string }>();

  const { missions, confirmVolunteer, completeMission } = useAssociationMissions();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!missionId) {
    return <div>ID de mission manquant.</div>;
  }

  const mission = missions.find(m => m.id === missionId);

  if (!mission) {
    return <div>Mission non trouvée</div>;
  }

  const handleConfirmVolunteer = async (userId: string) => {
    setLoading(true);
    try {
      await confirmVolunteer(missionId, userId);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMission = async () => {
    setLoading(true);
    try {
      await completeMission(missionId);
    } finally {
      setLoading(false);
    }
  };

  const pendingRegistrations = mission.registrations.filter(r => r.status === 'pending');
  const confirmedRegistrations = mission.registrations.filter(r => r.status === 'confirmed');
  const completedRegistrations = mission.registrations.filter(r => r.status === 'completed');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{mission.title}</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate('/association/missions')}>
            Retour
          </Button>
          {mission.status === 'published' && (
            <Button onClick={handleCompleteMission} disabled={loading}>
              Finaliser la mission
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Détails de la mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(mission.date), 'PPP', { locale: fr })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{mission.start_time} - {mission.end_time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{mission.address}, {mission.city}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{mission.spots_taken}/{mission.spots_available} places</span>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{mission.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRegistrations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">En attente ({pendingRegistrations.length})</h3>
                  <div className="space-y-2">
                    {pendingRegistrations.map(registration => (
                      <div key={registration.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {registration.volunteer.avatar_url ? (
                            <img
                              src={registration.volunteer.avatar_url}
                              alt={`${registration.volunteer.first_name} ${registration.volunteer.last_name}`}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              {registration.volunteer.first_name[0]}{registration.volunteer.last_name[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {registration.volunteer.first_name} {registration.volunteer.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Inscrit le {format(new Date(registration.registration_date), 'PPP', { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmVolunteer(registration.user_id)}
                            disabled={loading}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Confirmer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => navigate(`/association/volunteers/${registration.user_id}`)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Refuser
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {confirmedRegistrations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Confirmés ({confirmedRegistrations.length})</h3>
                  <div className="space-y-2">
                    {confirmedRegistrations.map(registration => (
                      <div key={registration.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {registration.volunteer.avatar_url ? (
                            <img
                              src={registration.volunteer.avatar_url}
                              alt={`${registration.volunteer.first_name} ${registration.volunteer.last_name}`}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              {registration.volunteer.first_name[0]}{registration.volunteer.last_name[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {registration.volunteer.first_name} {registration.volunteer.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Confirmé le {format(new Date(registration.confirmation_date!), 'PPP', { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/association/volunteers/${registration.user_id}`)}
                        >
                          Voir le profil
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completedRegistrations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Terminés ({completedRegistrations.length})</h3>
                  <div className="space-y-2">
                    {completedRegistrations.map(registration => (
                      <div key={registration.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {registration.volunteer.avatar_url ? (
                            <img
                              src={registration.volunteer.avatar_url}
                              alt={`${registration.volunteer.first_name} ${registration.volunteer.last_name}`}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              {registration.volunteer.first_name[0]}{registration.volunteer.last_name[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {registration.volunteer.first_name} {registration.volunteer.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Terminé le {format(new Date(registration.completion_date!), 'PPP', { locale: fr })}
                            </p>
                            {registration.feedback && (
                              <p className="text-sm mt-1">{registration.feedback}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/association/volunteers/${registration.user_id}`)}
                        >
                          Voir le profil
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mission.registrations.length === 0 && (
                <p className="text-muted-foreground">Aucune inscription pour cette mission</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 