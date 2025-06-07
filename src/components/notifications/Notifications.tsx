import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'

type Notification = Database['public']['Tables']['notifications']['Row']

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchNotifications()
      subscribeToNotifications()
    }
  }, [user])

  async function fetchNotifications() {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotifications(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function subscribeToNotifications() {
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          setNotifications((current) => [payload.new as Notification, ...current])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      )
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Une erreur est survenue : {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                !notification.is_read ? 'border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Marquer comme lu
                  </button>
                )}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              Aucune notification pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
