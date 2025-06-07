
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Calendar, Clock, MapPin } from 'lucide-react';

const MobileMissions = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Missions à venir simulées
  const upcomingMissions = [
    {
      id: 1,
      title: "Distribution alimentaire",
      time: "12:30 - 12:45",
      date: "Aujourd'hui",
      location: "Centre d'accueil Paris 19",
      duration: 15,
      status: "confirmed"
    },
    {
      id: 2,
      title: "Nettoyage du parc",
      time: "10:00 - 11:00",
      date: "Samedi 12 juin",
      location: "Parc des Buttes-Chaumont",
      duration: 60,
      status: "confirmed"
    },
    {
      id: 3,
      title: "Aide aux devoirs",
      time: "16:30 - 17:00",
      date: "Mardi 15 juin",
      location: "Centre social du 19ème",
      duration: 30,
      status: "confirmed"
    },
    {
      id: 4,
      title: "Accompagnement courses",
      time: "14:00 - 14:45",
      date: "Mercredi 23 juin",
      location: "Résidence seniors Les Lilas",
      duration: 45,
      status: "confirmed"
    }
  ];

  const pastMissions = [
    {
      id: 5,
      title: "Lecture aux seniors",
      date: "5 juin 2024",
      duration: 30,
      status: "completed"
    },
    {
      id: 6,
      title: "Distribution alimentaire",
      date: "2 juin 2024",
      duration: 15,
      status: "completed"
    }
  ];

  const getDurationBadgeClass = (duration: number) => {
    if (duration <= 15) return 'duration-15';
    if (duration <= 30) return 'duration-30';
    return 'duration-45';
  };

  const renderUpcomingMission = (mission: any) => (
    <div key={mission.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`status-dot ${mission.date === 'Aujourd\'hui' ? 'status-today' : 'status-upcoming'}`}></div>
            <span className="text-sm font-medium text-gray-600">{mission.date}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{mission.title}</h3>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{mission.time}</span>
            </div>
          </div>
        </div>
        <div className={`duration-badge ${getDurationBadgeClass(mission.duration)}`}>
          {mission.duration} min
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{mission.location}</span>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          Détails
        </Button>
        <Button variant="destructive" className="flex-1">
          Annuler
        </Button>
      </div>
    </div>
  );

  const renderPastMission = (mission: any) => (
    <div key={mission.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{mission.title}</h3>
          <p className="text-sm text-gray-500">{mission.date}</p>
        </div>
        <div className={`duration-badge ${getDurationBadgeClass(mission.duration)}`}>
          {mission.duration} min
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mes Missions</h1>
        <Button variant="outline" size="sm">
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">{upcomingMissions.length}</div>
          <div className="text-sm text-gray-500">À venir</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{pastMissions.length}</div>
          <div className="text-sm text-gray-500">Passées</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">1h</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1">
        <button
          className={`flex-1 py-3 text-center text-sm font-medium rounded-xl transition-colors ${
            activeTab === 'upcoming' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          À venir ({upcomingMissions.length})
        </button>
        <button
          className={`flex-1 py-3 text-center text-sm font-medium rounded-xl transition-colors ${
            activeTab === 'past' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Passées ({pastMissions.length})
        </button>
      </div>

      {/* Mission list */}
      <div className="space-y-3">
        {activeTab === 'upcoming' ? (
          upcomingMissions.map(renderUpcomingMission)
        ) : (
          pastMissions.map(renderPastMission)
        )}
      </div>
    </div>
  );
};

export default MobileMissions;
