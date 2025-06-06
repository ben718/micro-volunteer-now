import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useAssociation } from './useAssociation'; // Assurez-vous que le chemin est correct

export interface AssociationMember {
  id: string;
  association_id: string;
  user_id: string | null; // Peut être null si l'utilisateur n'a pas encore accepté l'invitation
  email: string;
  role: string; // Ex: 'admin', 'manager', 'member'
  status: 'invited' | 'active' | 'inactive';
  invitation_token: string | null; // Token d'invitation si applicable
  invitation_sent_at: string | null;
  invitation_accepted_at: string | null;
  created_at: string;
  updated_at: string;
  // Relation potentielle vers le profil utilisateur si user_id n'est pas null
  user: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  } | null;
}

export const useAssociationMembers = () => {
  const { user, loading: authLoading } = useAuth();
  const { association, loading: associationLoading } = useAssociation();
  const [members, setMembers] = useState<AssociationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      if (authLoading || !user || associationLoading || !association) {
        setLoading(false);
        setMembers([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('association_members')
          .select(`
            *,
            user:profiles(first_name, last_name, avatar_url)
          `)
          .eq('association_id', association.id)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        setMembers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des membres de l\'équipe.');
        setMembers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [user, authLoading, association, associationLoading]);

  const inviteMember = async (email: string, role: string) => {
    if (!association) return false;

    try {
      // Vérifier si l'email est déjà membre ou invité
      const existingMember = members.find(m => m.email === email);
      if (existingMember) {
        console.warn(`L'utilisateur avec l'email ${email} est déjà membre ou invité.`);
        // Vous pourriez vouloir gérer cela côté UI ou retourner une indication spécifique
        setError(`L'utilisateur avec l'email ${email} est déjà membre ou invité.`);
        return false;
      }

      // Créer une entrée dans association_members pour déclencher le trigger Supabase
      // Le trigger s'occupera d'envoyer l'email d'invitation et de générer le token
      const { data, error: insertError } = await supabase
        .from('association_members')
        .insert({
          association_id: association.id,
          email: email,
          role: role,
          status: 'invited',
          // invitation_sent_at est géré par le trigger/BDD lors de la création du token
        })
        .select(`
          *,
          user:profiles(first_name, last_name, avatar_url)
        `)
        .single();

      if (insertError) throw insertError;

      setMembers(prev => [...prev, data]);
      setError(null); // Effacer l'erreur si l'invitation réussit
      return true;
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'invitation:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi de l'invitation.");
      return false;
    }
  };

  const updateMemberRole = async (memberId: string, newRole: string) => {
    if (!association) return false;

    try {
      const { data, error: updateError } = await supabase
        .from('association_members')
        .update({ role: newRole })
        .eq('id', memberId)
        .eq('association_id', association.id) // S'assurer que seule l'association peut modifier ses membres
        .select(`
            *,
            user:profiles(first_name, last_name, avatar_url)
          `)
        .single();

      if (updateError) throw updateError;

      setMembers(prev => prev.map(member => member.id === memberId ? data : member));
      setError(null);
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du rôle du membre:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour du rôle du membre.");
      return false;
    }
  };

  const resendInvitation = async (memberId: string) => {
      if (!association) return false;

      try {
          // Appeler une fonction RPC ou mettre à jour l'entrée pour déclencher le trigger
          // Supposons qu'une simple mise à jour du champ invitation_sent_at déclenche le renvoi
          // Vous devrez peut-être créer une fonction RPC spécifique si ce n'est pas le cas
          const { data, error: updateError } = await supabase
            .from('association_members')
            .update({ 
                status: 'invited', // S'assurer du statut invité
                invitation_sent_at: new Date().toISOString(), // Mettre à jour la date pour potentiellement déclencher un trigger
                invitation_accepted_at: null // Réinitialiser si déjà accepté
            })
            .eq('id', memberId)
            .eq('association_id', association.id)
             .select(`
              *,
              user:profiles(first_name, last_name, avatar_url)
            `)
            .single();

          if (updateError) throw updateError;

           setMembers(prev => prev.map(member => member.id === memberId ? data : member));
           setError(null);
           // Afficher une notification indiquant que l'invitation a été renvoyée
           return true;
      } catch (err) {
          console.error("Erreur lors du renvoi de l'invitation:", err);
          setError(err instanceof Error ? err.message : "Erreur lors du renvoi de l'invitation.");
          return false;
      }
  };

  const removeMember = async (memberId: string) => {
    if (!association) return false;

    try {
      const { error: deleteError } = await supabase
        .from('association_members')
        .delete()
        .eq('id', memberId)
        .eq('association_id', association.id); // S'assurer que seule l'association peut supprimer ses membres

      if (deleteError) throw deleteError;

      setMembers(prev => prev.filter(member => member.id !== memberId));
      setError(null);
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression du membre:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression du membre.");
      return false;
    }
  };

  // Vous pourriez ajouter des fonctions pour updateMember, resendInvitation, etc.

  return {
    members,
    loading,
    error,
    inviteMember,
    updateMemberRole,
    resendInvitation,
    removeMember,
  };
}; 