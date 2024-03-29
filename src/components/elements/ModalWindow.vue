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
  windowClass: {
    type: String,
    default: '',
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
        <div
          ref="modalWindowEl"
          tabindex="-1"
          :class="`modalWindow ${props.windowClass ? props.windowClass : ''}`"
          :style="modalWidth"
        >
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
          <div
            ref="modalWindowEl"
            tabindex="-1"
            :class="`modalWindow ${props.windowClass ? props.windowClass : ''}`"
            :style="modalWidth"
          >
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

.modalWindow {
  max-height: 90dvh;
  overflow-y: auto;
  box-shadow: 0 0 10px 0 var(--cShadow);
  background-color: var(--cModalBg);
  border-radius: var(--s4);

  font-family: 'Source Sans 3', sans-serif;
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--cText);

  &::-webkit-scrollbar {
    width: 18px;
    height: 18px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    box-shadow: inset 0 0 10px 10px var(--cSettingsPageScrollbar);
    border: solid 4px transparent;
    border-radius: var(--s4);
  }

  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 10px 10px var(--cSettingsPageScrollthumb);
    border: solid 6px transparent;
    border-radius: 10px;
  }
  .lightGrayMode &,
  .lightMode & {
    font-weight: 400;
  }
}
</style>
