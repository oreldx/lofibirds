<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useGarden } from '../composables/useGarden'

const { audio, play, pause } = useGarden()
const bar = ref<HTMLElement | null>(null)
const isPlaying = computed(() => audio.playback === 'playing' || audio.playback === 'starting')
const label = computed(() => isPlaying.value ? 'Pause'
  : audio.playback === 'interrupted' ? 'Reprendre l’écoute' : 'Écouter le jardin')
let resizeObserver: ResizeObserver | undefined

function togglePlayback(): void {
  if (isPlaying.value) pause()
  else void play()
}

function updateBarHeight(): void {
  if (!bar.value) return
  document.documentElement.style.setProperty('--playback-bar-height', `${bar.value.getBoundingClientRect().height}px`)
}

onMounted(() => {
  if (!bar.value) return
  updateBarHeight()
  resizeObserver = new ResizeObserver(updateBarHeight)
  resizeObserver.observe(bar.value, { box: 'border-box' })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  document.documentElement.style.removeProperty('--playback-bar-height')
})
</script>

<template>
  <section ref="bar" class="playback-bar" aria-label="Lecture du jardin">
    <button type="button" class="playback-button" @click="togglePlayback">
      <svg v-if="isPlaying" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="m7 3 14 9-14 9z" />
      </svg>
      {{ label }}
    </button>
  </section>
</template>
