<script setup lang="ts">
import type { SpeciesId } from '../types'
import { useGarden } from '../composables/useGarden'

const props = defineProps<{ id: SpeciesId; name: string; spriteUrl: string }>()
const { preferences, setSpeciesEnabled } = useGarden()

function updatePresence(event: Event): void {
  const input = event.target
  if (input instanceof HTMLInputElement) {
    setSpeciesEnabled(props.id, input.checked)
  }
}
</script>

<template>
  <label class="species-control">
    <img :src="spriteUrl" alt="" width="1536" height="1024" />
    <span>{{ name }}</span>
    <span class="species-switch">
      <input type="checkbox" role="switch" :checked="preferences.species[id].enabled" @change="updatePresence" />
      <span class="switch-track" aria-hidden="true" />
    </span>
  </label>
</template>
