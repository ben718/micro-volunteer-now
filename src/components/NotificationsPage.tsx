import React, { useState, useEffect } from 'react';
import { useNotifications, AppNotification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, CheckCircle, Circle, MapPin, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const NotificationsPage = () => {
  const [filter, setFilter] = useState<{ is_read?: boolean; type?: string }>({});
  const [sortBy, setSortBy] = useState<{ column: 'created_at' | 'type' | 'is_read'; ascending: boolean }>({ column: 'created_at', ascending: false });

  const { notifications, loading, error, markAsRead, loadMore, hasMore } = useNotifications(filter, sortBy);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFilterChange = (key: keyof typeof filter, value: any) => {
      setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (column: 'created_at' | 'type' | 'is_read', ascending: boolean) => {
      setSortBy({ column, ascending });
  };

    // Infinite scroll logic
    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) { // -100 to load before hitting the very bottom
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading, loadMore]);

  if (loading && notifications.length === 0) { // Show initial loading only if no notifications yet
    return <div className="text-center py-8">Chargement des notifications...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Erreur: {error}</div>;
  }

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    if (notification.related_entity_type && notification.related_entity_id) {
      switch (notification.related_entity_type) {
        case 'mission':
          navigate(`/missions/${notification.related_entity_id}`);
          break;
        case 'badge':
          if (user?.id) {
             navigate(`/profile/${user.id}/badges`);
          }
          break;
        default:
          console.log(`Unhandled notification type for navigation: ${notification.related_entity_type}`);
      }
    } else if (notification.type === 'general') {
        navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Notifications</h1>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Filter by Read Status */}
          <select 
              className="p-2 border rounded-md bg-card text-foreground"
              value={filter.is_read === undefined ? 'all' : filter.is_read ? 'read' : 'unread'}
              onChange={(e) => handleFilterChange('is_read', e.target.value === 'all' ? undefined : e.target.value === 'read')}
          >
              <option value="all">Tous les statuts</option>
              <option value="read">Lus</option>
              <option value="unread">Non lus</option>
          </select>

          {/* Filter by Type */}
           <select 
              className="p-2 border rounded-md bg-card text-foreground"
              value={filter.type || 'all'}
              onChange={(e) => handleFilterChange('type', e.target.value === 'all' ? undefined : e.target.value)}
          >
               <option value="all">Tous les types</option>
               <option value="registration">Inscriptions</option>
               <option value="badge">Badges</option>
               <option value="mission_update">Mises à jour mission</option>
               <option value="general">Général</option>
          </select>

          {/* Sort By */}
           <select 
              className="p-2 border rounded-md bg-card text-foreground"
              value={`${sortBy.column}-${sortBy.ascending}`}
              onChange={(e) => {
                  const [column, ascending] = e.target.value.split('-');
                  handleSortChange(column as 'created_at' | 'type' | 'is_read', ascending === 'true');
              }}
          >
               <option value="created_at-false">Date (plus récent)</option>
               <option value="created_at-true">Date (plus ancien)</option>
               <option value="is_read-true">Statut (lu)</option>
               <option value="is_read-false">Statut (non lu)</option>
               <option value="type-true">Type (A-Z)</option>
               <option value="type-false">Type (Z-A)</option>
          </select>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4" />
          <p>Aucune nouvelle notification pour le moment.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-4">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`flex items-start space-x-3 p-3 rounded-md ${notification.is_read ? 'bg-muted/50' : 'bg-accent/10'} hover:bg-muted/70 cursor-pointer transition-colors`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex-shrink-0 mt-1">
                {notification.type === 'badge' ? (
                     <Award className={`h-5 w-5 ${notification.is_read ? 'text-success' : 'text-warning fill-warning/20'}`} />
                 ) : notification.related_entity_type === 'mission' ? (
                      <MapPin className={`h-5 w-5 ${notification.is_read ? 'text-success' : 'text-primary fill-primary/20'}`} />
                 ) : notification.is_read ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-primary fill-primary/20" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{notification.title}</p>
                <p className="text-sm text-muted-foreground">
                    {notification.related_mission_title && `Mission : ${notification.related_mission_title}`}
                    {notification.related_badge_name && `Badge : ${notification.related_badge_name}`}
                    {(!notification.related_mission_title && !notification.related_badge_name) && notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                </p>
              </div>
            </div>
          ))}

           {loading && notifications.length > 0 && (
                <div className="text-center py-4 text-muted-foreground">Chargement de plus de notifications...</div>
            )}

            {!hasMore && notifications.length > 0 && !loading && (
                <div className="text-center py-4 text-muted-foreground">Toutes les notifications sont chargées.</div>
            )}

        </div>
      )}
    </div>
  );
};

export default NotificationsPage; 