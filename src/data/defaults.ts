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
    ambience: { enabled: true, volume: 0.25 },
  }
}

export const initialPlaybackState: PlaybackState = 'stopped'
