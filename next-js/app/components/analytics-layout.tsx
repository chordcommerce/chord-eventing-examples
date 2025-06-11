'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { useChord } from '../hooks/useChord'

export function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const chord = useChord()
  const pathname = usePathname()

  useEffect(() => {
    if (chord) {
      chord.page()
    }
  }, [chord, pathname])

  return <>{children}</>
} 