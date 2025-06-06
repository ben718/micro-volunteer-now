import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string; // Ex: 'registration', 'badge', 'mission_update'
  related_entity_type: string | null;
  related_entity_id: string | null;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotifications() {
      if (authLoading || !user) {
        setLoading(false);
        setNotifications([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setNotifications(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des notifications.');
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [user, authLoading]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return; // Ne rien faire si pas d'utilisateur connecté
    try {
      // Mettre à jour la notification dans la BDD
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id); // S'assurer que l'utilisateur ne modifie que ses propres notifications

      if (updateError) throw updateError;

      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

    } catch (err) {
      console.error("Erreur lors du marquage de la notification comme lue:", err);
      // Gérer l'erreur, potentiellement afficher un message à l'utilisateur
    }
  };

  // Optionnel: marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
      if (!user) return;
      try {
          const { error: updateError } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false); // Mettre à jour seulement les non lues

          if (updateError) throw updateError;

          setNotifications(prev => 
              prev.map(notif => ({ ...notif, is_read: true }))
          );

      } catch (err) {
           console.error("Erreur lors du marquage de toutes les notifications comme lues:", err);
      }
  };


  return { notifications, loading, error, markAsRead, markAllAsRead };
}; 