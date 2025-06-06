import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    bio: '',
    languages: [] as string[],
    skills: [] as string[]
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setProfile(data)
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        address: data.address || '',
        bio: data.bio || '',
        languages: data.languages || [],
        skills: data.skills || []
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id)

      if (error) throw error
      await fetchProfile()
      setIsEditing(false)
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
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Prénom</h3>
                  <p className="mt-1">{profile?.first_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                  <p className="mt-1">{profile?.last_name}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">{profile?.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                <p className="mt-1">{profile?.phone || 'Non renseigné'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                <p className="mt-1">{profile?.address || 'Non renseignée'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                <p className="mt-1">{profile?.bio || 'Non renseignée'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Langues</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {profile?.languages?.map((lang, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Compétences</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {profile?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 