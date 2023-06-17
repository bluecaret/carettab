<script setup>
import { ref, computed, toRaw } from 'vue'
import { useSettingsStore, setStorage } from '@/store.js'

const store = useSettingsStore()
const props = defineProps({ modelValue: Array, tagId: String, shadow: Boolean, text: Boolean, disabled: Boolean })
const emit = defineEmits(['update:modelValue'])

// color: hue, saturation, lightness, opacity
// shadow: enable, x, y, blur, hue, saturation, lightness, opacity
let val
if (props.shadow) {
  val = props.modelValue ? toRaw(props.modelValue) : [false, 1, 1, 5, 0, 0, 0, 0.8]
} else {
  val = props.modelValue ? [false, 0, 0, 0, ...props.modelValue] : [false, 0, 0, 0, 0, 0, 0, 0.8]
}

const editPalette = ref(false)

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

const shadowPreview = computed(() => {
  return `--shadowPreviewBox: ${x.value}px ${y.value}px ${blur.value}px 0px hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value});
  --shadowPreviewText: ${x.value}px ${y.value}px ${blur.value}px hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})`
})

const pickerColor = computed(() => {
  return props.shadow
    ? 'var(--cGrey1)'
    : `hsl(${hue.value}deg ${saturation.value}% ${lightness.value}% / ${opacity.value})`
})
const pickerBg = computed(() => {
  return props.shadow
    ? 'var(--cGrey1)'
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
        <div v-if="props.shadow" :class="{ text: props.text }"></div>
        <div v-if="props.shadow" :class="{ text: props.text }"></div>
        <fa v-if="props.shadow" class="disabled" icon="fa-ban"></fa>
      </button>
    </template>
    <template #menu>
      <div class="colorMenu">
        <div class="block">
          <div class="group fill">
            <h3 class="label">{{ props.shadow ? 'Shadow' : 'Color' }}</h3>
            <div v-if="props.shadow" class="group compact mla">
              <label for="toggleShadow" class="desc">Enable</label>
              <ToggleField v-model="enable" tag-id="toggleShadow" @update:model-value="handleUpdate()"> </ToggleField>
            </div>
          </div>
          <div class="group fill">
            <div class="group stack">
              <label for="hue" class="desc">Hue</label>
              <div class="range">
                <output class="output">{{ hue }}&deg;</output>
                <input
                  id="hue"
                  v-model="hue"
                  type="range"
                  class="rangeInput rangeHue"
                  :style="currentHue"
                  min="0"
                  max="360"
                  @input="handleUpdate()"
                />
              </div>
            </div>
            <div class="group stack">
              <label for="saturation" class="desc">Saturation</label>
              <div class="range">
                <output class="output">{{ saturation }}%</output>
                <input
                  id="saturation"
                  v-model="saturation"
                  type="range"
                  class="rangeInput rangeSat"
                  :style="currentSat"
                  min="0"
                  max="100"
                  @input="handleUpdate()"
                />
              </div>
            </div>
          </div>
          <div class="group fill">
            <div class="group stack">
              <label for="lightness" class="desc">Lightness</label>
              <div class="range">
                <output class="output">{{ lightness }}%</output>
                <input
                  id="lightness"
                  v-model="lightness"
                  type="range"
                  class="rangeInput rangeLight"
                  :style="currentLight"
                  min="0"
                  max="100"
                  @input="handleUpdate()"
                />
              </div>
            </div>
            <div class="group stack">
              <label for="opacity" class="desc">Opacity</label>
              <div class="range">
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
                  @input="handleUpdate()"
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
          <div v-if="props.shadow" class="group fill">
            <div class="group stack">
              <label for="shadowX" class="desc">X</label>
              <NumberField
                v-model="x"
                tag-id="shadowX"
                aria-label="Offset shadow direction x coordinates"
                :increment="1"
                @update:model-value="handleUpdate()"
              >
              </NumberField>
            </div>
            <div class="group stack">
              <label for="shadowY" class="desc">Y</label>
              <NumberField
                v-model="y"
                tag-id="shadowY"
                aria-label="Offset shadow direction y coordinates"
                :increment="1"
                @update:model-value="handleUpdate()"
              >
              </NumberField>
            </div>
            <div class="group stack">
              <label for="shadowBlur" class="desc">Blur</label>
              <NumberField
                v-model="blur"
                tag-id="shadowBlur"
                aria-label="Shadow blur radius"
                :increment="1"
                :min="0"
                @update:model-value="handleUpdate()"
              >
              </NumberField>
            </div>
          </div>
          <div v-if="props.shadow" class="group stack fill">
            <div class="label">Preview</div>
            <div class="shadowPreview">
              <div :style="shadowPreview"></div>
              <div :style="shadowPreview"></div>
            </div>
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
      font-size: 1.2rem;
    }
    &.paletteBtn {
      border: 1px solid var(--cGrey1);
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
  background-color: v-bind(pickerColor);
  background: v-bind(pickerBg);
  color: currentColor;
  border-color: var(--cGrey1);
  width: 100%;
  min-width: 3.6rem;
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  padding: 0;
  overflow: hidden;

  :disabled {
    cursor: pointer;
  }

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
    box-shadow: v-bind(pickerShadow);
  }

  > div:not(.text):nth-child(2)::before {
    background-color: hsl(0deg 0% 10%);
  }

  > div.text::before {
    content: 'A';
    font-size: 1.8rem;
    font-weight: 600;
    text-shadow: v-bind(pickerTextShadow);
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
</style>
