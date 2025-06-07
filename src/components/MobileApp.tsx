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
                  <Badge variant="secondary">{filteredMissions?.length || 0}</Badge>
                </div>
                <div className="space-y-3">
                  {filteredMissions?.slice(0, 3).map((mission) => (
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
  return null;
};

export default MobileApp;
