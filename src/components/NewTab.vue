<script setup>
import { computed, watch } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore } from '@/store.js'
import { checkVersionInRange } from '@/helpers/data.js'
import { hsl, shadow } from '@/helpers/widgets.js'
import WallpaperLayer from '@/components/elements/WallpaperLayer.vue'
import ToggleSettings from '@/components/settings/ToggleSettings.vue'
import DigitalClockWidget from '@/components/widgets/DigitalClockWidget.vue'
import AnalogClockWidget from '@/components/widgets/AnalogClockWidget.vue'
import BinaryClockWidget from '@/components/widgets/BinaryClockWidget.vue'
import DateWidget from '@/components/widgets/DateWidget.vue'
import SearchBarWidget from '@/components/widgets/SearchBarWidget.vue'
import WeatherWidget from '@/components/widgets/WeatherWidget.vue'
import NotepadWidget from '@/components/widgets/NotepadWidget.vue'
import QuoteWidget from '@/components/widgets/QuoteWidget.vue'
import QuickLinksWidget from '@/components/widgets/QuickLinksWidget.vue'
import LoadsheddingWidget from '@/components/widgets/LoadsheddingWidget.vue'
import ShapeWidget from '@/components/widgets/ShapeWidget.vue'
import TextWidget from '@/components/widgets/TextWidget.vue'
import TodoWidget from '@/components/widgets/TodoWidget.vue'
import ToolBar from '@/components/tools/ToolBar.vue'
import WelcomePage from '@/components/settings/WelcomePage.vue'
import UpdatedPage from '@/components/settings/UpdatedPage.vue'

const store = useSettingsStore()

const getTextShadow = computed(() => {
  if (store.config.global.font.shadow && store.config.global.font.shadow[0]) {
    return `${store.config.global.font.shadow[1]}px ${store.config.global.font.shadow[2]}px ${store.config.global.font.shadow[3]}px hsl(${store.config.global.font.shadow[4]}deg ${store.config.global.font.shadow[5]}% ${store.config.global.font.shadow[6]}% / ${store.config.global.font.shadow[7]})`
  }
  return 'none'
})

const getTextColor = computed(() => {
  if (store.config.global.font.color && store.config.global.font.color[0]) {
    return `hsl(${store.config.global.font.color[0]}deg ${store.config.global.font.color[1]}% ${store.config.global.font.color[2]}% / ${store.config.global.font.color[3]})`
  }
  return 'white'
})

const getBgColor = computed(() => {
  if (store.config.global.wallpaper.background) {
    return `hsl(${store.config.global.wallpaper.background[0]}deg ${store.config.global.wallpaper.background[1]}% ${store.config.global.wallpaper.background[2]}% / ${store.config.global.wallpaper.background[3]})`
  }
  return 'black'
})

const generateTabGridStyles = computed(() => {
  let styles = 'left: var(--toolbarSize);'
  return styles
})

const generateNewTabStyles = computed(() => {
  return `
    background-color: ${getBgColor.value};
    --toolbarSize: ${store.config.toolbar.on ? store.config.toolbar.size + 'px' : '0px'};
    --toolbarBorderSize: ${store.config.toolbar.borderSize + 'px'};
    --toolbarBg: ${hsl(store.config.toolbar.background)};
    --toolbarFg: ${hsl(store.config.toolbar.foreground)};
    --toolbarBorderColor: ${hsl(store.config.toolbar.borderColor)};
    --toolbarShadow: ${shadow(store.config.toolbar.shadow)};
    --toolbarAlign: ${store.config.toolbar.align};
    --textSelection: ${store.config.global.disableSelection ? 'none' : 'auto'};
  `
})

const widgetNullCheck = (layer, widgetType, widget) => {
  return layer.on && layer.widget === widgetType && widget && widget.find((c) => c.id === layer.id)
}

watch(
  () => [store.config.global.tabTitle.type, store.currentTime],
  () => {
    setTabTitle()
  }
)

const setTabTitle = () => {
  if (store.config.global.tabTitle.type === 'custom') {
    document.title = store.config.global.tabTitle.custom
  } else if (store.config.global.tabTitle.type === 'datetime') {
    document.title = DateTime.fromJSDate(store.currentTime).toFormat(store.config.global.tabTitle.datetime)
  } else {
    document.title = 'New Tab'
  }
}
</script>

