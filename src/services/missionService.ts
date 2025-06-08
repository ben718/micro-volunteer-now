import { supabase } from '../lib/supabase';
import { Mission, MissionRegistration } from '../types';

export const missionService = {
  // Récupérer toutes les missions
  async getAllMissions() {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data as Mission[];
  },

  // Récupérer une mission par ID
  async getMissionById(id: string) {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Mission;
  },

  // Créer une nouvelle mission
  async createMission(mission: Omit<Mission, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('missions')
      .insert([mission])
      .select()
      .single();
    
    if (error) throw error;
    return data as Mission;
  },

  // Mettre à jour une mission
  async updateMission(id: string, updates: Partial<Mission>) {
    const { data, error } = await supabase
      .from('missions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Mission;
  },

  // Supprimer une mission
  async deleteMission(id: string) {
    const { error } = await supabase
      .from('missions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // S'inscrire à une mission
  async registerForMission(missionId: string, userId: string) {
    const { data, error } = await supabase
      .from('mission_registrations')
      .insert([{
        mission_id: missionId,
        user_id: userId,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as MissionRegistration;
  },

  // Annuler une inscription
  async cancelRegistration(missionId: string, userId: string) {
    const { error } = await supabase
      .from('mission_registrations')
      .delete()
      .eq('mission_id', missionId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Récupérer les inscriptions d'un utilisateur
  async getUserRegistrations(userId: string) {
    const { data, error } = await supabase
      .from('mission_registrations')
      .select(`
        *,
        mission:missions(*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as (MissionRegistration & { mission: Mission })[];
  }
}; 