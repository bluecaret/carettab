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
          <option value="spinner">Spinner</option>
          <option value="bubblewrap">Bubble Wrap</option>
        </select>
      </div>
      <template v-if="widget.type === 'bubblewrap'">
        <div class="block">
          <label for="popOnHover" class="label">Pop on hover</label>
          <ToggleField v-model="widget.bubblewrap.popOnHover" tag-id="popOnHover" />
        </div>
        <div class="block">
          <div class="label">
            <label for="bubbleSize">Bubbles per row</label>
            <div class="desc">
              Number of bubbles that will display in each row. If there is not enough height for a row to fit in, you
              will not see any bubbles. For performance considerations, the total maximum number of bubbles shown in a
              container is limited to 1,000.
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
        <div class="block">
          <label for="bubbleBg" class="label">Bubble color</label>
          <ColorField v-model="widget.bubblewrap.bubble" tag-id="bubbleBg" class="w20" />
        </div>
        <div class="block">
          <label for="bubbleShadow" class="label">Bubble shadow</label>
          <ColorField v-model="widget.bubblewrap.shadow" shadow tag-id="bubbleShadow" class="w20" />
        </div>
      </template>
    </div>
  </div>
</template>
