<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ChannelId } from '../types'
import { useGarden } from '../composables/useGarden'
import RobinSprite from './RobinSprite.vue'

const props = defineProps<{ id: ChannelId; name: string; spriteUrl?: string }>()
const { preferences, audio, setChannelEnabled, setChannelVolume, retry } = useGarden()
const channel = computed(() => props.id === 'ambience' ? preferences.ambience : preferences.species[props.id])
const load = computed(() => audio.channels[props.id])

const nameElement = ref<HTMLSpanElement | null>(null)
const truncated = ref(false)
const hovered = ref(false)
const focused = ref(false)
const tooltipDismissed = ref(false)
const tooltipPosition = ref({ left: '0px', top: '0px' })
const showTooltip = computed(() => truncated.value && (hovered.value || focused.value) && !tooltipDismissed.value)
let resizeObserver: ResizeObserver | undefined
let hoverTimeout: ReturnType<typeof setTimeout> | undefined

function measureName(): void {
  const element = nameElement.value
  if (!element) return
  truncated.value = element.clientWidth > 0 && element.scrollWidth > element.clientWidth
  const bounds = element.getBoundingClientRect()
  const tooltipWidth = Math.min(280, window.innerWidth - 24)
  tooltipPosition.value = {
    left: `${Math.max(12, Math.min(bounds.left, window.innerWidth - tooltipWidth - 12))}px`,
    top: `${bounds.top - 8}px`,
  }
}

function enterTooltip(): void {
  clearTimeout(hoverTimeout)
  hovered.value = true
  tooltipDismissed.value = false
  measureName()
}

function leaveTooltip(): void {
  clearTimeout(hoverTimeout)
  hoverTimeout = setTimeout(() => { hovered.value = false }, 120)
}

function focusControl(): void {
  focused.value = true
  tooltipDismissed.value = false
  measureName()
}

function dismissTooltip(event: KeyboardEvent): void {
  if (event.key === 'Escape') tooltipDismissed.value = true
}

function updateVolume(event: Event): void {
  if (event.target instanceof HTMLInputElement) setChannelVolume(props.id, Number(event.target.value) / 100)
}

onMounted(() => {
  resizeObserver = new ResizeObserver(measureName)
  if (nameElement.value) resizeObserver.observe(nameElement.value)
  window.addEventListener('resize', measureName)
  window.addEventListener('scroll', measureName, true)
  window.addEventListener('keydown', dismissTooltip)
  void document.fonts.ready.then(measureName)
  measureName()
})

watch(() => props.name, async () => {
  await nextTick()
  measureName()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  clearTimeout(hoverTimeout)
  window.removeEventListener('resize', measureName)
  window.removeEventListener('scroll', measureName, true)
  window.removeEventListener('keydown', dismissTooltip)
})
</script>

<template>
  <div class="channel-control" :class="{ 'channel-disabled': !channel.enabled }">
    <div class="channel-card">
      <button
        type="button"
        role="switch"
        class="species-control"
        :aria-label="`Activer — ${name}`"
        :aria-checked="channel.enabled"
        @click="setChannelEnabled(id, !channel.enabled)"
        @pointerenter="enterTooltip"
        @pointerleave="leaveTooltip"
        @focus="focusControl"
        @blur="focused = false"
      >
        <span class="species-artwork">
          <RobinSprite v-if="id === 'rouge-gorge'" class="robin-thumbnail" />
          <img v-else-if="spriteUrl" :src="spriteUrl" alt="" width="1536" height="1024" draggable="false" />
          <svg v-else class="ambience-artwork" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M14 48C7 26 24 12 51 10c3 27-10 43-30 39M14 54l28-31M24 44l-1-13m7 7 13-1" />
            <path d="M8 17h13M5 23h10M44 51h12" stroke-linecap="round" />
          </svg>
        </span>
        <span class="species-caption">
          <span class="channel-indicator" aria-hidden="true" />
          <span ref="nameElement" class="species-name">{{ name }}</span>
        </span>
      </button>
      <label class="channel-volume">
        <span class="visually-hidden">Volume — {{ name }}</span>
        <input type="range" min="0" max="100" step="1" :value="Math.round(channel.volume * 100)" :disabled="!channel.enabled" aria-orientation="vertical" :aria-valuetext="`${Math.round(channel.volume * 100)} %`" @input="updateVolume" />
        <span class="channel-volume-value" aria-hidden="true">{{ Math.round(channel.volume * 100) }} %</span>
      </label>
    </div>
    <div class="channel-status" aria-live="polite" aria-atomic="true">
      <p v-if="load.status === 'loading'">{{ id === 'ambience' ? 'Chargement de l’ambiance…' : 'Chargement du chant…' }}</p>
      <template v-else-if="load.status === 'error'">
        <p class="audio-error">{{ load.message }} ({{ name }})</p>
        <button type="button" class="retry-button" :aria-label="`Réessayer — ${name}`" @click="retry(id)">Réessayer</button>
      </template>
    </div>
  </div>
  <Teleport to="body">
    <span v-if="showTooltip" class="species-tooltip" role="tooltip" :style="tooltipPosition" @pointerenter="enterTooltip" @pointerleave="leaveTooltip">{{ name }}</span>
  </Teleport>
</template>
