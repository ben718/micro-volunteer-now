
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useAssociation } from './useAssociation';

export interface AssociationMember {
  id: string;
  association_id: string;
  user_id: string | null;
  email: string;
  role: string;
  status: 'invited' | 'active' | 'inactive';
  invitation_token: string | null;
  invitation_sent_at: string | null;
  invitation_accepted_at: string | null;
  created_at: string;
  updated_at: string;
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

        // Type assertion to fix the data structure
        const typedMembers: AssociationMember[] = (data || []).map((member: any) => ({
          ...member,
          status: member.status as 'invited' | 'active' | 'inactive',
          user: member.user ? {
            first_name: member.user.first_name || '',
            last_name: member.user.last_name || '',
            avatar_url: member.user.avatar_url || null
          } : null
        }));

        setMembers(typedMembers);
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
      const existingMember = members.find(m => m.email === email);
      if (existingMember) {
        setError(`L'utilisateur avec l'email ${email} est déjà membre ou invité.`);
        return false;
      }

      const { data, error: insertError } = await supabase
        .from('association_members')
        .insert({
          association_id: association.id,
          email: email,
          role: role,
          status: 'invited',
        })
        .select(`
          *,
          user:profiles(first_name, last_name, avatar_url)
        `)
        .single();

      if (insertError) throw insertError;

      const typedMember: AssociationMember = {
        ...data,
        status: data.status as 'invited' | 'active' | 'inactive',
        user: data.user ? {
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          avatar_url: data.user.avatar_url || null
        } : null
      };

      setMembers(prev => [...prev, typedMember]);
      setError(null);
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
        .eq('association_id', association.id)
        .select(`
          *,
          user:profiles(first_name, last_name, avatar_url)
        `)
        .single();

      if (updateError) throw updateError;

      const typedMember: AssociationMember = {
        ...data,
        status: data.status as 'invited' | 'active' | 'inactive',
        user: data.user ? {
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          avatar_url: data.user.avatar_url || null
        } : null
      };

      setMembers(prev => prev.map(member => member.id === memberId ? typedMember : member));
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
      const { data, error: updateError } = await supabase
        .from('association_members')
        .update({ 
          status: 'invited',
          invitation_sent_at: new Date().toISOString(),
          invitation_accepted_at: null
        })
        .eq('id', memberId)
        .eq('association_id', association.id)
        .select(`
          *,
          user:profiles(first_name, last_name, avatar_url)
        `)
        .single();

      if (updateError) throw updateError;

      const typedMember: AssociationMember = {
        ...data,
        status: data.status as 'invited' | 'active' | 'inactive',
        user: data.user ? {
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          avatar_url: data.user.avatar_url || null
        } : null
      };

      setMembers(prev => prev.map(member => member.id === memberId ? typedMember : member));
      setError(null);
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
        .eq('association_id', association.id);

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
