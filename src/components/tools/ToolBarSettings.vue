<script setup>
import draggable from 'vuedraggable'
import { useSettingsStore } from '@/store.js'
import { toolTypes } from '@/assets/lists.js'

const store = useSettingsStore()

const getToolDetails = (tool) => {
  return toolTypes.find((t) => t.tool === tool)
}
</script>

<template>
  <div class="page">
    <PageHeading title="Toolbar"></PageHeading>
    <h3 class="subtitle">Tools</h3>
    <draggable
      class="blockContainer"
      :list="store.config.toolbar.tools"
      item-key="id"
      ghost-class="dragGhost"
      chosen-class="dragChosen"
      drag-class="dragMove"
      @start="drag = true"
      @end="drag = false"
    >
      <template #item="{ element }">
        <div class="block">
          <button type="button" class="drag">
            <fa icon="fa-grip-vertical" size="xs" fixed-width></fa>
          </button>
          <div class="group">
            <div class="label">
              <div>
                <fa :icon="getToolDetails(element.id).icon" size="lg" fixed-width></fa>&nbsp;
                {{ getToolDetails(element.id).name }}
              </div>
            </div>
          </div>
          <div class="group mla">
            <ToggleField v-model="element.on"></ToggleField>
          </div>
        </div>
      </template>
    </draggable>
    <h3 class="subtitle">Toolbar style</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">Bar</div>
          <div class="group compact">
            <label for="tbWidth" class="desc">Size</label>
            <NumberField v-model="store.config.toolbar.size" :min="20" tag-id="tbWidth" class="w6"></NumberField>
          </div>
          <div class="group compact">
            <label for="tbBackground" class="desc">Background</label>
            <ColorField v-model="store.config.toolbar.background" tag-id="tbBackground"></ColorField>
          </div>
          <div class="group compact">
            <label for="tbBorderSize" class="desc">Border</label>
            <NumberField
              v-model="store.config.toolbar.borderSize"
              :min="0"
              :max="5"
              tag-id="tbBorderSize"
              class="w6"
            ></NumberField>
            <ColorField v-model="store.config.toolbar.borderColor" aria-label="Border color"></ColorField>
          </div>
          <div class="group compact">
            <label for="tbShadow" class="desc">Shadow</label>
            <ColorField v-model="store.config.toolbar.shadow" shadow tag-id="tbShadow"></ColorField>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">Icons</div>
          <div class="group compact">
            <label for="tbAlign" class="desc">Align</label>
            <select id="tbAlign" v-model="store.config.toolbar.align" name="tbAlign" class="select w12">
              <option value="flex-start">Top</option>
              <option value="center">Middle</option>
              <option value="flex-end">Bottom</option>
            </select>
          </div>
          <div class="group compact">
            <label for="tbForeground" class="desc">Color</label>
            <ColorField v-model="store.config.toolbar.foreground" tag-id="tbForeground"></ColorField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
