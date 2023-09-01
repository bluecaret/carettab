<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()

const widgetStore = 'snakes'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])

const handleHighScoreReset = () => {
  const reset = confirm('Reset high score')
  if (reset) widget.highScore = 0
}
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
        <label for="rotate" class="label">Game board cell size</label>
        <div class="range w20">
          <output class="output">{{ widget.grid.cellSize }}</output>
          <input id="rotate" v-model="widget.grid.cellSize" type="range" class="rangeInput" min="10" max="60" />
        </div>
      </div>
      <div class="block">
        <label for="gridCellColor" class="label mra">Game board cell color</label>
        <ColorField v-model="widget.grid.cellColor" tag-id="gridCellColor" class="w20" />
      </div>
      <div class="block">
        <label for="gridBorderColor" class="label mra">Game board border color</label>
        <ColorField v-model="widget.grid.borderColor" tag-id="gridBorderColor" class="w20" />
      </div>
      <div class="block">
        <label for="snakeColor" class="label mra">Snake color</label>
        <ColorField v-model="widget.snake.color" tag-id="snakeColor" class="w20" />
      </div>
      <div class="block">
        <label for="fruitColor" class="label mra">Fruit color</label>
        <ColorField v-model="widget.fruit.color" tag-id="fruitColor" class="w20" />
      </div>
      <div class="block">
        <label for="fruitColor" class="label mra">Reset high score</label>
        <button type="button" class="btn" @click="handleHighScoreReset">{{ $t('widget.reset') }}</button>
      </div>
    </div>
  </div>
</template>
