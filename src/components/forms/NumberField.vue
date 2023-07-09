<script setup>
import { ref } from 'vue'

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
const delay = ref(null)
const timer = ref(null)
const isHold = ref(false)

function handleUpdate(event) {
  const cleanedInput = event.target.value.replace(/[^0-9.-]/g, '')
  if (!isNaN(parseFloat(cleanedInput))) emit('update:modelValue', parseFloat(cleanedInput))
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

function handleArrowStart(up) {
  handleArrowUpdate(up)
  isHold.value = true
  delay.value = setTimeout(() => {
    if (isHold.value) {
      timer.value = setInterval(() => {
        if (isHold.value) {
          handleArrowUpdate(up)
        }
      }, 200)
    }
  }, 350)
}

function handleArrowDone() {
  isHold.value = false
  if (delay.value) setTimeout(delay.value)
  if (timer.value) clearInterval(timer.value)
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
    <div class="numBtnGroup">
      <button
        class="numBtn"
        tabindex="-1"
        :aria-label="$t('settings.increaseNumber')"
        :disabled="props.disabled ? 'disabled' : null"
        @pointerdown="handleArrowStart(true)"
        @pointerup="handleArrowDone()"
      >
        <fa icon="fa-plus"></fa>
      </button>
      <button
        class="numBtn"
        tabindex="-1"
        :aria-label="$t('settings.decreaseNumber')"
        :disabled="props.disabled ? 'disabled' : null"
        @pointerdown="handleArrowStart(false)"
        @pointerup="handleArrowDone()"
      >
        <fa icon="fa-minus"></fa>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.num {
  display: grid;
  grid-template-columns: 1fr 2rem;
  grid-template-rows: 1fr;

  input {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
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

.numBtnGroup {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  background-color: var(--cInputBg);
  border-radius: var(--s3);
  transition: scale 0.1s, box-shadow 0.1s;
}

.numBtn {
  background-color: transparent;
  border: 0;
  padding: 0;
  font-size: 1.2rem;
  cursor: pointer;
  display: grid;
  place-items: center;
  color: var(--cArrow);

  &:active {
    opacity: 0.5;
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--cArrowDisabled);
    scale: 1;
  }
}

.num:hover {
  .numBtnGroup {
    scale: 1.5;
    box-shadow: 0 0 0 1px var(--cArrowDisabled);
  }
}
</style>
