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

/** Seuls ces réglages pourront être persistés. */
export interface GardenPreferences {
  species: Record<SpeciesId, ChannelSettings>
  ambience: ChannelSettings
}

export type PlaybackState = 'stopped' | 'playing' | 'paused'

export type ChannelLoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'error'; message: string }

export interface AssetCredit {
  author: string
  sourceUrl: string
  license: string
  licenseUrl: string
  modifications: string[]
}

/** Une ressource intégrée doit posséder une URL locale importée et des crédits vérifiés. */
export interface CreditedAsset {
  url: string
  credit: AssetCredit
}

export interface SpeciesDefinition {
  id: SpeciesId
  name: string
  /** Liste vide tant qu’aucun enregistrement n’a été vérifié. */
  audio: readonly CreditedAsset[]
  /** null tant qu’aucun sprite n’a été vérifié. */
  sprite: CreditedAsset | null
}
