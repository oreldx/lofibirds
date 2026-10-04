import type { AssetCredit, SpeciesId } from '../types'

const publicDomain = {
  author: 'Oona Räisänen (Mysid)',
  license: 'Domaine public',
  licenseUrl: 'https://commons.wikimedia.org/wiki/Template:PD-self',
} as const

export const gardenCredit: AssetCredit = {
  author: null,
  rightsHolder: 'Propriétaire du projet Lofibirds',
  source: 'Décor fourni pour Lofibirds',
  sourceUrl: null,
  license: 'Utilisation autorisée dans Lofibirds — sans licence publique',
  licenseUrl: null,
  modifications: [],
}

export const spriteCredit: AssetCredit = {
  author: null,
  source: 'Sprites créés avec OpenAI imagegen',
  sourceUrl: null,
  license: 'Création pour Lofibirds — sans licence publique',
  licenseUrl: null,
  modifications: [],
}

export const audioCredits = {
  'merle-noir': {
    ...publicDomain,
    source: 'Turdus merula 2 — Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Turdus_merula_2.ogg',
    modifications: ['Extrait, volume ajusté, conversion en mono MP3 et fondus'],
  },
  'rouge-gorge': {
    author: 'Jan Cibulka',
    source: 'Erithacus rubecula · XC441752 — Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Erithacus_rubecula_-_European_Robin_XC441752.mp3',
    license: 'CC BY-SA 4.0 — adaptation sous la même licence',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    modifications: ['Volume ajusté, réencodage en mono MP3 et fondus'],
  },
  'mesange-charbonniere': {
    ...publicDomain,
    source: 'Parus major — Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Parus_major.ogg',
    modifications: ['Volume ajusté, conversion en mono MP3 et fondus'],
  },
  'moineau-domestique': {
    ...publicDomain,
    source: 'Passer domesticus — Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Passer_domesticus.ogg',
    modifications: ['Volume ajusté, conversion en mono MP3 et fondus'],
  },
  'pinson-des-arbres': {
    ...publicDomain,
    source: 'Fringilla coelebs short — Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fringilla_coelebs_short.ogg',
    modifications: ['Volume ajusté, conversion en mono MP3 et fondus'],
  },
} satisfies Record<SpeciesId, AssetCredit>

export const ambienceCredit: AssetCredit = {
  author: 'o_ciz',
  source: 'Wind(leaves) · 475448 — Freesound',
  sourceUrl: 'https://freesound.org/people/o_ciz/sounds/475448/',
  license: 'CC0 1.0',
  licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  modifications: ['Extrait, volume ajusté et réencodage en MP3'],
}
