<script setup>
import { ref, reactive, inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { searchEngines } from '@/assets/lists.js'

const store = useSettingsStore()
const user = inject('user')

const widgetStore = 'shapes'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])
</script>

<template>
  <div class="page">
    <PageHeading title="Shape" :widget-id="widget.id"></PageHeading>
    <div class="blockContainer">
      <WidgetBoxField
        :index="ci"
        :widget-store="widgetStore"
        no-container-alignment
        no-box-styles
        container-title="Shape size"
      />
    </div>
    <div class="blockContainer">
      <div class="block">
        <label for="shapeType" class="label">Type</label>
        <select id="shapeType" v-model="widget.shape" name="shapeType" class="select w20">
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="halfCircle">Half-Circle</option>
          <option value="triangle">Triangle</option>
          <option value="parallelogram">Parallelogram</option>
          <option value="pentagon">Pentagon</option>
          <option value="hexagon">Hexagon</option>
          <option value="heptagon">Heptagon</option>
          <option value="octagon">Octagon</option>
          <option value="nonagon">Nonagon</option>
          <option value="decagon">Decagon</option>
          <option value="bevel">Bevel</option>
          <option value="rabbet">Rabbet</option>
          <option value="arrow">Arrow</option>
          <option value="point">Point</option>
          <option value="chevron">Chevron</option>
          <option value="star">Star</option>
          <option value="cross">Cross</option>
          <option value="plus">Plus</option>
          <option value="x">X</option>
          <option value="chat">Chat</option>
        </select>
      </div>
      <div class="block">
        <label for="rotate" class="label">Rotate</label>
        <div class="range w20">
          <output class="output">{{ widget.rotate }}&deg;</output>
          <input id="rotate" v-model="widget.rotate" type="range" class="rangeInput" min="0" max="360" />
        </div>
      </div>
      <div class="block">
        <label for="background" class="label mra">Background color</label>
        <ColorField v-model="widget.base.container.background" tag-id="background" class="w20" />
      </div>
      <div class="block">
        <label for="shadow" class="label mra">Shadow</label>
        <ColorField v-model="widget.base.container.shadow" shadow tag-id="shadow" class="w20" />
      </div>
      <div v-if="['rectangle', 'circle', 'halfCircle'].includes(widget.shape)" class="block">
        <label for="borderSize" class="label">Border size</label>
        <NumberField v-model="widget.base.container.borderSize" tag-id="borderSize" class="w10" />
      </div>
      <div v-if="['rectangle', 'circle', 'halfCircle'].includes(widget.shape)" class="block">
        <label for="borderColor" class="label">Border color</label>
        <ColorField v-model="widget.base.container.borderColor" tag-id="borderColor" class="w20" />
      </div>
      <div v-if="['rectangle'].includes(widget.shape)" class="block">
        <label for="radius" class="label mra">Rounded corners</label>
        <NumberField v-model="widget.base.container.radius" tag-id="radius" :min="0" class="w10"></NumberField>
      </div>
    </div>
  </div>
</template>
