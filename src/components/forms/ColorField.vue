<script setup>
import { ref, computed, toRaw } from 'vue'
import { useSettingsStore, setStorage } from '@/store.js'

const store = useSettingsStore()
const props = defineProps({ modelValue: Array, tagId: String })
const emit = defineEmits(['update:modelValue'])

// hue, saturation, lightness, opacity
const val = props.modelValue ?? [0, 0, 0, 0.8]

const editPalette = ref(false)

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
  return `--rangeInputThumb: linear-gradient(hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value}), hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})), repeating-conic-gradient(#555 0% 25%, transparent 0% 50%) 50% / 8px 8px, #DDD;--rangeInputTrack: linear-gradient(to right, hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / 0), hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / 1)), repeating-conic-gradient(#555 0% 25%, transparent 0% 50%) 50% / 8px 8px, #DDD;`
})
const currentColor = computed(() => {
  return `hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})`
})
const currentGradient = computed(() => {
  return `
    linear-gradient(
      hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value}), 
      hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})
    ), 
    repeating-conic-gradient(#555 0% 25%, transparent 0% 50%) 50% / 8px 8px, #DDD
  `
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
  console.log('color click', color)
  if (editPalette.value) {
    store.palette[index] = []
    let newPalette = [...store.palette]
    setStorage({ palette: newPalette }, 'local')
  } else if (color.length) {
    hue.value = color[0]
    saturation.value = color[1]
    lightness.value = color[2]
    opacity.value = color[3]
    handleColorSet()
  } else {
    let saveColor = [
      parseInt(hue.value),
      parseInt(saturation.value),
      parseInt(lightness.value),
      parseFloat(opacity.value),
    ]
    store.palette[index] = saveColor
    console.log('save palette', toRaw(store.palette), store.palette)
    let newPalette = toRaw(store.palette)
    setStorage({ palette: newPalette }, 'local')
  }
}

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
          <div class="group fill">
            <ul class="palette">
              <li v-for="(color, index) in store.palette" :key="index">
                <button
                  class="btn paletteBtn"
                  :style="`background: ${color.length ? constructPaletteColor(color) : 'none'}`"
                  aria-label="Save current color to palette"
                  title="Save current color to palette"
                  :disabled="editPalette && !color.length"
                  @click="handlePaletteColorClick(color, index)"
                >
                  <fa v-if="!editPalette && !color.length" icon="fa-plus"></fa>
                  <fa v-if="editPalette && color.length" icon="fa-trash"></fa>
                </button>
              </li>
              <li>
                <button
                  class="btn"
                  :class="{ active: editPalette }"
                  aria-label="Edit palette"
                  title="Edit palette"
                  @click="editPalette = !editPalette"
                >
                  <fa icon="fa-pen"></fa>
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
  grid-template-columns: repeat(9, 1fr);
  gap: 0.4rem;
  padding: 0;
  margin: 0;
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
      font-size: 1.2rem;
    }
    &.paletteBtn {
      border: 1px solid var(--cGrey2);
      background-color: transparent;
      color: var(--cText);
      .svg-inline--fa {
        filter: drop-shadow(0.2rem 0.2rem 0.2rem hsl(0deg 0% 0% / 1));
      }
      &:disabled {
        cursor: default;
        &:hover {
          box-shadow: none;
        }
      }
    }
  }
}

.pickerButton {
  background-color: v-bind(currentColor);
  background: v-bind(currentGradient);
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
