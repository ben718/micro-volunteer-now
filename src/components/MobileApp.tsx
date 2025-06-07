
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  Calendar, 
  User, 
  Bell,
  MapPin,
  Clock,
  Menu,
  X,
  Plus,
  SlidersHorizontal,
  Users
} from 'lucide-react';

// Hooks
import { useMissions } from '@/hooks/useMissions';
import { useFilters } from '@/hooks/useFilters';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useCategories } from '@/hooks/useCategories';

// Components
import MissionCard from '@/components/mobile/MissionCard';
import FilterPanel from '@/components/mobile/FilterPanel';
import UserStatsCard from '@/components/mobile/UserStatsCard';

const MobileApp = () => {
  const [currentView, setCurrentView] = useState<'home' | 'explorer' | 'missions' | 'profile'>('home');
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Hooks
  const { missions, userMissions, participateInMission, cancelMission, loading } = useMissions();
  const { filters, filteredMissions, updateFilter, clearFilters, activeFiltersCount } = useFilters(missions);
  const { 
    userStats, 
    badges, 
    preferredCategories, 
    maxDistance, 
    preferredDuration,
    userAssociations,
    updateStats,
    toggleCategory,
    setMaxDistance,
    setDuration
  } = useUserProfile();
  const { categories } = useCategories();

  // Données factices pour les notifications
  const notifications = [
    { id: 1, is_read: false, message: "Nouvelle mission disponible" },
    { id: 2, is_read: true, message: "Mission confirmée" }
  ];

  const handleParticipate = (missionId: string) => {
    participateInMission(missionId);
    updateStats({ 
      missions: userStats.missions + 1,
      associations: userStats.associations
    });
  };

  // Mobile Header Component
  const MobileHeader = ({ title }: { title: string }) => (
    <div className="lg:hidden bg-card px-4 py-3 flex items-center justify-between border-b sticky top-0 z-40 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="ml-2 text-lg font-bold text-foreground truncate">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => {/* Navigation vers notifications */}}
        >
          <Bell className="h-5 w-5" />
          {notifications.some(notif => !notif.is_read) && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></div>
          )}
        </button>
        <button 
          className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold"
          onClick={() => setCurrentView('profile')}
        >
          JD
        </button>
      </div>
    </div>
  );

  // Mobile Sidebar Overlay
  const MobileSidebar = () => (
    <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
      <div 
        className="fixed inset-0 bg-black bg-opacity-25" 
        onClick={() => setSidebarOpen(false)}
      />
      <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-card shadow-xl">
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-2 rounded-xl">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="ml-2 text-lg font-bold text-foreground">Voisin Solidaire</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {[
            { key: 'home', label: 'Accueil', icon: Home },
            { key: 'explorer', label: 'Explorer', icon: Search },
            { key: 'missions', label: 'Mes Missions', icon: Calendar },
            { key: 'profile', label: 'Profil', icon: User },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setCurrentView(item.key as any);
                setSidebarOpen(false);
              }}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg w-full transition-colors ${
                currentView === item.key
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${
                currentView === item.key ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              }`} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-2 rounded-xl">
            <Home className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="ml-2 text-lg font-bold text-foreground">Voisin Solidaire</span>
        </div>
        
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {[
            { key: 'home', label: 'Accueil', icon: Home },
            { key: 'explorer', label: 'Explorer', icon: Search },
            { key: 'missions', label: 'Mes Missions', icon: Calendar },
            { key: 'profile', label: 'Profil', icon: User },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentView(item.key as any)}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors ${
                currentView === item.key
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${
                currentView === item.key ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              }`} />
              {item.label}
              {item.key === 'missions' && userMissions.length > 0 && (
                <Badge className="ml-auto bg-destructive text-destructive-foreground text-xs">{userMissions.length}</Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="flex-shrink-0 flex border-t border-border p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">Jean Dupont</p>
              <p className="text-xs text-muted-foreground">Débutant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Header Component
  const DesktopHeader = ({ title }: { title: string }) => (
    <div className="hidden lg:block bg-card px-6 py-4 border-b border-border">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-foreground" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
              JD
            </div>
            <div className="text-sm">
              <div className="font-medium text-foreground">Jean Dupont</div>
              <div className="text-muted-foreground">Niveau: Débutant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Bottom Navigation - Mobile Only
  const MobileNavigation = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 safe-area-pb">
      <div className="flex justify-around">
        {[
          { key: 'home', label: 'Accueil', icon: Home },
          { key: 'explorer', label: 'Explorer', icon: Search },
          { key: 'missions', label: 'Missions', icon: Calendar },
          { key: 'profile', label: 'Profil', icon: User }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentView(tab.key as any)}
            className={`flex flex-col items-center py-2 px-1 min-w-0 flex-1 ${
              currentView === tab.key
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <tab.icon className="h-5 w-5 mb-1" />
            <span className="text-xs truncate">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderHomeView = () => (
    <div className="flex-1 bg-background overflow-y-auto pb-20 lg:pb-0">
      <MobileHeader title="Voisin Solidaire" />
      <DesktopHeader title="Tableau de bord" />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <h2 className="text-lg lg:text-2xl font-bold text-foreground mb-1">Bonjour, Jean 👋</h2>
          <p className="text-muted-foreground text-sm lg:text-base">Prêt à aider près de chez vous aujourd'hui ?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-1">
            <UserStatsCard />
          </div>

          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Actions rapides</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => setCurrentView('explorer')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Search className="h-6 w-6" />
                  <span>Explorer les missions</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView('missions')}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Calendar className="h-6 w-6" />
                  <span>Mes missions</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3">Catégories</h3>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setCurrentView('explorer');
                  updateFilter('category', category.name.toLowerCase());
                }}
                className="text-center group"
              >
                <div className={`w-10 h-10 lg:w-16 lg:h-16 rounded-full ${category.color} flex items-center justify-center mb-1 lg:mb-2 transition-transform group-hover:scale-105`}>
                  <span className="text-lg lg:text-2xl">{category.icon}</span>
                </div>
                <span className="text-xs lg:text-sm text-muted-foreground">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExplorerView = () => (
    <div className="flex-1 bg-background overflow-y-auto pb-20 lg:pb-0">
      <MobileHeader title="Explorer" />
      <DesktopHeader title="Explorer les missions" />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une mission..."
                className="pl-10 bg-card border-border h-12"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full h-12 flex items-center justify-center space-x-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-card rounded-xl p-4 sticky top-4">
              <FilterPanel
                filters={filters}
                onFilterChange={updateFilter}
                onClearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
                showAdvanced={true}
                onToggleAdvanced={() => {}}
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 lg:space-y-6">
            <div 
              className="bg-muted rounded-xl h-48 lg:h-64 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
            >
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-primary" />
                <p className="font-medium text-lg">Carte des missions à proximité</p>
                <p className="text-sm">{missions.length} missions disponibles</p>
              </div>
            </div>

            <div className="lg:hidden">
              <FilterPanel
                filters={filters}
                onFilterChange={updateFilter}
                onClearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
                showAdvanced={showFilters}
                onToggleAdvanced={() => setShowFilters(!showFilters)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-lg">
                  Missions disponibles ({filteredMissions.length})
                </h3>
                {filters.urgency && (
                  <Badge variant="destructive" className="animate-pulse">
                    {filteredMissions.filter(m => m.isUrgent).length} urgentes
                  </Badge>
                )}
              </div>
              
              {filteredMissions.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onParticipate={() => handleParticipate(mission.id)}
                      variant="default"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Aucune mission trouvée
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <Button onClick={clearFilters}>
                    Effacer tous les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMissionsView = () => {
    const todayMissions = userMissions.filter(m => m.status === 'today');
    const upcomingMissions = userMissions.filter(m => m.status === 'upcoming');

    return (
      <div className="flex-1 bg-background overflow-y-auto pb-20 lg:pb-0">
        <MobileHeader title="Mes Missions" />
        <DesktopHeader title="Mes Missions" />

        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{upcomingMissions.length}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">À venir</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{todayMissions.length}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Aujourd'hui</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.missions}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {todayMissions.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-4 text-lg">Aujourd'hui</h3>
                <div className="space-y-3">
                  {todayMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onCancel={() => cancelMission(mission.id)}
                      variant="today"
                    />
                  ))}
                </div>
              </div>
            )}

            {upcomingMissions.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-4 text-lg">Cette semaine</h3>
                <div className="space-y-3">
                  {upcomingMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onCancel={() => cancelMission(mission.id)}
                      variant="upcoming"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {userMissions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucune mission programmée
              </h3>
              <p className="text-muted-foreground mb-4">
                Explorez les missions disponibles pour vous engager
              </p>
              <Button onClick={() => setCurrentView('explorer')}>
                Explorer les missions
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfileView = () => (
    <div className="flex-1 bg-background overflow-y-auto pb-20 lg:pb-0">
      <MobileHeader title="Profil" />
      <DesktopHeader title="Mon Profil" />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4">
                  JD
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Jean Dupont</h3>
                <p className="text-sm text-muted-foreground mb-2">Membre depuis juin 2025</p>
                <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  Paris 19ème
                </div>
                <Button variant="outline" className="w-full">
                  Modifier mon profil
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <UserStatsCard title="Mon impact" />

            <div className="bg-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Mes badges</h3>
                <button className="text-primary text-sm hover:text-primary/80">Voir tout</button>
              </div>
              <div className="grid grid-cols-4 lg:grid-cols-6 gap-4">
                {badges.map((badge, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full ${badge.color} flex items-center justify-center mb-2 ${!badge.earned && 'opacity-50'}`}>
                      <span className="text-lg lg:text-xl">{badge.icon}</span>
                    </div>
                    <span className="text-xs lg:text-sm text-muted-foreground">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Mes préférences</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-3">Catégories préférées</h4>
              <div className="flex flex-wrap gap-2">
                {preferredCategories.map((category, index) => (
                  <Badge 
                    key={index}
                    className={`cursor-pointer ${category.active ? category.color : 'border-dashed border-border text-muted-foreground bg-transparent'}`}
                    onClick={() => toggleCategory(category.name)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Durée préférée</h4>
              <div className="flex flex-wrap gap-2">
                {['15 min', '30 min', '1h', '2h+'].map((duration) => (
                  <Badge 
                    key={duration}
                    className={`cursor-pointer ${preferredDuration === duration ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    onClick={() => setDuration(duration)}
                  >
                    {duration}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Mes associations</h3>
              <button className="text-primary text-sm hover:text-primary/80">Voir tout</button>
            </div>
            <div className="space-y-4">
              {userAssociations.map((association, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-lg">{association.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{association.name}</h4>
                    <p className="text-sm text-muted-foreground">{association.missions} missions effectuées</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return renderHomeView();
      case 'explorer':
        return renderExplorerView();
      case 'missions':
        return renderMissionsView();
      case 'profile':
        return renderProfileView();
      default:
        return renderHomeView();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <DesktopSidebar />
      <MobileSidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        {renderCurrentView()}
        <MobileNavigation />
      </div>
    </div>
  );
};

export default MobileApp;
