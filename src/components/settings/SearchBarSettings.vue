<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'
import { searchEngines } from '@/assets/lists.js'

const store = useSettingsStore()

const ci = ref(store.config.searchBars.findIndex((c) => c.id === store.editing))
const widget = reactive(store.config.searchBars[ci.value])
</script>

<template>
  <div class="page">
    <PageHeading title="Search bar" :widget-id="widget.id"></PageHeading>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField
        v-model:width="widget.w.w"
        v-model:height="widget.w.h"
        v-model:autoSize="widget.w.as"
        v-model:align="widget.w.a"
        v-model:calign="widget.w.ca"
        v-model:x="widget.w.x"
        v-model:y="widget.w.y"
      >
      </SizeAndPositionField>
      <WidgetFontField
        v-model:override="widget.w.orf"
        v-model:cl="widget.w.cl"
        v-model:fs="widget.w.fs"
        v-model:fb="widget.w.fb"
        v-model:fi="widget.w.fi"
        v-model:fu="widget.w.fu"
        v-model:ls="widget.w.ls"
        v-model:ts="widget.w.ts"
        v-model:tt="widget.w.tt"
        v-model:ff="widget.w.ff"
      >
      </WidgetFontField>
      <WidgetBoxField
        v-model:override="widget.w.cor"
        v-model:rounded="widget.w.crd"
        v-model:bs="widget.w.cbs"
        v-model:bc="widget.w.cbc"
        v-model:bg="widget.w.cbg"
        v-model:shadow="widget.w.csh"
        v-model:padding="widget.w.cpd"
      >
      </WidgetBoxField>
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
            <ToggleField id="custom" v-model="widget.ce" name="custom"></ToggleField>
          </div>
          <select v-if="!widget.ce" id="engine" v-model="widget.en" name="engine" class="select w25">
            <option v-for="engine in searchEngines" :key="engine.id" :value="engine.id">{{ engine.label }}</option>
          </select>
          <input
            v-if="widget.ce"
            id="engine"
            v-model="widget.ceu"
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
          <input id="label" v-model="widget.lb" type="text" name="label" class="input w25" />
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <label for="searchOptions" class="label mra">Search options</label>
          <div class="group stack">
            <label for="autocomplete" class="desc">Autocomplete</label>
            <ToggleField id="autocomplete" v-model="widget.ac" name="autocomplete"></ToggleField>
          </div>
          <div class="group stack">
            <label for="icon" class="desc">Search icon</label>
            <ToggleField id="icon" v-model="widget.ic" name="icon"></ToggleField>
          </div>
          <div class="group stack">
            <label for="icon" class="desc">Engine name</label>
            <ToggleField id="icon" v-model="widget.el" name="icon"></ToggleField>
          </div>
          <div class="group stack">
            <label for="icon" class="desc">Engine selection</label>
            <ToggleField id="icon" v-model="widget.ed" name="icon"></ToggleField>
          </div>
        </div>
      </div>
      <div class="block">
        <label for="colors" class="label mra">Bar</label>
        <div class="group fill">
          <div class="group stack w10">
            <label for="size" class="desc">Width</label>
            <NumberField id="size" v-model="widget.sz" name="size" :min="0" :step="1"></NumberField>
          </div>
          <div class="group stack w10">
            <label for="padding" class="desc">Padding</label>
            <NumberField id="padding" v-model="widget.pd" name="padding" :min="0" :step="1"></NumberField>
          </div>
          <div class="group stack w10">
            <label for="bradius" class="desc">Rounded</label>
            <NumberField id="bradius" v-model="widget.br" name="bradius" :min="0" :step="1"></NumberField>
          </div>
          <div class="group stack w10">
            <label for="bsize" class="desc">Border size</label>
            <NumberField id="bsize" v-model="widget.bsz" name="bsize" :min="0" :step="1"></NumberField>
          </div>
          <div class="group stack">
            <label for="bbottom" class="desc">Bottom border</label>
            <ToggleField id="bbottom" v-model="widget.bb" name="bbottom"></ToggleField>
          </div>
        </div>
        <div class="group fill">
          <div class="group stack fill">
            <label for="color" class="desc">Color</label>
            <ColorPickerField id="color" v-model="widget.cl" name="color"></ColorPickerField>
          </div>
          <div class="group stack fill">
            <label for="bg" class="desc">Background</label>
            <ColorPickerField id="bg" v-model="widget.bg" name="bg"></ColorPickerField>
          </div>
          <div class="group stack fill">
            <label for="bc" class="desc">Border</label>
            <ColorPickerField id="bc" v-model="widget.bc" name="bc"></ColorPickerField>
          </div>
          <div class="group stack fill">
            <label for="ts" class="desc">Text shadow</label>
            <ShadowField id="ts" v-model="widget.ts" name="ts" text></ShadowField>
          </div>
          <div class="group stack fill">
            <label for="bs" class="desc">Bar shadow</label>
            <ShadowField id="bs" v-model="widget.bs" name="bs"></ShadowField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
