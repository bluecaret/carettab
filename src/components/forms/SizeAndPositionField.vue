<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/store.js'

const props = defineProps({
  index: Number,
  widgetStore: String,
  windowTitle: String,
  containerTitle: String,
  noContainerAlignment: Boolean,
})

const store = useSettingsStore()
const widget = computed({
  get: () => {
    if (props.widgetStore === 'global') {
      return store.config.global
    } else {
      return store.config[props.widgetStore][props.index].base
    }
  },
  set: (newValue) => {
    if (props.widgetStore === 'global') {
      store.config.global = newValue
    } else {
      store.config[props.widgetStore][props.index].base = newValue
    }
  },
})

const handleAlignUpdate = (alignment) => {
  widget.value.x = 0
  widget.value.y = 0
  widget.value.alignment = alignment
}

const handleCAlignUpdate = (alignment) => {
  widget.value.container.alignment = alignment
}
</script>

<template>
  <div class="block">
    <div class="group fill">
      <div class="label">
        <label id="alignLabel">{{
          props.windowTitle ? props.windowTitle : $t('settings.windowAlignmentAndPosition')
        }}</label>
        <div class="desc">
          {{ $t('settings.widgetPositionsAreIndependent') }}
        </div>
      </div>
      <div class="group stack compact">
        <div class="group fill compact">
          <label class="desc mla" for="widgetOffsetY"> {{ $t('settings.upDown') }} </label>
          <NumberField v-model="widget.y" class="w8" tag-id="widgetOffsetY" :increment="10"></NumberField>
        </div>
        <div class="group fill compact">
          <label class="desc mla" for="widgetOffsetX"> {{ $t('settings.leftRight') }} </label>
          <NumberField v-model="widget.x" class="w8" tag-id="widgetOffsetX" :increment="10"></NumberField>
        </div>
      </div>
      <div aria-labelledby="alignLabel" class="btnPlacementGroup w10">
        <button
          type="button"
          :aria-label="$t('settings.topLeft')"
          :title="$t('settings.topLeft')"
          class="btn"
          :class="{ active: widget.alignment === 'nw' }"
          @click="handleAlignUpdate('nw')"
        >
          <fa icon="fa-caret-left" transform="rotate-45"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('settings.topCenter')"
          :title="$t('settings.topCenter')"
          class="btn"
          :class="{ active: widget.alignment === 'n' }"
          @click="handleAlignUpdate('n')"
        >
          <fa icon="fa-caret-up"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('settings.topRight')"
          :title="$t('settings.topRight')"
          class="btn"
          :class="{ active: widget.alignment === 'ne' }"
          @click="handleAlignUpdate('ne')"
        >
          <fa icon="fa-caret-up" transform="rotate-45"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('settings.centerLeft')"
          :title="$t('settings.centerLeft')"
          class="btn"
          :class="{ active: widget.alignment === 'w' }"
          @click="handleAlignUpdate('w')"
        >
          <fa icon="fa-caret-left"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('settings.center')"
          :title="$t('settings.center')"
          class="btn"
          :class="{
            active: widget.alignment === 'c' || widget.alignment == null || widget.alignment == '',
          }"
          @click="handleAlignUpdate('c')"
        >
          <fa icon="fa-minus"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('settings.centerRight')"
          :title="$t('settings.centerRight')"
          class="btn"
          :class="{ active: widget.alignment === 'e' }"
          @click="handleAlignUpdate('e')"
        >
          <fa icon="fa-caret-right"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('settings.bottomLeft')"
          :title="$t('settings.bottomLeft')"
          class="btn"
          :class="{ active: widget.alignment === 'sw' }"
          @click="handleAlignUpdate('sw')"
        >
          <fa icon="fa-caret-down" transform="rotate-45"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('settings.bottomCenter')"
          :title="$t('settings.bottomCenter')"
          class="btn"
          :class="{ active: widget.alignment === 's' }"
          @click="handleAlignUpdate('s')"
        >
          <fa icon="fa-caret-down"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('settings.bottomRight')"
          :title="$t('settings.bottomRight')"
          class="btn"
          :class="{ active: widget.alignment === 'se' }"
          @click="handleAlignUpdate('se')"
        >
          <fa icon="fa-caret-right" transform="rotate-45"></fa>
        </button>
      </div>
    </div>
  </div>
  <div class="block">
    <div class="group fill">
      <div class="label">
        <label id="containerAlignLabel">{{
          props.containerTitle ? props.containerTitle : 'Container alignment and size'
        }}</label>
        <div class="desc">
          {{
            props.noContainerAlignment
              ? 'Sets the size of the widget container'
              : 'Sets the size of the widget container and alignment of content within the container'
          }}
        </div>
      </div>
      <div class="group stack compact mla">
        <div class="group fill compact">
          <label class="desc mla" for="widgetWidth">Width</label>
          <NumberField
            v-if="widget.widthUnit !== 'auto'"
            v-model="widget.width"
            tag-id="widgetWidth"
            class="w8"
          ></NumberField>
          <select
            id="widgetWidthUnit"
            v-model="widget.widthUnit"
            aria-label="Use pixels or percentage of screen for width or set it to automatic to use the width of the content"
            class="select w8"
            name="widgetWidthUnit"
          >
            <option :value="'auto'">auto</option>
            <option :value="'pixels'">pixels</option>
            <option :value="'percent'">%</option>
          </select>
        </div>
        <div class="group fill compact">
          <label class="desc mla" for="widgetHeight">Height</label>
          <NumberField
            v-if="widget.heightUnit !== 'auto'"
            v-model="widget.height"
            tag-id="widgetHeight"
            class="w8"
            :increment="10"
          ></NumberField>
          <select
            id="widgetHeightUnit"
            v-model="widget.heightUnit"
            aria-label="Use pixels or percentage of screen for height or set it to automatic to use the height of the content"
            class="select w8"
            name="widgetHeightUnit"
          >
            <option :value="'auto'">auto</option>
            <option :value="'pixels'">pixels</option>
            <option :value="'percent'">%</option>
          </select>
        </div>
      </div>
      <div v-if="!props.noContainerAlignment" class="group">
        <div aria-labelledby="containerAlignLabel" class="btnPlacementGroup w10">
          <button
            type="button"
            :aria-label="$t('settings.topLeft')"
            :title="$t('settings.topLeft')"
            class="btn"
            :class="{ active: widget.container.alignment === 'nw' }"
            @click="handleCAlignUpdate('nw')"
          >
            <fa icon="fa-caret-left" transform="rotate-45"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('settings.topCenter')"
            :title="$t('settings.topCenter')"
            class="btn"
            :class="{ active: widget.container.alignment === 'n' }"
            @click="handleCAlignUpdate('n')"
          >
            <fa icon="fa-caret-up"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('settings.topRight')"
            :title="$t('settings.topRight')"
            class="btn"
            :class="{ active: widget.container.alignment === 'ne' }"
            @click="handleCAlignUpdate('ne')"
          >
            <fa icon="fa-caret-up" transform="rotate-45"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('settings.centerLeft')"
            :title="$t('settings.centerLeft')"
            class="btn"
            :class="{ active: widget.container.alignment === 'w' }"
            @click="handleCAlignUpdate('w')"
          >
            <fa icon="fa-caret-left"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('settings.center')"
            :title="$t('settings.center')"
            class="btn"
            :class="{
              active:
                widget.container.alignment === 'c' ||
                widget.container.alignment == null ||
                widget.container.alignment == '',
            }"
            @click="handleCAlignUpdate('c')"
          >
            <fa icon="fa-minus"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('settings.centerRight')"
            :title="$t('settings.centerRight')"
            class="btn"
            :class="{ active: widget.container.alignment === 'e' }"
            @click="handleCAlignUpdate('e')"
          >
            <fa icon="fa-caret-right"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('settings.bottomLeft')"
            :title="$t('settings.bottomLeft')"
            class="btn"
            :class="{ active: widget.container.alignment === 'sw' }"
            @click="handleCAlignUpdate('sw')"
          >
            <fa icon="fa-caret-down" transform="rotate-45"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('settings.bottomCenter')"
            :title="$t('settings.bottomCenter')"
            class="btn"
            :class="{ active: widget.container.alignment === 's' }"
            @click="handleCAlignUpdate('s')"
          >
            <fa icon="fa-caret-down"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('settings.bottomRight')"
            :title="$t('settings.bottomRight')"
            class="btn"
            :class="{ active: widget.container.alignment === 'se' }"
            @click="handleCAlignUpdate('se')"
          >
            <fa icon="fa-caret-right" transform="rotate-45"></fa>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
