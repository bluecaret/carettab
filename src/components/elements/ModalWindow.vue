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
  noTeleport: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close'])
const modalWindowEl = ref(null)

const modalWidth = computed(() => {
  return `width: min(90%, ${props.size})`
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

  <template v-if="props.noTeleport">
    <Transition name="modalTransition">
      <div v-if="props.show" class="modalWindowWrapper">
        <div class="modalOverlay"></div>
        <div ref="modalWindowEl" tabindex="-1" class="modalWindow" :style="modalWidth">
          <slot name="window"> </slot>
        </div>
      </div>
    </Transition>
  </template>
  <template v-else>
    <Teleport to="#modals">
      <Transition name="modalTransition">
        <div v-if="props.show" class="modalWindowWrapper">
          <div class="modalOverlay"></div>
          <div ref="modalWindowEl" tabindex="-1" class="modalWindow" :style="modalWidth">
            <slot name="window"> </slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
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

.modalTransition-enter-active {
  animation: blur 0.15s ease-in-out forwards;
}
.modalTransition-leave-active {
  animation: blur 0.15s ease-in-out reverse forwards;
}
@keyframes blur {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(40px);
  }
}

.modalOverlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: var(--cBackdrop);
  backdrop-filter: blur(40px);
}
// @keyframes fadeIn {
//   from {
//     opacity: 0;
//   }
//   to {
//     opacity: 1;
//   }
// }

.modalWindow {
  max-height: 90dvh;
  overflow-y: auto;
  box-shadow: 0 0 10px 0 var(--cShadow);
  background-color: var(--cModalBg);
  border-radius: var(--s4);

  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--cText);
  // animation: fadeIn 0.2s ease-out forwards;
}
</style>
