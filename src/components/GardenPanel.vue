<script setup lang="ts">
import { ref } from 'vue'
import { speciesCatalog } from '../data/species'
import SpeciesControl from './SpeciesControl.vue'
import { useGarden } from '../composables/useGarden'

const expanded = ref(true)
const { audio, play, pause } = useGarden()

function togglePlayback(): void {
  if (audio.playback === 'playing' || audio.playback === 'starting') pause()
  else void play()
}
</script>

<template>
  <aside class="garden-panel" aria-labelledby="garden-panel-title">
    <button type="button" class="playback-button" @click="togglePlayback">
      <svg v-if="audio.playback === 'playing' || audio.playback === 'starting'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
      <svg v-else viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m7 3 14 9-14 9z" /></svg>
      {{ audio.playback === 'playing' || audio.playback === 'starting' ? 'Pause' : audio.playback === 'interrupted' ? 'Reprendre l’écoute' : 'Écouter le jardin' }}
    </button>
    <div class="playback-status" role="status" aria-atomic="true">
      <p v-if="audio.playback === 'starting'">Démarrage de l’écoute…</p>
      <p v-else-if="audio.playback === 'interrupted'">L’écoute a été interrompue par le navigateur. Vous pouvez la reprendre.</p>
      <p v-if="audio.error" class="audio-error">{{ audio.error }}</p>
    </div>
    <div class="panel-heading">
      <h2 id="garden-panel-title">Les habitants</h2>
      <button type="button" :aria-expanded="expanded" aria-controls="garden-settings" @click="expanded = !expanded">
        {{ expanded ? 'Replier' : 'Afficher' }}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 14 6-6 6 6" /></svg>
      </button>
    </div>
    <div id="garden-settings" v-show="expanded">
      <p class="panel-intro">Composez les sons de votre jardin.</p>
      <ul class="species-list">
        <li v-for="species in speciesCatalog" :key="species.id">
          <SpeciesControl :id="species.id" :name="species.name" :sprite-url="species.sprite.url" />
        </li>
      </ul>
      <div class="ambience-group">
        <SpeciesControl id="ambience" name="Brise et feuillage" />
      </div>
    </div>
  </aside>
</template>
