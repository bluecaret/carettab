<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()

const widgetStore = 'texts'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
</script>

<template>
  <div class="page">
    <PageHeading title="Text" :widget-id="widget.id"></PageHeading>
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block">
        <label for="text" class="label">Text</label>
        <input id="text" v-model="widget.text" type="text" name="text" class="input w30" placeholder="Enter text..." />
      </div>
    </div>
  </div>
</template>
