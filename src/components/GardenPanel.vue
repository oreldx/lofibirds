<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { speciesCatalog } from '../data/species'
import SpeciesControl from './SpeciesControl.vue'

const props = defineProps<{ open: boolean; isMobile: boolean }>()
const emit = defineEmits<{ close: [] }>()
const panel = ref<HTMLDialogElement | null>(null)
const activeGroup = ref<'species' | 'environment'>('species')

function syncPanel(): void {
  const dialog = panel.value
  if (!dialog) return
  const focused = document.activeElement
  const restoreFocus = focused instanceof HTMLElement && dialog.contains(focused)
  // A dialog must close before switching between modal and non-modal display.
  if (dialog.open) dialog.close()
  if (!props.open) return
  if (props.isMobile) dialog.showModal()
  else dialog.show()
  if (restoreFocus) focused.focus({ preventScroll: true })
}

function handleEscape(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || props.isMobile || event.defaultPrevented) return
  event.preventDefault()
  emit('close')
}

onMounted(syncPanel)
watch(() => [props.open, props.isMobile], syncPanel, { flush: 'post' })
onBeforeUnmount(() => panel.value?.close())

function navigateTabs(event: KeyboardEvent): void {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  activeGroup.value = event.key === 'Home' ? 'species'
    : event.key === 'End' ? 'environment'
      : activeGroup.value === 'species' ? 'environment' : 'species'
  const tabList = event.currentTarget
  if (tabList instanceof HTMLElement) {
    tabList.querySelector<HTMLButtonElement>(`#${activeGroup.value}-tab`)?.focus()
  }
}
</script>

<template>
  <dialog
    id="garden-panel"
    ref="panel"
    class="garden-panel"
    :aria-modal="isMobile && open ? 'true' : undefined"
    aria-labelledby="garden-panel-title"
    @cancel.prevent="emit('close')"
    @keydown="handleEscape"
  >
    <div class="garden-toolbar">
      <div class="drawer-heading">
        <h2 id="garden-panel-title">Les sons du jardin</h2>
        <button type="button" class="drawer-close" aria-label="Fermer les réglages" @click="emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m6 6 12 12M6 18 18 6" />
          </svg>
        </button>
      </div>
      <div class="sound-tabs" role="tablist" aria-label="Catégorie de sons" @keydown="navigateTabs">
        <button id="species-tab" type="button" role="tab" :aria-selected="activeGroup === 'species'" :tabindex="activeGroup === 'species' ? 0 : -1" aria-controls="species-panel" @click="activeGroup = 'species'">Espèces</button>
        <button id="environment-tab" type="button" role="tab" :aria-selected="activeGroup === 'environment'" :tabindex="activeGroup === 'environment' ? 0 : -1" aria-controls="environment-panel" @click="activeGroup = 'environment'">Environnement</button>
      </div>
    </div>
    <div class="drawer-content">
    <div id="species-panel" v-show="activeGroup === 'species'" role="tabpanel" aria-labelledby="species-tab" class="sound-panel">
      <ul class="species-list" aria-label="Espèces du jardin">
        <li v-for="species in speciesCatalog" :key="species.id">
          <SpeciesControl :id="species.id" :name="species.name" :photo-url="species.photo.url" />
        </li>
      </ul>
    </div>
    <div id="environment-panel" v-show="activeGroup === 'environment'" role="tabpanel" aria-labelledby="environment-tab" class="sound-panel">
      <ul class="species-list" aria-label="Sons de l’environnement">
        <li><SpeciesControl id="ambience" name="Brise et feuillage" /></li>
      </ul>
    </div>
    </div>
  </dialog>
</template>
