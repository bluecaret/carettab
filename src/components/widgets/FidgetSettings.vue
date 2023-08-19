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
          <option value="spinner">{{ $t('widget.spinner') }}</option>
          <option value="bubblewrap">{{ $t('widget.bubbleWrap') }}</option>
        </select>
      </div>
      <div class="block">
        <label for="overrideColors" class="label">{{ $t('widget.overrideColors') }}</label>
        <ToggleField v-model="widget.overrideColors" tag-id="overrideColors"></ToggleField>
      </div>
      <div v-if="widget.overrideColors" class="block">
        <label for="bubbleBg" class="label">{{ $t('common.color') }}</label>
        <ColorField v-model="widget.primaryColor" tag-id="bubbleBg" class="w20" />
      </div>
      <div v-if="widget.overrideColors" class="block">
        <label for="bubbleShadow" class="label">{{ $t('common.shadow') }}</label>
        <ColorField v-model="widget.shadow" shadow tag-id="bubbleShadow" class="w20" />
      </div>
    </div>
    <div v-if="widget.type === 'bubblewrap'" class="blockContainer">
      <div class="block">
        <label for="popOnHover" class="label">{{ $t('widget.popBubblesOnHover') }}</label>
        <ToggleField v-model="widget.bubblewrap.popOnHover" tag-id="popOnHover" />
      </div>
      <div class="block">
        <div class="label">
          <label for="bubbleSize">{{ $t('widget.bubblesPerRow') }}</label>
          <div class="desc">
            {{ $t('widget.bubblesPerRowDesc') }}
          </div>
        </div>
        <select id="bubbleSize" v-model="widget.bubblewrap.size" class="select w10" name="bubbleSize">
          <option :value="1">100</option>
          <option :value="2">50</option>
          <option :value="4">25</option>
          <option :value="5">20</option>
          <option :value="10">10</option>
          <option :value="20">5</option>
          <option :value="25">4</option>
          <option :value="50">2</option>
          <option :value="100">1</option>
        </select>
      </div>
    </div>
  </div>
</template>
