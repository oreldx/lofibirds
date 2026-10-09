<script setup lang="ts">
import BirdSpritesheet from './BirdSpritesheet.vue'
import spritesheetUrl from '../assets/images/merle-noir-spritesheet.png'

defineProps<{ animated?: boolean }>()
</script>

<template>
  <BirdSpritesheet :src="spritesheetUrl" aspect-ratio="192 / 128" :animated="animated" />
</template>
