<script setup>
import { computed } from 'vue'
const props = defineProps({
  show: {
    type: Boolean,
  },
  size: {
    type: String,
    default: '800px',
  },
})

const modalWidth = computed(() => {
  return `min(90%, ${props.size})`
})
</script>

<template>
  <slot name="button"> </slot>

  <Teleport to="#modals">
    <div v-if="props.show" class="modalWindowWrapper">
      <div class="modalOverlay"></div>
      <div class="modal">
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

.modal {
  width: v-bind(modalWidth);
  max-height: 90dvh;
  overflow-y: auto;
  box-shadow: 0 0 10px 0 var(--cShadow);
  background-color: var(--cGrey1);
  border-radius: var(--s4);

  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--cText);
}
</style>
