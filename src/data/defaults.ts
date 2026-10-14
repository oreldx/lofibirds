import type { GardenPreferences, PlaybackState } from '../types'

export function createDefaultPreferences(): GardenPreferences {
  return {
    species: {
      'merle-noir': { enabled: true, volume: 0.4 },
      'rouge-gorge': { enabled: true, volume: 0.4 },
      'mesange-charbonniere': { enabled: true, volume: 0.4 },
      'moineau-domestique': { enabled: true, volume: 0.4 },
      'pinson-des-arbres': { enabled: true, volume: 0.4 },
    },
    ambiences: {
      'brise-feuillage': { enabled: true, volume: 0.25 },
      'pluie-douce': { enabled: false, volume: 0.25 },
      'ruisseau': { enabled: false, volume: 0.25 },
      'riviere': { enabled: false, volume: 0.25 },
      'vent-leger': { enabled: false, volume: 0.25 },
    },
  }
}

export const initialPlaybackState: PlaybackState = 'stopped'
