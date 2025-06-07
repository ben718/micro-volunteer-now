
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
      setError('')
      
      const profile = await profileService.getCurrentProfile()
      console.log('Profile loaded:', profile)
      
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
          console.log('Badges loaded:', userBadges)
          setBadges(userBadges as UserBadge[])
        } else {
          console.error('Error loading badges:', badgesError)
        }

        // Set user stats from profile data
        setUserStats({
          total_missions_completed: profile?.total_missions_completed || 0,
          total_hours_volunteered: profile?.total_hours_volunteered || 0,
          impact_score: profile?.impact_score || 0,
          associations_helped: 0, // Simplified pour éviter les erreurs
          languages: profile?.languages || []
        })
      }
    } catch (err: any) {
      console.error('Error loading profile:', err)
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (updates: any) => {
    try {
      console.log('Updating profile with:', updates)
      
      const updatedProfile = await profileService.updateProfile(updates)
      console.log('Profile updated:', updatedProfile)
      
      setUserProfile(updatedProfile)
      if (updates.availability) {
        setAvailability(updates.availability)
      }
      return true
    } catch (err: any) {
      console.error('Error updating profile:', err)
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

  const togglePreferredCategory = async (categoryName: string) => {
    const currentInterests = userProfile?.interests || []
    const categoryLower = categoryName.toLowerCase()
    
    let newInterests: string[]
    if (currentInterests.includes(categoryLower)) {
      newInterests = currentInterests.filter((interest: string) => interest !== categoryLower)
    } else {
      newInterests = [...currentInterests, categoryLower]
    }
    
    const success = await updateUserProfile({ interests: newInterests })
    if (success) {
      await loadProfile() // Recharger le profil pour mettre à jour l'affichage
    }
    return success
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
    setPreferredCategories,
    togglePreferredCategory
  }
}
