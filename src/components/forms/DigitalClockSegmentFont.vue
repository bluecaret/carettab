<script setup>
const emit = defineEmits([
  'update:override',
  'update:cl',
  'update:ts',
  'update:fs',
  'update:ls',
  'update:ox',
  'update:oy',
])
const props = defineProps({
  type: String,
  clock: Object,
  override: Boolean,
  cl: Array,
  ts: Array,
  fs: Number,
  ls: Number,
  ox: Number,
  oy: Number,
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
  emit('update:ox', num)
}

const handleOyUpdate = (num) => {
  emit('update:oy', num)
}

const resetOverride = () => {
  emit('update:cl', props.clock.w.cl)
  emit('update:ts', props.clock.w.ts)
  emit('update:fs', props.clock.w.fs)
  emit('update:ls', props.clock.w.ls)
  emit('update:ox', 0)
  emit('update:oy', 0)
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
          :model-value="props.ox"
          @update:model-value="handleOxUpdate"
        ></NumberField>
      </div>
      <div class="group stack w9">
        <label :for="`${type}-offsetY`" class="desc"> Offset Y </label>
        <NumberField
          :tag-id="`${type}-offsetY`"
          :increment="1"
          :model-value="props.oy"
          @update:model-value="handleOyUpdate"
        ></NumberField>
      </div>
      <div class="group stack w9">
        <label :for="`${type}-fontSize`" class="desc"> Size </label>
        <NumberField
          :tag-id="`${type}-fontSize`"
          :increment="1"
          :model-value="props.fs"
          @update:model-value="handleFsUpdate"
        ></NumberField>
      </div>
      <div class="group stack">
        <label :for="`${type}-letterSpacing`" class="desc"> Letter spacing </label>
        <NumberField
          :tag-id="`${type}-letterSpacing`"
          :increment="0.2"
          :model-value="props.ls"
          @update:model-value="handleLsUpdate"
        ></NumberField>
      </div>
      <div class="group stack w6">
        <label :for="`${type}-fontColor`" class="desc"> Color </label>
        <ColorField :tag-id="`${type}-fontColor`" :model-value="props.cl" @update:model-value="handleClUpdate">
        </ColorField>
      </div>
      <div class="group stack w6">
        <label :for="`${type}-fontColor`" class="desc"> Shadow </label>
        <ShadowField text :tag-id="`${type}-fontShadow`" :model-value="props.ts" @update:model-value="handleTsUpdate">
        </ShadowField>
      </div>
    </div>
  </div>
</template>