<template>
  <div class="newTab" :style="generateNewTabStyles">
    <WallpaperLayer></WallpaperLayer>
    <ToolBar v-if="store.config.toolbar.on" />
    <div class="tabGrid" :style="generateTabGridStyles">
      <div><!--Placeholder to help setup outliner styles--></div>
      <template v-for="(layer, index) in store.config.layers" :key="layer.id">
        <AnalogClockWidget
          v-if="widgetNullCheck(layer, 'analogClock', store.config.analogClocks)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.analogClocks.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </AnalogClockWidget>
        <div v-if="!layer.on && layer.widget === 'analogClock'"></div>
        <BinaryClockWidget
          v-if="widgetNullCheck(layer, 'binaryClock', store.config.binaryClocks)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.binaryClocks.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </BinaryClockWidget>
        <div v-if="!layer.on && layer.widget === 'binaryClock'"></div>
        <DigitalClockWidget
          v-if="widgetNullCheck(layer, 'digitalClock', store.config.digitalClocks)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.digitalClocks.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </DigitalClockWidget>
        <div v-if="!layer.on && layer.widget === 'digitalClock'"></div>
        <DateWidget
          v-if="widgetNullCheck(layer, 'date', store.config.dates)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.dates.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </DateWidget>
        <div v-if="!layer.on && layer.widget === 'date'"></div>
        <SearchBarWidget
          v-if="widgetNullCheck(layer, 'searchBar', store.config.searchBars)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.searchBars.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </SearchBarWidget>
        <div v-if="!layer.on && layer.widget === 'searchBar'"></div>
        <WeatherWidget
          v-if="widgetNullCheck(layer, 'weather', store.config.weathers)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.weathers.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </WeatherWidget>
        <NotepadWidget
          v-if="widgetNullCheck(layer, 'notepad', store.config.notepads)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.notepads.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </NotepadWidget>
        <div v-if="!layer.on && layer.widget === 'notepad'"></div>
        <QuoteWidget
          v-if="widgetNullCheck(layer, 'quote', store.config.quotes)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.quotes.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </QuoteWidget>
        <div v-if="!layer.on && layer.widget === 'quote'"></div>
        <QuickLinksWidget
          v-if="widgetNullCheck(layer, 'quickLinks', store.config.quickLinks)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.quickLinks.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </QuickLinksWidget>
        <div v-if="!layer.on && layer.widget === 'quickLinks'"></div>
        <LoadsheddingWidget
          v-if="widgetNullCheck(layer, 'loadshedding', store.config.loadsheddings)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.loadsheddings.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </LoadsheddingWidget>
        <div v-if="!layer.on && layer.widget === 'loadshedding'"></div>
        <ShapeWidget
          v-if="widgetNullCheck(layer, 'shape', store.config.shapes)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.shapes.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </ShapeWidget>
        <div v-if="!layer.on && layer.widget === 'shape'"></div>
        <TextWidget
          v-if="widgetNullCheck(layer, 'text', store.config.texts)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.texts.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </TextWidget>
        <div v-if="!layer.on && layer.widget === 'text'"></div>
        <TodoWidget
          v-if="widgetNullCheck(layer, 'todo', store.config.todos)"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.todos.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </TodoWidget>
        <div v-if="!layer.on && layer.widget === 'todo'"></div>
      </template>
    </div>
    <div v-if="store.showGrid" class="positioningGrid"></div>
    <ToggleSettings></ToggleSettings>
    <WelcomePage v-if="store.status === 'installed'" />

    <!-- Currently only showing if prevVersion is within v3.X.X. Normal updates shouldn't show an update page -->
    <UpdatedPage v-if="store.status === 'updated' && checkVersionInRange(store.prevVersion, '3.X.X')" />
  </div>
</template>

