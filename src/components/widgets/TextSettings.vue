<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()

const widgetStore = 'texts'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
</script>

<template>
  <PageHeading title="Text" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block">
        <label for="text" class="label">{{ $t('widget.text') }}</label>
        <input
          id="text"
          v-model="widget.text"
          type="text"
          name="text"
          class="input w30"
          :placeholder="$t('widget.enterText')"
        />
      </div>
    </div>
  </div>
</template>
