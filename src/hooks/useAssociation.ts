import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Association {
  id: string;
  name: string;
  siret: string;
  description: string;
  logo_url: string;
  address: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  website: string;
  phone: string;
  email: string;
  categories: string[];
  verified: boolean;
  impact_score: number;
  total_missions_created: number;
  total_volunteers_engaged: number;
  created_at: string;
  updated_at: string;
  notification_preferences: {
    new_volunteer: boolean;
    mission_reminder: boolean;
    mission_completed: boolean;
    platform_updates: boolean;
  };
}

// Définition du type Mission basée sur la table 'missions' de bdd.sql
export interface Mission {
  id: string;
  association_id: string;
  title: string;
  description: string;
  short_description: string;
  category: string;
  image_url: string | null;
  address: string;
  city: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  date: string; // Stocké comme date en BDD, souvent manipulé comme string ou Date en TS
  start_time: string; // Stocké comme time en BDD
  end_time: string; // Stocké comme time en BDD
  duration: number; // en minutes
  spots_available: number;
  spots_taken: number;
  min_age: number | null;
  requirements: string[] | null;
  skills_needed: string[] | null;
  languages_needed: string[] | null;
  materials_provided: string[] | null;
  materials_to_bring: string[] | null;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  is_recurring: boolean | null;
  recurring_pattern: any | null; // Adapter si la structure est connue
  impact_description: string | null;
  impact_metrics: any | null; // Adapter si la structure est connue
  created_at: string;
  updated_at: string;
}

export interface AssociationMission extends Mission {
  // AssociationMission hérite maintenant de toutes les propriétés de Mission
  // et ajoute les informations spécifiques aux inscriptions récupérées
  registrations: {
    id: string;
    user_id: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    registration_date: string;
    confirmation_date: string | null;
    completion_date: string | null;
    cancellation_date: string | null;
    cancellation_reason: string | null;
    feedback: string | null;
    rating: number | null;
    hours_logged: number | null;
    volunteer: {
      first_name: string;
      last_name: string;
      avatar_url: string | null; // Permettre null pour avatar_url
    };
  }[];
  // Ajouter ici d'autres propriétés spécifiques à la vue association si nécessaire (ex: nom/logo association via join)
  association_name?: string; // Exemple si joint dans la requête
  association_logo?: string | null; // Exemple si joint dans la requête
}

export const useAssociation = () => {
  const { user, loading: authLoading } = useAuth();
  const [association, setAssociation] = useState<Association | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssociation() {
      if (authLoading || !user) {
        setLoading(false);
        setAssociation(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('associations')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) throw fetchError;

        setAssociation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des données de l\'association.');
        setAssociation(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAssociation();
  }, [user, authLoading]);

  const updateAssociation = async (updates: Partial<Association>) => {
    if (!user) return false;

    try {
      const { error: updateError } = await supabase
        .from('associations')
        .update(updates)
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAssociation(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'association:", err);
      return false;
    }
  };

  const updateNotificationPreferences = async (preferences: Partial<Association['notification_preferences']>) => {
    if (!association) return false;

    try {
      const newPreferences = {
        ...association.notification_preferences,
        ...preferences
      };

      const { error: updateError } = await supabase
        .from('associations')
        .update({ notification_preferences: newPreferences })
        .eq('id', association.id);

      if (updateError) throw updateError;

      setAssociation(prev => prev ? {
        ...prev,
        notification_preferences: newPreferences
      } : null);

      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour des préférences de notification:", err);
      return false;
    }
  };

  return {
    association,
    loading,
    error,
    updateAssociation,
    updateNotificationPreferences
  };
}; 