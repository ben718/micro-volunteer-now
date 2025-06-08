import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Category, Mission } from '../types';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { MapPinIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

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

const Home: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [instantMissions, setInstantMissions] = useState<Mission[]>([]);
  const [impactStats, setImpactStats] = useState({
    missions: 0,
    hours: 0,
    associations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .eq("active", true)
          .order("name");

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Fetch instant missions
        const { data: missionsData, error: missionsError } = await supabase
          .from("missions")
          .select("*, association:associations(*)")
          .eq("status", "published")
          .lte("duration", 30)
          .order("date", { ascending: true })
          .limit(2);

        if (missionsError) throw missionsError;
        
        // Calculer la distance pour chaque mission
        const missionsWithDistance = missionsData?.map(mission => {
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

        setInstantMissions(missionsWithDistance);

        // Fetch impact stats
        if (user) {
          const { data: statsData, error: statsError } = await supabase
            .rpc("get_user_impact_stats", { user_id: user.id });

          if (statsError) throw statsError;
          setImpactStats(statsData || { missions: 0, hours: 0, associations: 0 });
        }

      } catch (error: any) {
        toast.error("Erreur lors du chargement des données: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, profile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vs-blue-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vs-gray-100">
      {/* Hero Section */}
      <div className="bg-vs-blue-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Devenez un Voisin Solidaire
            </h1>
            <p className="text-xl mb-8">
              Rejoignez une communauté de bénévoles et faites la différence dans votre quartier
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/explore" className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-md bg-vs-gray-100 text-vs-gray-900 hover:bg-vs-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vs-gray-500">
                Découvrir les missions
              </Link>
              {!user && (
                <Link to="/signup" className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-md bg-vs-blue-primary text-white hover:bg-vs-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vs-blue-primary">
                  Je m'inscris
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold text-vs-gray-800 mb-6">
          Explorez par catégorie
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/explore?category=${category.name}`}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-3xl mb-3 text-vs-blue-primary">{category.icon}</div>
              <h3 className="font-medium text-vs-gray-900">{category.name}</h3>
              <p className="text-sm text-vs-gray-500 mt-1">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Instant Missions Section */}
      {instantMissions.length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-vs-gray-800 mb-6">
              Missions instantanées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {instantMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="bg-vs-gray-50 rounded-xl p-6 border border-vs-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-vs-gray-900 mb-2">{mission.title}</h3>
                      <p className="text-vs-gray-600">{mission.short_description}</p>
                    </div>
                    <span className="bg-vs-blue-100 text-vs-blue-primary text-sm px-3 py-1 rounded-full">
                      {mission.duration} min
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-vs-gray-500 mb-4">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>{mission.distance} km</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{new Date(mission.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{mission.start_time}</span>
                    </div>
                  </div>
                  <a
                    href={`/missions/${mission.id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium rounded-md text-white bg-vs-blue-primary hover:bg-vs-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vs-blue-primary"
                  >
                    Participer
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Impact Stats Section */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-semibold text-vs-gray-800 mb-6">
            Votre impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-vs-gray-200">
              <h3 className="text-lg font-medium text-vs-gray-800 mb-2">
                Missions réalisées
              </h3>
              <p className="text-3xl font-bold text-vs-blue-primary">
                {impactStats.missions}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-vs-gray-200">
              <h3 className="text-lg font-medium text-vs-gray-800 mb-2">
                Heures de bénévolat
              </h3>
              <p className="text-3xl font-bold text-vs-blue-primary">
                {impactStats.hours}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-vs-gray-200">
              <h3 className="text-lg font-medium text-vs-gray-800 mb-2">
                Associations aidées
              </h3>
              <p className="text-3xl font-bold text-vs-blue-primary">
                {impactStats.associations}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
