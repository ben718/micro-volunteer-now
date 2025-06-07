
import { useState, useMemo } from 'react';

export interface Filters {
  category: string;
  distance: string;
  duration: string;
  availability: string;
  urgency: boolean;
  searchQuery: string;
}

export const useFilters = (missions: any[] = []) => {
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    distance: 'all',
    duration: 'all',
    availability: 'all',
    urgency: false,
    searchQuery: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const onFilterChange = (key: keyof Filters, value: any) => {
    updateFilter(key, value);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      distance: 'all',
      duration: 'all',
      availability: 'all',
      urgency: false,
      searchQuery: '',
    });
  };

  const onClearFilters = () => {
    clearFilters();
  };

  const onToggleAdvanced = () => {
    setShowAdvanced(prev => !prev);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.distance !== 'all') count++;
    if (filters.duration !== 'all') count++;
    if (filters.availability !== 'all') count++;
    if (filters.urgency) count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  };

  const filteredMissions = useMemo(() => {
    if (!Array.isArray(missions)) return [];
    
    return missions.filter(mission => {
      // Filtre par recherche textuelle
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = [
          mission.title,
          mission.description,
          mission.short_description,
          mission.association_name,
          mission.category
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }
      
      // Filtre par catégorie
      if (filters.category !== 'all' && mission.category !== filters.category) {
        return false;
      }
      
      // Filtre par durée
      if (filters.duration !== 'all') {
        const duration = parseInt(mission.duration);
        switch (filters.duration) {
          case '15':
            if (duration > 15) return false;
            break;
          case '30':
            if (duration > 30) return false;
            break;
          case '60':
            if (duration <= 60) return false;
            break;
        }
      }
      
      // Filtre par urgence
      if (filters.urgency && !mission.is_urgent) {
        return false;
      }
      
      return true;
    });
  }, [missions, filters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    activeFiltersCount: getActiveFiltersCount(),
    filteredMissions,
    onFilterChange,
    onClearFilters,
    showAdvanced,
    onToggleAdvanced,
  };
};
