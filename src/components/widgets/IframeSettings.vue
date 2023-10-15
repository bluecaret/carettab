<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()

const widgetStore = 'iframes'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
</script>

<template>
  <PageHeading title="IFrame" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" no-container-alignment container-title="Iframe size" />
    </div>
    <div class="blockContainer">
      <div class="block stack">
        <div class="label">NOTE:</div>
        <div class="paragraph">
          Due to security policies set by websites, some URLs may not be embeddable in the IFrame widget. In addition,
          there is no guarantee a website will display correctly inside an IFrame depending on the size the IFrame is
          set to.
        </div>
      </div>
      <div class="block">
        <label for="text" class="label">{{ $t('widget.urlAddress') }}</label>
        <input id="text" v-model="widget.url" type="text" name="text" class="input w30" placeholder="https://" />
      </div>
    </div>
  </div>
</template>
