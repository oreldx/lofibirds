import type { CreditedAsset } from '../types'
import gardenUrl from '../assets/images/garden.png'
import gardenSkyUrl from '../assets/images/garden-calques/01-ciel.png'
import cloudsUrl from '../assets/images/garden-calques/02-nuages-spritesheet.png'
import backgroundUrl from '../assets/images/garden-calques/03-arriere-plan-spritesheet.png'
import foregroundUrl from '../assets/images/garden-calques/04-premier-plan-spritesheet.png'
import ambienceUrl from '../assets/audio/brise-feuillage.mp3'
import { ambienceCredit, gardenCredit } from './credits'

export const gardenAsset: CreditedAsset = { url: gardenUrl, credit: gardenCredit }
export const gardenSkyAsset: CreditedAsset = { url: gardenSkyUrl, credit: gardenCredit }
export const gardenAnimationLayers = [
  { id: 'clouds', url: cloudsUrl, durationSeconds: 12, credit: gardenCredit },
  { id: 'background', url: backgroundUrl, durationSeconds: 4, credit: gardenCredit },
  { id: 'foreground', url: foregroundUrl, durationSeconds: 3, credit: gardenCredit },
] as const satisfies readonly (CreditedAsset & { id: string; durationSeconds: number })[]
export const ambienceAsset: CreditedAsset = { url: ambienceUrl, credit: ambienceCredit }
