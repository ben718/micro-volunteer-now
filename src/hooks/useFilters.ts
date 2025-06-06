
import { useState, useMemo } from 'react';
import { Mission } from '@/types/mission';

export interface Filters {
  search: string;
  category: string;
  duration: string;
  distance: string;
  urgency: boolean;
  availability: string;
}

export const useFilters = (missions: Mission[]) => {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    duration: 'all',
    distance: 'all',
    urgency: false,
    availability: 'all'
  });

  const filteredMissions = useMemo(() => {
    return missions.filter(mission => {
      // Search filter
      if (filters.search && !mission.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !mission.association.toLowerCase().includes(filters.search.toLowerCase()) &&
          !mission.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && mission.category !== filters.category) {
        return false;
      }

      // Duration filter
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

      // Urgency filter
      if (filters.urgency && !mission.isUrgent) {
        return false;
      }

      // Availability filter
      if (filters.availability === 'now' && !mission.startTime.includes('min')) {
        return false;
      }

      return true;
    });
  }, [missions, filters]);

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      duration: 'all',
      distance: 'all',
      urgency: false,
      availability: 'all'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'all' && value !== false && value !== ''
  ).length;

  return {
    filters,
    filteredMissions,
    updateFilter,
    clearFilters,
    activeFiltersCount
  };
};
