<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()

const ci = ref(store.config.searchBars.findIndex((c) => c.id === store.editing))
</script>

<template>
  <div class="page">
    <PageHeading title="Search Bar" :widget-id="store.config.searchBars[ci].id"></PageHeading>
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
        v-model:ff="store.config.searchBars[ci].w.ff"
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
