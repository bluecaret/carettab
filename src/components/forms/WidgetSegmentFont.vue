<script setup>
const emit = defineEmits([
  'update:override',
  'update:color',
  'update:shadow',
  'update:size',
  'update:letterSpacing',
  'update:x',
  'update:y',
])
const props = defineProps({
  type: String,
  widget: Object,
  override: Boolean,
  color: Array,
  shadow: Array,
  size: Number,
  letterSpacing: Number,
  x: Number,
  y: Number,
})

const handleOverrideUpdate = (bool) => {
  emit('update:override', bool)
  resetOverride()
}

const handleClUpdate = (arr) => {
  emit('update:color', arr)
}

const handleTsUpdate = (arr) => {
  emit('update:shadow', arr)
}

const handleFsUpdate = (num) => {
  emit('update:size', num)
}

const handleLsUpdate = (num) => {
  emit('update:letterSpacing', num)
}

const handleOxUpdate = (num) => {
  emit('update:x', num)
}

const handleOyUpdate = (num) => {
  emit('update:y', num)
}

const resetOverride = () => {
  emit('update:size', props.widget.base.font.size)
  emit('update:letterSpacing', props.widget.base.font.letterSpacing)
}
</script>

<template>
  <div class="block">
    <div class="label mra">
      <label :for="`${type}-override`">{{ $t('settings.overrideWidgetStyles') }}</label>
      <div class="desc">{{ $t('settings.changeTheColorFontSizeAndPositionForThisElement') }}</div>
    </div>
    <ToggleField :tag-id="`${type}-override`" :model-value="props.override" @update:model-value="handleOverrideUpdate">
    </ToggleField>
  </div>
  <div v-if="props.override" class="block">
    <label :for="`${type}-offsetY`" class="label mra"> Offset Y </label>
    <NumberField
      class="w10"
      :tag-id="`${type}-offsetY`"
      :increment="1"
      :model-value="props.y"
      @update:model-value="handleOyUpdate"
    ></NumberField>
  </div>
  <div v-if="props.override" class="block">
    <label :for="`${type}-offsetX`" class="label mra"> Offset X </label>
    <NumberField
      class="w10"
      :tag-id="`${type}-offsetX`"
      :increment="1"
      :model-value="props.x"
      @update:model-value="handleOxUpdate"
    ></NumberField>
  </div>
  <div v-if="props.override" class="block">
    <label :for="`${type}-fontSize`" class="label mra"> {{ $t('common.size') }} </label>
    <NumberField
      class="w10"
      :tag-id="`${type}-fontSize`"
      :increment="1"
      :model-value="props.size"
      @update:model-value="handleFsUpdate"
    ></NumberField>
  </div>
  <div v-if="props.override" class="block">
    <label :for="`${type}-letterSpacing`" class="label mra"> {{ $t('settings.letterSpacing') }} </label>
    <NumberField
      class="w10"
      :tag-id="`${type}-letterSpacing`"
      :increment="0.2"
      :model-value="props.letterSpacing"
      @update:model-value="handleLsUpdate"
    ></NumberField>
  </div>
  <div v-if="props.override" class="block">
    <label :for="`${type}-fontColor`" class="label mra"> {{ $t('common.color') }} </label>
    <ColorField
      :tag-id="`${type}-fontColor`"
      :model-value="props.color"
      class="w20"
      @update:model-value="handleClUpdate"
    >
    </ColorField>
  </div>
  <div v-if="props.override" class="block">
    <label :for="`${type}-fontColor`" class="label mra"> {{ $t('common.shadow') }} </label>
    <ColorField
      class="w20"
      shadow
      text
      :tag-id="`${type}-fontShadow`"
      :model-value="props.shadow"
      @update:model-value="handleTsUpdate"
    >
    </ColorField>
  </div>
</template>
