<script setup>
import { useSettingsStore } from '@/store.js'
const emit = defineEmits([
  'update:override',
  'update:rounded',
  'update:bs',
  'update:bc',
  'update:bg',
  'update:shadow',
  'update:padding',
])
const props = defineProps({
  noOverride: Boolean,
  override: Boolean,
  rounded: Number,
  bs: Number,
  bc: Array,
  bg: Array,
  shadow: Array,
  padding: Number,
})

const store = useSettingsStore()

const handleOverrideUpdate = (bool) => {
  emit('update:override', bool)
  resetOverride()
}

const handleRoundedUpdate = (num) => {
  emit('update:rounded', num < 1 ? 0 : num)
}

const handleBsUpdate = (num) => {
  emit('update:bs', num < 1 ? 0 : num)
}

const handleBcUpdate = (arr) => {
  emit('update:bc', arr)
}

const handleBgUpdate = (arr) => {
  emit('update:bg', arr)
}

const handleShadowUpdate = (arr) => {
  emit('update:shadow', arr)
}

const handlePaddingUpdate = (num) => {
  emit('update:padding', num < 1 ? 0 : num)
}

const resetOverride = () => {
  emit('update:rounded', store.config.global.crd)
  emit('update:bs', store.config.global.cbs)
  emit('update:bc', store.config.global.cbc)
  emit('update:bg', store.config.global.cbg)
  emit('update:shadow', store.config.global.csh)
  emit('update:padding', store.config.global.cpd)
}
</script>

<template>
  <div class="block">
    <div class="group fill">
      <label class="label mra">Container box</label>
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
      <div class="group stack">
        <label for="boxPadding" class="desc"> Padding </label>
        <NumberField
          tag-id="boxPadding"
          :increment="1"
          :min="0"
          :model-value="props.padding"
          @update:model-value="handlePaddingUpdate"
        >
        </NumberField>
      </div>
      <div class="group stack">
        <label for="boxRounded" class="desc"> Rounded </label>
        <NumberField
          tag-id="boxRounded"
          :increment="1"
          :min="0"
          :model-value="props.rounded"
          @update:model-value="handleRoundedUpdate"
        >
        </NumberField>
      </div>
      <div class="group stack">
        <label for="boxBs" class="desc"> Border size </label>
        <NumberField
          tag-id="boxBs"
          :increment="1"
          :min="0"
          :model-value="props.bs"
          @update:model-value="handleBsUpdate"
        >
        </NumberField>
      </div>
      <div class="group stack">
        <label for="boxBc" class="desc"> Border color </label>
        <ColorPickerField tag-id="boxBc" class="w8" :model-value="props.bc" @update:model-value="handleBcUpdate">
        </ColorPickerField>
      </div>
      <div class="group stack">
        <label for="boxBg" class="desc"> Background </label>
        <ColorPickerField tag-id="boxBg" class="w8" :model-value="props.bg" @update:model-value="handleBgUpdate">
        </ColorPickerField>
      </div>
      <div class="group stack">
        <label for="boxShadow" class="desc"> Shadow </label>
        <ShadowField tag-id="boxShadow" class="w8" :model-value="props.shadow" @update:model-value="handleShadowUpdate">
        </ShadowField>
      </div>
    </div>
  </div>
</template>
