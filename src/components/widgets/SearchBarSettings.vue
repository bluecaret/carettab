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
  <PageHeading title="Search bar" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block">
        <label for="engine" class="label">{{ $t('widget.searchEngine') }}</label>
        <select v-if="widget.customEngine" id="engine" name="engine" class="select w20" disabled="disabled">
          <option selected>{{ $t('widget.customEngine') }}</option>
        </select>
        <select
          v-if="!widget.customEngine"
          id="engine"
          v-model="widget.engine"
          name="engine"
          class="select w20"
          :disabled="widget.customEngine"
        >
          <option v-for="engine in searchEngines" :key="engine.id" :value="engine.id">{{ engine.label }}</option>
        </select>
      </div>
      <div class="block">
        <label for="custom" class="label">
          <div>{{ $t('widget.customSearchEngine') }}</div>
        </label>
        <ToggleField id="custom" v-model="widget.customEngine" name="custom"></ToggleField>
      </div>
      <div v-if="widget.customEngine" class="block">
        <label for="customUrl" class="label">
          <div>{{ $t('widget.customSearchEngineUrl') }}</div>
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
        <label for="icon" class="label">{{ $t('widget.showEngineName') }}</label>
        <ToggleField id="icon" v-model="widget.engineLabel" name="icon"></ToggleField>
      </div>
      <div class="block">
        <label for="icon" class="label">
          <div>{{ $t('widget.showEngineSelectionMenu') }}</div>
        </label>
        <ToggleField id="icon" v-model="widget.dropdown" name="icon"></ToggleField>
      </div>
      <div class="block">
        <label for="label" class="label">{{ $t('widget.placeholderText') }}</label>
        <input id="label" v-model="widget.label" type="text" name="label" class="input w20" />
      </div>
      <div class="block">
        <label for="autocomplete" class="label">{{ $t('widget.allowBrowserAutocomplete') }}</label>
        <ToggleField id="autocomplete" v-model="widget.autocomplete" name="autocomplete"></ToggleField>
      </div>
      <div class="block">
        <label for="icon" class="label">{{ $t('widget.showSearchIcon') }}</label>
        <ToggleField id="icon" v-model="widget.icon" name="icon"></ToggleField>
      </div>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.searchBarStyles') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="colorOverride" class="label">{{ $t('widget.overrideColors') }}</label>
            <ToggleField v-model="widget.overrideColors" tag-id="colorOverride"></ToggleField>
          </div>
          <div class="block">
            <label for="padding" class="label">{{ $t('common.padding') }}</label>
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
            <label for="bg" class="label">{{ $t('common.background') }}</label>
            <ColorField id="bg" v-model="widget.background" name="bg" class="w20"></ColorField>
          </div>
          <div v-if="widget.overrideColors" class="block">
            <label for="bs" class="label">{{ $t('common.shadow') }}</label>
            <ColorField id="bs" v-model="widget.boxShadow" shadow name="bs" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="bradius" class="label">{{ $t('widget.roundedCorners') }}</label>
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
            <label for="bsize" class="label">{{ $t('common.borderSize') }}</label>
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
            <label for="bbottom" class="label">{{ $t('widget.bottomBorderOnly') }}</label>
            <ToggleField id="bbottom" v-model="widget.borderBottom" name="bbottom"></ToggleField>
          </div>
          <div v-if="widget.overrideColors" class="block">
            <label for="bc" class="label">{{ $t('common.borderColor') }}</label>
            <ColorField id="bc" v-model="widget.borderColor" name="bc" class="w20"></ColorField>
          </div>
        </template>
      </FieldAccordion>
    </div>
  </div>
</template>
