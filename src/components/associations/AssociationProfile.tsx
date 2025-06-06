import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'

type Association = Database['public']['Tables']['associations']['Row']
type Mission = Database['public']['Tables']['missions']['Row']

export default function AssociationProfile() {
  const { id } = useParams<{ id: string }>()
  const [association, setAssociation] = useState<Association | null>(null)
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchAssociationDetails()
    }
  }, [id])

  async function fetchAssociationDetails() {
    try {
      // Récupérer les détails de l'association
      const { data: associationData, error: associationError } = await supabase
        .from('associations')
        .select('*')
        .eq('id', id)
        .single()

      if (associationError) throw associationError
      setAssociation(associationData)

      // Récupérer les missions de l'association
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('association_id', id)
        .order('created_at', { ascending: false })

      if (missionsError) throw missionsError
      setMissions(missionsData || [])
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

  if (error || !association) {
    return (
      <div className="text-red-600 text-center p-4">
        {error || 'Association non trouvée'}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{association.name}</h1>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-gray-600">{association.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact</h3>
              <div className="mt-1 space-y-2 text-gray-600">
                <p>📧 {association.email}</p>
                <p>📞 {association.phone || 'Non renseigné'}</p>
                <p>📍 {association.address || 'Non renseignée'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Statistiques</h3>
              <div className="mt-1 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {association.total_missions || 0}
                  </p>
                  <p className="text-sm text-gray-500">Missions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {association.total_volunteers || 0}
                  </p>
                  <p className="text-sm text-gray-500">Bénévoles</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {association.total_hours || 0}
                  </p>
                  <p className="text-sm text-gray-500">Heures</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Missions de l'association</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{mission.title}</h3>
                  <p className="text-gray-600 mb-4">{mission.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{mission.location}</span>
                    <span>{mission.duration} heures</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {mission.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(mission.start_date).toLocaleDateString()}
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
      </div>
    </div>
  )
} 