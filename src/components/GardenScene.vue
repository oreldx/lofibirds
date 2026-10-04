<script setup lang="ts">
import { gardenAsset } from '../data/resources'
import { speciesCatalog } from '../data/species'
import { useGarden } from '../composables/useGarden'

const { preferences } = useGarden()
</script>

<template>
  <figure class="garden-scene" role="img" aria-label="Un jardin européen au matin de printemps, avec un grand arbre, des fleurs, un muret et une barrière. Choisissez les oiseaux présents dans le panneau Les habitants.">
    <img class="garden-background" :src="gardenAsset.url" alt="" width="1672" height="941" fetchpriority="high" />
    <template v-for="species in speciesCatalog" :key="species.id">
      <span v-if="preferences.species[species.id].enabled" class="garden-bird" :class="`bird-${species.id}`" aria-hidden="true">
        <img :src="species.sprite.url" alt="" width="1536" height="1024" draggable="false" />
      </span>
    </template>
  </figure>
</template>
