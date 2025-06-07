
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MapPin } from 'lucide-react';
import MobileMissionCard from './MissionCard';
import FilterPanel from './FilterPanel';
import { useFilters } from '@/hooks/useFilters';
import { useMissions } from '@/hooks/useMissions';

const MobileExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { filters, updateFilter, clearFilters, activeFiltersCount } = useFilters();
  const { missions, loading, participateInMission } = useMissions();

  // Filtrer les missions selon la recherche
  const filteredMissions = missions.filter(mission => 
    mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mission.short_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleParticipate = async (missionId: string) => {
    const success = await participateInMission(missionId);
    if (success) {
      console.log('Inscription réussie');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Explorer</h1>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher une mission..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white rounded-2xl border-gray-200"
        />
      </div>

      {/* Carte des missions */}
      <div className="bg-gray-100 rounded-2xl h-48 flex items-center justify-center border border-gray-200">
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-500" />
          <p className="font-medium">Carte des missions à proximité</p>
        </div>
      </div>

      {/* Filtres */}
      <FilterPanel
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
        showAdvanced={showFilters}
        onToggleAdvanced={() => setShowFilters(!showFilters)}
      />

      {/* Missions disponibles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Missions disponibles ({filteredMissions.length})
          </h2>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-gray-500">Chargement des missions...</div>
          ) : filteredMissions.length > 0 ? (
            filteredMissions.map((mission) => (
              <MobileMissionCard
                key={mission.id}
                mission={mission}
                onParticipate={() => handleParticipate(mission.id)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500">
              {searchQuery ? 'Aucune mission trouvée' : 'Aucune mission disponible'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileExplorer;
