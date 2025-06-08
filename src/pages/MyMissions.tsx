import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Mission } from '../types';

interface MissionGroup {
  title: string;
  missions: Mission[];
}

const MyMissions: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'upcoming' | 'past'>('upcoming');
  const [missionGroups, setMissionGroups] = React.useState<MissionGroup[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMissions = async () => {
      try {
        const { data: missions, error } = await supabase
          .from('missions')
          .select('*')
          .eq('volunteer_id', user?.id)
          .order('date', { ascending: true });

        if (error) throw error;

        // Grouper les missions par période
        const today = new Date();
        const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        const groups: MissionGroup[] = [
          {
            title: "Aujourd'hui",
            missions: missions.filter(m => new Date(m.date).toDateString() === today.toDateString())
          },
          {
            title: 'Cette semaine',
            missions: missions.filter(m => {
              const missionDate = new Date(m.date);
              return missionDate > today && missionDate <= thisWeek;
            })
          },
          {
            title: 'Plus tard',
            missions: missions.filter(m => new Date(m.date) > thisWeek)
          }
        ];

        setMissionGroups(groups);
      } catch (error) {
        console.error('Erreur lors du chargement des missions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMissions();
    }
  }, [user]);

  const getDurationColor = (duration: number) => {
    if (duration <= 15) return 'bg-vs-orange-light text-vs-orange-dark';
    if (duration <= 30) return 'bg-vs-green-light text-vs-green-dark';
    return 'bg-vs-blue-light text-vs-blue-dark';
  };

  const handleCancelMission = async (missionId: string) => {
    try {
      const { error } = await supabase
        .from('missions')
        .update({ volunteer_id: null })
        .eq('id', missionId);

      if (error) throw error;

      // Mettre à jour l'état local
      setMissionGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          missions: group.missions.filter(m => m.id !== missionId)
        }))
      );
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la mission:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vs-blue-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-vs-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-vs-gray-800">Mes Missions</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-vs-gray-100">
              <i className="fas fa-filter text-vs-gray-500"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-vs-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`tab flex-1 py-3 text-center font-medium ${
              activeTab === 'upcoming'
                ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary'
                : 'text-vs-gray-500'
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`tab flex-1 py-3 text-center font-medium ${
              activeTab === 'past'
                ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary'
                : 'text-vs-gray-500'
            }`}
          >
            Passées
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 pb-20">
        {missionGroups.map((group, index) => (
          group.missions.length > 0 && (
            <div key={index} className="mb-6">
              <h2 className="text-sm font-medium text-vs-gray-500 mb-3">{group.title}</h2>
              
              {group.missions.map((mission) => (
                <div
                  key={mission.id}
                  className={`bg-white rounded-xl p-4 shadow-sm mb-3 ${
                    group.title === "Aujourd'hui" ? 'border-l-4 border-vs-orange-accent' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-vs-gray-800">{mission.title}</h3>
                    <span className={`${getDurationColor(mission.duration)} text-xs px-2 py-1 rounded-full font-medium`}>
                      {mission.duration} min
                    </span>
                  </div>
                  <p className="text-sm text-vs-gray-500 mb-1">
                    {new Date(mission.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-sm text-vs-gray-500 mb-3">
                    {mission.start_time} - {mission.end_time}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt text-vs-gray-500 mr-1"></i>
                      <span className="text-xs text-vs-gray-500">{mission.address}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/mission/${mission.id}`}
                        className="text-vs-blue-primary text-sm hover:underline"
                      >
                        Détails
                      </Link>
                      <button
                        onClick={() => handleCancelMission(mission.id)}
                        className="bg-vs-error text-white text-sm py-1 px-3 rounded-lg hover:bg-red-600 transition duration-200"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ))}

        {missionGroups.every(group => group.missions.length === 0) && (
          <div className="text-center py-12">
            <p className="text-vs-gray-500">Aucune mission {activeTab === 'upcoming' ? 'à venir' : 'passée'}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyMissions; 