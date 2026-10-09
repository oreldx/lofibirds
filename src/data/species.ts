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
import { audioCredits, generatedSpritesheetCredit, robinSpritesheetCredit } from './credits'

export const speciesCatalog = [
  {
    id: 'merle-noir', name: 'Merle noir',
    audio: [{ url: blackbirdSound, credit: audioCredits['merle-noir'] }],
    sprite: { url: blackbirdSprite, credit: generatedSpritesheetCredit },
  },
  {
    id: 'rouge-gorge', name: 'Rouge-gorge',
    audio: [{ url: robinSound, credit: audioCredits['rouge-gorge'] }],
    sprite: { url: robinSprite, credit: robinSpritesheetCredit },
  },
  {
    id: 'mesange-charbonniere', name: 'Mésange charbonnière',
    audio: [{ url: greatTitSound, credit: audioCredits['mesange-charbonniere'] }],
    sprite: { url: greatTitSprite, credit: generatedSpritesheetCredit },
  },
  {
    id: 'moineau-domestique', name: 'Moineau domestique',
    audio: [{ url: sparrowSound, credit: audioCredits['moineau-domestique'] }],
    sprite: { url: sparrowSprite, credit: generatedSpritesheetCredit },
  },
  {
    id: 'pinson-des-arbres', name: 'Pinson des arbres',
    audio: [{ url: chaffinchSound, credit: audioCredits['pinson-des-arbres'] }],
    sprite: { url: chaffinchSprite, credit: generatedSpritesheetCredit },
  },
] as const satisfies readonly SpeciesDefinition[]
