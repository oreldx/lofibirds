<script setup lang="ts">
import { ref } from 'vue'
import { speciesCatalog } from '../data/species'
import SpeciesControl from './SpeciesControl.vue'
import { useGarden } from '../composables/useGarden'

const activeGroup = ref<'species' | 'environment'>('species')
const { audio } = useGarden()

function navigateTabs(event: KeyboardEvent): void {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  activeGroup.value = event.key === 'Home' ? 'species'
    : event.key === 'End' ? 'environment'
      : activeGroup.value === 'species' ? 'environment' : 'species'
  const tabList = event.currentTarget
  if (tabList instanceof HTMLElement) {
    tabList.querySelector<HTMLButtonElement>(`#${activeGroup.value}-tab`)?.focus()
  }
}
</script>

<template>
  <aside class="garden-panel" aria-labelledby="garden-panel-title">
    <h2 id="garden-panel-title" class="visually-hidden">Les sons du jardin</h2>
    <div class="garden-toolbar">
      <div class="sound-tabs" role="tablist" aria-label="Catégorie de sons" @keydown="navigateTabs">
        <button id="species-tab" type="button" role="tab" :aria-selected="activeGroup === 'species'" :tabindex="activeGroup === 'species' ? 0 : -1" aria-controls="species-panel" @click="activeGroup = 'species'">Espèces</button>
        <button id="environment-tab" type="button" role="tab" :aria-selected="activeGroup === 'environment'" :tabindex="activeGroup === 'environment' ? 0 : -1" aria-controls="environment-panel" @click="activeGroup = 'environment'">Environnement</button>
      </div>
    </div>
    <div class="playback-status" role="status" aria-atomic="true">
      <p v-if="audio.playback === 'starting'">Démarrage de l’écoute…</p>
      <p v-else-if="audio.playback === 'interrupted'">L’écoute a été interrompue par le navigateur. Vous pouvez la reprendre.</p>
      <p v-if="audio.error" class="audio-error">{{ audio.error }}</p>
    </div>
    <div id="species-panel" v-show="activeGroup === 'species'" role="tabpanel" aria-labelledby="species-tab" class="sound-panel">
      <ul class="species-list" aria-label="Espèces du jardin">
        <li v-for="species in speciesCatalog" :key="species.id">
          <SpeciesControl :id="species.id" :name="species.name" :sprite-url="species.sprite.url" />
        </li>
      </ul>
    </div>
    <div id="environment-panel" v-show="activeGroup === 'environment'" role="tabpanel" aria-labelledby="environment-tab" class="sound-panel">
      <ul class="species-list" aria-label="Sons de l’environnement">
        <li><SpeciesControl id="ambience" name="Brise et feuillage" /></li>
      </ul>
    </div>
  </aside>
</template>
