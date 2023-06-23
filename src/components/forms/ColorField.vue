<script setup>
import { ref, computed, toRaw } from 'vue'
import { useSettingsStore, setStorage } from '@/store.js'
import { hsl } from '@/helpers/widgets.js'

const store = useSettingsStore()
const props = defineProps({ modelValue: Array, tagId: String, shadow: Boolean, text: Boolean, disabled: Boolean })
const emit = defineEmits(['update:modelValue'])

const swatches = [
  [
    [6, 54, 95, 1],
    [6, 54, 89, 1],
    [6, 54, 78, 1],
    [6, 54, 68, 1],
    [6, 54, 57, 1],
    [6, 63, 46, 1],
    [6, 63, 41, 1],
    [6, 63, 35, 1],
    [6, 63, 29, 1],
    [6, 63, 24, 1],
  ],
  [
    [6, 78, 96, 1],
    [6, 78, 91, 1],
    [6, 78, 83, 1],
    [6, 78, 74, 1],
    [6, 78, 66, 1],
    [6, 78, 57, 1],
    [6, 59, 50, 1],
    [6, 59, 43, 1],
    [6, 59, 37, 1],
    [6, 59, 30, 1],
  ],
  [
    [283, 39, 95, 1],
    [283, 39, 91, 1],
    [283, 39, 81, 1],
    [283, 39, 72, 1],
    [283, 39, 63, 1],
    [283, 39, 53, 1],
    [283, 34, 47, 1],
    [283, 34, 40, 1],
    [283, 34, 34, 1],
    [283, 34, 28, 1],
  ],
  [
    [282, 39, 95, 1],
    [282, 39, 89, 1],
    [282, 39, 79, 1],
    [282, 39, 68, 1],
    [282, 39, 58, 1],
    [282, 44, 47, 1],
    [282, 44, 42, 1],
    [282, 44, 36, 1],
    [282, 44, 30, 1],
    [282, 44, 25, 1],
  ],
  [
    [204, 51, 94, 1],
    [204, 51, 89, 1],
    [204, 51, 78, 1],
    [204, 51, 67, 1],
    [204, 51, 55, 1],
    [204, 64, 44, 1],
    [204, 64, 39, 1],
    [204, 64, 34, 1],
    [204, 64, 28, 1],
    [204, 64, 23, 1],
  ],
  [
    [204, 70, 95, 1],
    [204, 70, 91, 1],
    [204, 70, 81, 1],
    [204, 70, 72, 1],
    [204, 70, 63, 1],
    [204, 70, 53, 1],
    [204, 62, 47, 1],
    [204, 62, 40, 1],
    [204, 62, 34, 1],
    [204, 62, 28, 1],
  ],
  [
    [168, 55, 94, 1],
    [168, 55, 88, 1],
    [168, 55, 77, 1],
    [168, 55, 65, 1],
    [168, 55, 54, 1],
    [168, 76, 42, 1],
    [168, 76, 37, 1],
    [168, 76, 32, 1],
    [168, 76, 27, 1],
    [168, 76, 22, 1],
  ],
  [
    [168, 42, 94, 1],
    [168, 42, 87, 1],
    [168, 42, 74, 1],
    [168, 42, 61, 1],
    [168, 45, 49, 1],
    [168, 76, 36, 1],
    [168, 76, 31, 1],
    [168, 76, 27, 1],
    [168, 76, 23, 1],
    [168, 76, 19, 1],
  ],
  [
    [145, 45, 94, 1],
    [145, 45, 88, 1],
    [145, 45, 77, 1],
    [145, 45, 65, 1],
    [145, 45, 53, 1],
    [145, 63, 42, 1],
    [145, 63, 37, 1],
    [145, 63, 32, 1],
    [145, 63, 27, 1],
    [145, 63, 22, 1],
  ],
  [
    [145, 61, 95, 1],
    [145, 61, 90, 1],
    [145, 61, 80, 1],
    [145, 61, 69, 1],
    [145, 61, 59, 1],
    [145, 63, 49, 1],
    [145, 63, 43, 1],
    [145, 63, 37, 1],
    [145, 63, 31, 1],
    [145, 63, 25, 1],
  ],
  [
    [48, 89, 95, 1],
    [48, 89, 90, 1],
    [48, 89, 80, 1],
    [48, 89, 70, 1],
    [48, 89, 60, 1],
    [48, 89, 50, 1],
    [48, 88, 44, 1],
    [48, 88, 38, 1],
    [48, 88, 32, 1],
    [48, 88, 26, 1],
  ],
  [
    [37, 90, 95, 1],
    [37, 90, 90, 1],
    [37, 90, 80, 1],
    [37, 90, 71, 1],
    [37, 90, 61, 1],
    [37, 90, 51, 1],
    [37, 86, 45, 1],
    [37, 86, 39, 1],
    [37, 86, 33, 1],
    [37, 86, 27, 1],
  ],
  [
    [28, 80, 95, 1],
    [28, 80, 90, 1],
    [28, 80, 81, 1],
    [28, 80, 71, 1],
    [28, 80, 61, 1],
    [28, 80, 52, 1],
    [28, 74, 46, 1],
    [28, 74, 39, 1],
    [28, 74, 33, 1],
    [28, 74, 27, 1],
  ],
  [
    [24, 71, 94, 1],
    [24, 71, 88, 1],
    [24, 71, 77, 1],
    [24, 71, 65, 1],
    [24, 71, 53, 1],
    [24, 100, 41, 1],
    [24, 100, 36, 1],
    [24, 100, 31, 1],
    [24, 100, 26, 1],
    [24, 100, 22, 1],
  ],
  [
    [20, 16, 93, 1],
    [16, 16, 81, 1],
    [15, 15, 69, 1],
    [16, 15, 56, 1],
    [16, 18, 47, 1],
    [16, 25, 38, 1],
    [15, 25, 34, 1],
    [14, 26, 29, 1],
    [11, 26, 24, 1],
  ],
  [
    [210, 9, 92, 1],
    [210, 9, 85, 1],
    [210, 9, 70, 1],
    [210, 9, 55, 1],
    [210, 14, 39, 1],
    [210, 29, 24, 1],
    [210, 29, 21, 1],
    [210, 29, 18, 1],
    [210, 29, 16, 1],
    [210, 29, 13, 1],
  ],
  [
    [0, 0, 98, 1],
    [0, 0, 96, 1],
    [0, 0, 93, 1],
    [0, 0, 88, 1],
    [0, 0, 74, 1],
    [0, 0, 62, 1],
    [0, 0, 46, 1],
    [0, 0, 38, 1],
    [0, 0, 26, 1],
    [0, 0, 13, 1],
  ],
  [
    [0, 0, 100, 1],
    [0, 0, 0, 1],
    [0, 0, 100, 0],
    [0, 0, 100, 0.2],
    [0, 0, 100, 0.4],
    [0, 0, 100, 0.6],
    [0, 0, 0, 0.2],
    [0, 0, 0, 0.4],
    [0, 0, 0, 0.6],
    [0, 0, 0, 0.8],
  ],
]

