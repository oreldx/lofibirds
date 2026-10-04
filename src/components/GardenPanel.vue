<script setup lang="ts">
import { ref } from 'vue'
import { speciesCatalog } from '../data/species'
import SpeciesControl from './SpeciesControl.vue'

const expanded = ref(true)
</script>

<template>
  <aside class="garden-panel" aria-labelledby="garden-panel-title">
    <div class="panel-heading">
      <h2 id="garden-panel-title">Les habitants</h2>
      <button type="button" :aria-expanded="expanded" aria-controls="garden-settings" @click="expanded = !expanded">
        {{ expanded ? 'Replier' : 'Afficher' }}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 14 6-6 6 6" /></svg>
      </button>
    </div>
    <div id="garden-settings" v-show="expanded">
      <p class="panel-intro">Choisissez qui habite votre jardin.</p>
      <ul class="species-list">
        <li v-for="species in speciesCatalog" :key="species.id">
          <SpeciesControl :id="species.id" :name="species.name" :sprite-url="species.sprite.url" />
        </li>
      </ul>
      <p class="listening-note">Pour le moment, profitez du paysage. L’écoute arrive à la prochaine étape.</p>
    </div>
  </aside>
</template>
