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
          .eq('status', 'active')
          .order('participants_count', { ascending: false })
          .limit(3);

        if (missionsError) throw missionsError;

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

        setData({
          featuredMissions: missions || [],
          testimonials: testimonials || [],
          stats: stats || {
            totalMissions: 0,
            totalVolunteers: 0,
            totalHours: 0
          }
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