<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()

const widgetStore = 'todos'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
</script>

<template>
  <div class="page">
    <PageHeading title="Todo" :widget-id="widget.id"></PageHeading>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField :index="ci" :widget-store="widgetStore" />
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
      <div class="block">
        <div class="group fill">
          <label for="text" class="label mra">Text</label>
        </div>
      </div>
    </div>
  </div>
</template>
