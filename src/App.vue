<script setup>
import { computed, onMounted, inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { storeToRefs } from 'pinia'
import NewTab from '@/components/NewTab.vue'
import SettingsPanel from '@/components/settings/SettingsPanel.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { fontList } from '@/assets/lists.js'
import { ExtPay } from '@/assets/ExtPay.js'

const extpay = ExtPay('carettab')
const user = inject('user')
const store = useSettingsStore()
const { isLoading, settingsOpen } = storeToRefs(store)

onMounted(() => {
  store.load()
  updateTime()

  // Run a full user check against the server now that the app has loaded
  const refreshUserCheck = () => {
    extpay.getUser().then((u) => {
      user.value = u
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
  if (store.config.global.bg && store.config.global.bg[0]) {
    return `${store.config.global.bg[0]}deg`
  }
  return '0deg'
})

const getBgSaturation = computed(() => {
  if (store.config.global.bg && store.config.global.bg[1]) {
    return `${store.config.global.bg[1]}%`
  }
  return '0%'
})

const getBgLightness = computed(() => {
  if (store.config.global.bg && store.config.global.bg[2]) {
    return `${store.config.global.bg[2]}%`
  }
  return '0%'
})

const getFontFamily = computed(() => {
  let ff = fontList.find((font) => font.id === store.config.global.ff)
  if (store.config.global.ff && ff) {
    return `'${ff.label}'`
  }
  return 'Source Sans Pro'
})

const buildFontLink = computed(() => {
  const base = 'https://fonts.googleapis.com/css2?family='
  const post = '&display=swap'
  let wght = '400'
  if (store.config.global.fb < 400) {
    wght = `${store.config.global.fb};400`
  } else if (store.config.global.fb > 400) {
    wght = `400;${store.config.global.fb}`
  }
  return `${base}${store.config.global.ff}:wght@${wght}${post}`
})
</script>

<template>
  <div class="appInner">
    <select id="locale" v-model="$i18n.locale" style="position: fixed; z-index: 9999; bottom: 0">
      <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
    </select>
    <link id="google-font-link" rel="stylesheet" :href="buildFontLink" />
    <NewTab></NewTab>
    <SettingsPanel v-if="settingsOpen"></SettingsPanel>
    <div id="modals"></div>
    <LoadingOverlay v-if="isLoading"></LoadingOverlay>
  </div>
</template>

<style>
.appInner {
  font-family: v-bind(getFontFamily);
  font-weight: v-bind('store.config.global.fb');
  --bgHue: v-bind(getBgHue);
  --bgSat: v-bind(getBgSaturation);
  --bgLight: v-bind(getBgLightness);
}
</style>
