<script setup>
const props = defineProps({
  modelValue: Number,
  increment: { type: Number, default: 1 },
  max: Number,
  min: Number,
  tagId: String,
  placeholder: String,
  disabled: Boolean,
})
const emit = defineEmits(['update:modelValue'])

function handleUpdate(event) {
  emit('update:modelValue', parseFloat(event.target.value))
}

function handleArrowUpdate(up) {
  let num = isNaN(props.modelValue) ? 0 : props.modelValue
  let inc = props.increment ?? 1
  let updated = num
  let hasMin = props.min || props.min === 0
  let hasMax = props.max || props.max === 0
  if (up) {
    updated = num + inc
    if ((hasMax && updated.toFixed(1) <= props.max) || !hasMax) {
      emit('update:modelValue', parseFloat(updated.toFixed(1)))
    }
    return
  }
  updated = num - inc
  if ((hasMin && updated.toFixed(1) >= props.min) || !hasMin) {
    emit('update:modelValue', parseFloat(updated.toFixed(1)))
  }
}
</script>

<template>
  <div class="num">
    <input
      :id="tagId"
      type="number"
      class="input"
      :value="modelValue"
      :min="min"
      :max="max"
      :disabled="props.disabled ? 'disabled' : null"
      :placeholder="props.placeholder ? props.placeholder : ''"
      @input="handleUpdate"
    />
    <button
      class="numBtn"
      tabindex="-1"
      :aria-label="$t('settings.increaseNumber')"
      :disabled="props.disabled ? 'disabled' : null"
      @click="handleArrowUpdate(true)"
    >
      <fa icon="fa-plus"></fa>
    </button>
    <button
      class="numBtn"
      tabindex="-1"
      :aria-label="$t('settings.decreaseNumber')"
      :disabled="props.disabled ? 'disabled' : null"
      @click="handleArrowUpdate(false)"
    >
      <fa icon="fa-minus"></fa>
    </button>
  </div>
</template>

<style lang="scss">
.num {
  display: grid;
  grid-template-columns: 1fr 2rem;
  grid-template-rows: 1fr 1fr;

  input {
    grid-row: 1 / 3;
    grid-column: 1 / 3;
    appearance: none;
    background-image: linear-gradient(to right, var(--cArrowFade), var(--cArrowFade));
    background-position: calc(100% - 2rem) 0.2em;
    background-size: 1px 2.8rem;
    background-repeat: no-repeat;
    padding-right: 2.1rem;

    &:disabled {
      background-image: linear-gradient(to right, var(--cArrowDisabled), var(--cArrowDisabled));
    }

    &::-webkit-inner-spin-button {
      appearance: none;
    }

    &::-webkit-outer-spin-button {
      appearance: none;
    }
  }
}

.numBtn {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  background: transparent;
  border: 0;
  width: auto;
  height: auto;
  padding: 0;
  font-size: 1.2rem;
  cursor: pointer;
  display: grid;
  place-items: center;
  color: var(--cArrow);

  &:last-of-type {
    grid-row: 2 / 3;
  }

  &:hover,
  &:focus-within {
    scale: 1.3;
  }

  &:active {
    opacity: 0.5;
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--cArrowDisabled);
    scale: 1;
  }
}
</style>