// color: hue, saturation, lightness, opacity
// shadow: enable, x, y, blur, hue, saturation, lightness, opacity
let val
if (props.shadow) {
  val = props.modelValue ? toRaw(props.modelValue) : [false, 1, 1, 5, 0, 0, 0, 0.8]
} else {
  val = props.modelValue ? [false, 0, 0, 0, ...props.modelValue] : [false, 0, 0, 0, 0, 0, 0, 0.8]
}

const editPalette = ref(false)
const showSwatches = ref(false)

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
  return `--rangeInputThumb: linear-gradient(hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value}), hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})), repeating-conic-gradient(#555 0% 25%, transparent 0% 50%) 50% / 8px 8px, #DDD;--rangeInputTrack: linear-gradient(to right, hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / 0), hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / 1)), repeating-conic-gradient(#555 0% 25%, transparent 0% 50%) 50% / 8px 8px, #DDD;`
})

const pickerColor = computed(() => {
  return props.shadow
    ? 'var(--cGrey1)'
    : `hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})`
})
const pickerBg = computed(() => {
  return props.shadow
    ? 'var(--cGrey3)'
    : `
    linear-gradient(
      hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value}), 
      hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})
    ), 
    repeating-conic-gradient(#555 0% 25%, transparent 0% 50%) 50% / 8px 8px, #DDD
  `
})
const pickerShadow = computed(() => {
  return `${x.value}px ${y.value}px ${blur.value}px ${props.text ? '' : '0'} hsl(${hue.value}deg ${saturation.value}% ${
    lightness.value
  }% / ${opacity.value})`
})
const pickerTextShadow = computed(() => {
  return `${x.value}px ${y.value}px ${blur.value}px hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})`
})

