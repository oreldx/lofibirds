import { reactive, readonly } from 'vue'
import { createDefaultPreferences } from '../data/defaults'
import type { SpeciesId } from '../types'

const preferences = reactive(createDefaultPreferences())
const gardenPreferences = readonly(preferences)

function setSpeciesEnabled(id: SpeciesId, enabled: boolean): void {
  preferences.species[id].enabled = enabled
}

export function useGarden() {
  return { preferences: gardenPreferences, setSpeciesEnabled }
}
