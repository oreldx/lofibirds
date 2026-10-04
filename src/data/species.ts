import type { SpeciesDefinition } from '../types'

export const speciesCatalog = [
  { id: 'merle-noir', name: 'Merle noir', audio: [], sprite: null },
  { id: 'rouge-gorge', name: 'Rouge-gorge', audio: [], sprite: null },
  { id: 'mesange-charbonniere', name: 'Mésange charbonnière', audio: [], sprite: null },
  { id: 'moineau-domestique', name: 'Moineau domestique', audio: [], sprite: null },
  { id: 'pinson-des-arbres', name: 'Pinson des arbres', audio: [], sprite: null },
] as const satisfies readonly SpeciesDefinition[]
