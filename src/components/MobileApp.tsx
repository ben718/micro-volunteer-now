
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Home, 
  Search, 
  Zap, 
  Calendar, 
  User, 
  Settings,
  Bell,
  MapPin,
  Clock,
  Filter,
  SlidersHorizontal,
  Menu,
  X
} from 'lucide-react';

// Hooks
import { useMissions } from '@/hooks/useMissions';
import { useFilters } from '@/hooks/useFilters';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';

// Components
import MissionCard from '@/components/mobile/MissionCard';
import FilterPanel from '@/components/mobile/FilterPanel';
import UserStatsCard from '@/components/mobile/UserStatsCard';

const MobileApp = () => {
  const [currentView, setCurrentView] = useState<'home' | 'explorer' | 'missions' | 'profile'>('home');
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Hooks
  const { missions, userMissions, participateInMission, cancelMission } = useMissions();
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

  const categories = [
    { name: "Alimentaire", icon: "🍽️", color: "bg-blue-100 text-blue-700" },
    { name: "Education", icon: "📚", color: "bg-green-100 text-green-700" },
    { name: "Social", icon: "😊", color: "bg-yellow-100 text-yellow-700" },
    { name: "Plus", icon: "+", color: "bg-gray-100 text-gray-700" }
  ];

  const handleParticipate = (missionId: string) => {
    participateInMission(missionId);
    updateStats({ 
      missions: userStats.missions + 1,
      associations: userStats.associations
    });
  };

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="bg-gradient-to-r from-primary to-success p-2 rounded-xl">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="ml-2 text-lg font-bold text-gray-800">Voisin Solidaire</span>
        </div>
        
        {/* Navigation */}
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
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${
                currentView === item.key ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              {item.label}
              {item.key === 'missions' && userMissions.length > 0 && (
                <Badge className="ml-auto bg-red-500 text-white text-xs">{userMissions.length}</Badge>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile in Sidebar */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Jean Dupont</p>
              <p className="text-xs text-gray-500">Débutant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Header Component
  const MobileHeader = ({ title }: { title: string }) => (
    <div className="lg:hidden bg-white px-4 py-4 flex items-center justify-between border-b">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="ml-2 text-xl font-bold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          JD
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar Overlay
  const MobileSidebar = () => (
    <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
      <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-primary to-success p-2 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-lg font-bold text-gray-800">Voisin Solidaire</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
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
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors ${
                currentView === item.key
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${
                currentView === item.key ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  // Desktop Header Component
  const DesktopHeader = ({ title }: { title: string }) => (
    <div className="hidden lg:block bg-white px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-800" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              JD
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-700">Jean Dupont</div>
              <div className="text-gray-500">Niveau: Débutant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHomeView = () => (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <MobileHeader title="Voisin Solidaire" />
      <DesktopHeader title="Tableau de bord" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">Bonjour, Jean 👋</h2>
          <p className="text-gray-600 text-sm lg:text-base">Prêt à aider près de chez vous aujourd'hui ?</p>
        </div>

        {/* Grid Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Impact Stats */}
          <div className="lg:col-span-1">
            <UserStatsCard stats={userStats} />
          </div>

          {/* Quick Actions - Desktop Only */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Actions rapides</h3>
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

        {/* Missions Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Instant Missions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Missions instantanées</h3>
              <button 
                className="text-blue-600 text-sm hover:text-blue-800"
                onClick={() => setCurrentView('explorer')}
              >
                Voir tout
              </button>
            </div>
            <div className="space-y-3">
              {missions.filter(m => m.isUrgent || m.startTime.includes('min')).slice(0, 2).map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onParticipate={handleParticipate}
                  variant="default"
                />
              ))}
            </div>
          </div>

          {/* Upcoming Missions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Vos missions à venir</h3>
              <button 
                className="text-blue-600 text-sm hover:text-blue-800"
                onClick={() => setCurrentView('missions')}
              >
                Voir tout
              </button>
            </div>
            {userMissions.length > 0 ? (
              userMissions.slice(0, 2).map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onCancel={cancelMission}
                  variant="upcoming"
                />
              ))
            ) : (
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm">Aucune mission à venir</p>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setCurrentView('explorer')}
                >
                  Explorer les missions
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Catégories</h3>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="text-center cursor-pointer group"
                onClick={() => {
                  if (category.name !== "Plus") {
                    setCurrentView('explorer');
                    updateFilter('category', category.name.toLowerCase());
                  }
                }}
              >
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full ${category.color} flex items-center justify-center mb-2 transition-transform group-hover:scale-105`}>
                  <span className="text-xl lg:text-2xl">{category.icon}</span>
                </div>
                <span className="text-xs lg:text-sm text-gray-600">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExplorerView = () => (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <MobileHeader title="Explorer" />
      <DesktopHeader title="Explorer les missions" />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une mission..."
                className="pl-10 bg-white border-gray-200 h-12"
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

        {/* Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel - Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl p-4 sticky top-4">
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

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-6">
            {/* Map placeholder */}
            <div className="bg-gray-100 rounded-xl h-48 lg:h-64 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                <p className="font-medium text-lg">Carte des missions à proximité</p>
                <p className="text-sm">{filteredMissions.length} missions disponibles</p>
              </div>
            </div>

            {/* Mobile Filters */}
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

            {/* Results */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-lg">
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
                      onParticipate={handleParticipate}
                      variant="default"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Aucune mission trouvée
                  </h3>
                  <p className="text-gray-600 mb-4">
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
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <MobileHeader title="Mes Missions" />
        <DesktopHeader title="Mes Missions" />

        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{upcomingMissions.length}</div>
              <div className="text-xs lg:text-sm text-gray-500">À venir</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{todayMissions.length}</div>
              <div className="text-xs lg:text-sm text-gray-500">Aujourd'hui</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.missions}</div>
              <div className="text-xs lg:text-sm text-gray-500">Total</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 max-w-md">
            <button className="flex-1 py-2 text-center text-sm font-medium bg-white text-blue-600 rounded-md shadow-sm">
              À venir
            </button>
            <button className="flex-1 py-2 text-center text-sm font-medium text-gray-600">
              Passées
            </button>
          </div>

          {/* Desktop Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today */}
            {todayMissions.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-4 text-lg">Aujourd'hui</h3>
                <div className="space-y-3">
                  {todayMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onCancel={cancelMission}
                      variant="today"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            {upcomingMissions.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-4 text-lg">Cette semaine</h3>
                <div className="space-y-3">
                  {upcomingMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onCancel={cancelMission}
                      variant="upcoming"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Empty state */}
          {userMissions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Aucune mission programmée
              </h3>
              <p className="text-gray-600 mb-4">
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
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <MobileHeader title="Profil" />
      <DesktopHeader title="Mon Profil" />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  JD
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Jean Dupont</h3>
                <p className="text-sm text-gray-600 mb-2">Membre depuis juin 2025</p>
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  Paris 19ème
                </div>
                <Button variant="outline" className="w-full text-blue-600 border-blue-600">
                  Modifier mon profil
                </Button>
              </div>
            </div>
          </div>

          {/* Stats and Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Impact Stats */}
            <UserStatsCard stats={userStats} title="Mon impact" />

            {/* Badges */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Mes badges</h3>
                <button className="text-blue-600 text-sm hover:text-blue-800">Voir tout</button>
              </div>
              <div className="grid grid-cols-4 lg:grid-cols-6 gap-4">
                {badges.map((badge, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full ${badge.color} flex items-center justify-center mb-2 ${!badge.earned && 'opacity-50'}`}>
                      <span className="text-lg lg:text-xl">{badge.icon}</span>
                    </div>
                    <span className="text-xs lg:text-sm text-gray-600">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Mes préférences</h3>
            
            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Catégories préférées</h4>
              <div className="flex flex-wrap gap-2">
                {preferredCategories.map((category, index) => (
                  <Badge 
                    key={index}
                    className={`cursor-pointer ${category.active ? category.color : 'border-dashed border-gray-300 text-gray-500 bg-transparent'}`}
                    onClick={() => toggleCategory(category.name)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Max Distance */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Distance maximale</h4>
                <span className="text-sm text-blue-600 font-medium">{maxDistance[0]} km</span>
              </div>
              <Slider
                value={maxDistance}
                onValueChange={setMaxDistance}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Preferred Duration */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Durée préférée</h4>
              <div className="flex flex-wrap gap-2">
                {['15 min', '30 min', '1h', '2h+'].map((duration) => (
                  <Badge 
                    key={duration}
                    className={`cursor-pointer ${preferredDuration === duration ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setDuration(duration)}
                  >
                    {duration}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* My Associations */}
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Mes associations</h3>
              <button className="text-blue-600 text-sm hover:text-blue-800">Voir tout</button>
            </div>
            <div className="space-y-4">
              {userAssociations.map((association, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">{association.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{association.name}</h4>
                    <p className="text-sm text-gray-500">{association.missions} missions effectuées</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-white">
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Mobile Sidebar Overlay */}
      <MobileSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Main Views */}
        {currentView === 'home' && renderHomeView()}
        {currentView === 'explorer' && renderExplorerView()}
        {currentView === 'missions' && renderMissionsView()}
        {currentView === 'profile' && renderProfileView()}

        {/* Bottom Navigation - Mobile Only */}
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                currentView === 'home' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Home className="h-6 w-6 mb-1" />
              <span className="text-xs">Accueil</span>
            </button>
            
            <button
              onClick={() => setCurrentView('explorer')}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                currentView === 'explorer' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Search className="h-6 w-6 mb-1" />
              <span className="text-xs">Explorer</span>
            </button>

            <div className="flex flex-col items-center py-2 px-3">
              <div className="bg-orange-500 rounded-full p-3 mb-1 cursor-pointer hover:bg-orange-600 transition-colors">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>

            <button
              onClick={() => setCurrentView('missions')}
              className={`flex flex-col items-center py-2 px-3 transition-colors relative ${
                currentView === 'missions' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Calendar className="h-6 w-6 mb-1" />
              <span className="text-xs">Missions</span>
              {userMissions.length > 0 && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setCurrentView('profile')}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                currentView === 'profile' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <User className="h-6 w-6 mb-1" />
              <span className="text-xs">Profil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
