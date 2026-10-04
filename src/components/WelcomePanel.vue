<script setup lang="ts">
import { speciesCatalog } from '../data/species'
import ResourceCredits from './ResourceCredits.vue'
</script>

<template>
  <section class="welcome" aria-labelledby="welcome-title">
    <p class="wordmark">Lofibirs</p>
    <p class="eyebrow">Un peu de nature, bientôt ici</p>
    <h1 id="welcome-title">Le jardin prend racine.</h1>
    <p class="intro">Cinq oiseaux, une brise légère et du temps pour soi. Les ressources du jardin sont réunies ; la scène et l’écoute arrivent aux prochaines étapes.</p>
    <section class="residents" aria-labelledby="residents-title">
      <h2 id="residents-title">Les habitants du jardin</h2>
      <ul>
        <li v-for="species in speciesCatalog" :key="species.id" class="resident">
          <img :src="species.sprite.url" alt="" width="108" height="72" />
          <span>{{ species.name }}</span>
        </li>
      </ul>
    </section>
    <ResourceCredits />
  </section>
</template>
