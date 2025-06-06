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
  related_mission_title?: string;
  related_badge_name?: string;
}

interface NotificationFilter {
    is_read?: boolean;
    type?: string; // 'registration', 'badge', 'mission_update', 'general'
}

interface NotificationSort {
    column: 'created_at' | 'type' | 'is_read'; // Colonnes possibles pour le tri
    ascending: boolean;
}

// Default pagination settings
const NOTIFICATIONS_PER_PAGE = 20; // You can adjust this value

export const useNotifications = (filter: NotificationFilter = {}, sortBy: NotificationSort = { column: 'created_at', ascending: false }) => {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true); // To indicate if there are more notifications to load

  useEffect(() => {
    // Reset notifications and page when filter, sort, or user changes
    setNotifications([]);
    setPage(0);
    setHasMore(true);
  }, [user, authLoading, filter, sortBy]);

  useEffect(() => {
    async function fetchNotifications(currentPage: number) {
      if (authLoading || !user || !hasMore) {
        setLoading(false);
        // setNotifications([]); // Don't reset here, handled by the other effect
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const from = currentPage * NOTIFICATIONS_PER_PAGE;
        const to = from + NOTIFICATIONS_PER_PAGE - 1;

        let query = supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id);

        // Apply filters
        if (filter.is_read !== undefined) {
            query = query.eq('is_read', filter.is_read);
        }
        if (filter.type) {
            query = query.eq('type', filter.type);
        }

        // Apply sorting
        query = query.order(sortBy.column, { ascending: sortBy.ascending });

        // Apply pagination
        query = query.range(from, to);

        const { data: fetchedNotifications, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        const notificationsWithDetails = await Promise.all((fetchedNotifications || []).map(async (notif: AppNotification) => {
            let details: any = {};
            if (notif.related_entity_type === 'mission' && notif.related_entity_id) {
                const { data: mission, error: missionError } = await supabase
                    .from('missions')
                    .select('title')
                    .eq('id', notif.related_entity_id)
                    .single();
                if (!missionError && mission) {
                    details.related_mission_title = mission.title;
                }
            } else if (notif.related_entity_type === 'badge' && notif.related_entity_id) {
                 const { data: badge, error: badgeError } = await supabase
                    .from('badges')
                    .select('name')
                    .eq('id', notif.related_entity_id)
                    .single();
                if (!badgeError && badge) {
                    details.related_badge_name = badge.name;
                }
            }

            return { ...notif, ...details };
        }));

        setNotifications(prevNotifications => [...prevNotifications, ...notificationsWithDetails]);
        setHasMore((fetchedNotifications || []).length === NOTIFICATIONS_PER_PAGE);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des notifications.');
        // setNotifications([]); // Don't reset here
        setHasMore(false); // Stop trying to load more on error
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications(page);
  }, [user, authLoading, filter, sortBy, page, hasMore]); // Add page and hasMore to dependencies

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

  const markAsRead = async (notificationId: string) => {
    if (!user) return; // Ne rien faire si pas d\'utilisateur connecté
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true } as any) // Ajoutez \'as any\' si TypeScript se plaint malgré l\'interface
        .eq('id', notificationId)
        .eq('user_id', user.id); // S\'assurer que l\'utilisateur ne modifie que ses propres notifications

      if (updateError) throw updateError;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

    } catch (err) {
      console.error("Erreur lors du marquage de la notification comme lue:", err);
    }
  };

  const markAllAsRead = async () => {
      if (!user) return;
      try {
          const { error: updateError } = await supabase
            .from('notifications')
            .update({ is_read: true } as any) // Ajoutez \'as any\'
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

  return { notifications, loading, error, markAsRead, markAllAsRead, loadMore, hasMore };
}; 