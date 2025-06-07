
import { useState } from 'react';

export interface Filters {
  category: string;
  distance: string;
  duration: string;
  availability: string;
  urgency: boolean;
}

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    distance: 'all',
    duration: 'all',
    availability: 'all',
    urgency: false,
  });

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      distance: 'all',
      duration: 'all',
      availability: 'all',
      urgency: false,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.distance !== 'all') count++;
    if (filters.duration !== 'all') count++;
    if (filters.availability !== 'all') count++;
    if (filters.urgency) count++;
    return count;
  };

  return {
    filters,
    updateFilter,
    clearFilters,
    activeFiltersCount: getActiveFiltersCount(),
  };
};
