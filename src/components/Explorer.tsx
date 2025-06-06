import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Map, List, Clock, MapPin, Users, SlidersHorizontal } from 'lucide-react';
import MissionCard from './MissionCard';
import { missionService } from '@/lib/supabase';

const Explorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    availability: 'all',
    duration: 'all',
    category: 'all',
    distance: 'all',
    urgency: false
  });
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'Aide alimentaire',
    'Accompagnement',
    'Environnement',
    'Éducation',
    'Santé',
    'Culture',
    'Sport'
  ];

  useEffect(() => {
    async function fetchMissions() {
      setLoading(true);
      setError(null);
      try {
        const data = await missionService.getAvailableMissions();
        setMissions(data || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMissions();
  }, []);

  const filteredMissions = missions.filter(mission => {
    // Recherche textuelle
    if (searchQuery && !mission.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mission.association_name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mission.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Filtre par catégorie
    if (selectedFilters.category !== 'all' && mission.category !== selectedFilters.category) {
      return false;
    }
    // Filtre par durée
    if (selectedFilters.duration !== 'all') {
      const duration = parseInt(mission.duration);
      switch (selectedFilters.duration) {
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
    if (selectedFilters.urgency && !mission.isUrgent) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSelectedFilters({
      availability: 'all',
      duration: 'all',
      category: 'all',
      distance: 'all',
      urgency: false
    });
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(selectedFilters).filter(value => 
    value !== 'all' && value !== false
  ).length + (searchQuery ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Explorer les missions</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-1" />
              Liste
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="h-4 w-4 mr-1" />
              Carte
            </Button>
          </div>
        </div>
        
        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une mission, association ou mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres rapides et bouton filtres avancés */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={selectedFilters.urgency ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilters({...selectedFilters, urgency: !selectedFilters.urgency})}
            className="text-xs"
          >
            🚨 Urgent
          </Button>
          
          <Button
            variant={selectedFilters.availability === 'now' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilters({
              ...selectedFilters, 
              availability: selectedFilters.availability === 'now' ? 'all' : 'now'
            })}
            className="text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Maintenant
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs"
          >
            <SlidersHorizontal className="h-3 w-3 mr-1" />
            Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-muted-foreground"
            >
              Effacer tout
            </Button>
          )}
        </div>

        {/* Panneau de filtres avancés */}
        {showFilters && (
          <div className="mt-4 p-4 bg-muted rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Disponibilité</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background"
                  value={selectedFilters.availability}
                  onChange={(e) => setSelectedFilters({...selectedFilters, availability: e.target.value})}
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
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background"
                  value={selectedFilters.duration}
                  onChange={(e) => setSelectedFilters({...selectedFilters, duration: e.target.value})}
                >
                  <option value="all">Toutes durées</option>
                  <option value="15">15 min max</option>
                  <option value="30">30 min max</option>
                  <option value="60">1h et plus</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background"
                  value={selectedFilters.category}
                  onChange={(e) => setSelectedFilters({...selectedFilters, category: e.target.value})}
                >
                  <option value="all">Toutes catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Distance</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background"
                  value={selectedFilters.distance}
                  onChange={(e) => setSelectedFilters({...selectedFilters, distance: e.target.value})}
                >
                  <option value="all">Toutes distances</option>
                  <option value="0.5">Moins de 500m</option>
                  <option value="1">Moins de 1 km</option>
                  <option value="2">Moins de 2 km</option>
                  <option value="5">Moins de 5 km</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques et résultats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{filteredMissions.length}</span> missions trouvées
          </p>
          {selectedFilters.urgency && (
            <Badge variant="destructive" className="animate-pulse-gentle">
              {filteredMissions.filter(m => m.isUrgent).length} urgentes
            </Badge>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Paris 11ème - Triées par proximité</span>
        </div>
      </div>

      {/* Résultats */}
      {loading ? (
        <div>Chargement...</div>
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMissions.map((mission, index) => (
            <MissionCard
              key={index}
              {...mission}
              onParticipate={() => console.log(`Participer à: ${mission.title}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center border border-border">
          <div className="text-center text-muted-foreground">
            <Map className="h-12 w-12 mx-auto mb-4" />
            <p className="font-medium">Vue carte interactive</p>
            <p className="text-sm">Intégration Mapbox à venir</p>
            <p className="text-sm mt-2">{filteredMissions.length} missions à afficher</p>
          </div>
        </div>
      )}

      {/* Message si aucun résultat */}
      {filteredMissions.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Aucune mission trouvée
          </h3>
          <p className="text-muted-foreground mb-4">
            Essayez de modifier vos critères de recherche ou supprimez certains filtres
          </p>
          <Button onClick={clearFilters}>
            Effacer tous les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default Explorer;
