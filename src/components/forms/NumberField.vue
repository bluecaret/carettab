<script setup>
const props = defineProps({
  modelValue: Number,
  increment: { type: Number, default: 1 },
  max: Number,
  min: Number,
  tagId: String,
})
const emit = defineEmits(['update:modelValue'])

function handleUpdate(event) {
  emit('update:modelValue', parseFloat(event.target.value))
}

function handleArrowUpdate(up) {
  let num = isNaN(props.modelValue) ? 0 : props.modelValue
  let inc = props.increment ?? 1
  if (up) {
    emit('update:modelValue', parseFloat((num + inc).toFixed(1)))
    return
  }
  emit('update:modelValue', parseFloat((num - inc).toFixed(1)))
}
</script>

<template>
  <div class="num">
    <input :id="tagId" type="number" class="input" :value="modelValue" :min="min" :max="max" @input="handleUpdate" />
    <button class="numBtn" tabindex="-1" aria-label="Increase number" @click="handleArrowUpdate(true)">
      <fa icon="fa-plus"></fa>
    </button>
    <button class="numBtn" tabindex="-1" aria-label="Decrease number" @click="handleArrowUpdate(false)">
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
}
</style>
