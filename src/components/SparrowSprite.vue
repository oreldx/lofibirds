<script setup lang="ts">
import BirdSpritesheet from './BirdSpritesheet.vue'
import spritesheetUrl from '../assets/images/moineau-domestique-spritesheet.png'

defineProps<{ animated?: boolean }>()
</script>

<template>
  <BirdSpritesheet :src="spritesheetUrl" aspect-ratio="192 / 128" :animated="animated" />
</template>
