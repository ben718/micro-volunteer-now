
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import type { Database } from '../../types/database'

type Mission = Database['public']['Tables']['missions']['Row']

export default function MissionDetails() {
  const { id } = useParams<{ id: string }>()
  const [mission, setMission] = useState<Mission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchMissionDetails()
    }
  }, [id])

  async function fetchMissionDetails() {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setMission(data)

      if (user) {
        const { data: registration } = await supabase
          .from('mission_registrations')
          .select('*')
          .eq('mission_id', id)
          .eq('user_id', user.id)
          .single()

        setIsRegistered(!!registration)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister() {
    if (!user) {
      navigate('/auth/signin')
      return
    }

    try {
      const { error } = await supabase
        .from('mission_registrations')
        .insert([
          {
            mission_id: id!,
            user_id: user.id,
            status: 'confirmed'
          }
        ])

      if (error) throw error
      setIsRegistered(true)
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

  if (error || !mission) {
    return (
      <div className="text-red-600 text-center p-4">
        {error || 'Mission non trouvée'}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-medium"
          aria-label="Retour à la liste des missions"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Retour
        </button>
        <h1 className="text-3xl font-bold mb-4">{mission.title}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-blue-600 font-medium">
              Association
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {mission.category}
            </span>
          </div>

          <p className="text-gray-600 mb-6">{mission.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Informations</h3>
              <ul className="space-y-2 text-gray-600">
                <li>📍 {mission.city}</li>
                <li>⏱️ {mission.duration} minutes</li>
                <li>👥 {mission.spots_available} places disponibles</li>
                <li>📅 {new Date(mission.date).toLocaleDateString()}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Compétences requises</h3>
              <ul className="space-y-2 text-gray-600">
                {mission.skills_needed?.map((skill, index) => (
                  <li key={index}>• {skill}</li>
                ))}
              </ul>
            </div>
          </div>

          {!isRegistered ? (
            <button
              onClick={handleRegister}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              S'inscrire à cette mission
            </button>
          ) : (
            <div className="text-center text-green-600 font-medium">
              Vous êtes inscrit à cette mission
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
