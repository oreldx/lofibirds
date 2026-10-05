import { reactive, readonly } from 'vue'
import { createDefaultPreferences } from '../data/defaults'
import { speciesCatalog } from '../data/species'
import { ambienceAsset } from '../data/resources'
import { GardenAudioEngine } from '../audio/GardenAudioEngine'
import type { AudioSnapshot } from '../audio/GardenAudioEngine'
import type { ChannelId, ChannelLoadState, SpeciesId } from '../types'

const preferences = reactive(createDefaultPreferences())
const gardenPreferences = readonly(preferences)
const audio = reactive<AudioSnapshot>({
  playback: 'stopped', error: null,
  channels: Object.fromEntries([...speciesCatalog.map((species) => species.id), 'ambience'].map((id) => [id, { status: 'idle' }])) as Record<ChannelId, ChannelLoadState>,
})
const audioState = readonly(audio)
const engine = new GardenAudioEngine(
  Object.fromEntries([
    ...speciesCatalog.map((species) => [species.id, species.audio.map((asset) => asset.url)]),
    ['ambience', [ambienceAsset.url]],
  ]) as Record<ChannelId, readonly string[]>,
  preferences,
  (snapshot) => Object.assign(audio, snapshot),
)

function settings(id: ChannelId) {
  return id === 'ambience' ? preferences.ambience : preferences.species[id]
}

function setChannelEnabled(id: ChannelId, enabled: boolean): void {
  settings(id).enabled = enabled
  engine.setChannel(id, settings(id))
}

function setChannelVolume(id: ChannelId, volume: number): void {
  settings(id).volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0
  engine.setChannel(id, settings(id))
}

function setSpeciesEnabled(id: SpeciesId, enabled: boolean): void {
  setChannelEnabled(id, enabled)
}

// Le remplacement d’un module en développement termine son ancienne session.
if (import.meta.hot) import.meta.hot.dispose(() => { void engine.destroy() })

export function useGarden() {
  return {
    preferences: gardenPreferences, audio: audioState,
    setSpeciesEnabled, setChannelEnabled, setChannelVolume,
    play: () => engine.play(), pause: () => engine.pause(), retry: (id: ChannelId) => engine.retry(id),
  }
}
