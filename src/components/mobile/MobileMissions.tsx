
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Calendar, Clock, MapPin } from 'lucide-react';
import { useUserMissions } from '@/hooks/useUserMissions';
import { useMissions } from '@/hooks/useMissions';

const MobileMissions = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const { upcomingMissions, pastMissions, loading } = useUserMissions();
  const { cancelMissionParticipation } = useMissions();

  const handleCancel = async (missionId: string) => {
    const success = await cancelMissionParticipation(missionId, 'Annulation depuis l\'interface mobile');
    if (success) {
      console.log('Mission annulée avec succès');
    }
  };

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
            <div className="status-dot status-upcoming"></div>
            <span className="text-sm font-medium text-gray-600">
              {mission.date ? new Date(mission.date).toLocaleDateString() : 'Date à définir'}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{mission.title}</h3>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{mission.start_time} - {mission.end_time}</span>
            </div>
          </div>
        </div>
        <div className={`duration-badge ${getDurationBadgeClass(mission.duration)}`}>
          {mission.duration} min
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{mission.association_name || 'Association'}</span>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          Détails
        </Button>
        <Button 
          variant="destructive" 
          className="flex-1"
          onClick={() => handleCancel(mission.id)}
        >
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
          <p className="text-sm text-gray-500">
            {mission.date ? new Date(mission.date).toLocaleDateString() : 'Date inconnue'}
          </p>
        </div>
        <div className={`duration-badge ${getDurationBadgeClass(mission.duration)}`}>
          {mission.duration} min
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des missions...</div>
      </div>
    );
  }

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
          <div className="text-2xl font-bold text-gray-900">
            {pastMissions.reduce((total, mission) => total + (mission.hours_logged || mission.duration || 0), 0)}h
          </div>
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
          upcomingMissions.length > 0 ? (
            upcomingMissions.map(renderUpcomingMission)
          ) : (
            <div className="text-center text-gray-500 py-8">
              Aucune mission à venir
            </div>
          )
        ) : (
          pastMissions.length > 0 ? (
            pastMissions.map(renderPastMission)
          ) : (
            <div className="text-center text-gray-500 py-8">
              Aucune mission passée
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MobileMissions;
