<script setup>
const emit = defineEmits([
  'update:override',
  'update:cl',
  'update:ts',
  'update:fs',
  'update:ls',
  'update:x',
  'update:y',
])
const props = defineProps({
  type: String,
  widget: Object,
  override: Boolean,
  cl: Array,
  ts: Array,
  fs: Number,
  ls: Number,
  x: Number,
  y: Number,
})

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

const handleFsUpdate = (num) => {
  emit('update:fs', num)
}

const handleLsUpdate = (num) => {
  emit('update:ls', num)
}

const handleOxUpdate = (num) => {
  emit('update:x', num)
}

const handleOyUpdate = (num) => {
  emit('update:y', num)
}

const resetOverride = () => {
  emit('update:cl', props.widget.base.font.color)
  emit('update:ts', props.widget.base.font.shadow)
  emit('update:fs', props.widget.base.font.size)
  emit('update:ls', props.widget.base.font.letterSpacing)
  emit('update:x', 0)
  emit('update:y', 0)
}
</script>

<template>
  <div class="block">
    <div class="group fill">
      <div class="label">
        <label>Override widget styles</label>
        <div class="desc">Change the color, font size, and position for this element.</div>
      </div>
      <div class="group mla">
        <ToggleField
          :tag-id="`${type}-override`"
          :model-value="props.override"
          @update:model-value="handleOverrideUpdate"
        >
        </ToggleField>
      </div>
    </div>
    <div v-if="props.override" class="group fill">
      <div class="group stack w9">
        <label :for="`${type}-offsetX`" class="desc"> Offset X </label>
        <NumberField
          :tag-id="`${type}-offsetX`"
          :increment="1"
          :model-value="props.x"
          @update:model-value="handleOxUpdate"
        ></NumberField>
      </div>
      <div class="group stack w9">
        <label :for="`${type}-offsetY`" class="desc"> Offset Y </label>
        <NumberField
          :tag-id="`${type}-offsetY`"
          :increment="1"
          :model-value="props.y"
          @update:model-value="handleOyUpdate"
        ></NumberField>
      </div>
      <div class="group stack w9">
        <label :for="`${type}-fontSize`" class="desc"> Size </label>
        <NumberField
          :tag-id="`${type}-fontSize`"
          :increment="1"
          :model-value="props.size"
          @update:model-value="handleFsUpdate"
        ></NumberField>
      </div>
      <div class="group stack">
        <label :for="`${type}-letterSpacing`" class="desc"> Letter spacing </label>
        <NumberField
          :tag-id="`${type}-letterSpacing`"
          :increment="0.2"
          :model-value="props.letterSpacing"
          @update:model-value="handleLsUpdate"
        ></NumberField>
      </div>
      <div class="group stack w6">
        <label :for="`${type}-fontColor`" class="desc"> Color </label>
        <ColorField :tag-id="`${type}-fontColor`" :model-value="props.color" @update:model-value="handleClUpdate">
        </ColorField>
      </div>
      <div class="group stack w6">
        <label :for="`${type}-fontColor`" class="desc"> Shadow </label>
        <ColorField
          shadow
          text
          :tag-id="`${type}-fontShadow`"
          :model-value="props.shadow"
          @update:model-value="handleTsUpdate"
        >
        </ColorField>
      </div>
    </div>
  </div>
</template>
