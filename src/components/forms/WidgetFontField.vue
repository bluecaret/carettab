<script setup>
import { useSettingsStore } from '@/store.js'
import { fontList, fontWeight, textTransform } from '@/assets/lists.js'

const emit = defineEmits([
  'update:override',
  'update:color',
  'update:shadow',
  'update:family',
  'update:size',
  'update:bold',
  'update:italic',
  'update:underline',
  'update:letterSpacing',
  'update:transform',
])
const props = defineProps({
  noOverride: Boolean,
  override: Boolean,
  color: Array,
  shadow: Array,
  family: String,
  size: Number,
  bold: Number,
  italic: Boolean,
  underline: Boolean,
  letterSpacing: Number,
  transform: String,
})

const store = useSettingsStore()

const handleOverrideUpdate = (bool) => {
  emit('update:override', bool)
  resetOverride()
}

const handleColorUpdate = (arr) => {
  emit('update:color', arr)
}

const handleShadowUpdate = (arr) => {
  emit('update:shadow', arr)
}

const handleFamilyUpdate = (obj) => {
  emit('update:family', obj.label)
}

const handleSizeUpdate = (num) => {
  emit('update:size', num < 1 ? 1 : num)
}

const handleBoldUpdate = (num) => {
  emit('update:bold', parseFloat(num.target.value))
}

const handleItalicUpdate = () => {
  emit('update:italic', !props.italic)
}

const handleUnderlineUpdate = () => {
  emit('update:underline', !props.underline)
}

const handleLetterSpacingUpdate = (num) => {
  emit('update:letterSpacing', num)
}

const handleTransformUpdate = (str) => {
  emit('update:transform', str.target.value)
}

const resetOverride = () => {
  emit('update:color', [...store.config.global.font.color])
  emit('update:shadow', [...store.config.global.font.shadow])
  emit('update:family', store.config.global.font.family)
  emit('update:size', store.config.global.font.size)
  emit('update:bold', store.config.global.font.bold)
  emit('update:italic', store.config.global.font.italic)
  emit('update:underline', store.config.global.font.underline)
  emit('update:letterSpacing', store.config.global.font.letterSpacing)
  emit('update:transform', store.config.global.font.transform)
}
</script>

<template>
  <div class="block">
    <div class="group fill">
      <label class="label mra">Font</label>
      <div v-if="!props.noOverride" class="group compact">
        <label for="overrideGlobalFont" class="desc">Override global styles</label>
        <ToggleField
          tag-id="overrideGlobalFont"
          :model-value="props.override"
          @update:model-value="handleOverrideUpdate"
        >
        </ToggleField>
      </div>
    </div>
    <div v-if="props.noOverride || props.override" class="group fill">
      <div class="group stack fill">
        <label for="fontFamily" class="desc"> Font </label>
        <AutocompleteField
          left
          tag-id="test"
          use-label
          allow-custom
          :list="fontList"
          :selected="props.family"
          @selected="(item) => handleFamilyUpdate(item)"
        ></AutocompleteField>
      </div>
      <div class="group stack">
        <label for="fontSize" class="desc"> Size </label>
        <NumberField
          tag-id="fontSize"
          class="w12"
          aria-label="Font size"
          :increment="1"
          :model-value="props.size"
          :min="1"
          @update:model-value="handleSizeUpdate"
        ></NumberField>
      </div>
      <div class="group stack">
        <label for="widgetLetterSpacing" class="desc"> Letter spacing </label>
        <NumberField
          tag-id="widgetLetterSpacing"
          class="w12"
          aria-label="Letter spacing"
          :increment="0.2"
          :model-value="props.letterSpacing"
          @update:model-value="handleLetterSpacingUpdate"
        >
        </NumberField>
      </div>
    </div>
    <div v-if="props.noOverride || props.override" class="group fill">
      <div class="group stack fill">
        <label for="fontBold" class="desc"> Weight </label>
        <select id="fontBold" name="fontBold" class="select" @change="handleBoldUpdate($event)">
          <option v-for="wgt in fontWeight" :key="wgt.id" :selected="wgt.id === props.bold" :value="wgt.id">
            {{ wgt.label }}
          </option>
        </select>
      </div>
      <div class="group stack">
        <label class="desc"> Style </label>
        <div class="btnGroup">
          <button
            id="togglePosition"
            aria-label="Italic"
            class="btn"
            type="button"
            :class="{ active: props.italic }"
            @click="handleItalicUpdate"
          >
            <fa icon="fa-italic" fixed-width></fa>
          </button>
          <button
            id="togglePosition"
            aria-label="Underline"
            class="btn"
            type="button"
            :class="{ active: props.underline }"
            @click="handleUnderlineUpdate"
          >
            <fa icon="fa-underline" fixed-width></fa>
          </button>
        </div>
      </div>
      <div class="group stack fill">
        <label for="textTranform" class="desc"> Case </label>
        <select id="textTranform" name="textTranform" class="select" @change="handleTransformUpdate($event)">
          <option v-for="opt in textTransform" :key="opt.id" :selected="opt.id === props.transform" :value="opt.id">
            {{ opt.label }}
          </option>
        </select>
      </div>
      <div class="group stack">
        <label for="widgetFontColor" class="desc"> Color </label>
        <ColorField
          tag-id="widgetFontColor"
          class="w8"
          :model-value="props.color"
          @update:model-value="handleColorUpdate"
        >
        </ColorField>
      </div>
      <div class="group stack">
        <label for="widgetFontShadow" class="desc"> Shadow </label>
        <ColorField
          shadow
          text
          tag-id="widgetFontShadow"
          class="w8"
          :model-value="props.shadow"
          @update:model-value="handleShadowUpdate"
        >
        </ColorField>
      </div>
    </div>
  </div>
</template>
