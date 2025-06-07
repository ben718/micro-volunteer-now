
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, SlidersHorizontal } from 'lucide-react';
import { Filters } from '@/hooks/useFilters';

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: any) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
  showAdvanced,
  onToggleAdvanced
}) => {
  const categories = [
    'alimentaire',
    'social',
    'environnement',
    'éducation',
    'santé',
    'culture',
    'sport'
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={filters.urgency ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('urgency', !filters.urgency)}
          className="text-xs"
        >
          🚨 Urgent
        </Button>
        
        <Button
          variant={filters.availability === 'now' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('availability', filters.availability === 'now' ? 'all' : 'now')}
          className="text-xs"
        >
          <Clock className="h-3 w-3 mr-1" />
          Maintenant
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAdvanced}
          className="text-xs"
        >
          <SlidersHorizontal className="h-3 w-3 mr-1" />
          Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-muted-foreground"
          >
            Effacer tout
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge 
          className={`px-3 py-1 cursor-pointer ${filters.category === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          onClick={() => onFilterChange('category', 'all')}
        >
          Tous
        </Badge>
        <Badge 
          variant="outline" 
          className={`px-3 py-1 cursor-pointer ${filters.duration === '15' ? 'bg-primary text-primary-foreground border-primary' : ''}`}
          onClick={() => onFilterChange('duration', filters.duration === '15' ? 'all' : '15')}
        >
          moins de 15 min
        </Badge>
        <Badge 
          variant="outline" 
          className={`px-3 py-1 cursor-pointer ${filters.distance === '1' ? 'bg-primary text-primary-foreground border-primary' : ''}`}
          onClick={() => onFilterChange('distance', filters.distance === '1' ? 'all' : '1')}
        >
          moins de 1 km
        </Badge>
        <Badge 
          variant="outline" 
          className={`px-3 py-1 cursor-pointer ${filters.availability === 'today' ? 'bg-primary text-primary-foreground border-primary' : ''}`}
          onClick={() => onFilterChange('availability', filters.availability === 'today' ? 'all' : 'today')}
        >
          Aujourd'hui
        </Badge>
      </div>

      {showAdvanced && (
        <div className="mt-4 p-4 bg-muted rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Disponibilité</label>
              <select 
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground"
                value={filters.availability}
                onChange={(e) => onFilterChange('availability', e.target.value)}
              >
                <option value="all">Toutes</option>
                <option value="now">Maintenant</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Durée</label>
              <select 
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground"
                value={filters.duration}
                onChange={(e) => onFilterChange('duration', e.target.value)}
              >
                <option value="all">Toutes durées</option>
                <option value="15">15 min max</option>
                <option value="30">30 min max</option>
                <option value="60">1h et plus</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
            <select 
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground"
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
            >
              <option value="all">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
