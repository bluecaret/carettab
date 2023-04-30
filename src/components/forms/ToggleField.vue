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
  --toggleBtnBorder: var(--cGrey3);
  --toggleBtnBg: var(--cGrey3);
  --toggleBtnIndicator: var(--cBlue8);
  --toggleBtnColor: var(--cText);

  --toggleBtnPressedBorder: var(--cGrey3);
  --toggleBtnPressedBg: var(--cGrey3);
  --toggleBtnPressedIndicator: var(--cBlue4);
  --toggleBtnPressedColor: var(--cText);

  --toggleBtnBorderDisabled: var(--cGrey3Alt);
  --toggleBtnBgDisabled: var(--cGrey3Alt);
  --toggleBtnIndicatorDisabled: var(--cGrey3Alt);
  --toggleBtnColorDisabled: var(--cText);

  --toggleBtnPressedBorderDisabled: var(--cGrey3Alt);
  --toggleBtnPressedBgDisabled: var(--cGrey3Alt);
  --toggleBtnPressedIndicatorDisabled: var(--cGrey3Alt);
  --toggleBtnPressedColorDisabled: var(--cText);
  @media (prefers-color-scheme: dark) {
    --toggleBtnBorder: var(--cGrey3);
    --toggleBtnBg: var(--cGrey3);
    --toggleBtnIndicator: var(--cBlue6);
    --toggleBtnColor: var(--cText);

    --toggleBtnPressedBorder: var(--cGrey3);
    --toggleBtnPressedBg: var(--cGrey3);
    --toggleBtnPressedIndicator: var(--cBlue3);
    --toggleBtnPressedColor: var(--cText);

    --toggleBtnBorderDisabled: var(--cGrey3Alt);
    --toggleBtnBgDisabled: var(--cGrey3Alt);
    --toggleBtnIndicatorDisabled: var(--cGrey3Alt);
    --toggleBtnColorDisabled: var(--cText);

    --toggleBtnPressedBorderDisabled: var(--cGrey3Alt);
    --toggleBtnPressedBgDisabled: var(--cGrey3Alt);
    --toggleBtnPressedIndicatorDisabled: var(--cGrey3Alt);
    --toggleBtnPressedColorDisabled: var(--cText);
  }

  flex: 0 0 auto;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: var(--toggleBtnBg);
  width: 4.2rem;
  height: 2.8rem;
  padding: 0;
  margin-block: 0.3rem;
  border: 2px solid var(--toggleBtnBorder);
  border-radius: calc(2.8rem / 2);
  color: var(--toggleBtnColor);

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
    background-color: var(--toggleBtnIndicator);
  }

  .toggleIcon {
    svg {
      height: 1.2rem;
      width: auto;
    }
  }

  &[aria-pressed='true'] {
    border-color: var(--toggleBtnPressedBorder);
    background-color: var(--toggleBtnPressedBg);
    color: var(--toggleBtnPressedColor);

    &::before,
    .toggleIcon {
      inset: 0 0 0 auto;
    }

    &::before {
      background-color: var(--toggleBtnPressedIndicator);
    }
  }

  &[disabled] {
    cursor: not-allowed;
    border-color: var(--toggleBtnBorderDisabled);
    background-color: var(--toggleBtnBgDisabled);
    color: var(--toggleBtnColorDisabled);

    &::before {
      background-color: var(--toggleBtnIndicatorDisabled);
    }
  }

  &[aria-pressed='true'][disabled] {
    border-color: var(--toggleBtnPressedBorderDisabled);
    background-color: var(--toggleBtnPressedBgDisabled);
    color: var(--toggleBtnPressedColorDisabled);

    &::before {
      background-color: var(--toggleBtnPressedIndicatorDisabled);
    }
  }
}
</style>
