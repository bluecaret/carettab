<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'
import { searchEngines } from '@/assets/lists.js'

const store = useSettingsStore()

const widgetStore = 'searchBars'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
</script>

<template>
  <div class="page">
    <PageHeading title="Search bar" :widget-id="widget.id"></PageHeading>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
    </div>
    <h3 class="subtitle">Search bar options</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <label for="engine" class="label mra">Engine</label>
          <div class="group compact">
            <label for="custom" class="desc">
              <div><PremiumLabel />Custom</div>
            </label>
            <ToggleField id="custom" v-model="widget.customEngine" name="custom"></ToggleField>
          </div>
          <select v-if="!widget.customEngine" id="engine" v-model="widget.engine" name="engine" class="select w25">
            <option v-for="engine in searchEngines" :key="engine.id" :value="engine.id">{{ engine.label }}</option>
          </select>
          <input
            v-if="widget.customEngine"
            id="engine"
            v-model="widget.customEngineUrl"
            type="text"
            name="engine"
            class="input w25"
            placeholder="https://www.google.com/search?q=%s"
          />
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <label for="label" class="label mra">Placeholder</label>
          <input id="label" v-model="widget.label" type="text" name="label" class="input w25" />
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <label for="searchOptions" class="label mra">Search options</label>
          <div class="group stack">
            <label for="autocomplete" class="desc">Autocomplete</label>
            <ToggleField id="autocomplete" v-model="widget.autocomplete" name="autocomplete"></ToggleField>
          </div>
          <div class="group stack">
            <label for="icon" class="desc">Search icon</label>
            <ToggleField id="icon" v-model="widget.icon" name="icon"></ToggleField>
          </div>
          <div class="group stack">
            <label for="icon" class="desc">Engine name</label>
            <ToggleField id="icon" v-model="widget.engineLabel" name="icon"></ToggleField>
          </div>
          <div class="group stack">
            <label for="icon" class="desc">Engine selection</label>
            <ToggleField id="icon" v-model="widget.dropdown" name="icon"></ToggleField>
          </div>
        </div>
      </div>
      <div class="block">
        <label for="colors" class="label mra">Bar</label>
        <div class="group fill">
          <div class="group stack fill">
            <label for="size" class="desc">Width</label>
            <NumberField id="size" v-model="widget.size" name="size" :min="0" :step="1"></NumberField>
          </div>
          <div class="group stack fill">
            <label for="padding" class="desc">Padding</label>
            <NumberField id="padding" v-model="widget.padding" name="padding" :min="0" :step="1"></NumberField>
          </div>
          <div class="group stack fill">
            <label for="bradius" class="desc">Rounded</label>
            <NumberField id="bradius" v-model="widget.radius" name="bradius" :min="0" :step="1"></NumberField>
          </div>
          <div class="group stack fill">
            <label for="bsize" class="desc">Border size</label>
            <NumberField id="bsize" v-model="widget.borderSize" name="bsize" :min="0" :step="1"></NumberField>
          </div>
        </div>
        <div class="group fill">
          <div class="group stack fit">
            <label for="bbottom" class="desc fit">Bottom border</label>
            <ToggleField id="bbottom" v-model="widget.borderBottom" name="bbottom"></ToggleField>
          </div>
          <div class="group stack fit">
            <label for="colorOverride" class="desc fit">Override colors</label>
            <ToggleField v-model="widget.overrideColors" tag-id="colorOverride"></ToggleField>
          </div>
          <div v-if="widget.overrideColors" class="group stack fill">
            <label for="bg" class="desc">Background</label>
            <ColorField id="bg" v-model="widget.background" name="bg"></ColorField>
          </div>
          <div v-if="widget.overrideColors" class="group stack fill">
            <label for="bc" class="desc">Border</label>
            <ColorField id="bc" v-model="widget.borderColor" name="bc"></ColorField>
          </div>
          <div v-if="widget.overrideColors" class="group stack fill">
            <label for="bs" class="desc">Bar shadow</label>
            <ColorField id="bs" v-model="widget.boxShadow" shadow name="bs"></ColorField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
