import { createDefaultPreferences } from '../data/defaults'
import type { ChannelSettings, GardenPreferences, SpeciesId } from '../types'

export const PREFERENCES_KEY = 'lofibirds.preferences.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateChannel(value: unknown, defaults: ChannelSettings): ChannelSettings {
  if (!isRecord(value)) return defaults
  return {
    enabled: typeof value.enabled === 'boolean' ? value.enabled : defaults.enabled,
    volume: typeof value.volume === 'number' && Number.isFinite(value.volume)
      && value.volume >= 0 && value.volume <= 1 ? value.volume : defaults.volume,
  }
}

function validatePreferences(value: unknown): GardenPreferences {
  const defaults = createDefaultPreferences()
  if (!isRecord(value)) return defaults
  if (isRecord(value.species)) {
    for (const id of Object.keys(defaults.species) as SpeciesId[]) {
      defaults.species[id] = validateChannel(value.species[id], defaults.species[id])
    }
  }
  defaults.ambience = validateChannel(value.ambience, defaults.ambience)
  return defaults
}

export function loadPreferences(storage?: Pick<Storage, 'getItem'>): GardenPreferences {
  try {
    const stored = (storage ?? globalThis.localStorage)?.getItem(PREFERENCES_KEY)
    return stored == null ? createDefaultPreferences() : validatePreferences(JSON.parse(stored))
  } catch {
    return createDefaultPreferences()
  }
}

export function savePreferences(
  preferences: GardenPreferences,
  storage?: Pick<Storage, 'setItem'>,
): void {
  try {
    // Reconstruire uniquement les réglages connus, sans état audio ni champs supplémentaires.
    const stored = JSON.stringify(validatePreferences(preferences))
    const targetStorage = storage ?? globalThis.localStorage
    targetStorage?.setItem(PREFERENCES_KEY, stored)
  } catch {
    // Les réglages en mémoire restent utilisables si le stockage est indisponible.
  }
}
