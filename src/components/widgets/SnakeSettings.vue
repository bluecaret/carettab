<script setup>
import { ref, reactive } from 'vue'
import { useSettingsStore } from '@/store.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const store = useSettingsStore()

const widgetStore = 'snakes'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])

const handleHighScoreReset = () => {
  const reset = confirm(t('widget.resetHighScore'))
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
        <label for="rotate" class="label">{{ $t('widget.gameBoardCellSize') }}</label>
        <div class="range w20">
          <output class="output">{{ widget.grid.cellSize }}</output>
          <input id="rotate" v-model="widget.grid.cellSize" type="range" class="rangeInput" min="10" max="60" />
        </div>
      </div>
      <div class="block">
        <label for="gridCellColor" class="label mra">{{ $t('widget.gameBoardCellColor') }}</label>
        <ColorField v-model="widget.grid.cellColor" tag-id="gridCellColor" class="w20" />
      </div>
      <div class="block">
        <label for="gridBorderColor" class="label mra">{{ $t('widget.gameBoardBorderColor') }}</label>
        <ColorField v-model="widget.grid.borderColor" tag-id="gridBorderColor" class="w20" />
      </div>
      <div class="block">
        <label for="snakeColor" class="label mra">{{ $t('widget.snakeColor') }}</label>
        <ColorField v-model="widget.snake.color" tag-id="snakeColor" class="w20" />
      </div>
      <div class="block">
        <label for="fruitColor" class="label mra">{{ $t('widget.fruitColor') }}</label>
        <ColorField v-model="widget.fruit.color" tag-id="fruitColor" class="w20" />
      </div>
      <div class="block">
        <label for="fruitColor" class="label mra">{{ $t('widget.resetHighScore') }}</label>
        <button type="button" class="btn" @click="handleHighScoreReset">{{ $t('widget.reset') }}</button>
      </div>
    </div>
  </div>
</template>
