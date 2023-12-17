<script setup>
import { computed, watch, ref } from 'vue'
import { useSettingsStore } from '@/store.js'
import { storeToRefs } from 'pinia'

const store = useSettingsStore()
const { status, settingsOpen } = storeToRefs(store)
const toggleSettingsEl = ref(null)

const toggleSettings = () => {
  store.$patch({ settingsOpen: !store.settingsOpen })
}

watch(
  () => store.settingsOpen,
  () => {
    if (!store.settingsOpen) toggleSettingsEl.value.focus()
  }
)

const getBaseFontSize = () => {
  if (store.config.global.container.dynamicScaling) {
    return `clamp(12px, 1.66dvw, 20px)`
  }
  return `20px`
}

const getShadow = computed(() => {
  if (store.config.global.font.shadow && store.config.global.font.shadow[0]) {
    return `${store.config.global.font.shadow[1]}px ${store.config.global.font.shadow[2]}px ${store.config.global.font.shadow[3]}px 0px hsl(${store.config.global.font.shadow[4]}deg ${store.config.global.font.shadow[5]}% ${store.config.global.font.shadow[6]}% / ${store.config.global.font.shadow[7]})`
  }
  return 'none'
})

const getTextColor = computed(() => {
  if (store.config.global.font.color && store.config.global.font.color[0]) {
    return `hsl(${store.config.global.font.color[0]}deg ${store.config.global.font.color[1]}% ${store.config.global.font.color[2]}% / ${store.config.global.font.color[3]})`
  }
  return 'white'
})
</script>

<template>
  <div class="settingsToggleWrapper" :style="`font-size: ${getBaseFontSize()}`">
    <div v-if="status === 'highlightSettings'" class="highlightSettings"></div>
    <button
      ref="toggleSettingsEl"
      :class="{ settingsToggle: true, open: settingsOpen, hide: store.config.global.hideSettings }"
      :title="
        settingsOpen
          ? $t('common.closeAndSaveSettings')
          : status === 'updated'
          ? $t('common.updated')
          : $t('common.open')
      "
      @click="toggleSettings"
    >
      <fa v-if="!store.settingsOpen" icon="fa-bars" />
      <div v-if="status === 'updated'" class="updateNotice">NEW!</div>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.settingsToggleWrapper {
  --optionsToggleSize: 3em;
  position: fixed;
  z-index: 50;
  bottom: 0;
  right: 0;
}

.settingsToggle {
  z-index: +1;
  display: grid;
  place-items: center;
  background: transparent;
  border: 0;
  padding: 0;
  width: var(--optionsToggleSize);
  height: var(--optionsToggleSize);
  color: v-bind(getTextColor);
  cursor: pointer;
  overflow: hidden;

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 3px currentColor;
  }

  > .svg-inline--fa {
    opacity: 0.5;
    font-size: 1em;
    transition: opacity 0.5s;
    filter: drop-shadow(v-bind(getShadow));
  }

  &:hover,
  &:focus-visible {
    > .svg-inline--fa {
      opacity: 1;
    }
  }

  &.open {
    width: 100vw;
    height: 100vh;
  }

  &.hide:not(.open) {
    > .svg-inline--fa {
      opacity: 0;
    }

    &:focus-visible,
    &:hover {
      > .svg-inline--fa {
        opacity: 1;
      }
    }
  }

  .updateNotice {
    position: absolute;
    top: 50%;
    right: 2.7em;
    transform: translate(-50%, -50%);
    transform-origin: top left;
    color: black;
    font-size: 0.55em;
    font-weight: 700;
    line-height: 1;
    background-color: goldenrod;
    display: grid;
    place-items: center;
    padding: 0.05rem 0.3rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.3rem 0 black;
    animation: pulse2 1s ease-in-out infinite alternate;
  }

  &.open .quietUpdateNotice {
    opacity: 0;
  }
}

.highlightSettings {
  position: fixed;
  bottom: 0;
  right: 0;
  width: var(--optionsToggleSize);
  height: var(--optionsToggleSize);
  cursor: pointer;
  overflow: hidden;
  background-color: hsl(0deg 0% 0% / 0.7);
  border: 3px solid hsl(0deg 0% 100% / 0.7);
  border-radius: 50%;
  animation: pulse 1s ease-in-out 10 forwards;
  animation-direction: alternate;
  pointer-events: none;
}

@keyframes pulse {
  0% {
    opacity: 0;
    scale: 1;
  }

  100% {
    opacity: 1;
    scale: 3;
  }
}

@keyframes pulse2 {
  0% {
    scale: 1;
  }

  100% {
    scale: 1.2;
  }
}
</style>
