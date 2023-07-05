<script setup>
import { ref, inject } from 'vue'
import draggable from 'vuedraggable'
import { useSettingsStore } from '@/store.js'
import { toolTypes } from '@/assets/lists.js'

const store = useSettingsStore()
const user = inject('user')

const getToolDetails = (tool) => {
  return toolTypes.find((t) => t.tool === tool)
}

const showToolbarSettings = ref(false)
const showToolbarTools = ref(false)
</script>

<template>
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
              <label for="enableToolbar">{{ $t('widget.toolbar') }}</label>
              <div class="desc">{{ $t('widget.enableAToolbarForQuickAccessToUsefulTools') }}</div>
            </div>
          </div>
          <ToggleField v-model="store.config.toolbar.on" tag-id="enableToolbar"></ToggleField>
          <div class="btnGroup">
            <button
              v-if="store.config.toolbar.on"
              type="button"
              class="btn"
              :class="{ active: showToolbarTools }"
              :aria-label="$t('widget.toggleAndReorderTools')"
              :title="$t('widget.toggleAndReorderTools')"
              @click="showToolbarTools = !showToolbarTools"
            >
              <fa icon="fa-shapes" fixed-width></fa>
            </button>
            <button
              v-if="store.config.toolbar.on"
              type="button"
              class="btn"
              :class="{ active: showToolbarSettings }"
              :aria-label="$t('widget.editToolbarSettings')"
              :title="$t('widget.editToolbarSettings')"
              @click="showToolbarSettings = !showToolbarSettings"
            >
              <fa icon="fa-pen" fixed-width></fa>
            </button>
          </div>
        </div>
      </div>
      <FieldAccordion v-if="showToolbarSettings" start-open>
        <template #label>
          <div class="label">{{ $t('widget.bar') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="tbWidth" class="label mra">{{ $t('common.size') }}</label>
            <NumberField v-model="store.config.toolbar.size" :min="20" tag-id="tbWidth" class="w10"></NumberField>
          </div>
          <div class="block">
            <label for="tbBackground" class="label mra">{{ $t('common.background') }}</label>
            <ColorField v-model="store.config.toolbar.background" tag-id="tbBackground" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="tbShadow" class="label mra">{{ $t('common.shadow') }}</label>
            <ColorField v-model="store.config.toolbar.shadow" shadow tag-id="tbShadow" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="tbBorderSize" class="label mra">{{ $t('common.borderSize') }}</label>
            <NumberField
              v-model="store.config.toolbar.borderSize"
              :min="0"
              tag-id="tbBorderSize"
              class="w10"
            ></NumberField>
          </div>
          <div class="block">
            <label for="tbBorderColor" class="label mra">{{ $t('common.borderColor') }}</label>
            <ColorField v-model="store.config.toolbar.borderColor" tag-id="tbBorderColor" class="w20"></ColorField>
          </div>
        </template>
      </FieldAccordion>
      <FieldAccordion v-if="showToolbarSettings" start-open>
        <template #label>
          <div class="label">Icons</div>
        </template>
        <template #children>
          <div class="block">
            <label for="tbAlign" class="label mra">{{ $t('widget.align') }}</label>
            <select id="tbAlign" v-model="store.config.toolbar.align" name="tbAlign" class="select w20">
              <option value="flex-start">{{ $t('widget.top') }}</option>
              <option value="center">{{ $t('widget.middle') }}</option>
              <option value="flex-end">{{ $t('widget.bottom') }}</option>
            </select>
          </div>
          <div class="block">
            <label for="tbForeground" class="label mra">{{ $t('common.color') }}</label>
            <ColorField v-model="store.config.toolbar.foreground" tag-id="tbForeground" class="w20"></ColorField>
          </div>
        </template>
      </FieldAccordion>
    </template>
    <template #item="{ element }">
      <div v-if="showToolbarTools && store.config.toolbar.on" class="block">
        <button type="button" class="drag" :aria-label="$t('common.dragToReorder')">
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
        <div class="group compact mla">
          <PremiumLabel v-if="getToolDetails(element.id).premium" />
          <ToggleField v-model="element.on" :disabled="getToolDetails(element.id).premium && !user.paid"></ToggleField>
        </div>
      </div>
    </template>
  </draggable>
</template>
