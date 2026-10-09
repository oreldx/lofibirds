<script setup lang="ts">
import BirdSpritesheet from './BirdSpritesheet.vue'
import spritesheetUrl from '../assets/images/rouge-gorge-spritesheet.png'

defineProps<{ animated?: boolean }>()
</script>

<template>
  <BirdSpritesheet :src="spritesheetUrl" aspect-ratio="101 / 90" :animated="animated" />
</template>
