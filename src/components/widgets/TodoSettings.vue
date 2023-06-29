<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()

const widgetStore = 'todos'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
</script>

<template>
  <PageHeading title="Todo" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block">
        <label for="labelOn" class="label">{{ $t('widget.enableLabel') }}</label>
        <ToggleField v-model="widget.label.on" tag-id="labelOn" />
      </div>
      <div v-if="widget.label.on" class="block">
        <label for="labelText" class="label">{{ $t('widget.labelText') }}</label>
        <input id="labelText" v-model="widget.label.label" type="text" class="input w20" />
      </div>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.completedTasks') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="strike" class="label">{{ $t('widget.strikethrough') }}</label>
            <ToggleField v-model="widget.done.strikethrough" tag-id="strike" />
          </div>
          <div class="block">
            <label for="override" class="label">{{ $t('widget.overrideColors') }}</label>
            <ToggleField v-model="widget.done.overrideColor" tag-id="override" />
          </div>
          <div v-if="widget.done.overrideColor" class="block">
            <label for="doneColor" class="label">{{ $t('common.color') }}</label>
            <ColorField v-model="widget.done.color" tag-id="doneColor" class="w20" />
          </div>
        </template>
      </FieldAccordion>
    </div>
  </div>
</template>
