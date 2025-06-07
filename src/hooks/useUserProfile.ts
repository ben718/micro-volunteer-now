

import { useState, useEffect } from 'react'
import { profileService } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

interface UserStats {
  total_missions_completed: number;
  total_hours_volunteered: number;
  impact_score: number;
  associations_helped: number;
  languages: string[];
}

interface BadgeData {
  id: string;
  name: string;
  icon_url: string;
  description: string;
  category: string;
}

interface UserBadge {
  badge_id: string;
  awarded_at: string;
  badges: BadgeData;
}

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    total_missions_completed: 0,
    total_hours_volunteered: 0,
    impact_score: 0,
    associations_helped: 0,
    languages: []
  })
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [availability, setAvailability] = useState<any>(null)

  const loadProfile = async () => {
    try {
      setLoading(true)
      const profile = await profileService.getCurrentProfile()
      setUserProfile(profile)
      setAvailability(profile?.availability || {})
      
      if (profile?.id) {
        // Load user badges
        const { data: userBadges, error: badgesError } = await supabase
          .from('user_badges')
          .select(`
            badge_id,
            awarded_at,
            badges (
              id,
              name,
              icon_url,
              description,
              category
            )
          `)
          .eq('user_id', profile.id)
        
        if (!badgesError && userBadges) {
          setBadges(userBadges as UserBadge[])
        }

        // For now, set associations helped to 0 to avoid TypeScript issues
        // This can be implemented later with a simpler approach
        let uniqueAssociationsCount = 0;
        
        // Set user stats from profile data
        setUserStats({
          total_missions_completed: profile?.total_missions_completed || 0,
          total_hours_volunteered: profile?.total_hours_volunteered || 0,
          impact_score: profile?.impact_score || 0,
          associations_helped: uniqueAssociationsCount,
          languages: profile?.languages || []
        })
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
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
      setError(err.message || 'Erreur lors de la mise à jour')
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

