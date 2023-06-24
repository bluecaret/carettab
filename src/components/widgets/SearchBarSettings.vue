<script setup>
import { ref, reactive, inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { searchEngines } from '@/assets/lists.js'

const store = useSettingsStore()
const user = inject('user')

const widgetStore = 'searchBars'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
</script>

<template>
  <div class="page">
    <PageHeading title="Search bar" :widget-id="widget.id"></PageHeading>
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block">
        <label for="engine" class="label">Search engine</label>
        <select
          v-if="widget.customEngine && user.paid"
          id="engine"
          name="engine"
          class="select w20"
          disabled="disabled"
        >
          <option selected>Custom engine</option>
        </select>
        <select
          v-if="!widget.customEngine || !user.paid"
          id="engine"
          v-model="widget.engine"
          name="engine"
          class="select w20"
          :disabled="widget.customEngine && user.paid"
        >
          <option v-for="engine in searchEngines" :key="engine.id" :value="engine.id">{{ engine.label }}</option>
        </select>
      </div>
      <div class="block">
        <label for="custom" class="label">
          <div><PremiumLabel />Custom search engine</div>
        </label>
        <ToggleField id="custom" v-model="widget.customEngine" name="custom" :disabled="!user.paid"></ToggleField>
      </div>
      <div v-if="widget.customEngine && user.paid" class="block">
        <label for="customUrl" class="label">
          <div><PremiumLabel />Custom search engine URL</div>
        </label>
        <input
          v-if="widget.customEngine"
          id="customUrl"
          v-model="widget.customEngineUrl"
          type="text"
          name="customUrl"
          class="input w30"
          placeholder="https://www.google.com/search?q=%s"
        />
      </div>
      <div class="block">
        <label for="icon" class="label">Show engine name</label>
        <ToggleField id="icon" v-model="widget.engineLabel" name="icon"></ToggleField>
      </div>
      <div class="block">
        <label for="icon" class="label">
          <div><PremiumLabel />Show engine selection menu</div>
        </label>
        <ToggleField id="icon" v-model="widget.dropdown" name="icon" :disabled="!user.paid"></ToggleField>
      </div>
      <div class="block">
        <label for="label" class="label">Placeholder text</label>
        <input id="label" v-model="widget.label" type="text" name="label" class="input w20" />
      </div>
      <div class="block">
        <label for="autocomplete" class="label">Allow browser autocomplete</label>
        <ToggleField id="autocomplete" v-model="widget.autocomplete" name="autocomplete"></ToggleField>
      </div>
      <div class="block">
        <label for="icon" class="label">Show search icon</label>
        <ToggleField id="icon" v-model="widget.icon" name="icon"></ToggleField>
      </div>
      <FieldAccordion>
        <template #label>
          <div class="label">Search bar styles</div>
        </template>
        <template #children>
          <div class="block">
            <label for="colorOverride" class="label">Override colors</label>
            <ToggleField v-model="widget.overrideColors" tag-id="colorOverride"></ToggleField>
          </div>
          <div class="block">
            <label for="size" class="label">Width</label>
            <NumberField id="size" v-model="widget.size" name="size" :min="0" :step="1" class="w10"></NumberField>
          </div>
          <div class="block">
            <label for="padding" class="label">Padding</label>
            <NumberField
              id="padding"
              v-model="widget.padding"
              name="padding"
              :min="0"
              :step="1"
              class="w10"
            ></NumberField>
          </div>
          <div v-if="widget.overrideColors" class="block">
            <label for="bg" class="label">Background</label>
            <ColorField id="bg" v-model="widget.background" name="bg" class="w20"></ColorField>
          </div>
          <div v-if="widget.overrideColors" class="block">
            <label for="bs" class="label">Shadow</label>
            <ColorField id="bs" v-model="widget.boxShadow" shadow name="bs" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="bradius" class="label">Rounded corners</label>
            <NumberField
              id="bradius"
              v-model="widget.radius"
              name="bradius"
              :min="0"
              :step="1"
              class="w10"
            ></NumberField>
          </div>
          <div class="block">
            <label for="bsize" class="label">Border size</label>
            <NumberField
              id="bsize"
              v-model="widget.borderSize"
              name="bsize"
              :min="0"
              :step="1"
              class="w10"
            ></NumberField>
          </div>
          <div class="block">
            <label for="bbottom" class="label">Bottom border only</label>
            <ToggleField id="bbottom" v-model="widget.borderBottom" name="bbottom"></ToggleField>
          </div>
          <div v-if="widget.overrideColors" class="block">
            <label for="bc" class="label">Border color</label>
            <ColorField id="bc" v-model="widget.borderColor" name="bc" class="w20"></ColorField>
          </div>
        </template>
      </FieldAccordion>
    </div>
  </div>
</template>
