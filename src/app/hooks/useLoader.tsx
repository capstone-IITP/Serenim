'use client'

import { useContext } from 'react'
import { LoadingContext } from '../providers'

export function useLoader() {
  const context = useContext(LoadingContext)
  
  if (!context) {
    throw new Error('useLoader must be used within a LoadingProvider')
  }
  
  return {
    isLoading: context.isLoading,
    /**
     * Show the cosmic loader
     */
    showLoader: () => context.setIsLoading(true),
    /**
     * Hide the cosmic loader
     */
    hideLoader: () => context.setIsLoading(false),
    /**
     * Show loader for a specific duration and then hide it
     */
    pulseLoader: (durationMs: number = 1500) => {
      context.setIsLoading(true)
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          context.setIsLoading(false)
          resolve()
        }, durationMs)
      })
    }
  }
} 