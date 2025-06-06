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
  Heart,
  Star,
  Filter,
  SlidersHorizontal
} from 'lucide-react';

const MobileApp = () => {
  const [currentView, setCurrentView] = useState<'home' | 'explorer' | 'missions' | 'profile'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [maxDistance, setMaxDistance] = useState([3]);

  const userStats = {
    missions: 5,
    timeGiven: "3h",
    associations: 2
  };

  const instantMissions = [
    {
      title: "Distribution alimentaire",
      description: "Aider à distribuer des repas aux personnes sans-abri",
      duration: "15 min",
      distance: "500m",
      category: "alimentaire",
      isUrgent: false
    },
    {
      title: "Lecture aux seniors",
      description: "Lire le journal à des personnes âgées",
      duration: "30 min", 
      distance: "1.2 km",
      category: "social",
      isUrgent: false
    }
  ];

  const upcomingMissions = [
    {
      title: "Nettoyage du parc",
      date: "Samedi 12 juin",
      time: "10:00 - 11:00",
      location: "Parc des Buttes-Chaumont",
      duration: "1h"
    }
  ];

  const availableMissions = [
    {
      title: "Distribution alimentaire",
      description: "Aider à distribuer des repas aux personnes sans-abri",
      duration: "15 min",
      distance: "500m • Aujourd'hui",
      category: "alimentaire"
    },
    {
      title: "Lecture aux seniors",
      description: "Lire le journal à des personnes âgées",
      duration: "30 min",
      distance: "1.2 km • Aujourd'hui",
      category: "social"
    },
    {
      title: "Aide aux courses",
      description: "Accompagner une personne âgée pour ses courses",
      duration: "45 min",
      distance: "800m • Demain",
      category: "accompagnement"
    }
  ];

  const badges = [
    { name: "Premier pas", icon: "⭐", color: "bg-yellow-400", earned: true },
    { name: "Alimentaire", icon: "🍽️", color: "bg-green-400", earned: true },
    { name: "Réactif", icon: "⚡", color: "bg-blue-400", earned: true },
    { name: "À débloquer", icon: "🔒", color: "bg-gray-300", earned: false }
  ];

  const categories = [
    { name: "Alimentaire", icon: "🍽️", color: "bg-blue-100 text-blue-700" },
    { name: "Education", icon: "📚", color: "bg-green-100 text-green-700" },
    { name: "Social", icon: "😊", color: "bg-yellow-100 text-yellow-700" },
    { name: "Plus", icon: "+", color: "bg-gray-100 text-gray-700" }
  ];

  const userAssociations = [
    {
      name: "Les Restos du Cœur",
      missions: 3,
      avatar: "👨‍🍳"
    },
    {
      name: "Secours Populaire",
      missions: 2,
      avatar: "👩‍⚕️"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'alimentaire':
        return 'bg-orange-100 text-orange-700';
      case 'social':
        return 'bg-green-100 text-green-700';
      case 'accompagnement':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderHomeView = () => (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Voisin Solidaire</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-gray-600" />
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
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Votre impact</h3>
          <div className="flex justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.missions}</div>
              <div className="text-xs text-gray-500">Missions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.timeGiven}</div>
              <div className="text-xs text-gray-500">Temps donné</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.associations}</div>
              <div className="text-xs text-gray-500">Associations</div>
            </div>
          </div>
        </div>

        {/* Instant Missions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Missions instantanées</h3>
            <button className="text-blue-600 text-sm">Voir tout</button>
          </div>
          <div className="space-y-3">
            {instantMissions.map((mission, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border-l-4 border-orange-400">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{mission.title}</h4>
                  <Badge className="bg-orange-100 text-orange-600 text-xs px-2 py-1">
                    {mission.duration}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {mission.distance}
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm">
                    Je participe
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Catégories</h3>
          <div className="flex justify-between">
            {categories.map((category, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-2`}>
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
            <button className="text-blue-600 text-sm">Voir tout</button>
          </div>
          {upcomingMissions.map((mission, index) => (
            <div key={index} className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-center mr-3">
                    <div className="text-xs text-gray-500 uppercase">JUN</div>
                    <div className="text-lg font-bold text-gray-800">12</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{mission.title}</h4>
                    <p className="text-sm text-gray-600">{mission.time}</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-600 text-xs">
                  {mission.duration}
                </Badge>
              </div>
            </div>
          ))}
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
          <SlidersHorizontal className="h-6 w-6 text-gray-600" />
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une mission..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Map placeholder */}
        <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Carte des missions à proximité</p>
          </div>
        </div>

        {/* Filters */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-700">Filtres</h3>
            <button className="text-blue-600 text-sm">Réinitialiser</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-600 text-white px-3 py-1">Tous</Badge>
            <Badge variant="outline" className="px-3 py-1">moins de 15 min</Badge>
            <Badge variant="outline" className="px-3 py-1">moins de 1 km</Badge>
            <Badge variant="outline" className="px-3 py-1">Aujourd'hui</Badge>
            <Badge variant="outline" className="px-3 py-1">Alimentaire</Badge>
            <Badge variant="outline" className="px-3 py-1">Social</Badge>
          </div>
        </div>

        {/* Available Missions */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Missions disponibles (8)</h3>
          <div className="space-y-3">
            {availableMissions.map((mission, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border-l-4 border-orange-400">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{mission.title}</h4>
                  <Badge className={`text-xs px-2 py-1 ${getCategoryColor(mission.category)}`}>
                    {mission.duration}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {mission.distance}
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm">
                    Je participe
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMissionsView = () => (
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
        {/* Today */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Aujourd'hui</h3>
          <div className="bg-white rounded-xl p-4 border-l-4 border-orange-400">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800">Distribution alimentaire</h4>
              <Badge className="bg-orange-100 text-orange-600 text-xs">15 min</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">12:30 - 12:45</p>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              Centre d'accueil Paris 19
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">Détails</Button>
              <Button variant="destructive" size="sm" className="text-xs">Annuler</Button>
            </div>
          </div>
        </div>

        {/* This Week */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Cette semaine</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">Nettoyage du parc</h4>
                <Badge className="bg-blue-100 text-blue-600 text-xs">1h</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Samedi 12 juin</p>
              <p className="text-sm text-gray-600 mb-1">10:00 - 11:00</p>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                Parc des Buttes-Chaumont
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-xs">Détails</Button>
                <Button variant="destructive" size="sm" className="text-xs">Annuler</Button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">Aide aux devoirs</h4>
                <Badge className="bg-green-100 text-green-600 text-xs">30 min</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Mardi 15 juin</p>
              <p className="text-sm text-gray-600 mb-1">16:30 - 17:00</p>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                Centre social du 19ème
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-xs">Détails</Button>
                <Button variant="destructive" size="sm" className="text-xs">Annuler</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Later */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Plus tard</h3>
          <div className="bg-white rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800">Accompagnement courses</h4>
              <Badge className="bg-blue-100 text-blue-600 text-xs">45 min</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">Mercredi 23 juin</p>
            <p className="text-sm text-gray-600 mb-1">14:00 - 14:45</p>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              Résidence seniors Les Lilas
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">Détails</Button>
              <Button variant="destructive" size="sm" className="text-xs">Annuler</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Mon impact</h3>
          <div className="flex justify-between text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-xs text-gray-500">Missions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">3h</div>
              <div className="text-xs text-gray-500">Temps donné</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-xs text-gray-500">Associations</div>
            </div>
          </div>
        </div>

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
              <Badge className="bg-blue-500 text-white">Alimentaire</Badge>
              <Badge className="bg-green-500 text-white">Social</Badge>
              <Badge className="bg-yellow-500 text-white">Education</Badge>
              <Badge variant="outline" className="border-dashed">+ Ajouter</Badge>
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
              <Badge className="bg-blue-500 text-white">15 min</Badge>
              <Badge variant="outline">30 min</Badge>
              <Badge variant="outline">1h</Badge>
              <Badge variant="outline">2h+</Badge>
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
            className={`flex flex-col items-center py-2 px-3 ${
              currentView === 'home' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Home className="h-6 w-6 mb-1" />
            <span className="text-xs">Accueil</span>
          </button>
          
          <button
            onClick={() => setCurrentView('explorer')}
            className={`flex flex-col items-center py-2 px-3 ${
              currentView === 'explorer' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Search className="h-6 w-6 mb-1" />
            <span className="text-xs">Explorer</span>
          </button>

          <div className="flex flex-col items-center py-2 px-3">
            <div className="bg-orange-500 rounded-full p-3 mb-1">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>

          <button
            onClick={() => setCurrentView('missions')}
            className={`flex flex-col items-center py-2 px-3 ${
              currentView === 'missions' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Calendar className="h-6 w-6 mb-1" />
            <span className="text-xs">Missions</span>
          </button>

          <button
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center py-2 px-3 ${
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
