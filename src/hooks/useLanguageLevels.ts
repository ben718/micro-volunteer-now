import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface LanguageLevel {
  id: string;
  user_id: string;
  language: string;
  level: 'débutant' | 'intermédiaire' | 'avancé' | 'natif';
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export const useLanguageLevels = () => {
  const { user, loading: authLoading } = useAuth();
  const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLanguageLevels() {
      if (authLoading || !user) {
        setLoading(false);
        setLanguageLevels([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('language_levels')
          .select('*')
          .eq('user_id', user.id)
          .order('is_primary', { ascending: false }) // Trier par langue principale d'abord
          .order('language', { ascending: true }); // Puis par nom de langue

        if (fetchError) throw fetchError;

        setLanguageLevels(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des niveaux de langue.');
        setLanguageLevels([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLanguageLevels();
  }, [user, authLoading]);

  const addLanguageLevel = async (language: string, level: LanguageLevel['level'], isPrimary: boolean) => {
    if (!user) return false;

    try {
      // Appeler la fonction RPC pour ajouter la langue
      const { error: rpcError } = await supabase.rpc('add_language_to_profile', {
        p_language: language,
        p_level: level,
        p_is_primary: isPrimary
      });

      if (rpcError) throw rpcError;

      // Recharger les niveaux de langue après l'ajout
      const { data, error: fetchError } = await supabase
        .from('language_levels')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false })
        .order('language', { ascending: true });

      if (fetchError) throw fetchError;

      setLanguageLevels(data || []);
      setError(null);
      return true;
    } catch (err) {
      console.error("Erreur lors de l'ajout du niveau de langue:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout du niveau de langue.");
      return false;
    }
  };

  const removeLanguageLevel = async (language: string) => {
    if (!user) return false;

    try {
      // Appeler la fonction RPC pour supprimer la langue
      const { error: rpcError } = await supabase.rpc('remove_language_from_profile', {
        p_language: language
      });

      if (rpcError) throw rpcError;

      // Mettre à jour l'état local après la suppression
      setLanguageLevels(prev => prev.filter(lang => lang.language !== language));
      setError(null);
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression du niveau de langue:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression du niveau de langue.");
      return false;
    }
  };

  return {
    languageLevels,
    loading,
    error,
    addLanguageLevel,
    removeLanguageLevel,
  };
}; 