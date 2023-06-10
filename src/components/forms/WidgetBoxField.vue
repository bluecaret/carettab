<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'

const props = defineProps({
  noOverride: Boolean,
  index: Number,
  widgetStore: String,
})

const store = useSettingsStore()
const widgetPrep = ref(null)
if (props.widgetStore === 'global') {
  widgetPrep.value = store.config.global.container
} else {
  widgetPrep.value = store.config[props.widgetStore][props.index].base.container
}
const widget = reactive(widgetPrep.value)
</script>

<template>
  <div class="block">
    <div class="group fill">
      <label class="label mra">Container box</label>
      <div v-if="!props.noOverride" class="group compact">
        <label for="overrideGlobalFont" class="desc">Override global styles</label>
        <ToggleField v-model="widget.override" tag-id="overrideGlobalFont"> </ToggleField>
      </div>
    </div>
    <div v-if="props.noOverride || widget.override" class="group fill">
      <div class="group stack">
        <label for="boxPadding" class="desc"> Padding </label>
        <NumberField v-model="widget.padding" tag-id="boxPadding" :increment="1" :min="0"> </NumberField>
      </div>
      <div class="group stack">
        <label for="boxRounded" class="desc"> Rounded </label>
        <NumberField v-model="widget.radius" tag-id="boxRounded" :increment="1" :min="0"> </NumberField>
      </div>
      <div class="group stack">
        <label for="boxBs" class="desc"> Border size </label>
        <NumberField v-model="widget.borderSize" tag-id="boxBs" :increment="1" :min="0"> </NumberField>
      </div>
      <div class="group stack">
        <label for="boxBc" class="desc"> Border color </label>
        <ColorField v-model="widget.borderColor" tag-id="boxBc" class="w8"> </ColorField>
      </div>
      <div class="group stack">
        <label for="boxBg" class="desc"> Background </label>
        <ColorField v-model="widget.background" tag-id="boxBg" class="w8"> </ColorField>
      </div>
      <div class="group stack">
        <label for="boxShadow" class="desc"> Shadow </label>
        <ColorField v-model="widget.shadow" shadow tag-id="boxShadow" class="w8"> </ColorField>
      </div>
    </div>
  </div>
</template>
