<script setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { storeToRefs } from 'pinia'
import NewTab from '@/components/NewTab.vue'
import SettingsPanel from '@/components/settings/SettingsPanel.vue'
import LoadingOverlay from '@/components/elements/LoadingOverlay.vue'
import { fontList } from '@/assets/lists.js'
import { ExtPay } from '@/assets/ExtPay.js'
import { mergeV3Settings } from '@/helpers/mergeOldSettings.js'

const { locale } = useI18n({ useScope: 'global' })
const extpay = ExtPay('carettab')
const updateUser = inject('updateUser')
const store = useSettingsStore()
const { isLoading, settingsOpen } = storeToRefs(store)

onMounted(async () => {
  await store.load()
  updateTime()
  locale.value = store.config.global.lang

  // Run a full user check against the server now that the app has loaded
  const refreshUserCheck = () => {
    extpay
      .getUser()
      .then((u) => {
        updateUser(u)
      })
      .then(() => {
        mergeV3Settings(true)
      })
  }
  refreshUserCheck()
})

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
  return '"Source Sans Pro"'
})

const buildFontLink = computed(() => {
  const base = 'https://fonts.googleapis.com/css2?family='
  const post = '&display=swap'
  let wght = '400'
  if (store.config.global.font.bold < 400) {
    wght = `${store.config.global.font.bold};400`
  } else if (store.config.global.font.bold > 400) {
    wght = `400;${store.config.global.font.bold}`
  }
  return `${base}${store.config.global.font.family}:wght@${wght}${post}`
})
</script>

<template>
  <div class="appInner">
    <link id="google-font-link" rel="stylesheet" :href="buildFontLink" />
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
