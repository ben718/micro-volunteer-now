import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, CheckCircle, Circle } from 'lucide-react';

const NotificationsPage = () => {
  const { notifications, loading, error, markAsRead } = useNotifications();

  if (loading) {
    return <div className="text-center py-8">Chargement des notifications...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Erreur: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Notifications</h1>

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
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div className="flex-shrink-0 mt-1">
                {notification.is_read ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-primary fill-primary/20" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                </p>
              </div>
              {/* Optionnel: Bouton pour marquer comme lu si pas cliqué sur la div */}
              {/* {!notification.is_read && (
                <button 
                  className="flex-shrink-0 text-sm text-primary hover:underline"
                  onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                >
                  Marquer comme lu
                </button>
              )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage; 