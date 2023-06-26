<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  tagId: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue'])

function handleToggled() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
    :id="tagId"
    class="toggle"
    style="flex: 0 0 auto"
    :aria-pressed="props.modelValue ? 'true' : 'false'"
    @click="handleToggled"
  >
    <div class="toggleIcon">
      <fa v-if="props.modelValue" icon="fa-check"></fa>
      <fa v-if="!props.modelValue" icon="fa-xmark"></fa>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.toggle {
  flex: 0 0 auto;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: var(--cToggleBg);
  width: 4.2rem;
  height: 2.8rem;
  padding: 0;
  margin-block: 0.3rem;
  border: 2px solid var(--cToggleBg);
  border-radius: calc(2.8rem / 2);
  color: var(--cToggleFg);

  &::before,
  .toggleIcon {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    display: grid;
    place-items: center;
    width: 1.8rem;
    height: 1.8rem;
    margin: 0.3rem;
    font-size: 1.2rem;
  }

  &::before {
    border-radius: 50%;
    background-color: var(--cToggleIndicator);
  }

  .toggleIcon {
    svg {
      height: 1.2rem;
      width: auto;
    }
  }

  &[aria-pressed='true'] {
    border-color: var(--cToggleBgPressed);
    background-color: var(--cToggleBgPressed);
    color: var(--cToggleFgPressed);

    &::before,
    .toggleIcon {
      inset: 0 0 0 auto;
    }

    &::before {
      background-color: var(--cToggleIndicatorPressed);
    }
  }

  &[disabled] {
    cursor: not-allowed;
    border-color: var(--cToggleBgDisabled);
    background-color: var(--cToggleBgDisabled);
    color: var(--cToggleFgDisabled);

    &::before {
      background-color: var(--cToggleIndicatorDisabled);
    }
  }

  &[aria-pressed='true'][disabled] {
    border-color: var(--cToggleBgDisabled);
    background-color: var(--cToggleBgDisabled);
    color: var(--cToggleFgDisabled);

    &::before {
      background-color: var(--cToggleIndicatorDisabled);
    }
  }
}
</style>
