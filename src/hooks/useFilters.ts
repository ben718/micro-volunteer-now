
import { useState, useMemo } from 'react'
import { Mission } from '@/types/mission'

export interface Filters {
  category: string
  distance: string
  duration: string
  availability: string
  urgency: boolean
  location?: { lat: number; lng: number }
  searchQuery: string
}

export const useFilters = (missions: Mission[]) => {
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    distance: 'all',
    duration: 'all',
    availability: 'all',
    urgency: false,
    searchQuery: ''
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const filteredMissions = useMemo(() => {
    return missions.filter(mission => {
      // Filtre par catégorie
      if (filters.category !== 'all' && mission.category !== filters.category) {
        return false
      }

      // Filtre par durée
      if (filters.duration !== 'all') {
        const maxDuration = parseInt(filters.duration)
        if (mission.duration > maxDuration) {
          return false
        }
      }

      // Filtre par urgence
      if (filters.urgency && !mission.is_urgent) {
        return false
      }

      // Filtre par disponibilité
      if (filters.availability !== 'all') {
        const now = new Date()
        const missionDate = new Date(mission.start_time)
        
        switch (filters.availability) {
          case 'now':
            const inNextHour = new Date(now.getTime() + 60 * 60 * 1000)
            if (missionDate < now || missionDate > inNextHour) {
              return false
            }
            break
          case 'today':
            if (missionDate.toDateString() !== now.toDateString()) {
              return false
            }
            break
          case 'week':
            const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            if (missionDate > nextWeek) {
              return false
            }
            break
        }
      }

      // Filtre par recherche
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        if (!mission.title.toLowerCase().includes(query) && 
            !mission.description.toLowerCase().includes(query) &&
            !mission.city.toLowerCase().includes(query)) {
          return false
        }
      }

      return true
    })
  }, [missions, filters])

  const onFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const onClearFilters = () => {
    setFilters({
      category: 'all',
      distance: 'all', 
      duration: 'all',
      availability: 'all',
      urgency: false,
      searchQuery: ''
    })
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.category !== 'all') count++
    if (filters.distance !== 'all') count++
    if (filters.duration !== 'all') count++
    if (filters.availability !== 'all') count++
    if (filters.urgency) count++
    if (filters.searchQuery) count++
    return count
  }, [filters])

  const onToggleAdvanced = () => setShowAdvanced(!showAdvanced)

  return {
    filters,
    filteredMissions,
    onFilterChange,
    onClearFilters,
    activeFiltersCount,
    showAdvanced,
    onToggleAdvanced
  }
}
