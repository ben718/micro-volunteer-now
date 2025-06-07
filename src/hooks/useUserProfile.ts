
import { useState, useEffect } from 'react'
import { profileService } from '@/lib/supabase'

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userStats, setUserStats] = useState({
    total_missions_completed: 0,
    total_hours_volunteered: 0,
    impact_score: 0,
    associations_helped: 0,
    languages: [] as string[]
  })
  const [badges, setBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const loadProfile = async () => {
    try {
      setLoading(true)
      const profile = await profileService.getCurrentProfile()
      setUserProfile(profile)
      
      // Simuler des stats pour le moment
      setUserStats({
        total_missions_completed: 12,
        total_hours_volunteered: 48,
        impact_score: 850,
        associations_helped: 5,
        languages: ['français', 'anglais']
      })
      
      setBadges([
        { id: 1, name: 'Premier pas', description: 'Première mission complétée', earned: true },
        { id: 2, name: 'Régulier', description: '10 missions complétées', earned: true },
        { id: 3, name: 'Dévoué', description: '50h de bénévolat', earned: false }
      ])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: any) => {
    try {
      const updatedProfile = await profileService.updateProfile(updates)
      setUserProfile(updatedProfile)
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  return {
    userProfile,
    userStats,
    badges,
    loading,
    error,
    loadProfile,
    updateProfile
  }
}
