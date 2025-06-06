
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Map, List, Clock, MapPin } from 'lucide-react';
import MissionCard from './MissionCard';
import ImpactStats from './ImpactStats';

interface DashboardProps {
  view: 'dashboard' | 'explore' | 'missions' | 'profile';
  onViewChange: (view: 'dashboard' | 'explore' | 'missions' | 'profile') => void;
}

const Dashboard = ({ view, onViewChange }: DashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    availability: 'now',
    duration: 'all',
    category: 'all'
  });
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const userStats = {
    missionsCompleted: 3,
    associationsHelped: 2,
    timeVolunteered: 75,
    pointsEarned: 150
  };

  const userLevel = {
    current: "Voisin Solidaire Débutant",
    progress: 60,
    nextLevel: "Intermédiaire",
    missionsToNext: 2
  };

  const nearbyMissions = [
    {
      title: "Aide aux courses",
      association: "Épicerie Solidaire du 11ème",
      duration: "15 min",
      distance: "0.5 km",
      startTime: "Dans 10 min",
      description: "Aidez à porter les courses des bénéficiaires jusqu'à leur domicile",
      participants: { current: 2, max: 3 },
      category: "Aide alimentaire",
      isUrgent: true
    },
    {
      title: "Distribution de repas",
      association: "Secours Populaire",
      duration: "30 min",
      distance: "1.2 km",
      startTime: "Maintenant",
      description: "Participez à la distribution de repas chauds aux personnes dans le besoin",
      participants: { current: 4, max: 6 },
      category: "Aide alimentaire"
    },
    {
      title: "Accompagnement senior",
      association: "Les Petites Sœurs",
      duration: "45 min",
      distance: "0.8 km",
      startTime: "15h30",
      description: "Accompagnez une personne âgée pour ses courses hebdomadaires",
      participants: { current: 1, max: 2 },
      category: "Accompagnement"
    },
    {
      title: "Nettoyage parc",
      association: "Éco-Quartier",
      duration: "1h",
      distance: "1.5 km",
      startTime: "16h00",
      description: "Participez au nettoyage et à l'entretien du parc de Belleville",
      participants: { current: 3, max: 8 },
      category: "Environnement"
    }
  ];

  const myMissions = [
    {
      title: "Distribution alimentaire",
      association: "Restos du Cœur",
      status: "completed",
      date: "Hier, 14h30",
      duration: "30 min",
      impact: "+50 points"
    },
    {
      title: "Aide aux devoirs",
      association: "Aide aux Enfants",
      status: "upcoming",
      date: "Demain, 16h00",
      duration: "45 min"
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Salutation */}
      <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Bonjour Marie ! 👋
        </h1>
        <p className="text-muted-foreground">
          Prête à faire la différence aujourd'hui ? {nearbyMissions.filter(m => m.isUrgent).length} missions urgentes vous attendent.
        </p>
      </div>

      {/* Missions à proximité */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Missions près de chez vous</h2>
          <Button 
            variant="outline" 
            onClick={() => onViewChange('explore')}
            className="text-sm"
          >
            Voir tout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyMissions.slice(0, 3).map((mission, index) => (
            <MissionCard
              key={index}
              {...mission}
              onParticipate={() => console.log(`Participer à: ${mission.title}`)}
            />
          ))}
        </div>
      </div>

      {/* Statistiques d'impact */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">Votre impact</h2>
        <ImpactStats stats={userStats} level={userLevel} />
      </div>
    </div>
  );

  const renderExplorer = () => (
    <div className="space-y-6">
      {/* En-tête avec recherche */}
      <div className="bg-white border border-border rounded-xl p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Explorer les missions</h1>
        
        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une mission ou une association..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select 
            className="px-3 py-2 border border-border rounded-lg text-sm"
            value={selectedFilters.availability}
            onChange={(e) => setSelectedFilters({...selectedFilters, availability: e.target.value})}
          >
            <option value="now">Disponible maintenant</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
          </select>
          
          <select 
            className="px-3 py-2 border border-border rounded-lg text-sm"
            value={selectedFilters.duration}
            onChange={(e) => setSelectedFilters({...selectedFilters, duration: e.target.value})}
          >
            <option value="all">Toutes durées</option>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="60">1h+</option>
          </select>
          
          <select 
            className="px-3 py-2 border border-border rounded-lg text-sm"
            value={selectedFilters.category}
            onChange={(e) => setSelectedFilters({...selectedFilters, category: e.target.value})}
          >
            <option value="all">Toutes catégories</option>
            <option value="food">Aide alimentaire</option>
            <option value="accompany">Accompagnement</option>
            <option value="environment">Environnement</option>
          </select>
        </div>

        {/* Boutons vue */}
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

      {/* Résultats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">{nearbyMissions.length} missions trouvées</p>
        </div>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyMissions.map((mission, index) => (
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
              <p>Vue carte interactive</p>
              <p className="text-sm">(Simulation - intégration Mapbox à venir)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMyMissions = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Mes missions</h1>

      {/* Missions à venir */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">À venir</h2>
        <div className="space-y-3">
          {myMissions.filter(m => m.status === 'upcoming').map((mission, index) => (
            <div key={index} className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{mission.title}</h3>
                  <p className="text-sm text-muted-foreground">{mission.association}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {mission.date}
                    </span>
                    <span>{mission.duration}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Détails
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missions terminées */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Terminées</h2>
        <div className="space-y-3">
          {myMissions.filter(m => m.status === 'completed').map((mission, index) => (
            <div key={index} className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{mission.title}</h3>
                  <p className="text-sm text-muted-foreground">{mission.association}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {mission.date}
                    </span>
                    <span>{mission.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="badge-earned text-xs mb-1">✅ Complétée</div>
                  <p className="text-sm font-medium text-success">{mission.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Profil & Impact</h1>
      
      {/* Informations utilisateur */}
      <div className="bg-white border border-border rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center text-white text-2xl font-bold">
            M
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Marie Dupont</h2>
            <p className="text-muted-foreground">Membre depuis janvier 2024</p>
            <p className="text-primary font-medium">Niveau: Voisin Solidaire Débutant</p>
          </div>
        </div>
        
        <Button variant="outline" className="w-full">
          Modifier mon profil
        </Button>
      </div>

      {/* Statistiques détaillées */}
      <ImpactStats stats={userStats} level={userLevel} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation mobile */}
        <div className="md:hidden mb-6">
          <div className="flex space-x-2 p-1 bg-white rounded-lg border border-border">
            {[
              { key: 'dashboard', label: 'Accueil' },
              { key: 'explore', label: 'Explorer' },
              { key: 'missions', label: 'Missions' },
              { key: 'profile', label: 'Profil' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => onViewChange(tab.key as any)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  view === tab.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-6xl mx-auto">
          {view === 'dashboard' && renderDashboard()}
          {view === 'explore' && renderExplorer()}
          {view === 'missions' && renderMyMissions()}
          {view === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
