
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MapPin } from 'lucide-react';
import MobileMissionCard from './MissionCard';
import FilterPanel from './FilterPanel';
import { useFilters } from '@/hooks/useFilters';

const MobileExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { filters, updateFilter, clearFilters, activeFiltersCount } = useFilters();

  // Missions disponibles simulées
  const availableMissions = [
    {
      id: 1,
      title: "Distribution alimentaire",
      short_description: "Aider à distribuer des repas aux personnes sans-abri",
      duration: 15,
      city: "Paris 19ème",
      distance: "500m",
      category: "alimentaire",
      spots_taken: 2,
      spots_available: 4,
      is_urgent: false
    },
    {
      id: 2,
      title: "Lecture aux seniors",
      short_description: "Lire le journal à des personnes âgées",
      duration: 30,
      city: "Paris 19ème",
      distance: "1.2 km",
      category: "social",
      spots_taken: 1,
      spots_available: 2,
      is_urgent: false
    },
    {
      id: 3,
      title: "Aide aux courses",
      short_description: "Accompagner une personne âgée pour ses courses",
      duration: 45,
      city: "Paris 19ème",
      distance: "800m",
      category: "social",
      spots_taken: 0,
      spots_available: 1,
      is_urgent: false
    },
    {
      id: 4,
      title: "Tri de dons",
      short_description: "Aider au tri de vêtements donnés",
      duration: 20,
      city: "Paris 19ème",
      distance: "1.5 km",
      category: "social",
      spots_taken: 1,
      spots_available: 3,
      is_urgent: false
    }
  ];

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
            Missions disponibles ({availableMissions.length})
          </h2>
        </div>

        <div className="space-y-3">
          {availableMissions.map((mission) => (
            <MobileMissionCard
              key={mission.id}
              mission={mission}
              onParticipate={() => console.log('Participer à:', mission.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileExplorer;
