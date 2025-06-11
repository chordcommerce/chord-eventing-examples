'use client'

import { createContext, useContext } from 'react'

import type { AnalyticsChordInputs } from '../lib/chord'
import type { ChordAnalytics } from '@chordcommerce/analytics'

export const ChordAnalyticsContext = createContext<
  ChordAnalytics<AnalyticsChordInputs>
>(undefined!)
ChordAnalyticsContext.displayName = 'ChordAnalyticsContext'

export function useChord() {
  return useContext(ChordAnalyticsContext)
}
