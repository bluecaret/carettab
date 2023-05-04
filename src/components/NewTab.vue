<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/store.js'
import WallpaperLayer from '@/components/WallpaperLayer.vue'
import ToggleSettings from '@/components/settings/ToggleSettings.vue'
import DigitalClockWidget from '@/components/widgets/DigitalClockWidget.vue'
import AnalogClockWidget from '@/components/widgets/AnalogClockWidget.vue'
import BinaryClockWidget from '@/components/widgets/BinaryClockWidget.vue'
import DateWidget from '@/components/widgets/DateWidget.vue'

const store = useSettingsStore()

const getTextShadow = computed(() => {
  if (store.config.global.ts && store.config.global.ts[0]) {
    return `${store.config.global.ts[1]}px ${store.config.global.ts[2]}px ${store.config.global.ts[3]}px hsl(${store.config.global.ts[4]}deg ${store.config.global.ts[5]}% ${store.config.global.ts[6]}% / ${store.config.global.ts[7]})`
  }
  return 'none'
})

const getTextColor = computed(() => {
  if (store.config.global.cl && store.config.global.cl[0]) {
    return `hsl(${store.config.global.cl[0]}deg ${store.config.global.cl[1]}% ${store.config.global.cl[2]}% / ${store.config.global.cl[3]})`
  }
  return 'white'
})

const getBgColor = computed(() => {
  if (store.config.global.bg) {
    return `hsl(${store.config.global.bg[0]}deg ${store.config.global.bg[1]}% ${store.config.global.bg[2]}% / ${store.config.global.bg[3]})`
  }
  return 'black'
})
</script>

<template>
  <div class="newTab">
    <WallpaperLayer></WallpaperLayer>
    <div class="tabGrid">
      <template v-for="(layer, index) in store.config.layers" :key="layer.id">
        <AnalogClockWidget
          v-if="layer.on && layer.widget === 'analogClock'"
          :class="{ outliner: store.showOutliner }"
          :clock="store.config.analogClocks.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </AnalogClockWidget>
        <div v-if="!layer.on && layer.widget === 'analogClock'"></div>
        <BinaryClockWidget
          v-if="layer.on && layer.widget === 'binaryClock'"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.binaryClocks.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </BinaryClockWidget>
        <div v-if="!layer.on && layer.widget === 'binaryClock'"></div>
        <DigitalClockWidget
          v-if="layer.on && layer.widget === 'digitalClock'"
          :class="{ outliner: store.showOutliner }"
          :clock="store.config.digitalClocks.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </DigitalClockWidget>
        <div v-if="!layer.on && layer.widget === 'digitalClock'"></div>
        <DateWidget
          v-if="layer.on && layer.widget === 'date'"
          :class="{ outliner: store.showOutliner }"
          :widget="store.config.dates.find((c) => c.id === layer.id)"
          :style="`z-index: ${store.config.layers.length - index}`"
        >
        </DateWidget>
        <div v-if="!layer.on && layer.widget === 'date'"></div>
      </template>
    </div>
    <ToggleSettings></ToggleSettings>
  </div>
</template>

<style lang="scss">
.outliner {
  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    outline: 5px solid hsl(0deg 100% 50% / 50%);
    pointer-events: none;
  }
  &::after {
    outline: 1px solid hsl(0deg 0% 100% / 80%);
  }

  &:nth-child(10n + 1)::before {
    outline-color: hsl(0deg 100% 50% / 50%);
  }

  &:nth-child(10n + 2)::before {
    outline-color: hsl(30deg 100% 50% / 50%);
  }

  &:nth-child(10n + 3)::before {
    outline-color: hsl(60deg 100% 50% / 50%);
  }

  &:nth-child(10n + 4)::before {
    outline-color: hsl(90deg 100% 50% / 50%);
  }

  &:nth-child(10n + 5)::before {
    outline-color: hsl(120deg 100% 50% / 50%);
  }

  &:nth-child(10n + 6)::before {
    outline-color: hsl(150deg 100% 50% / 50%);
  }

  &:nth-child(10n + 7)::before {
    outline-color: hsl(180deg 100% 50% / 50%);
  }

  &:nth-child(10n + 8)::before {
    outline-color: hsl(210deg 100% 50% / 50%);
  }

  &:nth-child(10n + 9)::before {
    outline-color: hsl(240deg 100% 50% / 50%);
  }

  &:nth-child(10n + 10)::before {
    outline-color: hsl(255deg 100% 50% / 50%);
  }
}
</style>

<style lang="scss" scoped>
$bookmarksBarHeight: 33px;

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
  background-color: v-bind(getBgColor);
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
  // pointer-events: none;

  &.tabGridBookmarksBar {
    top: $bookmarksBarHeight;
  }
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
