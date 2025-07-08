'use client'

import { useEffect, useMemo, useState } from 'react'

import { ChordAnalyticsContext } from '../hooks/useChord'
import { createChordClient } from '../lib/chord'

export const ChordProvider = ({ children }: { children: React.ReactNode }) => {
  const currency = 'USD'
  const locale = 'en-US'
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const chord = useMemo(() => {
    if (!isClient) return null
    return createChordClient(currency, locale)
  }, [isClient, currency, locale])

  if (!chord) {
    return <>{children}</>
  }

  return (
    <ChordAnalyticsContext.Provider value={chord}>
      {children}
    </ChordAnalyticsContext.Provider>
  )
}
