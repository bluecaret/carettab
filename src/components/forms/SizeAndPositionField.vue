<script setup>
const emit = defineEmits([
  'update:autoSize',
  'update:width',
  'update:widthUnit',
  'update:height',
  'update:heightUnit',
  'update:align',
  'update:calign',
  'update:x',
  'update:y',
])
const props = defineProps({
  autoSize: Boolean,
  width: Number,
  widthUnit: String,
  height: Number,
  heightUnit: String,
  align: String,
  calign: String,
  x: Number,
  y: Number,
})

const handleWidthUpdate = (num) => {
  emit('update:width', num)
}

const handleWidthUnitUpdate = (str) => {
  emit('update:widthUnit', str.target.value)
}

const handleHeightUpdate = (num) => {
  emit('update:height', num)
}

const handleHeightUnitUpdate = (str) => {
  emit('update:heightUnit', str.target.value)
}

const handleAlignUpdate = (alignment) => {
  emit('update:align', alignment)
}

const handleContainerAlignUpdate = (alignment) => {
  emit('update:calign', alignment)
}

const handleXUpdate = (num) => {
  emit('update:x', num)
}

const handleYUpdate = (num) => {
  emit('update:y', num)
}
</script>

<template>
  <div class="block">
    <div class="group fill">
      <div class="label">
        <label id="alignLabel">Window alignment and position</label>
        <div class="desc">
          Widget positions are independent of each other. If widgets are overlapping, change the alignment or adjust the
          position.
        </div>
      </div>
      <div class="group stack compact">
        <div class="group fill compact">
          <label class="desc mla" for="widgetWidth"> Up/Down </label>
          <NumberField
            class="w8"
            tag-id="widgetOffsetY"
            aria-label="Y"
            :increment="10"
            :model-value="props.y"
            @update:model-value="handleYUpdate"
          ></NumberField>
        </div>
        <div class="group fill compact">
          <label class="desc mla" for="widgetWidth"> Left/Right </label>
          <NumberField
            class="w8"
            tag-id="widgetOffsetX"
            aria-label="X"
            :increment="10"
            :model-value="props.x"
            @update:model-value="handleXUpdate"
          ></NumberField>
        </div>
      </div>
      <div aria-labelledby="alignLabel" class="btnPlacementGroup w10">
        <button
          type="button"
          :aria-label="$t('options.common.topLeft')"
          :title="$t('options.common.topLeft')"
          class="btn"
          :class="{ active: align === 'nw' }"
          @click="handleAlignUpdate('nw')"
        >
          <fa icon="fa-caret-left" transform="rotate-45"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('options.common.topCenter')"
          :title="$t('options.common.topCenter')"
          class="btn"
          :class="{ active: align === 'n' }"
          @click="handleAlignUpdate('n')"
        >
          <fa icon="fa-caret-up"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('options.common.topRight')"
          :title="$t('options.common.topRight')"
          class="btn"
          :class="{ active: align === 'ne' }"
          @click="handleAlignUpdate('ne')"
        >
          <fa icon="fa-caret-up" transform="rotate-45"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('options.common.centerLeft')"
          :title="$t('options.common.centerLeft')"
          class="btn"
          :class="{ active: align === 'w' }"
          @click="handleAlignUpdate('w')"
        >
          <fa icon="fa-caret-left"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('options.common.center')"
          :title="$t('options.common.center')"
          class="btn"
          :class="{ active: align === 'c' || align == null || align == '' }"
          @click="handleAlignUpdate('c')"
        >
          <fa icon="fa-minus"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('options.common.centerRight')"
          :title="$t('options.common.centerRight')"
          class="btn"
          :class="{ active: align === 'e' }"
          @click="handleAlignUpdate('e')"
        >
          <fa icon="fa-caret-right"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('options.common.bottomLeft')"
          :title="$t('options.common.bottomLeft')"
          class="btn"
          :class="{ active: align === 'sw' }"
          @click="handleAlignUpdate('sw')"
        >
          <fa icon="fa-caret-down" transform="rotate-45"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('options.common.bottomCenter')"
          :title="$t('options.common.bottomCenter')"
          class="btn"
          :class="{ active: align === 's' }"
          @click="handleAlignUpdate('s')"
        >
          <fa icon="fa-caret-down"></fa>
        </button>
        <button
          type="button"
          :aria-label="$t('options.common.bottomRight')"
          :title="$t('options.common.bottomRight')"
          class="btn"
          :class="{ active: align === 'se' }"
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
        <label id="containerAlignLabel">Container alignment and size</label>
        <div class="desc">Sets the size of the widget container and alignment of content within the container</div>
      </div>
      <div class="group stack compact">
        <div class="group fill compact">
          <label class="desc mla" for="widgetWidth">Width</label>
          <NumberField
            v-if="props.widthUnit !== 'auto'"
            tag-id="widgetWidth"
            class="w8"
            :model-value="props.width"
            @update:model-value="handleWidthUpdate"
          ></NumberField>
          <select
            id="widgetWidthUnit"
            aria-label="Use pixels or percentage of screen for width or set it to automatic to use the width of the content"
            class="select w8"
            name="widgetWidthUnit"
            @change="handleWidthUnitUpdate($event)"
          >
            <option :selected="props.widthUnit === 'auto'" :value="'auto'">auto</option>
            <option :selected="props.widthUnit === 'pixels'" :value="'pixels'">pixels</option>
            <option :selected="props.widthUnit === 'percent'" :value="'percent'">%</option>
          </select>
        </div>
        <div class="group fill compact">
          <label class="desc mla" for="widgetHeight">Height</label>
          <NumberField
            v-if="props.heightUnit !== 'auto'"
            tag-id="widgetHeight"
            class="w8"
            :increment="10"
            :model-value="props.height"
            @update:model-value="handleHeightUpdate"
          ></NumberField>
          <select
            id="widgetHeightUnit"
            aria-label="Use pixels or percentage of screen for height or set it to automatic to use the height of the content"
            class="select w8"
            name="widgetHeightUnit"
            @change="handleHeightUnitUpdate($event)"
          >
            <option :selected="props.heightUnit === 'auto'" :value="'auto'">auto</option>
            <option :selected="props.heightUnit === 'pixels'" :value="'pixels'">pixels</option>
            <option :selected="props.heightUnit === 'percent'" :value="'percent'">%</option>
          </select>
        </div>
      </div>
      <div class="group">
        <div aria-labelledby="containerAlignLabel" class="btnPlacementGroup w10">
          <button
            type="button"
            :aria-label="$t('options.common.topLeft')"
            :title="$t('options.common.topLeft')"
            class="btn"
            :class="{ active: calign === 'nw' }"
            @click="handleContainerAlignUpdate('nw')"
          >
            <fa icon="fa-caret-left" transform="rotate-45"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('options.common.topCenter')"
            :title="$t('options.common.topCenter')"
            class="btn"
            :class="{ active: calign === 'n' }"
            @click="handleContainerAlignUpdate('n')"
          >
            <fa icon="fa-caret-up"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('options.common.topRight')"
            :title="$t('options.common.topRight')"
            class="btn"
            :class="{ active: calign === 'ne' }"
            @click="handleContainerAlignUpdate('ne')"
          >
            <fa icon="fa-caret-up" transform="rotate-45"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('options.common.centerLeft')"
            :title="$t('options.common.centerLeft')"
            class="btn"
            :class="{ active: calign === 'w' }"
            @click="handleContainerAlignUpdate('w')"
          >
            <fa icon="fa-caret-left"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('options.common.center')"
            :title="$t('options.common.center')"
            class="btn"
            :class="{ active: calign === 'c' || align == null || align == '' }"
            @click="handleContainerAlignUpdate('c')"
          >
            <fa icon="fa-minus"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('options.common.centerRight')"
            :title="$t('options.common.centerRight')"
            class="btn"
            :class="{ active: calign === 'e' }"
            @click="handleContainerAlignUpdate('e')"
          >
            <fa icon="fa-caret-right"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('options.common.bottomLeft')"
            :title="$t('options.common.bottomLeft')"
            class="btn"
            :class="{ active: calign === 'sw' }"
            @click="handleContainerAlignUpdate('sw')"
          >
            <fa icon="fa-caret-down" transform="rotate-45"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('options.common.bottomCenter')"
            :title="$t('options.common.bottomCenter')"
            class="btn"
            :class="{ active: calign === 's' }"
            @click="handleContainerAlignUpdate('s')"
          >
            <fa icon="fa-caret-down"></fa>
          </button>
          <button
            type="button"
            :aria-label="$t('options.common.bottomRight')"
            :title="$t('options.common.bottomRight')"
            class="btn"
            :class="{ active: calign === 'se' }"
            @click="handleContainerAlignUpdate('se')"
          >
            <fa icon="fa-caret-right" transform="rotate-45"></fa>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
