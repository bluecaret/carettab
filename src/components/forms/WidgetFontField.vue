<script setup>
import { useSettingsStore } from '@/store.js'
import { fontList, fontWeight, textTransform } from '@/assets/lists.js'

const emit = defineEmits([
  'update:override',
  'update:cl',
  'update:ts',
  'update:ff',
  'update:fs',
  'update:fb',
  'update:fi',
  'update:fu',
  'update:ls',
  'update:tt',
])
const props = defineProps({
  noOverride: Boolean,
  override: Boolean,
  cl: Array,
  ts: Array,
  ff: String,
  fs: Number,
  fb: Number,
  fi: Boolean,
  fu: Boolean,
  ls: Number,
  tt: String,
})

const store = useSettingsStore()

const handleOverrideUpdate = (bool) => {
  emit('update:override', bool)
  resetOverride()
}

const handleClUpdate = (arr) => {
  emit('update:cl', arr)
}

const handleTsUpdate = (arr) => {
  emit('update:ts', arr)
}

const handleFfToggle = (obj) => {
  emit('update:ff', obj.id)
}

const handleFsUpdate = (num) => {
  emit('update:fs', num < 1 ? 1 : num)
}

const handleFbUpdate = (num) => {
  emit('update:fb', parseFloat(num.target.value))
}

const handleFiUpdate = () => {
  emit('update:fi', !props.fi)
}

const handleFuUpdate = () => {
  emit('update:fu', !props.fu)
}

const handleLsUpdate = (num) => {
  emit('update:ls', num)
}

const handleTtUpdate = (str) => {
  emit('update:tt', str.target.value)
}

const resetOverride = () => {
  emit('update:cl', [...store.config.global.cl])
  emit('update:ts', [...store.config.global.ts])
  emit('update:ff', store.config.global.ff)
  emit('update:fs', store.config.global.fs)
  emit('update:fb', store.config.global.fb)
  emit('update:fi', store.config.global.fi)
  emit('update:fu', store.config.global.fu)
  emit('update:ls', store.config.global.ls)
  emit('update:tt', store.config.global.tt)
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
          :selected="props.ff"
          @selected="(item) => handleFfToggle(item)"
        ></AutocompleteField>
      </div>
      <div class="group stack">
        <label for="fontSize" class="desc"> Size </label>
        <NumberField
          tag-id="fontSize"
          class="w12"
          aria-label="Font size"
          :increment="1"
          :model-value="props.fs"
          :min="1"
          @update:model-value="handleFsUpdate"
        ></NumberField>
      </div>
      <div class="group stack">
        <label for="widgetLetterSpacing" class="desc"> Letter spacing </label>
        <NumberField
          tag-id="widgetLetterSpacing"
          class="w12"
          aria-label="Letter spacing"
          :increment="0.2"
          :model-value="props.ls"
          @update:model-value="handleLsUpdate"
        >
        </NumberField>
      </div>
    </div>
    <div v-if="props.noOverride || props.override" class="group fill">
      <div class="group stack fill">
        <label for="fontBold" class="desc"> Weight </label>
        <select id="fontBold" name="fontBold" class="select" @change="handleFbUpdate($event)">
          <option v-for="wgt in fontWeight" :key="wgt.id" :selected="wgt.id === props.fb" :value="wgt.id">
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
            :class="{ active: props.fi }"
            @click="handleFiUpdate"
          >
            <fa icon="fa-italic" fixed-width></fa>
          </button>
          <button
            id="togglePosition"
            aria-label="Underline"
            class="btn"
            type="button"
            :class="{ active: props.fu }"
            @click="handleFuUpdate"
          >
            <fa icon="fa-underline" fixed-width></fa>
          </button>
        </div>
      </div>
      <div class="group stack fill">
        <label for="textTranform" class="desc"> Case </label>
        <select id="textTranform" name="textTranform" class="select" @change="handleTtUpdate($event)">
          <option v-for="opt in textTransform" :key="opt.id" :selected="opt.id === props.tt" :value="opt.id">
            {{ opt.label }}
          </option>
        </select>
      </div>
      <div class="group stack">
        <label for="widgetFontColor" class="desc"> Color </label>
        <ColorField tag-id="widgetFontColor" class="w8" :model-value="props.cl" @update:model-value="handleClUpdate">
        </ColorField>
      </div>
      <div class="group stack">
        <label for="widgetFontShadow" class="desc"> Shadow </label>
        <ColorField
          shadow
          text
          tag-id="widgetFontShadow"
          class="w8"
          :model-value="props.ts"
          @update:model-value="handleTsUpdate"
        >
        </ColorField>
      </div>
    </div>
  </div>
</template>
