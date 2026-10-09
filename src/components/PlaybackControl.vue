<script setup lang="ts">
import { computed } from 'vue'
import { useGarden } from '../composables/useGarden'

const { audio, play, pause } = useGarden()
const isPlaying = computed(() => audio.playback === 'playing' || audio.playback === 'starting')
const label = computed(() => isPlaying.value ? 'Pause'
  : audio.playback === 'interrupted' ? 'Reprendre l’écoute' : 'Écouter le jardin')

function togglePlayback(): void {
  if (isPlaying.value) pause()
  else void play()
}
</script>

<template>
  <div class="playback-control">
    <button type="button" class="playback-button" :aria-label="label" @click="togglePlayback">
      <svg v-if="isPlaying" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="m7 3 14 9-14 9z" />
      </svg>
      <span class="playback-label">{{ label }}</span>
    </button>
    <div class="playback-status" role="status" aria-atomic="true">
      <p v-if="audio.playback === 'starting'">Démarrage de l’écoute…</p>
      <p v-else-if="audio.playback === 'interrupted'">L’écoute a été interrompue par le navigateur. Vous pouvez la reprendre.</p>
      <p v-if="audio.error" class="audio-error">{{ audio.error }}</p>
    </div>
  </div>
</template>