const constructPaletteColor = (color) => {
  return `
    linear-gradient(
      hsl(${color[0]}deg ${color[1]}% ${color[2]}% / ${color[3]}),
      hsl(${color[0]}deg ${color[1]}% ${color[2]}% / ${color[3]})
    ),
    repeating-conic-gradient(#555 0% 25%, transparent 0% 50%) 50% / 8px 8px, #DDD
  `
}

const handlePaletteColorClick = (color, index) => {
  if (editPalette.value) {
    store.palette[index] = []
    let newPalette = [...store.palette]
    setStorage({ palette: newPalette }, 'local')
  } else if (color.length) {
    hue.value = color[0]
    saturation.value = color[1]
    lightness.value = color[2]
    opacity.value = color[3]
    handleUpdate()
  } else {
    let saveColor = [
      parseInt(hue.value),
      parseInt(saturation.value),
      parseInt(lightness.value),
      parseFloat(opacity.value),
    ]
    store.palette[index] = saveColor
    let newPalette = toRaw(store.palette)
    setStorage({ palette: newPalette }, 'local')
  }
}

const handleUpdate = () => {
  emit(
    'update:modelValue',
    props.shadow
      ? [
          enable.value,
          x.value,
          y.value,
          blur.value,
          parseInt(hue.value),
          parseInt(saturation.value),
          parseInt(lightness.value),
          parseFloat(opacity.value),
        ]
      : [parseInt(hue.value), parseInt(saturation.value), parseInt(lightness.value), parseFloat(opacity.value)]
  )
}

const handleSwatchSelect = (swatch) => {
  hue.value = swatch[0]
  saturation.value = swatch[1]
  lightness.value = swatch[2]
  opacity.value = swatch[3]
  handleUpdate()
}

const getSwatchColor = (swatch) => {
  const style = `background: linear-gradient(${hsl(swatch)}, ${hsl(
    swatch
  )}), repeating-conic-gradient(#555 0% 25%, transparent 0% 50%) 50% / 8px 8px, #DDD`
  console.log(style)
  return style
}
</script>

