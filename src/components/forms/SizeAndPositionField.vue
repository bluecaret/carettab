<script setup>
import { computed, ref } from 'vue'
import { useSettingsStore } from '@/store.js'
import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

const props = defineProps({
  index: Number,
  widgetStore: String,
  noContainerAlignment: Boolean,
  helpDiagram: Boolean,
})

const emit = defineEmits(['open-help'])

let helpDiagramData = { ...baseWidgetStyles }
helpDiagramData.widthUnit = 'pixels'
helpDiagramData.heightUnit = 'pixels'

const store = useSettingsStore()
const widget = computed({
  get: () => {
    if (props.helpDiagram) {
      return helpDiagramData
    } else if (props.widgetStore === 'global') {
      return store.config.global
    } else {
      return store.config[props.widgetStore][props.index].base
    }
  },
  set: (newValue) => {
    if (props.helpDiagram) {
      helpDiagramData = newValue
    } else if (props.widgetStore === 'global') {
      store.config.global = newValue
    } else {
      store.config[props.widgetStore][props.index].base = newValue
    }
  },
})

const positionHelp = ref(false)
const sizeHelp = ref(false)

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
  <div class="group positionAndSizeGroup" :class="{ helpRelative: props.helpDiagram }">
    <div class="block stack">
      <div class="group compact">
        <div class="label">{{ $t('settings.widgetPositionAndAlignment') }}</div>
        <button class="btn btnText btnSmall" :title="$t('settings.viewInstructions')" @click="emit('open-help')">
          <fa icon="fa-question-circle" />
        </button>
      </div>
      <div class="group">
        <div class="positionGrid" :class="{ helpRelative: props.helpDiagram }">
          <div v-if="props.helpDiagram" class="helpNumber" style="top: -0.2rem; left: 1rem">1</div>
          <div class="positionN" style="align-items: end">
            <NumberField v-model="widget.y" :title="$t('settings.moveWidgetOffsetUp')" up-button-only>
              <fa icon="fa-caret-up" fixed-width />
            </NumberField>
          </div>
          <div class="positionS" style="align-items: start">
            <NumberField v-model="widget.y" :title="$t('settings.moveWidgetOffsetDown')" down-button-only>
              <fa icon="fa-caret-down" fixed-width />
            </NumberField>
          </div>
          <div class="positionW">
            <NumberField v-model="widget.x" class="mla" :title="$t('settings.moveWidgetOffsetLeft')" down-button-only>
              <fa icon="fa-caret-left" fixed-width />
            </NumberField>
          </div>
          <div class="positionE">
            <NumberField v-model="widget.x" class="mra" :title="$t('settings.moveWidgetOffsetRight')" up-button-only>
              <fa icon="fa-caret-right" fixed-width />
            </NumberField>
          </div>
        </div>
        <div class="group stack compact">
          <div class="group compact" :class="{ helpRelative: props.helpDiagram }">
            <div v-if="props.helpDiagram" class="helpNumber" style="top: -0.2rem; left: 2rem">2</div>
            <div v-if="props.helpDiagram" class="helpNumber" style="top: -0.2rem; left: 10rem">3</div>
            <label class="desc" for="widgetOffsetX" :title="$t('settings.manuallySetTheHorizontalOffset')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style="width: 1.5em; height: auto"
              >
                <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
              </svg>
            </label>
            <NumberField v-model="widget.x" class="w7" tag-id="widgetOffsetX"></NumberField>
            <select
              id="widgetXUnit"
              v-model="widget.xUnit"
              :aria-label="$t('settings.unitOfMeasureForTheHorizontalOffset')"
              class="select w6"
              name="widgetXUnit"
            >
              <option :value="'pixels'">px</option>
              <option :value="'percent'">%</option>
            </select>
          </div>
          <div class="group compact" :class="{ helpRelative: props.helpDiagram }">
            <div v-if="props.helpDiagram" class="helpNumber" style="top: -0.2rem; left: 2rem">4</div>
            <div v-if="props.helpDiagram" class="helpNumber" style="top: -0.2rem; left: 10rem">5</div>
            <label class="desc" for="widgetOffsetY" :title="$t('settings.manuallySetTheVerticalOffset')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style="width: 1.5em; height: auto"
              >
                <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z" />
              </svg>
            </label>
            <NumberField v-model="widget.y" class="w7" tag-id="widgetOffsetY"></NumberField>
            <select
              id="widgetYUnit"
              v-model="widget.yUnit"
              :aria-label="$t('settings.unitOfMeasureForTheVerticalOffset')"
              class="select w6"
              name="widgetYUnit"
            >
              <option :value="'pixels'">px</option>
              <option :value="'percent'">%</option>
            </select>
          </div>
        </div>
        <div class="group compact stack" :class="{ helpRelative: props.helpDiagram }">
          <div v-if="props.helpDiagram" class="helpNumber" style="top: -0.2rem; left: -0.5rem">6</div>
          <div v-if="props.helpDiagram" class="helpNumber" style="top: 3.8rem; left: -0.5rem">7</div>
          <DropdownMenu>
            <template #button>
              <button id="anchorPosition" :title="$t('settings.anchorPosition')" class="btn btnText">
                <fa icon="fa-anchor" fixed-width />
                <div class="anchorSetting">
                  <fa
                    v-if="widget.alignment === 'nw'"
                    fixed-width
                    size="sm"
                    icon="fa-caret-left"
                    transform="rotate-45"
                  ></fa>
                  <fa v-else-if="widget.alignment === 'n'" fixed-width size="sm" icon="fa-caret-up"></fa>
                  <fa
                    v-else-if="widget.alignment === 'ne'"
                    fixed-width
                    size="sm"
                    icon="fa-caret-up"
                    transform="rotate-45"
                  ></fa>
                  <fa v-else-if="widget.alignment === 'w'" fixed-width size="sm" icon="fa-caret-left"></fa>
                  <fa v-else-if="widget.alignment === 'e'" fixed-width size="sm" icon="fa-caret-right"></fa>
                  <fa
                    v-else-if="widget.alignment === 'sw'"
                    fixed-width
                    size="sm"
                    icon="fa-caret-down"
                    transform="rotate-45"
                  ></fa>
                  <fa v-else-if="widget.alignment === 's'" fixed-width size="sm" icon="fa-caret-down"></fa>
                  <fa
                    v-else-if="widget.alignment === 'se'"
                    fixed-width
                    size="sm"
                    icon="fa-caret-right"
                    transform="rotate-45"
                  ></fa>
                  <fa v-else icon="fa-minus" size="sm" fixed-width></fa>
                </div>
              </button>
            </template>
            <template #menu>
              <div class="block">
                <div aria-labelledby="anchorPosition" class="btnPlacementGroup w8">
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
            </template>
          </DropdownMenu>
          <DropdownMenu v-if="!props.noContainerAlignment">
            <template #button>
              <button id="contentAlignment" :title="$t('settings.contentAlignment')" class="btn btnText">
                <fa icon="fa-align-left" fixed-width />
                <div class="anchorSetting">
                  <fa
                    v-if="widget.container.alignment === 'nw'"
                    fixed-width
                    size="sm"
                    icon="fa-caret-left"
                    transform="rotate-45"
                  ></fa>
                  <fa v-else-if="widget.container.alignment === 'n'" fixed-width size="sm" icon="fa-caret-up"></fa>
                  <fa
                    v-else-if="widget.container.alignment === 'ne'"
                    fixed-width
                    size="sm"
                    icon="fa-caret-up"
                    transform="rotate-45"
                  ></fa>
                  <fa v-else-if="widget.container.alignment === 'w'" fixed-width size="sm" icon="fa-caret-left"></fa>
                  <fa v-else-if="widget.container.alignment === 'e'" fixed-width size="sm" icon="fa-caret-right"></fa>
                  <fa
                    v-else-if="widget.container.alignment === 'sw'"
                    fixed-width
                    size="sm"
                    icon="fa-caret-down"
                    transform="rotate-45"
                  ></fa>
                  <fa v-else-if="widget.container.alignment === 's'" fixed-width size="sm" icon="fa-caret-down"></fa>
                  <fa
                    v-else-if="widget.container.alignment === 'se'"
                    fixed-width
                    size="sm"
                    icon="fa-caret-right"
                    transform="rotate-45"
                  ></fa>
                  <fa v-else icon="fa-minus" size="sm" fixed-width></fa>
                </div>
              </button>
            </template>
            <template #menu>
              <div class="block">
                <div aria-labelledby="contentAlignment" class="btnPlacementGroup w8">
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
            </template>
          </DropdownMenu>
        </div>
      </div>
    </div>
    <div class="block stack">
      <div class="group compact">
        <div class="label">{{ $t('settings.containerSize') }}</div>
        <button class="btn btnText btnSmall" @click="emit('open-help')">
          <fa icon="fa-question-circle" />
        </button>
      </div>
      <div class="group fill" style="align-items: start">
        <div class="group stack compact">
          <div class="group fill compact" :class="{ helpRelative: props.helpDiagram }">
            <div v-if="props.helpDiagram" class="helpNumber" style="top: -0.2rem; left: 2rem">8</div>
            <div v-if="props.helpDiagram" class="helpNumber" style="top: -0.2rem; left: 10rem">9</div>
            <label class="desc" for="widgetWidth" :title="$t('widget.width')">
              <fa icon="fa-arrows-left-right" fixed-width />
            </label>
            <NumberField
              v-if="widget.widthUnit !== 'auto'"
              v-model="widget.width"
              tag-id="widgetWidth"
              class="w7"
            ></NumberField>
            <select
              id="widgetWidthUnit"
              v-model="widget.widthUnit"
              :aria-label="$t('settings.unitOfMeasureForTheWidth')"
              class="select w7"
              name="widgetWidthUnit"
            >
              <option :value="'auto'">auto</option>
              <option :value="'pixels'">px</option>
              <option :value="'percent'">%</option>
            </select>
          </div>
          <div class="group fill compact" :class="{ helpRelative: props.helpDiagram }">
            <div v-if="props.helpDiagram" class="helpNumber" style="top: -0.2rem; left: 2rem">10</div>
            <div v-if="props.helpDiagram" class="helpNumber" style="top: -0.2rem; left: 10rem">11</div>
            <label class="desc" for="widgetHeight" :title="$t('widget.height')">
              <fa icon="fa-arrows-up-down" fixed-width />
            </label>
            <NumberField
              v-if="widget.heightUnit !== 'auto'"
              v-model="widget.height"
              tag-id="widgetHeight"
              class="w7"
            ></NumberField>
            <select
              id="widgetHeightUnit"
              v-model="widget.heightUnit"
              :aria-label="$t('settings.unitOfMeasureForTheHeight')"
              class="select w7"
              name="widgetHeightUnit"
            >
              <option :value="'auto'">auto</option>
              <option :value="'pixels'">px</option>
              <option :value="'percent'">%</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.positionAndSizeGroup {
  align-items: start;
  gap: 0;
}
.positionGrid {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto;
  grid-template-rows: 1fr auto auto 1fr;
  gap: var(--s3);
  > * {
    display: flex;
    align-items: center;
  }
}
.positionNW {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
}
.positionN {
  grid-column: 4 / 5;
  grid-row: 1 / 3;
}
.positionNE {
  grid-column: 7 / 8;
  grid-row: 1 / 3;
}
.positionW {
  grid-column: 2 / 4;
  grid-row: 2 / 4;
}
.positionC {
  grid-column: 4 / 5;
  grid-row: 2 / 4;
}
.positionE {
  grid-column: 5 / 7;
  grid-row: 2 / 4;
}
.positionSW {
  grid-column: 1 / 2;
  grid-row: 3 / 5;
}
.positionS {
  grid-column: 4 / 5;
  grid-row: 3 / 5;
}
.positionSE {
  grid-column: 7 / 8;
  grid-row: 3 / 5;
}
.anchorSetting,
.positionUnitSetting {
  background-color: var(--g1);
  // color: var(--g1);
  padding: var(--s1);
  border-radius: var(--s3);
  min-width: 2.4rem;
  min-height: 1.6rem;
  font-size: 1.4rem;
  font-weight: 400;
}
.positionAltBtn {
  border-color: transparent;
  color: var(--b1);
}

.helpRelative {
  position: relative;
  z-index: +1;
  pointer-events: none;
}
.helpNumber {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 1.2rem;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: black;
  background-color: orange;
}
</style>
