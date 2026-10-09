<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ResourceCredits from './ResourceCredits.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const modal = ref<HTMLDialogElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
let pointerStartedOnBackdrop = false

function syncModal(): void {
  const dialog = modal.value
  if (!dialog) return
  if (props.open && !dialog.open) {
    dialog.showModal()
    closeButton.value?.focus({ preventScroll: true })
  } else if (!props.open && dialog.open) {
    dialog.close()
  }
}

function isBackdrop(event: MouseEvent): boolean {
  const dialog = modal.value
  if (!dialog || event.target !== dialog) return false
  const bounds = dialog.getBoundingClientRect()
  return event.clientX < bounds.left || event.clientX > bounds.right
    || event.clientY < bounds.top || event.clientY > bounds.bottom
}

function handlePointerDown(event: PointerEvent): void {
  pointerStartedOnBackdrop = isBackdrop(event)
}

function handleBackdropClick(event: MouseEvent): void {
  if (pointerStartedOnBackdrop && isBackdrop(event)) emit('close')
  pointerStartedOnBackdrop = false
}

onMounted(syncModal)
watch(() => props.open, syncModal, { flush: 'post' })
onBeforeUnmount(() => modal.value?.close())
</script>

<template>
  <dialog
    id="about-modal"
    ref="modal"
    class="about-modal"
    aria-labelledby="about-modal-title"
    @cancel.prevent="emit('close')"
    @pointerdown="handlePointerDown"
    @click="handleBackdropClick"
  >
    <header class="about-heading">
      <h2 id="about-modal-title">À propos</h2>
      <button
        ref="closeButton"
        type="button"
        class="drawer-close"
        aria-label="Fermer la fenêtre À propos"
        autofocus
        @click="emit('close')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m6 6 12 12M6 18 18 6" />
        </svg>
      </button>
    </header>
    <div class="about-content">
      <div class="about-author">
        <p>
          Fait avec <span role="img" aria-label="amour">❤️</span> par
          <a href="https://www.oreldx.dev/" target="_blank" rel="noopener noreferrer">Orel</a>
        </p>
        <a
          class="github-link"
          href="https://github.com/oreldx/lofibirds"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Voir le dépôt GitHub"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 19c-4.3 1.3-4.3-2.5-6-3m12 6v-3.9c0-1.1-.1-1.6-.6-2.1 2.5-.3 5.1-1.2 5.1-5.5 0-1.3-.5-2.5-1.2-3.4.1-.3.5-1.6-.1-3.4 0 0-1-.3-3.5 1.3a12 12 0 0 0-6.4 0C5.9 3.4 4.9 3.7 4.9 3.7c-.6 1.8-.2 3.1-.1 3.4-.7.9-1.2 2.1-1.2 3.4 0 4.3 2.6 5.2 5.1 5.5-.5.5-.7 1.2-.7 2.1V22" />
          </svg>
        </a>
      </div>
      <ResourceCredits />
    </div>
  </dialog>
</template>
