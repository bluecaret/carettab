<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ modelValue: Array, tagId: String })
const emit = defineEmits(['update:modelValue'])

// hue, saturation, lightness, opacity
const val = props.modelValue ?? [0, 0, 0, 0.8]

const hue = ref(val[0])
const saturation = ref(val[1])
const lightness = ref(val[2])
const opacity = ref(val[3])

const currentHue = computed(() => {
  return `--rangeInputThumb: hsl(${hue.value}deg 100% 50%)`
})
const currentSat = computed(() => {
  return `--rangeInputThumb: hsl(${hue.value}deg ${saturation.value}% 50%); --rangeInputTrack: linear-gradient(to right, hsl(${hue.value}deg 0% 50%), hsl(${hue.value}deg 100% 50%));`
})
const currentLight = computed(() => {
  return `--rangeInputThumb: hsl(${hue.value}deg ${saturation.value}% ${lightness.value}%); --rangeInputTrack: linear-gradient(to right, hsl(${hue.value}deg ${saturation.value}% 0%), hsl(${hue.value}deg ${saturation.value}% 50%), hsl(${hue.value}deg ${saturation.value}% 100%));`
})
const currentOp = computed(() => {
  return `--rangeInputThumb: linear-gradient(hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value}), hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})), repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 6px 6px, black;--rangeInputTrack: linear-gradient(to right, hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / 0), hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / 1)), repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 6px 6px;`
})
const currentColor = computed(() => {
  return `hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})`
})

const handleColorSet = () => {
  emit('update:modelValue', [
    parseInt(hue.value),
    parseInt(saturation.value),
    parseInt(lightness.value),
    parseFloat(opacity.value),
  ])
}
</script>

<template>
  <DropdownMenu>
    <template #button>
      <button :id="tagId" aria-label="Select color" class="btn pickerButton"></button>
    </template>
    <template #menu>
      <div class="colorMenu">
        <div class="block">
          <h3 class="label">Color</h3>
          <div class="group fill">
            <div class="group stack">
              <label for="" class="desc">Hue</label>
              <div class="range">
                <output class="output">{{ hue }}&deg;</output>
                <input
                  v-model="hue"
                  type="range"
                  class="rangeInput rangeHue"
                  :style="currentHue"
                  min="0"
                  max="360"
                  @input="handleColorSet()"
                />
              </div>
            </div>
            <div class="group stack">
              <label for="" class="desc">Saturation</label>
              <div class="range">
                <output class="output">{{ saturation }}%</output>
                <input
                  v-model="saturation"
                  type="range"
                  class="rangeInput rangeSat"
                  :style="currentSat"
                  min="0"
                  max="100"
                  @input="handleColorSet()"
                />
              </div>
            </div>
          </div>
          <div class="group fill">
            <div class="group stack">
              <label for="" class="desc">Lightness</label>
              <div class="range">
                <output class="output">{{ lightness }}%</output>
                <input
                  v-model="lightness"
                  type="range"
                  class="rangeInput rangeLight"
                  :style="currentLight"
                  min="0"
                  max="100"
                  @input="handleColorSet()"
                />
              </div>
            </div>
            <div class="group stack">
              <label for="" class="desc">Opacity</label>
              <div class="range">
                <output class="output">{{ parseFloat(opacity * 100).toFixed(0) }}%</output>
                <input
                  v-model="opacity"
                  type="range"
                  class="rangeInput rangeOp"
                  :style="currentOp"
                  min="0"
                  max="1"
                  step=".01"
                  @input="handleColorSet()"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DropdownMenu>
</template>

<style lang="scss" scoped>
.pickerButton {
  background-color: v-bind(currentColor);
  color: currentColor;
  border-color: var(--cGrey1);
  width: 100%;
  min-width: 3.6rem;
}

.colorMenu {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 35rem;
  border-radius: var(--s3);
  background-color: var(--cGrey1);
}

.range {
  grid-template-columns: 2.2em auto;
  width: 15.5rem;
}

.rangeInput {
  &::-webkit-slider-runnable-track {
    height: 0.8rem;
    background: var(--rangeInputTrack);
  }

  &::-webkit-slider-thumb {
    translate: 0 -0.6rem;
    box-shadow: 0 0 0 1px hsl(0deg 0% 30%);
    background: var(--rangeInputThumb);
  }

  &.rangeHue::-webkit-slider-runnable-track {
    background: linear-gradient(to right, red, yellow, lime, aqua, blue, magenta, red);
  }
}
</style>
