import type { CreditedAsset } from '../types'
import gardenUrl from '../assets/images/garden.png'
import ambienceUrl from '../assets/audio/brise-feuillage.mp3'
import { ambienceCredit, gardenCredit } from './credits'

export const gardenAsset: CreditedAsset = { url: gardenUrl, credit: gardenCredit }
export const ambienceAsset: CreditedAsset = { url: ambienceUrl, credit: ambienceCredit }
