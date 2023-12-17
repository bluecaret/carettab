<script setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, watch } from 'vue'
import { useSettingsStore, getStorage, setStorage } from '@/store.js'
import { storeToRefs } from 'pinia'
import NewTab from '@/components/NewTab.vue'
import SettingsPanel from '@/components/settings/SettingsPanel.vue'
import LoadingOverlay from '@/components/elements/LoadingOverlay.vue'
import { fontList } from '@/assets/lists.js'
import { checkVersionInRange } from '@/helpers/data.js'
import { mergeV3Settings } from '@/helpers/mergeOldSettings.js'

const { locale } = useI18n({ useScope: 'global' })
const store = useSettingsStore()
const { isLoading, settingsOpen } = storeToRefs(store)

onMounted(async () => {
  await store.load()
  setupTempSettings()

  if (store.status === 'updated' && checkVersionInRange(store.prevVersion, '3.X.X')) {
    mergeV3Settings()
  }

  // If status is still set to installed, but there are already layers,
  // this is probably incorrect and needs changed to existing.
  if (store.status === 'installed' && store.config.layers?.length > 0) {
    store.status = 'existing'
    setStorage({ status: 'existing' }, 'local')
  }

  applyUserColorSchemePreference()
})

watch(
  () => store.config.global.mode,
  () => {
    applyUserColorSchemePreference()
  }
)

const applyUserColorSchemePreference = () => {
  const body = document.body

  if (store.config.global.mode && store.config.global.mode !== 'auto') {
    switch (store.config.global.mode) {
      case 'dark':
        body.className = 'darkMode'
        break
      case 'darkGray':
        body.className = 'darkGrayMode'
        break
      case 'light':
        body.className = 'lightMode'
        break
      case 'lightGray':
        body.className = 'lightGrayMode'
        break
      default:
        body.className = 'darkMode'
        break
    }
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.className = 'darkMode'
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      body.className = 'lightMode'
    } else {
      body.className = 'defaultMode'
    }
  }
}

const setupTempSettings = async () => {
  updateTime()

  locale.value = store.config.global.lang

  const whatsNew = await getStorage('clearWhatsNewBox', 'local')
  store.clearWhatsNewBox = whatsNew.clearWhatsNewBox
}

const updateTime = () => {
  store.currentTime = new Date()
  setInterval(() => {
    store.currentTime = new Date()
  }, 1000)
}

const getBgHue = computed(() => {
  if (store.config.global.wallpaper.background && store.config.global.wallpaper.background[0]) {
    return `${store.config.global.wallpaper.background[0]}deg`
  }
  return '0deg'
})

const getBgSaturation = computed(() => {
  if (store.config.global.wallpaper.background && store.config.global.wallpaper.background[1]) {
    return `${store.config.global.wallpaper.background[1]}%`
  }
  return '0%'
})

const getBgLightness = computed(() => {
  if (store.config.global.wallpaper.background && store.config.global.wallpaper.background[2]) {
    return `${store.config.global.wallpaper.background[2]}%`
  }
  return '0%'
})

const getFontFamily = computed(() => {
  let ff = fontList.find((font) => font.id === store.config.global.font.family)
  if (store.config.global.font.family && ff) {
    return `"${ff.label}"`
  }
  return '"Source Sans 3"'
})
</script>

<template>
  <div class="appInner">
    <FontLink :global="true"></FontLink>
    <NewTab></NewTab>
    <SettingsPanel v-if="settingsOpen"></SettingsPanel>
    <div id="modals"></div>
    <div id="dropdowns"></div>
    <LoadingOverlay v-if="isLoading"></LoadingOverlay>
  </div>
</template>

<style>
.appInner {
  font-family: v-bind(getFontFamily);
  font-weight: v-bind('store.config.global.font.bold');
  --bgHue: v-bind(getBgHue);
  --bgSat: v-bind(getBgSaturation);
  --bgLight: v-bind(getBgLightness);
}
</style>
