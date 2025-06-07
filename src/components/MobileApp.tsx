
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Home, 
  Compass, 
  Calendar, 
  User, 
  Bell,
  Menu,
  Filter,
  Award,
  Heart,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useMissions } from '@/hooks/useMissions';
import { useFilters } from '@/hooks/useFilters';
import { useUserProfile } from '@/hooks/useUserProfile';
import MobileMissionCard from './mobile/MissionCard';
import FilterPanel from './mobile/FilterPanel';
import UserStatsCard from './mobile/UserStatsCard';

const MobileApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { 
    missions, 
    userMissions, 
    loading, 
    participateInMission, 
    cancelMissionParticipation 
  } = useMissions();

  const { 
    userProfile, 
    userStats, 
    badges
  } = useUserProfile();

  const {
    filters,
    filteredMissions,
    onFilterChange,
    onClearFilters,
    activeFiltersCount,
    showAdvanced,
    onToggleAdvanced
  } = useFilters(missions);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    onFilterChange('searchQuery', searchQuery);
  }, [searchQuery, onFilterChange]);

  const handleParticipate = async (missionId: string) => {
    const success = await participateInMission(missionId);
    if (success) {
      console.log('Inscription réussie !');
    }
  };

  const handleCancel = async (missionId: string) => {
    const success = await cancelMissionParticipation(missionId);
    if (success) {
      console.log('Annulation réussie !');
    }
  };

  // Rendu mobile
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Mobile */}
        <div className="bg-card border-b border-border p-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">Voisin Solidaire</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="pb-20">
          {activeTab === 'home' && (
            <div className="p-4 space-y-6">
              {/* Stats utilisateur */}
              <UserStatsCard />

              {/* Missions du jour */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Missions aujourd'hui</h2>
                  <Badge variant="secondary">{filteredMissions.length}</Badge>
                </div>
                <div className="space-y-3">
                  {filteredMissions.slice(0, 3).map((mission) => (
                    <MobileMissionCard
                      key={mission.id}
                      mission={mission}
                      onParticipate={() => handleParticipate(mission.id)}
                      variant="today"
                    />
                  ))}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 text-center cursor-pointer hover:bg-accent/50" onClick={() => setActiveTab('explore')}>
                  <Search className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">Explorer</span>
                </Card>
                <Card className="p-4 text-center cursor-pointer hover:bg-accent/50" onClick={() => setActiveTab('missions')}>
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">Mes missions</span>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="p-4 space-y-4">
              {/* Barre de recherche */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher des missions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Panneau de filtres */}
              {showFilters && (
                <FilterPanel
                  filters={filters}
                  onFilterChange={onFilterChange}
                  onClearFilters={onClearFilters}
                  activeFiltersCount={activeFiltersCount}
                  showAdvanced={showAdvanced}
                  onToggleAdvanced={onToggleAdvanced}
                />
              )}

              {/* Liste des missions */}
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : filteredMissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune mission trouvée
                  </div>
                ) : (
                  filteredMissions.map((mission) => (
                    <MobileMissionCard
                      key={mission.id}
                      mission={mission}
                      onParticipate={() => handleParticipate(mission.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <div className="p-4 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Mes missions</h2>
              
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">À venir</TabsTrigger>
                  <TabsTrigger value="completed">Terminées</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-3 mt-4">
                  {userMissions.filter(m => m.status === 'published').map((mission) => (
                    <MobileMissionCard
                      key={mission.id}
                      mission={mission}
                      onCancel={() => handleCancel(mission.id)}
                      variant="upcoming"
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-3 mt-4">
                  {userMissions.filter(m => m.status === 'completed').map((mission) => (
                    <MobileMissionCard
                      key={mission.id}
                      mission={mission}
                      showActions={false}
                    />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-4 space-y-6">
              {/* En-tête profil */}
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={userProfile?.avatar_url} />
                  <AvatarFallback>
                    {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-foreground">
                  {userProfile?.first_name} {userProfile?.last_name}
                </h2>
                <p className="text-muted-foreground">{userProfile?.email}</p>
              </div>

              {/* Stats détaillées */}
              <UserStatsCard title="Mon impact" />

              {/* Badges */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Mes badges</h3>
                <div className="grid grid-cols-3 gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-lg text-center border ${
                        badge.earned 
                          ? 'bg-primary/10 border-primary text-primary' 
                          : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                      }`}
                    >
                      <Award className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-xs font-medium">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions du profil */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Mes associations favorites
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Mon impact détaillé
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation inférieure */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="grid grid-cols-4 gap-1 p-2">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              className="flex flex-col h-auto py-2"
              onClick={() => setActiveTab('home')}
            >
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs">Accueil</span>
            </Button>
            <Button
              variant={activeTab === 'explore' ? 'default' : 'ghost'}
              className="flex flex-col h-auto py-2"
              onClick={() => setActiveTab('explore')}
            >
              <Compass className="h-5 w-5 mb-1" />
              <span className="text-xs">Explorer</span>
            </Button>
            <Button
              variant={activeTab === 'missions' ? 'default' : 'ghost'}
              className="flex flex-col h-auto py-2"
              onClick={() => setActiveTab('missions')}
            >
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs">Missions</span>
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              className="flex flex-col h-auto py-2"
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-5 w-5 mb-1" />
              <span className="text-xs">Profil</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Rendu desktop/tablette
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border p-6">
        <h1 className="text-xl font-bold text-primary mb-8">Voisin Solidaire</h1>
        
        <nav className="space-y-2">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('home')}
          >
            <Home className="h-4 w-4 mr-2" />
            Accueil
          </Button>
          <Button
            variant={activeTab === 'explore' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('explore')}
          >
            <Compass className="h-4 w-4 mr-2" />
            Explorer
          </Button>
          <Button
            variant={activeTab === 'missions' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('missions')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Mes missions
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-4 w-4 mr-2" />
            Profil
          </Button>
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {activeTab === 'home' && 'Tableau de bord'}
                {activeTab === 'explore' && 'Explorer les missions'}
                {activeTab === 'missions' && 'Mes missions'}
                {activeTab === 'profile' && 'Mon profil'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile?.avatar_url} />
                <AvatarFallback>
                  {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Contenu de l'onglet */}
        <div className="p-6">
          {activeTab === 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <UserStatsCard />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Missions recommandées</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredMissions.slice(0, 3).map((mission) => (
                      <MobileMissionCard
                        key={mission.id}
                        mission={mission}
                        onParticipate={() => handleParticipate(mission.id)}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Prochaines missions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userMissions.slice(0, 3).map((mission) => (
                      <div key={mission.id} className="p-3 border rounded-lg mb-3 last:mb-0">
                        <h4 className="font-medium">{mission.title}</h4>
                        <p className="text-sm text-muted-foreground">{mission.city}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="space-y-6">
              {/* Barre de recherche et filtres */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher des missions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2">{activeFiltersCount}</Badge>
                  )}
                </Button>
              </div>

              {showFilters && (
                <Card>
                  <CardContent className="pt-6">
                    <FilterPanel
                      filters={filters}
                      onFilterChange={onFilterChange}
                      onClearFilters={onClearFilters}
                      activeFiltersCount={activeFiltersCount}
                      showAdvanced={showAdvanced}
                      onToggleAdvanced={onToggleAdvanced}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Grille des missions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : filteredMissions.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    Aucune mission trouvée
                  </div>
                ) : (
                  filteredMissions.map((mission) => (
                    <MobileMissionCard
                      key={mission.id}
                      mission={mission}
                      onParticipate={() => handleParticipate(mission.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <div className="space-y-6">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList>
                  <TabsTrigger value="upcoming">Missions à venir</TabsTrigger>
                  <TabsTrigger value="completed">Missions terminées</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {userMissions.filter(m => m.status === 'published').map((mission) => (
                      <MobileMissionCard
                        key={mission.id}
                        mission={mission}
                        onCancel={() => handleCancel(mission.id)}
                        variant="upcoming"
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {userMissions.filter(m => m.status === 'completed').map((mission) => (
                      <MobileMissionCard
                        key={mission.id}
                        mission={mission}
                        showActions={false}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informations profil */}
                <Card className="lg:col-span-1">
                  <CardContent className="pt-6 text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={userProfile?.avatar_url} />
                      <AvatarFallback>
                        {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">
                      {userProfile?.first_name} {userProfile?.last_name}
                    </h3>
                    <p className="text-muted-foreground">{userProfile?.email}</p>
                  </CardContent>
                </Card>

                {/* Stats et badges */}
                <div className="lg:col-span-2 space-y-6">
                  <UserStatsCard />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Mes badges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {badges.map((badge) => (
                          <div
                            key={badge.id}
                            className={`p-4 rounded-lg text-center border ${
                              badge.earned 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                            }`}
                          >
                            <Award className="h-8 w-8 mx-auto mb-2" />
                            <h4 className="font-medium">{badge.name}</h4>
                            <p className="text-xs">{badge.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
