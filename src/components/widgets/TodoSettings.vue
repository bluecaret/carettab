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
          <label for="text" class="label mra">Label</label>
          <ToggleField v-model="widget.label.on" tag-id="labelOn" />
          <input
            v-if="widget.label.on"
            v-model="widget.label.label"
            type="text"
            class="input w20"
            aria-label="Label text"
          />
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <label for="text" class="label mra">Complete tasks</label>
          <div class="group compact">
            <label for="strike" class="desc">Strikethrough</label>
            <ToggleField v-model="widget.done.strikethrough" tag-id="strike" />
          </div>
          <div class="group compact">
            <label for="override" class="desc">Override color</label>
            <ToggleField v-model="widget.done.overrideColor" tag-id="override" />
          </div>
          <div v-if="widget.done.overrideColor" class="group compact">
            <label for="doneColor" class="desc">Color</label>
            <ColorField v-model="widget.done.color" tag-id="doneColor" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
