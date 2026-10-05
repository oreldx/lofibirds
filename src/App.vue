<script setup lang="ts">
import GardenScene from './components/GardenScene.vue'
import GardenPanel from './components/GardenPanel.vue'
import ResourceCredits from './components/ResourceCredits.vue'
</script>

<template>
  <main>
    <div class="garden-page">
      <header class="page-header">
        <h1 class="wordmark">Lofibirds</h1>
      </header>
      <div class="garden-layout">
        <GardenScene />
        <GardenPanel />
      </div>
      <ResourceCredits />
    </div>
  </main>
</template>
