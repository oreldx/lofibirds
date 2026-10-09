<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import '../bird-poses.css'

const props = defineProps<{ src: string; aspectRatio: string; animated?: boolean }>()
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
    class="bird-spritesheet"
    :class="{ 'bird-spritesheet-animating': animating }"
    :style="{ backgroundImage: `url(${src})`, aspectRatio }"
    aria-hidden="true"
    @animationend="scheduleAnimation"
  />
</template>

<style scoped>
.bird-spritesheet {
  display: block;
  width: 100%;
  background-size: 400% 300%;
  background-position: 0% 0%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}

.bird-spritesheet-animating {
  animation: bird-poses 3s steps(1, end) 1;
}

@media (prefers-reduced-motion: reduce) {
  .bird-spritesheet-animating { animation: none; }
}
</style>
