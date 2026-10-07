<script setup lang="ts">
import type { AssetCredit } from '../types'
import { speciesCatalog } from '../data/species'
import { ambienceCredit, gardenCredit, robinSpritesheetCredit, spriteCredit } from '../data/credits'

const groups: { name: string; resources: { name: string; credit: AssetCredit }[] }[] = [
  {
    name: 'Illustrations',
    resources: [
      { name: 'Décor du jardin', credit: gardenCredit },
      { name: 'Merle noir, mésange, moineau et pinson', credit: spriteCredit },
      { name: 'Rouge-gorge animé', credit: robinSpritesheetCredit },
    ],
  },
  {
    name: 'Chants d’oiseaux',
    resources: speciesCatalog.flatMap((species) =>
      species.audio.map((asset) => ({ name: species.name, credit: asset.credit })),
    ),
  },
  {
    name: 'Ambiance',
    resources: [{ name: 'Brise et feuillage', credit: ambienceCredit }],
  },
]
</script>

<template>
  <details class="credits">
    <summary>Crédits</summary>
    <p class="credits-intro">Merci aux créateurs qui donnent vie au jardin.</p>
    <section v-for="group in groups" :key="group.name" class="credit-group">
      <h2>{{ group.name }}</h2>
      <ul class="credit-list">
        <li v-for="resource in group.resources" :key="resource.name">
          <h3>{{ resource.name }}</h3>
          <p v-if="resource.credit.author" class="credit-author">{{ resource.credit.author }}</p>
          <p v-if="resource.credit.rightsHolder">Titulaire déclaré : {{ resource.credit.rightsHolder }}</p>
          <p>
            <a v-if="resource.credit.sourceUrl" :href="resource.credit.sourceUrl">{{ resource.credit.source }}</a>
            <span v-else>{{ resource.credit.source }}</span>
          </p>
          <p>
            <a v-if="resource.credit.licenseUrl" :href="resource.credit.licenseUrl">{{ resource.credit.license }}</a>
            <span v-else>{{ resource.credit.license }}</span>
          </p>
          <p v-if="resource.credit.modifications.length" class="credit-adaptations">
            {{ resource.credit.modifications.join(' ; ') }}.
          </p>
        </li>
      </ul>
    </section>
  </details>
</template>
