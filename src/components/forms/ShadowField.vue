<script setup>
import { ref, computed } from 'vue'
import NumberField from './NumberField.vue'
const props = defineProps({ modelValue: Array, tagId: String, text: Boolean })
const emit = defineEmits(['update:modelValue'])

// enable, x, y, blur, hue, saturation, lightness, opacity
const val = props.modelValue ?? [false, 1, 1, 5, 0, 0, 0, 0.8]

const enable = ref(val[0])
const x = ref(val[1])
const y = ref(val[2])
const blur = ref(val[3])
const hue = ref(val[4])
const saturation = ref(val[5])
const lightness = ref(val[6])
const opacity = ref(val[7])

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
  return `--rangeInputThumb: linear-gradient(hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value}), hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})), repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 6px 6px, black; --rangeInputTrack: linear-gradient(to right, hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / 0), hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / 1)), repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 6px 6px;`
})
const currentShadow = computed(() => {
  return `${x.value}px ${y.value}px ${blur.value}px ${props.text ? '' : '0'} hsl(${hue.value}deg ${saturation.value}% ${
    lightness.value
  }% / ${opacity.value})`
})
const currentTextShadow = computed(() => {
  return `${x.value}px ${y.value}px ${blur.value}px hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})`
})
const currentShadowPreview = computed(() => {
  return `--shadowPreviewBox: ${x.value}px ${y.value}px ${blur.value}px 0px hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value});
  --shadowPreviewText: ${x.value}px ${y.value}px ${blur.value}px hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})`
})

const handleShadowSet = () => {
  emit('update:modelValue', [
    enable.value,
    x.value,
    y.value,
    blur.value,
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
      <button :id="tagId" aria-label="Select color" class="btn pickerButton" :class="!enable && 'pickerButtonDisable'">
        <div :class="{ text: props.text }"></div>
        <div :class="{ text: props.text }"></div>
        <fa class="disabled" icon="fa-ban"></fa>
      </button>
    </template>
    <template #menu>
      <div class="shadowMenu">
        <div class="block">
          <div class="group fill">
            <label for="" class="label">Shadow</label>
            <div class="group compact mla">
              <label for="toggleShadow" class="desc">Enable</label>
              <ToggleField v-model="enable" tag-id="toggleShadow" @update:model-value="handleShadowSet()">
              </ToggleField>
            </div>
          </div>
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
                  @input="handleShadowSet()"
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
                  @input="handleShadowSet()"
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
                  @input="handleShadowSet()"
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
                  @input="handleShadowSet()"
                />
              </div>
            </div>
          </div>
          <div class="group fill">
            <div class="group stack">
              <label for="" class="desc">X</label>
              <NumberField
                v-model="x"
                tag-id="shadowX"
                aria-label="Offset shadow direction x coordinates"
                :increment="1"
                @update:model-value="handleShadowSet()"
              >
              </NumberField>
            </div>
            <div class="group stack">
              <label for="" class="desc">Y</label>
              <NumberField
                v-model="y"
                tag-id="shadowY"
                aria-label="Offset shadow direction y coordinates"
                :increment="1"
                @update:model-value="handleShadowSet()"
              >
              </NumberField>
            </div>
            <div class="group stack">
              <label for="" class="desc">Blur</label>
              <NumberField
                v-model="blur"
                tag-id="shadowBlur"
                aria-label="Shadow blur radius"
                :increment="1"
                :min="0"
                @update:model-value="handleShadowSet()"
              >
              </NumberField>
            </div>
          </div>
          <div class="group stack fill">
            <label for="" class="label">Preview</label>
            <div class="shadowPreview">
              <div :style="currentShadowPreview"></div>
              <div :style="currentShadowPreview"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DropdownMenu>
</template>

<style lang="scss" scoped>
.pickerButton {
  background-color: var(--cGrey1);
  border-color: var(--cGrey1);
  width: 100%;
  min-width: 3.6rem;
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  padding: 0;
  overflow: hidden;

  > div {
    display: grid;
    place-items: center;
    overflow: hidden;
    width: 100%;
    height: 100%;

    &:nth-child(1) {
      color: hsl(0deg 0% 85%);
      background-color: hsl(0deg 0% 10%);
    }

    &:nth-child(2) {
      color: hsl(0deg 0% 10%);
      background-color: hsl(0deg 0% 85%);
    }
  }

  > div:not(.text)::before {
    content: '';
    width: 50%;
    height: 30%;
    background-color: hsl(0deg 0% 85%);
    box-shadow: v-bind(currentShadow);
  }

  > div:not(.text):nth-child(2)::before {
    background-color: hsl(0deg 0% 10%);
  }

  > div.text::before {
    content: 'A';
    font-size: 1.8rem;
    font-weight: 600;
    text-shadow: v-bind(currentTextShadow);
  }

  .disabled {
    display: none;
  }

  &.pickerButtonDisable {
    grid-template-columns: 1fr;
    div {
      display: none;
    }
    .disabled {
      display: block;
    }
  }
}

.shadowPreview {
  width: 100%;
  height: 5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-radius: var(--s3);
  overflow: hidden;
  font-size: 2rem;

  > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    place-items: center;
    overflow: hidden;
    width: 100%;
    height: 100%;
    padding: 0 2rem;

    &:first-child {
      background-color: hsl(0deg 0% 10%);
    }

    &:last-child {
      background-color: hsl(0deg 0% 85%);
    }
  }

  > div::before {
    content: '';
    width: 60%;
    height: 30%;
    background-color: hsl(0deg 0% 85%);
    box-shadow: var(--shadowPreviewBox);
  }

  > div::after {
    content: 'ABC';
    font-weight: 700;
    color: hsl(0deg 0% 85%);
    text-shadow: var(--shadowPreviewText);
  }

  > div:last-child::before {
    background-color: hsl(0deg 0% 10%);
  }

  > div:last-child::after {
    color: hsl(0deg 0% 10%);
  }
}

.shadowMenu {
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
