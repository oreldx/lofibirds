import type { AmbienceId, AssetCredit, SpeciesId } from '../types'

const publicDomain = {
  author: 'Oona Räisänen (Mysid)',
  license: 'Domaine public',
  licenseUrl: 'https://commons.wikimedia.org/wiki/Template:PD-self',
} as const

export const gardenCredit: AssetCredit = {
  author: null,
  rightsHolder: 'Propriétaire du projet Lofibirds',
  source: 'Décor et calques fournis pour Lofibirds',
  sourceUrl: null,
  license: 'Utilisation autorisée dans Lofibirds — sans licence publique',
  licenseUrl: null,
  modifications: [
    'Animation des nuages et du feuillage par transformations des calques originaux',
    'Pixelisation des frames avec une taille de pixel de 3, sans lissage, selon la méthode Canvas de Pixel Art Village',
    '16 frames par calque, assemblées en spritesheets 4 × 4',
    'Superposition sur un ciel fixe ; décor original conservé pendant le chargement',
  ],
}

export const spriteCredit: AssetCredit = {
  author: null,
  source: 'Sprites créés avec OpenAI imagegen',
  sourceUrl: null,
  license: 'Création pour Lofibirds — sans licence publique',
  licenseUrl: null,
  modifications: [],
}

export const speciesPhotoCredit: AssetCredit = {
  author: null,
  source: 'Photodoiso',
  sourceUrl: 'https://www.photodoiso.fr/',
  license: 'CC BY-NC-ND 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  modifications: ['Fichiers renommés selon les espèces', 'Recadrage à l’affichage dans les cartes ; fichiers originaux inchangés'],
}

export const ambiencePhotoCredit: AssetCredit = {
  author: null,
  source: 'Pixabay',
  sourceUrl: 'https://pixabay.com/',
  license: 'Pixabay Content License',
  licenseUrl: 'https://pixabay.com/service/license-summary/',
  modifications: ['Fichiers renommés selon les ambiances', 'Recadrage à l’affichage dans les cartes ; fichiers originaux inchangés'],
}

export const robinSpritesheetCredit: AssetCredit = {
  author: null,
  source: 'Spritesheet du rouge-gorge fourni dans le dépôt Lofibirds',
  sourceUrl: null,
  license: 'Licence non renseignée',
  licenseUrl: null,
  modifications: ['Affichage des 12 cases en CSS ; fichier original inchangé'],
}

export const generatedSpritesheetCredit: AssetCredit = {
  author: null,
  source: 'Sprite original et 11 poses créés avec OpenAI imagegen pour Lofibirds',
  sourceUrl: null,
  license: 'Création pour Lofibirds — sans licence publique',
  licenseUrl: null,
  modifications: ['11 poses générées à partir du sprite original', 'Réduction au plus proche voisin et assemblage en grille 4 × 3', 'Affichage des 12 cases en CSS'],
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

const ambienceCredit: AssetCredit = {
  author: 'o_ciz',
  source: 'Wind(leaves) · 475448 — Freesound',
  sourceUrl: 'https://freesound.org/people/o_ciz/sounds/475448/',
  license: 'CC0 1.0',
  licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  modifications: ['Extrait, volume ajusté et réencodage en MP3'],
}

const sonothequeCredit = {
  author: 'Joseph SARDIN',
  license: 'CC0 1.0',
  licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  modifications: ['Fichier MP3 original renommé ; raccord avec fondu croisé d’une seconde à la lecture'],
}

export const ambienceCredits = {
  'brise-feuillage': ambienceCredit,
  'pluie-douce': {
    ...sonothequeCredit,
    source: 'Pluie d’été sur terrasse · 1019 — LaSonothèque',
    sourceUrl: 'https://lasonotheque.org/pluie-d-ete-sur-terrasse-s1019.html',
  },
  'ruisseau': {
    ...sonothequeCredit,
    source: 'Cours d’eau 5.2 · 3137 — LaSonothèque',
    sourceUrl: 'https://lasonotheque.org/cours-d-eau-5-2-s3137.html',
  },
  'riviere': {
    ...sonothequeCredit,
    source: 'Petit ruisseau #4 · 1354 — LaSonothèque',
    sourceUrl: 'https://lasonotheque.org/petit-ruisseau-4-s1354.html',
  },
  'vent-leger': {
    ...sonothequeCredit,
    source: 'Vent, herbes hautes · 0908 — LaSonothèque',
    sourceUrl: 'https://lasonotheque.org/vent-dans-les-herbes-hautes-s0908.html',
  },
} satisfies Record<AmbienceId, AssetCredit>
