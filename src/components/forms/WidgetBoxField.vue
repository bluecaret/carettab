<script setup>
import { useSettingsStore } from '@/store.js'
const emit = defineEmits([
  'update:override',
  'update:rounded',
  'update:borderSize',
  'update:borderColor',
  'update:background',
  'update:shadow',
  'update:padding',
])
const props = defineProps({
  noOverride: Boolean,
  override: Boolean,
  rounded: Number,
  borderSize: Number,
  borderColor: Array,
  background: Array,
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

const handleBorderSizeUpdate = (num) => {
  emit('update:borderSize', num < 1 ? 0 : num)
}

const handleBorderColorUpdate = (arr) => {
  emit('update:borderColor', arr)
}

const handleBgUpdate = (arr) => {
  emit('update:background', arr)
}

const handleShadowUpdate = (arr) => {
  emit('update:shadow', arr)
}

const handlePaddingUpdate = (num) => {
  emit('update:padding', num < 1 ? 0 : num)
}

const resetOverride = () => {
  emit('update:rounded', store.config.global.container.radius)
  emit('update:borderSize', store.config.global.container.borderSize)
  emit('update:borderColor', [...store.config.global.container.borderColor])
  emit('update:background', [...store.config.global.container.background])
  emit('update:shadow', [...store.config.global.container.shadow])
  emit('update:padding', store.config.global.container.padding)
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
          :model-value="props.borderSize"
          @update:model-value="handleBorderSizeUpdate"
        >
        </NumberField>
      </div>
      <div class="group stack">
        <label for="boxBc" class="desc"> Border color </label>
        <ColorField
          tag-id="boxBc"
          class="w8"
          :model-value="props.borderColor"
          @update:model-value="handleBorderColorUpdate"
        >
        </ColorField>
      </div>
      <div class="group stack">
        <label for="boxBg" class="desc"> Background </label>
        <ColorField tag-id="boxBg" class="w8" :model-value="props.background" @update:model-value="handleBgUpdate">
        </ColorField>
      </div>
      <div class="group stack">
        <label for="boxShadow" class="desc"> Shadow </label>
        <ColorField
          shadow
          tag-id="boxShadow"
          class="w8"
          :model-value="props.shadow"
          @update:model-value="handleShadowUpdate"
        >
        </ColorField>
      </div>
    </div>
  </div>
</template>
