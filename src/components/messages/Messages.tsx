import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'

type Message = Database['public']['Tables']['messages']['Row']
type Conversation = Database['public']['Tables']['conversations']['Row']

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages()
      subscribeToMessages()
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function fetchConversations() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setConversations(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  function subscribeToMessages() {
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}`
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const { error } = await supabase.from('messages').insert([
        {
          conversation_id: selectedConversation,
          sender_id: user?.id,
          content: newMessage.trim()
        }
      ])

      if (error) throw error
      setNewMessage('')
    } catch (err: any) {
      setError(err.message)
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Liste des conversations */}
          <div className="col-span-3 bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="divide-y">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 ${
                    selectedConversation === conversation.id
                      ? 'bg-blue-50'
                      : ''
                  }`}
                >
                  <p className="font-medium">
                    {conversation.user1_id === user?.id
                      ? conversation.user2_name
                      : conversation.user1_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.last_message}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Zone de messages */}
          <div className="col-span-9 bg-white rounded-lg shadow-md flex flex-col h-[600px]">
            {selectedConversation ? (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${
                        message.sender_id === user?.id
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Envoyer
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Sélectionnez une conversation pour commencer
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 