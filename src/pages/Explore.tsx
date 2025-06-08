import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mission, Category } from '../types';
import Button from '../components/Button';
import Pagination from '../components/Pagination';
import MissionMap from '../components/MissionMap';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const ITEMS_PER_PAGE = 10;

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10; // Arrondi à 1 décimale
};

const Explore: React.FC = () => {  const navigate = useNavigate();
  const { profile } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    duration: '',
    distance: '',
    date: '',
    category: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('active', true)
          .order('name');

        if (error) throw error;
        setCategories(data || []);
      } catch (error: any) {
        toast.error('Erreur lors du chargement des catégories: ' + error.message);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [currentPage, filters]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('missions')
        .select('*, association:associations(*)', { count: 'exact' })
        .eq('status', 'published')
        .order('date', { ascending: true });

      // Appliquer les filtres
      if (filters.duration) {
        query = query.lte('duration', parseInt(filters.duration));
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.date) {
        query = query.gte('date', filters.date);
      }

      // Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Calculer la distance pour chaque mission
      const missionsWithDistance = data?.map(mission => {
        if (profile?.latitude && profile?.longitude && mission.latitude && mission.longitude) {
          return {
            ...mission,
            distance: calculateDistance(
              profile.latitude,
              profile.longitude,
              mission.latitude,
              mission.longitude
            )
          };
        }
        return mission;
      }) || [];

      // Filtrer par distance si nécessaire
      const filteredMissions = filters.distance
        ? missionsWithDistance.filter(mission => 
            mission.distance && mission.distance <= parseInt(filters.distance)
          )
        : missionsWithDistance;

      setMissions(filteredMissions);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (error: any) {
      setError(error.message);
      toast.error('Erreur lors du chargement des missions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading && missions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vs-blue-primary"></div>
      </div>
    );
  }

  if (error && missions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchMissions}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vs-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée
              </label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"
              >
                <option value="">Toutes les durées</option>
                <option value="30">30 minutes</option>
                <option value="60">1 heure</option>
                <option value="120">2 heures</option>
                <option value="180">3 heures</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance
              </label>
              <select
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"
              >
                <option value="">Toutes les distances</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="20">20 km</option>
                <option value="50">50 km</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Carte des missions */}
        <div className="mb-8">
          <MissionMap
            missions={missions}
            onMissionClick={(mission) => navigate(`/mission/${mission.id}`)}
            userLocation={profile?.latitude && profile?.longitude ? { latitude: profile.latitude, longitude: profile.longitude } : undefined}
          />
        </div>

        {/* Liste des missions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {mission.image_url && (
                <img
                  src={mission.image_url}
                  alt={mission.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-vs-gray-800 mb-2">
                  {mission.title}
                </h3>
                <p className="text-vs-gray-600 text-sm mb-4">
                  {mission.short_description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-vs-gray-500">
                    {new Date(mission.date).toLocaleDateString()}
                  </span>
                  <Button
                    onClick={() => navigate(`/mission/${mission.id}`)}
                    variant="primary"
                  >
                    Voir les détails
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Message si aucune mission */}
        {missions.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-vs-gray-600">
              Aucune mission ne correspond à vos critères
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
