<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { useSettingsStore } from '@/store.js'
import { toolTypes } from '@/assets/lists.js'

const store = useSettingsStore()

const getToolDetails = (tool) => {
  return toolTypes.find((t) => t.tool === tool)
}

const showToolbarSettings = ref(false)
const showToolbarTools = ref(false)
</script>

<template>
  <!-- <div class="page"> -->
  <!-- <PageHeading title="Toolbar"></PageHeading> -->
  <!-- <h3 class="subtitle">Tools</h3> -->
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
    <template #header>
      <div class="block">
        <div class="group fill">
          <div class="group compact mra">
            <div class="label">
              <label for="enableToolbar">Toolbar</label>
              <div class="desc">Enable a toolbar for quick access to useful tools.</div>
            </div>
            <button class="btn btnLink" aria-label="Learn about the Toolbar"></button>
          </div>
          <ToggleField v-model="store.config.toolbar.on" tag-id="enableToolbar"></ToggleField>
          <div class="btnGroup">
            <button
              v-if="store.config.toolbar.on"
              type="button"
              class="btn"
              :class="{ active: showToolbarTools }"
              aria-label="Toggle and reorder tools"
              title="Toggle and reorder tools"
              @click="showToolbarTools = !showToolbarTools"
            >
              <fa icon="fa-shapes" fixed-width></fa>
            </button>
            <button
              v-if="store.config.toolbar.on"
              type="button"
              class="btn"
              :class="{ active: showToolbarSettings }"
              aria-label="Edit toolbar settings"
              title="Edit toolbar settings"
              @click="showToolbarSettings = !showToolbarSettings"
            >
              <fa icon="fa-pen" fixed-width></fa>
            </button>
          </div>
        </div>
      </div>
      <div v-if="showToolbarSettings" class="block">
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
      <div v-if="showToolbarSettings" class="block">
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
    </template>
    <template #item="{ element }">
      <div v-if="showToolbarTools && store.config.toolbar.on" class="block">
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
  <!-- <h3 class="subtitle">Toolbar style</h3> -->
  <!-- <div class="blockContainer"></div> -->
  <!-- </div> -->
</template>

<style lang="scss" scoped></style>
