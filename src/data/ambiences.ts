import type { AmbienceId, CreditedAsset } from '../types'
import breezeUrl from '../assets/audio/brise-feuillage.mp3'
import rainUrl from '../assets/audio/pluie-ete-terrasse.mp3'
import streamUrl from '../assets/audio/cours-eau-5-2.mp3'
import riverUrl from '../assets/audio/petit-ruisseau-4.mp3'
import lightWindUrl from '../assets/audio/vent-herbes-hautes.mp3'
import breezePhotoUrl from '../assets/images/brise-feuillage.jpg'
import rainPhotoUrl from '../assets/images/pluie-douce.jpg'
import streamPhotoUrl from '../assets/images/ruisseau.jpg'
import riverPhotoUrl from '../assets/images/riviere.jpg'
import lightWindPhotoUrl from '../assets/images/vent-leger.jpg'
import { ambienceCredits, ambiencePhotoCredit } from './credits'

export const ambienceCatalog = [
  { id: 'brise-feuillage', name: 'Vent léger', photo: { url: lightWindPhotoUrl, credit: ambiencePhotoCredit }, asset: { url: breezeUrl, credit: ambienceCredits['brise-feuillage'] } },
  { id: 'pluie-douce', name: 'Pluie douce', photo: { url: rainPhotoUrl, credit: ambiencePhotoCredit }, asset: { url: rainUrl, credit: ambienceCredits['pluie-douce'] } },
  { id: 'ruisseau', name: 'Ruisseau', photo: { url: streamPhotoUrl, credit: ambiencePhotoCredit }, asset: { url: streamUrl, credit: ambienceCredits.ruisseau } },
  { id: 'riviere', name: 'Rivière', photo: { url: riverPhotoUrl, credit: ambiencePhotoCredit }, asset: { url: riverUrl, credit: ambienceCredits.riviere } },
  { id: 'vent-leger', name: 'Brise et feuillage', photo: { url: breezePhotoUrl, credit: ambiencePhotoCredit }, asset: { url: lightWindUrl, credit: ambienceCredits['vent-leger'] } },
] as const satisfies readonly { id: AmbienceId; name: string; photo: CreditedAsset; asset: CreditedAsset }[]

export function isAmbienceId(id: string): id is AmbienceId {
  return ambienceCatalog.some((ambience) => ambience.id === id)
}