<template>
  <DropdownMenu>
    <template #button>
      <button
        :id="tagId"
        :aria-label="`Select ${props.shadow ? 'shadow' : 'color'}`"
        class="btn pickerButton"
        :class="props.shadow && !enable && 'pickerButtonDisable'"
        :disabled="props.disabled ? 'disabled' : null"
      >
        <div class="pickerIcon">
          <fa :icon="props.shadow && !enable ? 'fa-droplet-slash' : 'fa-droplet'" />
        </div>
        <div v-if="props.shadow" class="shadowSample" :class="{ text: props.text }"></div>
        <div v-if="props.shadow" class="shadowSample" :class="{ text: props.text }"></div>
      </button>
    </template>
    <template #menu>
      <div class="colorMenu">
        <div class="block">
          <div class="group fill">
            <h3 class="label mra">{{ props.shadow ? 'Shadow' : 'Color' }}</h3>
            <div v-if="props.shadow" class="group compact">
              <label for="toggleShadow" class="desc">Enable</label>
              <ToggleField v-model="enable" tag-id="toggleShadow" @update:model-value="handleUpdate()"> </ToggleField>
            </div>
            <button
              class="btn btnText"
              :class="{ active: showSwatches }"
              type="button"
              aria-label="View swatches"
              title="View swatches"
              :disabled="props.shadow && !enable"
              @click="showSwatches = !showSwatches"
            >
              <fa icon="fa-swatchbook" />
            </button>
          </div>
          <div v-if="props.shadow" class="group fill">
            <div class="group compact fill">
              <label for="shadowX" class="desc">X</label>
              <NumberField
                v-model="x"
                tag-id="shadowX"
                aria-label="Offset shadow direction x coordinates"
                :increment="1"
                :disabled="props.shadow && !enable"
                @update:model-value="handleUpdate()"
              >
              </NumberField>
            </div>
            <div class="group compact fill">
              <label for="shadowY" class="desc">Y</label>
              <NumberField
                v-model="y"
                tag-id="shadowY"
                aria-label="Offset shadow direction y coordinates"
                :increment="1"
                :disabled="props.shadow && !enable"
                @update:model-value="handleUpdate()"
              >
              </NumberField>
            </div>
            <div class="group compact fill">
              <label for="shadowBlur" class="desc">Blur</label>
              <NumberField
                v-model="blur"
                tag-id="shadowBlur"
                aria-label="Shadow blur radius"
                :increment="1"
                :min="0"
                :disabled="props.shadow && !enable"
                @update:model-value="handleUpdate()"
              >
              </NumberField>
            </div>
          </div>
          <template v-if="!showSwatches">
            <div class="group stack fill colorSliders">
              <div class="group compact fill">
                <label for="hue" class="desc mra">Hue</label>
                <div class="range w28">
                  <output class="output">{{ hue }}&deg;</output>
                  <input
                    id="hue"
                    v-model="hue"
                    type="range"
                    class="rangeInput rangeHue"
                    :style="currentHue"
                    min="0"
                    max="360"
                    :disabled="props.shadow && !enable"
                    @input="handleUpdate()"
                  />
                </div>
              </div>
              <div class="group compact fill">
                <label for="saturation" class="desc mra">Saturation</label>
                <div class="range w28">
                  <output class="output">{{ saturation }}%</output>
                  <input
                    id="saturation"
                    v-model="saturation"
                    type="range"
                    class="rangeInput rangeSat"
                    :style="currentSat"
                    min="0"
                    max="100"
                    :disabled="props.shadow && !enable"
                    @input="handleUpdate()"
                  />
                </div>
              </div>
              <div class="group compact fill">
                <label for="lightness" class="desc mra">Lightness</label>
                <div class="range w28">
                  <output class="output">{{ lightness }}%</output>
                  <input
                    id="lightness"
                    v-model="lightness"
                    type="range"
                    class="rangeInput rangeLight"
                    :style="currentLight"
                    min="0"
                    max="100"
                    :disabled="props.shadow && !enable"
                    @input="handleUpdate()"
                  />
                </div>
              </div>
              <div class="group compact fill">
                <label for="opacity" class="desc mra">Opacity</label>
                <div class="range w28">
                  <output class="output">{{ parseFloat(opacity * 100).toFixed(0) }}%</output>
                  <input
                    id="opacity"
                    v-model="opacity"
                    type="range"
                    class="rangeInput rangeOp"
                    :style="currentOp"
                    min="0"
                    max="1"
                    step=".01"
                    :disabled="props.shadow && !enable"
                    @input="handleUpdate()"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-if="showSwatches">
            <div class="swatches">
              <div v-for="(swatchGroup, index) in swatches" :key="index" class="swatchGroup">
                <button
                  v-for="(swatch, i) in swatchGroup"
                  :key="i"
                  type="button"
                  class="btn swatch"
                  :style="getSwatchColor(swatch)"
                  :disabled="props.shadow && !enable"
                  @click="handleSwatchSelect(swatch)"
                ></button>
              </div>
            </div>
          </template>
          <div class="group fill">
            <ul class="palette" aria-label="Color palette. Save your custom colors to the palette.">
              <li
                class="paletteIcon"
                title="Save your colors to the palette by clicking the plus. Remove them by clicking the edit button."
              >
                <fa icon="fa-palette" />
              </li>
              <li v-for="(color, index) in store.palette" :key="index">
                <button
                  class="btn paletteBtn"
                  :style="`background: ${color.length ? constructPaletteColor(color) : 'none'}`"
                  :aria-label="
                    editPalette
                      ? color.length
                        ? 'Remove color'
                        : ''
                      : color.length
                      ? 'Select saved color'
                      : 'Save current color'
                  "
                  :title="
                    editPalette
                      ? color.length
                        ? 'Remove color'
                        : ''
                      : color.length
                      ? 'Select saved color'
                      : 'Save current color'
                  "
                  :disabled="(editPalette && !color.length) || (props.shadow && !enable)"
                  @click="handlePaletteColorClick(color, index)"
                >
                  <fa v-if="!editPalette && !color.length" icon="fa-plus" size="sm"></fa>
                  <fa v-if="editPalette && color.length" icon="fa-xmark" size="md"></fa>
                </button>
              </li>
              <li>
                <button
                  class="btn"
                  :class="{ active: editPalette }"
                  aria-label="Edit palette"
                  title="Edit palette"
                  :disabled="props.shadow && !enable"
                  @click="editPalette = !editPalette"
                >
                  <fa icon="fa-pen" size="sm"></fa>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </DropdownMenu>
