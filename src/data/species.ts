import type { SpeciesDefinition } from '../types'
import blackbirdSound from '../assets/audio/merle-noir.mp3'
import robinSound from '../assets/audio/rouge-gorge.mp3'
import greatTitSound from '../assets/audio/mesange-charbonniere.mp3'
import sparrowSound from '../assets/audio/moineau-domestique.mp3'
import chaffinchSound from '../assets/audio/pinson-des-arbres.mp3'
import blackbirdSprite from '../assets/images/merle-noir-spritesheet.png'
import robinSprite from '../assets/images/rouge-gorge-spritesheet.png'
import greatTitSprite from '../assets/images/mesange-charbonniere-spritesheet.png'
import sparrowSprite from '../assets/images/moineau-domestique-spritesheet.png'
import chaffinchSprite from '../assets/images/pinson-des-arbres-spritesheet.png'
import blackbirdPhoto from '../assets/images/merle-noir.jpg'
import robinPhoto from '../assets/images/rouge-gorge.jpg'
import greatTitPhoto from '../assets/images/mesange-charbonniere.jpg'
import sparrowPhoto from '../assets/images/moineau-domestique.jpg'
import chaffinchPhoto from '../assets/images/pinson-des-arbres.jpg'
import { audioCredits, generatedSpritesheetCredit, robinSpritesheetCredit, speciesPhotoCredit } from './credits'

export const speciesCatalog = [
  {
    id: 'merle-noir', name: 'Merle noir',
    position: { x: 0.34, y: 0.74 },
    photo: { url: blackbirdPhoto, credit: speciesPhotoCredit },
    audio: [{ url: blackbirdSound, credit: audioCredits['merle-noir'] }],
    sprite: { url: blackbirdSprite, credit: generatedSpritesheetCredit },
  },
  {
    id: 'rouge-gorge', name: 'Rouge-gorge',
    position: { x: 0.15, y: 0.8 },
    photo: { url: robinPhoto, credit: speciesPhotoCredit },
    audio: [{ url: robinSound, credit: audioCredits['rouge-gorge'] }],
    sprite: { url: robinSprite, credit: robinSpritesheetCredit },
  },
  {
    id: 'mesange-charbonniere', name: 'Mésange charbonnière',
    position: { x: 0.26, y: 0.24 },
    photo: { url: greatTitPhoto, credit: speciesPhotoCredit },
    audio: [{ url: greatTitSound, credit: audioCredits['mesange-charbonniere'] }],
    sprite: { url: greatTitSprite, credit: generatedSpritesheetCredit },
  },
  {
    id: 'moineau-domestique', name: 'Moineau domestique',
    position: { x: 0.77, y: 0.8 },
    photo: { url: sparrowPhoto, credit: speciesPhotoCredit },
    audio: [{ url: sparrowSound, credit: audioCredits['moineau-domestique'] }],
    sprite: { url: sparrowSprite, credit: generatedSpritesheetCredit },
  },
  {
    id: 'pinson-des-arbres', name: 'Pinson des arbres',
    position: { x: 0.61, y: 0.75 },
    photo: { url: chaffinchPhoto, credit: speciesPhotoCredit },
    audio: [{ url: chaffinchSound, credit: audioCredits['pinson-des-arbres'] }],
    sprite: { url: chaffinchSprite, credit: generatedSpritesheetCredit },
  },
] as const satisfies readonly SpeciesDefinition[]
