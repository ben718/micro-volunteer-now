
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'

type Mission = Database['public']['Tables']['missions']['Row']

export default function MissionsList() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMissions()
  }, [])

  async function fetchMissions() {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMissions(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
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
      <h1 className="text-3xl font-bold mb-8">Missions disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:ring-2 hover:ring-blue-400 transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => navigate(`/missions/${mission.id}`)}
            tabIndex={0}
            aria-label={`Voir le détail de la mission ${mission.title}`}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/missions/${mission.id}`) }}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{mission.title}</h2>
              <p className="text-gray-600 mb-4">{mission.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{mission.city}</span>
                <span>{mission.duration} minutes</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-blue-600 font-medium">
                  Association
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {mission.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {missions.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Aucune mission disponible pour le moment.
        </div>
      )}
    </div>
  )
}
