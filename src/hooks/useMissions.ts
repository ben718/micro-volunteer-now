
import { useState, useEffect } from 'react'
import { missionService } from '@/lib/supabase'
import { Mission } from '@/types/mission'

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([])
  const [userMissions, setUserMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const loadMissions = async () => {
    try {
      setLoading(true)
      const data = await missionService.getAvailableMissions()
      setMissions(data as Mission[])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadUserMissions = async () => {
    try {
      const upcoming = await missionService.getUserUpcomingMissions()
      const past = await missionService.getUserPastMissions()
      setUserMissions([...upcoming, ...past] as Mission[])
    } catch (err: any) {
      console.error('Erreur lors du chargement des missions utilisateur:', err)
    }
  }

  const participateInMission = async (missionId: string) => {
    try {
      await missionService.registerForMission(missionId)
      await loadMissions()
      await loadUserMissions()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const cancelMissionParticipation = async (missionId: string, reason?: string) => {
    try {
      await missionService.cancelRegistration(missionId, reason)
      await loadMissions()
      await loadUserMissions()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const searchMissions = async (searchParams: any) => {
    try {
      setLoading(true)
      const data = await missionService.searchNearbyMissions(searchParams)
      setMissions(data as Mission[])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMissions()
    loadUserMissions()
  }, [])

  return {
    missions,
    userMissions,
    loading,
    error,
    loadMissions,
    loadUserMissions,
    participateInMission,
    cancelMissionParticipation,
    searchMissions
  }
}
