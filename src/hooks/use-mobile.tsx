import * as React from "react"

const MOBILE_BREAKPOINT = 768
const THROTTLE_DELAY = 100

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    let timeoutId: number | undefined

    const handleResize = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }

      timeoutId = window.setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }, THROTTLE_DELAY)
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Event listeners
    mql.addEventListener("change", handleResize)
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      mql.removeEventListener("change", handleResize)
      window.removeEventListener("resize", handleResize)
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  return !!isMobile
}

// Hook pour optimiser les performances des animations
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Hook pour la gestion du cache
export function useCache<T>(key: string, initialData: T) {
  const [data, setData] = React.useState<T>(() => {
    try {
      const cached = localStorage.getItem(key)
      return cached ? JSON.parse(cached) : initialData
    } catch {
      return initialData
    }
  })

  const updateCache = React.useCallback((newData: T) => {
    setData(newData)
    try {
      localStorage.setItem(key, JSON.stringify(newData))
    } catch (error) {
      console.error('Erreur lors de la mise en cache:', error)
    }
  }, [key])

  return [data, updateCache] as const
}
