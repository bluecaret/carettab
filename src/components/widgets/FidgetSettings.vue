<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()

const widgetStore = 'fidgets'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
</script>

<template>
  <PageHeading title="Fidget" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block">
        <label for="fidgetType" class="label">{{ $t('widget.type') }}</label>
        <select id="fidgetType" v-model="widget.type" class="select w25" name="fidgetType">
          <option value="bubblewrap">Bubble Wrap</option>
        </select>
      </div>
    </div>
  </div>
</template>
