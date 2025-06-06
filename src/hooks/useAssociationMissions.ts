import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { AssociationMission } from './useAssociation';

export const useAssociationMissions = () => {
  const { user, loading: authLoading } = useAuth();
  const [missions, setMissions] = useState<AssociationMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMissions() {
      if (authLoading || !user) {
        setLoading(false);
        setMissions([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('missions')
          .select(`
            *,
            registrations:mission_registrations(
              id,
              user_id,
              status,
              registration_date,
              confirmation_date,
              completion_date,
              cancellation_date,
              cancellation_reason,
              feedback,
              rating,
              hours_logged,
              volunteer:profiles(
                first_name,
                last_name,
                avatar_url
              )
            )
          `)
          .eq('association_id', user.id)
          .order('date', { ascending: false });

        if (fetchError) throw fetchError;

        setMissions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des missions.');
        setMissions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMissions();
  }, [user, authLoading]);

  const createMission = async (missionData: Omit<AssociationMission, 'id' | 'association_id' | 'created_at' | 'updated_at' | 'spots_taken' | 'registrations'>) => {
    if (!user) return null;

    try {
      const { data, error: createError } = await supabase
        .from('missions')
        .insert({
          ...missionData,
          association_id: user.id,
          spots_taken: 0
        })
        .select()
        .single();

      if (createError) throw createError;

      setMissions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("Erreur lors de la création de la mission:", err);
      return null;
    }
  };

  const updateMission = async (missionId: string, updates: Partial<AssociationMission>) => {
    if (!user) return false;

    try {
      const { error: updateError } = await supabase
        .from('missions')
        .update(updates)
        .eq('id', missionId)
        .eq('association_id', user.id);

      if (updateError) throw updateError;

      setMissions(prev => prev.map(mission => 
        mission.id === missionId ? { ...mission, ...updates } : mission
      ));

      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la mission:", err);
      return false;
    }
  };

  const deleteMission = async (missionId: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('missions')
        .delete()
        .eq('id', missionId)
        .eq('association_id', user.id);

      if (deleteError) throw deleteError;

      setMissions(prev => prev.filter(mission => mission.id !== missionId));
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression de la mission:", err);
      return false;
    }
  };

  const confirmVolunteer = async (missionId: string, userId: string) => {
    if (!user) return false;

    try {
      const { error: updateError } = await supabase
        .rpc('confirm_volunteer', {
          p_mission_id: missionId,
          p_user_id: userId
        });

      if (updateError) throw updateError;

      // Rafraîchir les données de la mission
      const { data, error: fetchError } = await supabase
        .from('missions')
        .select(`
          *,
          registrations:mission_registrations(
            id,
            user_id,
            status,
            registration_date,
            confirmation_date,
            completion_date,
            cancellation_date,
            cancellation_reason,
            feedback,
            rating,
            hours_logged,
            volunteer:profiles(
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq('id', missionId)
        .single();

      if (fetchError) throw fetchError;

      setMissions(prev => prev.map(mission => 
        mission.id === missionId ? data : mission
      ));

      return true;
    } catch (err) {
      console.error("Erreur lors de la confirmation du bénévole:", err);
      return false;
    }
  };

  const completeMission = async (missionId: string) => {
    if (!user) return false;

    try {
      const { error: completeError } = await supabase
        .rpc('complete_mission', {
          p_mission_id: missionId
        });

      if (completeError) throw completeError;

      // Rafraîchir les données de la mission
      const { data, error: fetchError } = await supabase
        .from('missions')
        .select(`
          *,
          registrations:mission_registrations(
            id,
            user_id,
            status,
            registration_date,
            confirmation_date,
            completion_date,
            cancellation_date,
            cancellation_reason,
            feedback,
            rating,
            hours_logged,
            volunteer:profiles(
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq('id', missionId)
        .single();

      if (fetchError) throw fetchError;

      setMissions(prev => prev.map(mission => 
        mission.id === missionId ? data : mission
      ));

      return true;
    } catch (err) {
      console.error("Erreur lors de la finalisation de la mission:", err);
      return false;
    }
  };

  return {
    missions,
    loading,
    error,
    createMission,
    updateMission,
    deleteMission,
    confirmVolunteer,
    completeMission
  };
}; 