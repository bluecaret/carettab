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
        v-model:width="widget.base.width"
        v-model:height="widget.base.height"
        v-model:autoSize="widget.base.autoSize"
        v-model:align="widget.base.alignment"
        v-model:calign="widget.base.container.alignment"
        v-model:x="widget.base.x"
        v-model:y="widget.base.y"
      >
      </SizeAndPositionField>
      <WidgetFontField
        v-model:override="widget.base.font.override"
        v-model:cl="widget.base.font.color"
        v-model:fs="widget.base.font.size"
        v-model:fb="widget.base.font.bold"
        v-model:fi="widget.base.font.italic"
        v-model:fu="widget.base.font.underline"
        v-model:ls="widget.base.font.letterSpacing"
        v-model:ts="widget.base.font.shadow"
        v-model:tt="widget.base.font.transform"
        v-model:ff="widget.base.font.family"
      >
      </WidgetFontField>
      <WidgetBoxField
        v-model:override="widget.base.container.override"
        v-model:rounded="widget.base.container.radius"
        v-model:bs="widget.base.container.borderSize"
        v-model:bc="widget.base.container.borderColor"
        v-model:bg="widget.base.container.background"
        v-model:shadow="widget.base.container.shadow"
        v-model:padding="widget.base.container.padding"
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
          <div class="group stack w10">
            <label for="size" class="desc">Width</label>
            <NumberField id="size" v-model="widget.size" name="size" :min="0" :step="1"></NumberField>
          </div>
          <div class="group stack w10">
            <label for="padding" class="desc">Padding</label>
            <NumberField id="padding" v-model="widget.padding" name="padding" :min="0" :step="1"></NumberField>
          </div>
          <div class="group stack w10">
            <label for="bradius" class="desc">Rounded</label>
            <NumberField id="bradius" v-model="widget.radius" name="bradius" :min="0" :step="1"></NumberField>
          </div>
          <div class="group stack w10">
            <label for="bsize" class="desc">Border size</label>
            <NumberField id="bsize" v-model="widget.borderSize" name="bsize" :min="0" :step="1"></NumberField>
          </div>
          <div class="group stack">
            <label for="bbottom" class="desc">Bottom border</label>
            <ToggleField id="bbottom" v-model="widget.borderBottom" name="bbottom"></ToggleField>
          </div>
        </div>
        <div class="group fill">
          <div class="group stack fill">
            <label for="color" class="desc">Color</label>
            <ColorField id="color" v-model="widget.color" name="color"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="bg" class="desc">Background</label>
            <ColorField id="bg" v-model="widget.background" name="bg"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="bc" class="desc">Border</label>
            <ColorField id="bc" v-model="widget.borderColor" name="bc"></ColorField>
          </div>
          <div class="group stack fill">
            <label for="ts" class="desc">Text shadow</label>
            <ColorField id="ts" v-model="widget.shadow" shadow name="ts" text></ColorField>
          </div>
          <div class="group stack fill">
            <label for="bs" class="desc">Bar shadow</label>
            <ColorField id="bs" v-model="widget.boxShadow" shadow name="bs"></ColorField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