<style lang="scss">
.positioningGrid {
  --grid-spacing: 100px;
  --grid-color: rgba(255, 255, 255, 0.3);
  --shadow-color: rgba(0, 0, 0, 0.2);
  --line-color: rgba(255, 255, 255, 1);
  position: fixed;
  z-index: 20;
  inset: 0;
  overflow: hidden;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='1' viewBox='0 0 100 1'%3E%3Cline x1='0' y1='0' x2='100' y2='0' stroke='%23000000' stroke-opacity='0.2' stroke-width='1' stroke-dasharray='2,6'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='100' viewBox='0 0 1 100'%3E%3Cline x1='0' y1='0' x2='0' y2='100' stroke='%23000000' stroke-opacity='0.2' stroke-width='1' stroke-dasharray='2,6'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='1' viewBox='0 0 100 1'%3E%3Cline x1='0' y1='0' x2='100' y2='0' stroke='%23ffffff' stroke-opacity='0.3' stroke-width='1' stroke-dasharray='2,6'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='100' viewBox='0 0 1 100'%3E%3Cline x1='0' y1='0' x2='0' y2='100' stroke='%23ffffff' stroke-opacity='0.3' stroke-width='1' stroke-dasharray='2,6'/%3E%3C/svg%3E");
  background-position: calc(50% - 1px) calc(50% - 1px), calc(50% - 1px) calc(50% - 1px), 50% 50%, 50% 50%;
  background-size: var(--grid-spacing) var(--grid-spacing);
  background-repeat: repeat;
  pointer-events: none;
  &::before,
  &::after {
    content: '';
    position: absolute;
    pointer-events: none;
  }
  &::before {
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, hsl(0deg 0% 100% / 0.5) 50%, hsl(0deg 0% 0% / 0.5) 50%);
    background-size: 8px 1px;
    translate: 0 -1px;
  }

  &::after {
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom, hsl(0deg 0% 100% / 0.5) 50%, hsl(0deg 0% 0% / 0.5) 50%);
    background-size: 1px 8px;
    translate: -1px 0;
  }
}

.outliner {
  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    outline: 5px solid hsl(0deg 100% 50% / 50%);
    outline-offset: -5px;
    pointer-events: none;
  }
  &::after {
    outline: 1px solid hsl(0deg 0% 100% / 80%);
  }

  &:nth-child(10n + 2)::before {
    outline-color: hsl(0deg 100% 50% / 50%);
  }

  &:nth-child(10n + 3)::before {
    outline-color: hsl(30deg 100% 50% / 50%);
  }

  &:nth-child(10n + 4)::before {
    outline-color: hsl(60deg 100% 50% / 50%);
  }

  &:nth-child(10n + 5)::before {
    outline-color: hsl(90deg 100% 50% / 50%);
  }

  &:nth-child(10n + 6)::before {
    outline-color: hsl(120deg 100% 50% / 50%);
  }

  &:nth-child(10n + 7)::before {
    outline-color: hsl(150deg 100% 50% / 50%);
  }

  &:nth-child(10n + 8)::before {
    outline-color: hsl(180deg 100% 50% / 50%);
  }

  &:nth-child(10n + 9)::before {
    outline-color: hsl(210deg 100% 50% / 50%);
  }

  &:nth-child(10n + 10)::before {
    outline-color: hsl(240deg 100% 50% / 50%);
  }

  &:nth-child(10n + 11)::before {
    outline-color: hsl(255deg 100% 50% / 50%);
  }
}
</style>

<style lang="scss" scoped>
.newTab {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  transform-origin: 100% 100%;
  transform: translate(0, 0) scale(1);
  background-size: cover;
  background-position: center;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.tabGrid {
  position: absolute;
  inset: 0;
  z-index: 10;
  color: v-bind(getTextColor);
  text-shadow: v-bind(getTextShadow);
  user-select: var(--textSelection);
}

.gridPosition {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  width: max-content;
}

.forceLineBreak {
  display: flex;
  width: 100%;
}

#nw {
  top: 0;
  left: 0;
  justify-content: flex-start;
  align-items: flex-start;

  .forceLineBreak {
    justify-content: flex-start;
  }
}

#n {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  align-items: center;

  .forceLineBreak {
    justify-content: center;
  }
}

#ne {
  top: 0;
  right: 0;
  justify-content: flex-end;
  align-items: flex-start;

  .forceLineBreak {
    justify-content: flex-end;
  }
}

#w {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  justify-content: flex-start;
  align-items: center;

  .forceLineBreak {
    justify-content: flex-start;
  }
}

#c {
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  justify-content: center;
  align-items: center;

  .forceLineBreak {
    justify-content: center;
  }
}

#e {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  justify-content: flex-end;
  align-items: center;

  .forceLineBreak {
    justify-content: flex-end;
  }
}

#sw {
  bottom: 0;
  left: 0;
  justify-content: flex-start;
  align-items: flex-end;

  .forceLineBreak {
    justify-content: flex-start;
  }
}

#s {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  align-items: flex-end;

  .forceLineBreak {
    justify-content: center;
  }
}

#se {
  bottom: 80px;
  right: 0;
  justify-content: flex-end;
  align-items: flex-end;

  .forceLineBreak {
    justify-content: flex-end;
  }
}
</style>
