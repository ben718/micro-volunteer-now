
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
  const [error, setError] = useState('')
  const [availability, setAvailability] = useState<any>(null)

  const loadProfile = async () => {
    try {
      setLoading(true)
      const profile = await profileService.getCurrentProfile()
      setUserProfile(profile)
      setAvailability(profile?.availability || {})
      
      // Set user stats from profile data
      setUserStats({
        total_missions_completed: profile?.total_missions_completed || 0,
        total_hours_volunteered: profile?.total_hours_volunteered || 0,
        impact_score: profile?.impact_score || 0,
        associations_helped: 0,
        languages: profile?.languages || []
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (updates: any) => {
    try {
      const updatedProfile = await profileService.updateProfile(updates)
      setUserProfile(updatedProfile)
      if (updates.availability) {
        setAvailability(updates.availability)
      }
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const setMaxDistance = async (distance: number) => {
    return await updateUserProfile({ max_distance: distance })
  }

  const setPreferredCategories = async (categories: string[]) => {
    return await updateUserProfile({ interests: categories })
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
    updateProfile: updateUserProfile,
    updateUserProfile,
    availability,
    setMaxDistance,
    setPreferredCategories
  }
}
