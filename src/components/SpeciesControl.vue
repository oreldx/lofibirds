<script setup lang="ts">
import { computed } from 'vue'
import type { ChannelId } from '../types'
import { useGarden } from '../composables/useGarden'

const props = defineProps<{ id: ChannelId; name: string; spriteUrl?: string }>()
const { preferences, audio, setChannelEnabled, setChannelVolume, retry } = useGarden()
const channel = computed(() => props.id === 'ambience' ? preferences.ambience : preferences.species[props.id])
const load = computed(() => audio.channels[props.id])

function updatePresence(event: Event): void {
  const input = event.target
  if (input instanceof HTMLInputElement) {
    setChannelEnabled(props.id, input.checked)
  }
}

function updateVolume(event: Event): void {
  if (event.target instanceof HTMLInputElement) setChannelVolume(props.id, Number(event.target.value) / 100)
}
</script>

<template>
  <div class="channel-control">
    <label class="species-control" :class="{ 'ambience-control': !spriteUrl }">
      <img v-if="spriteUrl" :src="spriteUrl" alt="" width="1536" height="1024" />
      <span>{{ name }}</span>
      <span class="species-switch">
        <input type="checkbox" role="switch" :aria-label="`Activer — ${name}`" :checked="channel.enabled" @change="updatePresence" />
        <span class="switch-track" aria-hidden="true" />
      </span>
    </label>
    <label class="channel-volume">
      <span class="visually-hidden">Volume — {{ name }}</span>
      <input type="range" min="0" max="100" step="1" :value="Math.round(channel.volume * 100)" :disabled="!channel.enabled" :aria-valuetext="`${Math.round(channel.volume * 100)} %`" @input="updateVolume" />
      <span aria-hidden="true">{{ Math.round(channel.volume * 100) }} %</span>
    </label>
    <div class="channel-status" aria-live="polite" aria-atomic="true">
      <p v-if="load.status === 'loading'">{{ id === 'ambience' ? 'Chargement de l’ambiance…' : 'Chargement du chant…' }}</p>
      <template v-else-if="load.status === 'error'">
        <p class="audio-error">{{ load.message }} ({{ name }})</p>
        <button type="button" class="retry-button" :aria-label="`Réessayer — ${name}`" @click="retry(id)">Réessayer</button>
      </template>
    </div>
  </div>
</template>
