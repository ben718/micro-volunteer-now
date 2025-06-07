
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Mission } from '@/types/mission';

interface Testimonial {
  id: string;
  name: string;
  age: number;
  avatar: string;
  level: string;
  missions_count: number;
  content: string;
}

interface HomePageData {
  featuredMissions: Mission[];
  testimonials: Testimonial[];
  stats: {
    totalMissions: number;
    totalVolunteers: number;
    totalHours: number;
  };
}

export const useHomePage = () => {
  const [data, setData] = useState<HomePageData>({
    featuredMissions: [],
    testimonials: [],
    stats: {
      totalMissions: 0,
      totalVolunteers: 0,
      totalHours: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHomePageData() {
      try {
        // Récupérer les missions populaires
        const { data: missions, error: missionsError } = await supabase
          .from('missions')
          .select('*')
          .eq('status', 'published')
          .order('spots_taken', { ascending: false })
          .limit(3);

        if (missionsError) throw missionsError;

        // Transform missions to match Mission interface
        const typedMissions: Mission[] = (missions || []).map(mission => ({
          ...mission,
          status: mission.status as 'draft' | 'published' | 'completed' | 'cancelled',
          is_urgent: false, // Default value since it's not in the database
          association_name: 'Association' // Default value since it's not in the database
        }));

        // Récupérer les témoignages
        const { data: testimonials, error: testimonialsError } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (testimonialsError) throw testimonialsError;

        // Récupérer les statistiques globales
        const { data: stats, error: statsError } = await supabase
          .from('global_stats')
          .select('*')
          .single();

        if (statsError) throw statsError;

        const transformedStats = stats ? {
          totalMissions: stats.total_missions,
          totalVolunteers: stats.total_volunteers,
          totalHours: stats.total_hours
        } : {
          totalMissions: 0,
          totalVolunteers: 0,
          totalHours: 0
        };

        setData({
          featuredMissions: typedMissions,
          testimonials: testimonials || [],
          stats: transformedStats
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHomePageData();
  }, []);

  return {
    data,
    loading,
    error
  };
};
