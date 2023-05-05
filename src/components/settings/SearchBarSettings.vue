<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()

const ci = ref(store.config.searchBars.findIndex((c) => c.id === store.editing))

const selectFont = (font) => {
  if (font) {
    let newSearchBars = [...store.config.searchBars]
    newSearchBars[newSearchBars.findIndex((c) => c.id === store.config.searchBars[ci.value].id)].w.ff = font
    store.$patch({ config: { searchBars: newSearchBars } })
  }
}
</script>

<template>
  <div class="page">
    <h2 class="title">
      <button
        class="back"
        aria-label="Go back to previous page"
        title="Go back to previous page"
        @click="store.goTo('dashboard')"
      >
        <fa icon="fa-circle-left" fixed-width></fa>
      </button>
      Search Bar <span style="font-size: 0.7em; opacity: 0.7">({{ store.config.searchBars[ci].id }})</span>
    </h2>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField
        v-model:width="store.config.searchBars[ci].w.w"
        v-model:height="store.config.searchBars[ci].w.h"
        v-model:autoSize="store.config.searchBars[ci].w.as"
        v-model:align="store.config.searchBars[ci].w.a"
        v-model:calign="store.config.searchBars[ci].w.ca"
        v-model:x="store.config.searchBars[ci].w.x"
        v-model:y="store.config.searchBars[ci].w.y"
      >
      </SizeAndPositionField>
      <WidgetFontField
        v-model:override="store.config.searchBars[ci].w.orf"
        v-model:cl="store.config.searchBars[ci].w.cl"
        v-model:fs="store.config.searchBars[ci].w.fs"
        v-model:fb="store.config.searchBars[ci].w.fb"
        v-model:fi="store.config.searchBars[ci].w.fi"
        v-model:fu="store.config.searchBars[ci].w.fu"
        v-model:ls="store.config.searchBars[ci].w.ls"
        v-model:ts="store.config.searchBars[ci].w.ts"
        v-model:tt="store.config.searchBars[ci].w.tt"
        :ff="store.config.searchBars[ci].w.ff"
        @update:ff="selectFont($event)"
      >
      </WidgetFontField>
      <WidgetBoxField
        v-model:override="store.config.searchBars[ci].w.cor"
        v-model:rounded="store.config.searchBars[ci].w.crd"
        v-model:bs="store.config.searchBars[ci].w.cbs"
        v-model:bc="store.config.searchBars[ci].w.cbc"
        v-model:bg="store.config.searchBars[ci].w.cbg"
        v-model:shadow="store.config.searchBars[ci].w.csh"
        v-model:padding="store.config.searchBars[ci].w.cpd"
      >
      </WidgetBoxField>
    </div>
    <h3 class="subtitle">Search Bar options</h3>
    <div class="blockContainer"></div>
  </div>
</template>
