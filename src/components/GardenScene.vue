<script setup lang="ts">
import { gardenAsset } from '../data/resources'
import { speciesCatalog } from '../data/species'
import { useGarden } from '../composables/useGarden'
import RobinSprite from './RobinSprite.vue'
import GreatTitSprite from './GreatTitSprite.vue'
import BlackbirdSprite from './BlackbirdSprite.vue'
import SparrowSprite from './SparrowSprite.vue'
import ChaffinchSprite from './ChaffinchSprite.vue'

const { preferences } = useGarden()
</script>

<template>
  <figure class="garden-scene" role="img" aria-label="Un jardin européen au matin de printemps, avec un grand arbre, des fleurs, un muret et une barrière. Choisissez les oiseaux présents dans l’onglet Espèces de la barre de contrôle sous le jardin.">
    <img class="garden-background" :src="gardenAsset.url" alt="" width="1672" height="941" fetchpriority="high" />
    <template v-for="species in speciesCatalog" :key="species.id">
      <span v-if="preferences.species[species.id].enabled" class="garden-bird" :class="`bird-${species.id}`" aria-hidden="true">
        <RobinSprite v-if="species.id === 'rouge-gorge'" animated />
        <GreatTitSprite v-else-if="species.id === 'mesange-charbonniere'" animated />
        <BlackbirdSprite v-else-if="species.id === 'merle-noir'" animated />
        <SparrowSprite v-else-if="species.id === 'moineau-domestique'" animated />
        <ChaffinchSprite v-else-if="species.id === 'pinson-des-arbres'" animated />
      </span>
    </template>
  </figure>
</template>
