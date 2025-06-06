
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
  SlidersHorizontal
} from 'lucide-react';

// Hooks
import { useMissions } from '@/hooks/useMissions';
import { useFilters } from '@/hooks/useFilters';
import { useUserProfile } from '@/hooks/useUserProfile';

// Components
import MissionCard from '@/components/mobile/MissionCard';
import FilterPanel from '@/components/mobile/FilterPanel';
import UserStatsCard from '@/components/mobile/UserStatsCard';

const MobileApp = () => {
  const [currentView, setCurrentView] = useState<'home' | 'explorer' | 'missions' | 'profile'>('home');
  const [showFilters, setShowFilters] = useState(false);
  
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
    // Update user stats
    updateStats({ 
      missions: userStats.missions + 1,
      associations: userStats.associations
    });
  };

  const renderHomeView = () => (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Voisin Solidaire</h1>
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

      <div className="p-4 space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Bonjour, Jean 👋</h2>
          <p className="text-gray-600 text-sm">Prêt à aider près de chez vous aujourd'hui ?</p>
        </div>

        {/* Impact Stats */}
        <UserStatsCard stats={userStats} />

        {/* Instant Missions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Missions instantanées</h3>
            <button 
              className="text-blue-600 text-sm"
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

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Catégories</h3>
          <div className="flex justify-between">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="text-center cursor-pointer"
                onClick={() => {
                  if (category.name !== "Plus") {
                    setCurrentView('explorer');
                    updateFilter('category', category.name.toLowerCase());
                  }
                }}
              >
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-2 transition-transform hover:scale-105`}>
                  <span className="text-xl">{category.icon}</span>
                </div>
                <span className="text-xs text-gray-600">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Missions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Vos missions à venir</h3>
            <button 
              className="text-blue-600 text-sm"
              onClick={() => setCurrentView('missions')}
            >
              Voir tout
            </button>
          </div>
          {userMissions.length > 0 ? (
            userMissions.slice(0, 1).map((mission) => (
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
    </div>
  );

  const renderExplorerView = () => (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Explorer</h1>
          <SlidersHorizontal 
            className="h-6 w-6 text-gray-600 cursor-pointer" 
            onClick={() => setShowFilters(!showFilters)}
          />
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une mission..."
            className="pl-10 bg-gray-50 border-gray-200"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Map placeholder */}
        <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Carte des missions à proximité</p>
            <p className="text-sm">{filteredMissions.length} missions disponibles</p>
          </div>
        </div>

        {/* Filters */}
        <FilterPanel
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          activeFiltersCount={activeFiltersCount}
          showAdvanced={showFilters}
          onToggleAdvanced={() => setShowFilters(!showFilters)}
        />

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">
              Missions disponibles ({filteredMissions.length})
            </h3>
            {filters.urgency && (
              <Badge variant="destructive" className="animate-pulse">
                {filteredMissions.filter(m => m.isUrgent).length} urgentes
              </Badge>
            )}
          </div>
          
          {filteredMissions.length > 0 ? (
            <div className="space-y-3">
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
            <div className="text-center py-8">
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
  );

  const renderMissionsView = () => {
    const todayMissions = userMissions.filter(m => m.status === 'today');
    const upcomingMissions = userMissions.filter(m => m.status === 'upcoming');

    return (
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Mes Missions</h1>
            <Filter className="h-6 w-6 text-gray-600" />
          </div>
          
          {/* Tabs */}
          <div className="flex mt-4 bg-gray-100 rounded-lg p-1">
            <button className="flex-1 py-2 text-center text-sm font-medium bg-white text-blue-600 rounded-md shadow-sm">
              À venir
            </button>
            <button className="flex-1 py-2 text-center text-sm font-medium text-gray-600">
              Passées
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{upcomingMissions.length}</div>
              <div className="text-xs text-gray-500">À venir</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{todayMissions.length}</div>
              <div className="text-xs text-gray-500">Aujourd'hui</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-orange-600">{userStats.missions}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>

          {/* Today */}
          {todayMissions.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Aujourd'hui</h3>
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
              <h3 className="font-medium text-gray-700 mb-3">Cette semaine</h3>
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
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Profil</h1>
          <Settings className="h-6 w-6 text-gray-600" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Info */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              JD
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">Jean Dupont</h3>
              <p className="text-sm text-gray-600">Membre depuis juin 2025</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                Paris 19ème
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full text-blue-600 border-blue-600">
            Modifier mon profil
          </Button>
        </div>

        {/* Impact Stats */}
        <UserStatsCard stats={userStats} title="Mon impact" />

        {/* Badges */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Mes badges</h3>
            <button className="text-blue-600 text-sm">Voir tout</button>
          </div>
          <div className="flex justify-between">
            {badges.map((badge, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center mb-2 ${!badge.earned && 'opacity-50'}`}>
                  <span className="text-lg">{badge.icon}</span>
                </div>
                <span className="text-xs text-gray-600">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Mes préférences</h3>
          
          {/* Categories */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Catégories préférées</h4>
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
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
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
            <h4 className="text-sm font-medium text-gray-700 mb-2">Durée préférée</h4>
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
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Mes associations</h3>
            <button className="text-blue-600 text-sm">Voir tout</button>
          </div>
          <div className="space-y-3">
            {userAssociations.map((association, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{association.avatar}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{association.name}</h4>
                  <p className="text-xs text-gray-500">{association.missions} missions effectuées</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Main Content */}
      {currentView === 'home' && renderHomeView()}
      {currentView === 'explorer' && renderExplorerView()}
      {currentView === 'missions' && renderMissionsView()}
      {currentView === 'profile' && renderProfileView()}

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
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
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
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
  );
};

export default MobileApp;
