import type { AmbienceId, CreditedAsset } from '../types'
import breezeUrl from '../assets/audio/brise-feuillage.mp3'
import rainUrl from '../assets/audio/pluie-calme.m4a'
import streamUrl from '../assets/audio/ruisseau.m4a'
import riverUrl from '../assets/audio/riviere.m4a'
import lightWindUrl from '../assets/audio/vent-leger.m4a'
import { ambienceCredits } from './credits'

export const ambienceCatalog = [
  { id: 'brise-feuillage', name: 'Brise et feuillage', asset: { url: breezeUrl, credit: ambienceCredits['brise-feuillage'] } },
  { id: 'pluie-douce', name: 'Pluie douce', asset: { url: rainUrl, credit: ambienceCredits['pluie-douce'] } },
  { id: 'ruisseau', name: 'Ruisseau', asset: { url: streamUrl, credit: ambienceCredits.ruisseau } },
  { id: 'riviere', name: 'Rivière', asset: { url: riverUrl, credit: ambienceCredits.riviere } },
  { id: 'vent-leger', name: 'Vent léger', asset: { url: lightWindUrl, credit: ambienceCredits['vent-leger'] } },
] as const satisfies readonly { id: AmbienceId; name: string; asset: CreditedAsset }[]

export function isAmbienceId(id: string): id is AmbienceId {
  return ambienceCatalog.some((ambience) => ambience.id === id)
}
