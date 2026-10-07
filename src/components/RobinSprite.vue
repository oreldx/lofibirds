<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import '../robin-poses.css'
import spritesheetUrl from '../assets/images/spritesheet.png'

const props = defineProps<{ animated?: boolean }>()
const animating = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
let reducedMotion: MediaQueryList | undefined

function scheduleAnimation(): void {
  clearTimeout(timer)
  timer = undefined
  animating.value = false
  if (!props.animated || !reducedMotion || reducedMotion.matches || document.hidden) return

  // Une séquence de 3 s (12 poses à 4 images/s), après 8 à 25 s de repos.
  timer = setTimeout(() => {
    timer = undefined
    animating.value = true
  }, 8000 + Math.random() * 17000)
}

onMounted(() => {
  if (!props.animated) return
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.addEventListener('change', scheduleAnimation)
  document.addEventListener('visibilitychange', scheduleAnimation)
  scheduleAnimation()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  reducedMotion?.removeEventListener('change', scheduleAnimation)
  document.removeEventListener('visibilitychange', scheduleAnimation)
})
</script>

<template>
  <span
    class="robin-sprite"
    :class="{ 'robin-sprite-animating': animating }"
    :style="{ backgroundImage: `url(${spritesheetUrl})` }"
    aria-hidden="true"
    @animationend="scheduleAnimation"
  />
</template>

<style scoped>
.robin-sprite {
  display: block;
  width: 100%;
  aspect-ratio: 101 / 90;
  background-size: 400% 300%;
  background-position: 0% 0%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}

.robin-sprite-animating {
  animation: robin-poses 3s steps(1, end) 1;
}

@media (prefers-reduced-motion: reduce) {
  .robin-sprite-animating { animation: none; }
}
</style>
