<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'
import { fontList, fontWeight, textTransform } from '@/assets/lists.js'

const props = defineProps({
  noOverride: Boolean,
  index: Number,
  widgetStore: String,
})

const store = useSettingsStore()
const widgetPrep = ref(null)
if (props.widgetStore === 'global') {
  widgetPrep.value = store.config.global.font
} else {
  widgetPrep.value = store.config[props.widgetStore][props.index].base.font
}
const widget = reactive(widgetPrep.value)

const updateFamily = (family) => {
  widget.family = family.label
}
</script>

<template>
  <div class="block">
    <div class="group fill">
      <label class="label mra">Font</label>
      <div v-if="!props.noOverride" class="group compact">
        <label for="fontSize" class="desc"> Size </label>
        <NumberField
          v-model="widget.size"
          tag-id="fontSize"
          class="w8"
          aria-label="Font size"
          :increment="1"
          :min="1"
        ></NumberField>
      </div>
      <div v-if="!props.noOverride" class="group compact">
        <label for="overrideGlobalFont" class="desc">Override global</label>
        <ToggleField v-model="widget.override" tag-id="overrideGlobalFont"> </ToggleField>
      </div>
    </div>
    <div v-if="props.noOverride || widget.override" class="group fill">
      <div class="group stack fill">
        <label for="fontFamily" class="desc"> Font </label>
        <AutocompleteField
          left
          fonts
          tag-id="test"
          use-label
          allow-custom
          :list="fontList"
          :selected="widget.family"
          @selected="(item) => updateFamily(item)"
        ></AutocompleteField>
      </div>
      <div class="group stack">
        <label for="widgetLetterSpacing" class="desc"> Letter spacing </label>
        <NumberField
          v-model="widget.letterSpacing"
          tag-id="widgetLetterSpacing"
          class="w12"
          aria-label="Letter spacing"
          :increment="0.2"
        >
        </NumberField>
      </div>
    </div>
    <div v-if="props.noOverride || widget.override" class="group fill">
      <div class="group stack fill">
        <label for="fontBold" class="desc"> Weight </label>
        <select id="fontBold" v-model="widget.bold" name="fontBold" class="select">
          <option v-for="wgt in fontWeight" :key="wgt.id" :value="wgt.id">
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
            :class="{ active: widget.italic }"
            @click="widget.italic = !widget.italic"
          >
            <fa icon="fa-italic" fixed-width></fa>
          </button>
          <button
            id="togglePosition"
            aria-label="Underline"
            class="btn"
            type="button"
            :class="{ active: widget.underline }"
            @click="widget.underline = !widget.underline"
          >
            <fa icon="fa-underline" fixed-width></fa>
          </button>
        </div>
      </div>
      <div class="group stack fill">
        <label for="textTranform" class="desc"> Case </label>
        <select id="textTranform" v-model="widget.transform" name="textTranform" class="select">
          <option v-for="opt in textTransform" :key="opt.id" :value="opt.id">
            {{ opt.label }}
          </option>
        </select>
      </div>
      <div class="group stack">
        <label for="widgetFontColor" class="desc"> Color </label>
        <ColorField v-model="widget.color" tag-id="widgetFontColor" class="w8"> </ColorField>
      </div>
      <div class="group stack">
        <label for="widgetFontShadow" class="desc"> Shadow </label>
        <ColorField v-model="widget.shadow" shadow text tag-id="widgetFontShadow" class="w8"> </ColorField>
      </div>
    </div>
  </div>
</template>
