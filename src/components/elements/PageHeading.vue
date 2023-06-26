<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  widgetId: String,
  backPage: String,
})

const backBtnEl = ref(null)

onMounted(() => {
  backBtnEl.value.focus()
})

const handleSave = () => {
  store.save()
  store.isLoading = true
  setTimeout(() => {
    store.isLoading = false
  }, 300)
}

const handleGoBackBtn = () => {
  if (store.settingsPage === 'dashboard') {
    store.settingsOpen = false
  } else {
    store.goTo(props.backPage || 'dashboard')
  }
}
</script>

<template>
  <header class="header">
    <button
      ref="backBtnEl"
      class="btn goBack"
      type="button"
      :aria-label="store.settingsPage === 'dashboard' ? 'Close' : 'Go back'"
      :title="store.settingsPage === 'dashboard' ? 'Close and save settings' : 'Go back to previous page'"
      @click="handleGoBackBtn()"
    >
      <fa :icon="store.settingsPage === 'dashboard' ? 'fa-xmark' : 'fa-caret-left'" size="lg" />
    </button>
    <h1>
      {{ props.title }} <span v-if="widgetId" class="widgetId" title="Widget ID Number">{{ widgetId }}</span>
    </h1>
    <div class="headerLinks">
      <div class="btnGroup">
        <button
          class="btn previewBtn"
          aria-label="Hide settings"
          @mouseenter="store.togglePanelPreview = true"
          @mouseleave="store.togglePanelPreview = false"
          @click="store.togglePanelPreview = true"
          @blur="store.togglePanelPreview = false"
        >
          <fa icon="fa-eye" fixed-width></fa>
        </button>
        <button
          class="btn"
          :class="{ active: store.showOutliner }"
          aria-label="Toggle widget outlines"
          title="Shows an outline around all widgets. Useful when positioning widgets."
          @click="store.showOutliner = !store.showOutliner"
        >
          <fa icon="fa-vector-square" fixed-width></fa>
        </button>
        <button
          class="btn"
          :class="{ active: store.panelMove }"
          aria-label="Move settings"
          title="Temporarily move the settings panel to the opposite side of the screen."
          @click="store.panelMove = !store.panelMove"
        >
          <fa v-if="!store.panelMove" icon="fa-arrow-right-to-bracket" rotation="180" fixed-width></fa>
          <fa v-if="store.panelMove" icon="fa-arrow-right-to-bracket" fixed-width></fa>
        </button>
      </div>
      <button class="btn" aria-label="Save" title="Save all current settings" @click="handleSave()">
        <fa icon="fa-floppy-disk"></fa>
        {{ $t('options.common.save') }}
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: +1;
  display: flex;
  align-items: center;
  gap: var(--s4);
  padding: var(--s5);
  background-color: var(--cSettingsHeader);
  border-radius: 0 0 var(--s4) var(--s4);
  .goBack {
    padding: 0;
    width: var(--s7);
    aspect-ratio: 1 / 1;
    display: grid;
    place-items: center;
    border-radius: 50%;
  }
  h1 {
    font-size: 2.4rem;
    font-weight: 300;
    margin: 0;
    span {
      display: inline-block;
      margin-inline-start: var(--s4);
      font-size: 1.4rem;
      font-weight: 400;
      color: var(--cTextSubtle);
      text-transform: uppercase;
    }
  }
  .headerLinks {
    display: flex;
    gap: var(--s4);
    margin-inline-start: auto;
  }
}
</style>
