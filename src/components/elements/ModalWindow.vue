<script setup>
import { computed, onMounted, nextTick, ref, watch, onBeforeUnmount } from 'vue'
const props = defineProps({
  show: {
    type: Boolean,
  },
  size: {
    type: String,
    default: '800px',
  },
  buttonRef: {
    type: Object,
  },
})
const emit = defineEmits(['close'])
const modalWindowEl = ref(null)

const modalWidth = computed(() => {
  return `min(90%, ${props.size})`
})

watch(
  () => props.show,
  () => {
    if (props.show) {
      nextTick(() => modalWindowEl.value.focus())
    } else {
      if (props.buttonRef) {
        props.buttonRef.focus()
      }
    }
  }
)

const handleEsc = (e) => {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

// close modal on ESC
onMounted(() => {
  window.addEventListener('keydown', (e) => handleEsc(e))
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', (e) => handleEsc(e))
})
</script>

<template>
  <slot name="button"> </slot>

  <Teleport to="#modals">
    <div v-if="props.show" class="modalWindowWrapper">
      <div class="modalOverlay"></div>
      <div ref="modalWindowEl" tabindex="-1" class="modalWindow">
        <slot name="window"> </slot>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modalButtonWrapper {
  width: 100%;
}

.modalWindowWrapper {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
}

.modalOverlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: var(--cBackdrop);
  backdrop-filter: blur(4px);
}

.modalWindow {
  width: v-bind(modalWidth);
  max-height: 90dvh;
  overflow-y: auto;
  box-shadow: 0 0 10px 0 var(--cShadow);
  background-color: var(--cModalBg);
  border-radius: var(--s4);

  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--cText);
}
</style>
