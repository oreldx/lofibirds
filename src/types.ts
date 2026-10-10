export type SpeciesId =
  | 'merle-noir'
  | 'rouge-gorge'
  | 'mesange-charbonniere'
  | 'moineau-domestique'
  | 'pinson-des-arbres'

export interface ChannelSettings {
  enabled: boolean
  /** Gain normalisé entre 0 et 1. */
  volume: number
}

export interface GardenPreferences {
  species: Record<SpeciesId, ChannelSettings>
  ambience: ChannelSettings
}

export type ChannelId = SpeciesId | 'ambience'

export type PlaybackState = 'stopped' | 'starting' | 'playing' | 'paused' | 'interrupted'

export type ChannelLoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'error'; message: string }

export interface AssetCredit {
  author: string | null
  rightsHolder?: string
  source: string
  sourceUrl: string | null
  license: string
  licenseUrl: string | null
  modifications: string[]
}

/** Une ressource intégrée doit posséder une URL locale importée et des crédits vérifiés. */
export interface CreditedAsset {
  url: string
  credit: AssetCredit
}

/** Coordonnées normalisées dans le jardin, de gauche à droite et de haut en bas. */
export interface ScenePosition {
  x: number
  y: number
}

export interface SpeciesDefinition {
  id: SpeciesId
  name: string
  photo: CreditedAsset
  position: ScenePosition
  /** Liste vide tant qu’aucun enregistrement n’a été vérifié. */
  audio: readonly CreditedAsset[]
  /** null tant qu’aucun sprite n’a été vérifié. */
  sprite: CreditedAsset | null
}