</template>

<style lang="scss" scoped>
.palette {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 0.4rem;
  padding: 0.6rem;
  margin: 0;
  background-color: var(--cGrey2);
  border-radius: var(--s3);
  list-style: none;
  .btn {
    width: 100%;
    min-height: auto;
    display: grid;
    place-items: center;
    padding: 0;
    aspect-ratio: 1/1;
    .svg-inline--fa {
      // font-size: 1.2rem;
    }
  }
  .btn.paletteBtn {
    border: 1px solid var(--cGrey1);
    background-color: transparent;
    color: var(--cGrey5);
    .fa-xmark {
      fill: white;
      stroke: black;
      stroke-width: 5em;
      stroke-linejoin: round;
      paint-order: stroke;
    }
    &:disabled {
      cursor: not-allowed;
      &:hover {
        box-shadow: none;
      }
    }
  }
}

.paletteIcon {
  display: grid;
  place-items: center;
}

.pickerButton {
  background-color: v-bind(pickerColor);
  background: v-bind(pickerBg);
  color: currentColor;
  border-color: var(--cGrey3);
  width: 100%;
  min-width: 3.6rem;
  display: grid;
  align-items: center;
  justify-items: start;
  grid-template-columns: calc(2.4rem + var(--s3) + var(--s3)) 1fr 1fr;
  gap: 0;
  padding: 0;
  overflow: hidden;

  :disabled {
    cursor: not-allowed;
  }

  .pickerIcon {
    display: grid;
    place-items: center;
    width: 2.4rem;
    height: 2.4rem;
    background: var(--cGrey3);
    color: var(--cGrey5);
    border-radius: 50%;
    font-size: 1.6rem;
    margin: 0 auto;
  }

  .shadowSample {
    display: grid;
    place-items: center;
    overflow: hidden;
    width: 100%;
    height: 100%;

    &:nth-child(2) {
      color: hsl(0deg 0% 75%);
      background-color: hsl(0deg 0% 25%);
    }

    &:nth-child(3) {
      color: hsl(0deg 0% 25%);
      background-color: hsl(0deg 0% 75%);
    }
  }

  .shadowSample:not(.text)::before {
    content: '';
    width: 50%;
    height: 30%;
    border-radius: 2rem;
    background-color: hsl(0deg 0% 75%);
    box-shadow: v-bind(pickerShadow);
  }

  .shadowSample:not(.text):nth-child(3)::before {
    background-color: hsl(0deg 0% 25%);
  }

  .shadowSample.text::before {
    content: 'A';
    font-size: 1.8rem;
    font-weight: 600;
    text-shadow: v-bind(pickerTextShadow);
  }

  &.pickerButtonDisable {
    grid-template-columns: 1fr;
    .shadowSample {
      display: none;
    }
  }
}

.colorMenu {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 40rem;
  border-radius: var(--s3);
  background-color: var(--cGrey1);
  > .block {
    gap: var(--s4);
  }
}

.colorSliders {
  gap: var(--s2);
}

.range {
  grid-template-columns: 2.2em auto;
}

.rangeInput {
  &::-webkit-slider-runnable-track {
    height: 1.2rem;
    background: var(--rangeInputTrack);
    border-radius: 0.6rem;
  }

  &::-webkit-slider-thumb {
    translate: 0 -0.4rem;
    box-shadow: 0 0 0 1px hsl(0deg 0% 100%), 0 0 3px 2px hsl(0deg 0% 0%);
    background: var(--rangeInputThumb);
  }

  &.rangeHue::-webkit-slider-runnable-track {
    background: linear-gradient(to right, red, yellow, lime, aqua, blue, magenta, red);
  }
}

.swatches {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(18, 1fr);
  overflow: hidden;
  border-radius: 0.4rem;
}
.swatchGroup {
  display: grid;
  grid-template-rows: repeat(10, 1fr);
}

.swatch {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: block;
  border: 0;
  padding: 0;
  margin: 0;
  min-height: unset;
  border-radius: 0;
  transition: none;
  &:hover {
    box-shadow: none;
  }
  &:focus {
    outline: 0;
    box-shadow: inset 0 0 0 1px white, inset 0 0 0 2px black;
  }
}
</style>
