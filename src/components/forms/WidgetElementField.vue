<script setup>
import { useSettingsStore } from '@/store.js'
const emit = defineEmits([
  'update:override',
  'update:primaryColor',
  'update:secondaryColor',
  'update:tertiaryColor',
  'update:shadow',
])
const props = defineProps({
  noOverride: Boolean,
  override: Boolean,
  primary: Array,
  secondary: Array,
  tertiary: Array,
  shadow: Array,
})

const store = useSettingsStore()

const handleOverrideUpdate = (bool) => {
  emit('update:override', bool)
  resetOverride()
}

const handlePclUpdate = (arr) => {
  emit('update:primaryColor', arr)
}

const handleSclUpdate = (arr) => {
  emit('update:secondaryColor', arr)
}

const handleTclUpdate = (arr) => {
  emit('update:tertiaryColor', arr)
}

const handleShUpdate = (arr) => {
  emit('update:shadow', arr)
}

const resetOverride = () => {
  emit('update:primaryColor', [...store.config.global.element.primaryColor])
  emit('update:secondaryColor', [...store.config.global.element.secondaryColor])
  emit('update:tertiaryColor', [...store.config.global.element.tertiaryColor])
  emit('update:shadow', [...store.config.global.element.shadow])
}
</script>

<template>
  <div class="block">
    <div class="group fill">
      <label class="label mra">{{ $t('settings.containerBox') }}</label>
      <div v-if="!props.noOverride" class="group compact">
        <label for="overrideGlobalFont" class="desc">{{ $t('common.overrideGlobal') }}</label>
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
        <label for="elPcl" class="desc">{{ $t('settings.primaryColor') }}</label>
        <ColorField tag-id="elPcl" class="w8" :model-value="props.primaryColor" @update:model-value="handlePclUpdate">
        </ColorField>
      </div>
      <div class="group stack">
        <label for="elScl" class="desc">{{ $t('settings.secondaryColor') }}</label>
        <ColorField tag-id="elScl" class="w8" :model-value="props.secondaryColor" @update:model-value="handleSclUpdate">
        </ColorField>
      </div>
      <div class="group stack">
        <label for="elTcl" class="desc">{{ $t('settings.tertiaryColor') }}</label>
        <ColorField tag-id="elTcl" class="w8" :model-value="props.tertiaryColor" @update:model-value="handleTclUpdate">
        </ColorField>
      </div>
      <div class="group stack">
        <label for="elShadow" class="desc">{{ $t('common.shadow') }}</label>
        <ColorField
          shadow
          tag-id="elShadow"
          class="w8"
          :model-value="props.shadow"
          @update:model-value="handleShUpdate"
        >
        </ColorField>
      </div>
    </div>
  </div>
</template>
