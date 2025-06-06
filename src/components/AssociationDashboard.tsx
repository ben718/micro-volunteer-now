import { useState } from 'react';
import { useAssociation } from '@/hooks/useAssociation';
import { useAssociationMissions } from '@/hooks/useAssociationMissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Users, Calendar, Award } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const AssociationDashboard = () => {
  const { association, loading: associationLoading } = useAssociation();
  const { missions, loading: missionsLoading } = useAssociationMissions();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  if (associationLoading || missionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!association) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Association non trouvée</p>
      </div>
    );
  }

  const upcomingMissions = missions.filter(m => 
    m.status === 'published' && new Date(m.date) >= new Date()
  );

  const pendingRegistrations = missions.reduce((count, mission) => 
    count + mission.registrations.filter(r => r.status === 'pending').length, 0
  );

  const totalVolunteers = association.total_volunteers_engaged;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      {/* En-tête avec bouton nouvelle mission */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <Button 
          onClick={() => navigate('/association/missions/new')}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle mission
        </Button>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions à venir</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMissions.length}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions en attente</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRegistrations}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bénévoles engagés</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVolunteers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="volunteers">Bénévoles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Prochaines missions</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMissions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMissions.slice(0, 5).map(mission => (
                    <div key={mission.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                      <div>
                        <h3 className="font-medium">{mission.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(mission.date), 'PPP', { locale: fr })}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/association/missions/${mission.id}`)}
                        className="w-full sm:w-auto"
                      >
                        Voir les détails
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune mission à venir</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les missions</CardTitle>
            </CardHeader>
            <CardContent>
              {missions.length > 0 ? (
                <div className="space-y-4">
                  {missions.map(mission => (
                    <div key={mission.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                      <div>
                        <h3 className="font-medium">{mission.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(mission.date), 'PPP', { locale: fr })} - {mission.spots_taken}/{mission.spots_available} places
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/association/missions/${mission.id}`)}
                        className="w-full sm:w-auto"
                      >
                        Gérer
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune mission créée</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bénévoles récents</CardTitle>
            </CardHeader>
            <CardContent>
              {missions.some(m => m.registrations.length > 0) ? (
                <div className="space-y-4">
                  {missions
                    .flatMap(m => m.registrations)
                    .filter(r => r.status === 'confirmed' || r.status === 'completed')
                    .sort((a, b) => new Date(b.registration_date).getTime() - new Date(a.registration_date).getTime())
                    .slice(0, 5)
                    .map(registration => (
                      <div key={registration.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                        <div className="flex items-center space-x-4">
                          {registration.volunteer.avatar_url ? (
                            <img
                              src={registration.volunteer.avatar_url}
                              alt={`${registration.volunteer.first_name} ${registration.volunteer.last_name}`}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              {registration.volunteer.first_name[0]}{registration.volunteer.last_name[0]}
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium">
                              {registration.volunteer.first_name} {registration.volunteer.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Inscrit le {format(new Date(registration.registration_date), 'PPP', { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate(`/association/volunteers/${registration.user_id}`)}
                          className="w-full sm:w-auto"
                        >
                          Voir le profil
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun bénévole inscrit</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssociationDashboard; 