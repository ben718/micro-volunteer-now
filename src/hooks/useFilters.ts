
import { useState, useMemo } from 'react'
import { Mission } from '@/types/mission'

export interface Filters {
  category: string
  searchQuery: string
  dateRange: string
  location: string
  maxDistance: number
  maxDuration: number
  language: string
}

export const useFilters = (missions: Mission[]) => {
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    searchQuery: '',
    dateRange: 'all',
    location: '',
    maxDistance: 50,
    maxDuration: 480,
    language: 'all'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const filteredMissions = useMemo(() => {
    return missions.filter(mission => {
      // Category filter
      if (filters.category !== 'all' && mission.category !== filters.category) {
        return false
      }

      // Search query filter
      if (filters.searchQuery && !mission.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !mission.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false
      }

      // Duration filter
      if (mission.duration > filters.maxDuration) {
        return false
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
      searchQuery: '',
      dateRange: 'all',
      location: '',
      maxDistance: 50,
      maxDuration: 480,
      language: 'all'
    })
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'category') return value !== 'all'
    if (key === 'searchQuery') return value !== ''
    if (key === 'dateRange') return value !== 'all'
    if (key === 'location') return value !== ''
    if (key === 'language') return value !== 'all'
    return false
  }).length

  const onToggleAdvanced = () => {
    setShowAdvanced(!showAdvanced)
  }

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
