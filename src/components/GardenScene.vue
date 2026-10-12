<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gardenAnimationLayers, gardenAsset, gardenSkyAsset } from '../data/resources'
import { speciesCatalog } from '../data/species'
import { useGarden } from '../composables/useGarden'
import RobinSprite from './RobinSprite.vue'
import GreatTitSprite from './GreatTitSprite.vue'
import BlackbirdSprite from './BlackbirdSprite.vue'
import SparrowSprite from './SparrowSprite.vue'
import ChaffinchSprite from './ChaffinchSprite.vue'

const { preferences } = useGarden()
const layersReady = ref(false)
const pageHidden = ref(false)
let reducedMotion: MediaQueryList | undefined
let loadStarted = false
let mounted = false

async function loadLayers(): Promise<void> {
  if (loadStarted) return
  loadStarted = true
  try {
    // Switch the complete scene only after every image has decoded successfully.
    await Promise.all([gardenSkyAsset, ...gardenAnimationLayers].map(async (asset) => {
      const image = new Image()
      image.src = asset.url
      await image.decode()
    }))
    if (mounted) layersReady.value = true
  } catch {
    // Keep the original garden visible if a layer cannot be loaded.
  }
}

function updateMotionState(): void {
  pageHidden.value = document.hidden
  if (!pageHidden.value && reducedMotion && !reducedMotion.matches) void loadLayers()
}

onMounted(() => {
  mounted = true
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.addEventListener('change', updateMotionState)
  document.addEventListener('visibilitychange', updateMotionState)
  updateMotionState()
})

onUnmounted(() => {
  mounted = false
  reducedMotion?.removeEventListener('change', updateMotionState)
  document.removeEventListener('visibilitychange', updateMotionState)
})
</script>

<template>
  <figure class="garden-scene" :class="{ 'garden-scene-paused': pageHidden }" role="img" aria-label="Un jardin européen au matin de printemps, avec un grand arbre, des fleurs, un muret et une barrière. Choisissez les oiseaux présents dans l’onglet Espèces du panneau de réglages.">
    <div class="garden-surface">
    <img class="garden-background" :src="layersReady ? gardenSkyAsset.url : gardenAsset.url" alt="" width="1672" height="941" fetchpriority="high" />
    <template v-if="layersReady">
      <span
        v-for="layer in gardenAnimationLayers"
        :key="layer.id"
        class="garden-layer"
        :class="`garden-layer-${layer.id}`"
        :style="{ backgroundImage: `url(${layer.url})`, '--garden-loop-duration': `${layer.durationSeconds}s` }"
        aria-hidden="true"
      />
    </template>
    <template v-for="species in speciesCatalog" :key="species.id">
      <span
        v-if="preferences.species[species.id].enabled"
        class="garden-bird"
        :class="`bird-${species.id}`"
        :style="{ left: `${species.position.x * 100}%`, top: `${species.position.y * 100}%` }"
        aria-hidden="true"
      >
        <RobinSprite v-if="species.id === 'rouge-gorge'" animated />
        <GreatTitSprite v-else-if="species.id === 'mesange-charbonniere'" animated />
        <BlackbirdSprite v-else-if="species.id === 'merle-noir'" animated />
        <SparrowSprite v-else-if="species.id === 'moineau-domestique'" animated />
        <ChaffinchSprite v-else-if="species.id === 'pinson-des-arbres'" animated />
      </span>
    </template>
    </div>
  </figure>
</template>

<style scoped>
.garden-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-size: 400% 400%;
  background-position: 0% 0%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  animation: garden-layer-frames var(--garden-loop-duration) steps(1, end) infinite;
}

.garden-scene-paused .garden-layer {
  animation-play-state: paused;
}

/* The atlas contains 16 full-scene frames, in row-major order on a 4 × 4 grid. */
@keyframes garden-layer-frames {
  0% { background-position: 0% 0%; }
  6.25% { background-position: 33.333333% 0%; }
  12.5% { background-position: 66.666667% 0%; }
  18.75% { background-position: 100% 0%; }
  25% { background-position: 0% 33.333333%; }
  31.25% { background-position: 33.333333% 33.333333%; }
  37.5% { background-position: 66.666667% 33.333333%; }
  43.75% { background-position: 100% 33.333333%; }
  50% { background-position: 0% 66.666667%; }
  56.25% { background-position: 33.333333% 66.666667%; }
  62.5% { background-position: 66.666667% 66.666667%; }
  68.75% { background-position: 100% 66.666667%; }
  75% { background-position: 0% 100%; }
  81.25% { background-position: 33.333333% 100%; }
  87.5% { background-position: 66.666667% 100%; }
  93.75% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}

@media (prefers-reduced-motion: reduce) {
  .garden-layer {
    animation: none;
  }
}
</style>
