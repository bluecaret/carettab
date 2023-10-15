<script setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, inject, watch } from 'vue'
import { useSettingsStore, getStorage, setStorage } from '@/store.js'
import { storeToRefs } from 'pinia'
import NewTab from '@/components/NewTab.vue'
import SettingsPanel from '@/components/settings/SettingsPanel.vue'
import LoadingOverlay from '@/components/elements/LoadingOverlay.vue'
import { fontList } from '@/assets/lists.js'
import { ExtPay } from '@/assets/ExtPay.js'
import { checkVersionInRange } from '@/helpers/data.js'
import { mergeV3Settings } from '@/helpers/mergeOldSettings.js'
import PremiumModal from '@/components/elements/PremiumModal.vue'
import 'intro.js/introjs.css'

const { locale } = useI18n({ useScope: 'global' })
const extpay = ExtPay('carettab')
const updateUser = inject('updateUser')
const store = useSettingsStore()
const { isLoading, settingsOpen } = storeToRefs(store)

onMounted(async () => {
  await store.load()
  setupTempSettings()
  refreshUserCheck()
  applyUserColorSchemePreference()
  // store.intro
  //   .setOptions({
  //     steps: [
  //       {
  //         element: document.querySelector('.settingsToggleWrapper'),
  //         title: 'Get started with CaretTab!',
  //         intro: 'Click the settings button to start configuring CaretTab',
  //       },
  //       {
  //         element: document.querySelector('.addWidgetBar .addBtn:first-child'),
  //         title: 'Next step',
  //         intro: 'next step',
  //       },
  //     ],
  //     showProgress: true,
  //     showBullets: false,
  //     exitOnOverlayClick: false,
  //     disableInteraction: false,
  //   })
  //   .onbeforechange(function (targetElement) {
  //     console.log('open settings', this._currentStep, targetElement)
  //     nextStep(this._currentStep)
  //   })
  // store.intro.start()
})

// const nextStep = (step) => {
//   console.log('Run function when next button is clicked', step)
//   switch (step) {
//     case 1:
//       store.settingsOpen = true
//       break

//     default:
//       break
//   }
// }

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

// Run a full user check against the server now that the app has loaded
const refreshUserCheck = async () => {
  try {
    const getUser = await extpay.getUser()
    updateUser({ ...getUser })
  } catch (error) {
    console.warn('Failed to check extensionPay user', error)
  }
  // after checking paid status, run v3 migration
  if (store.status === 'updated' && checkVersionInRange(store.prevVersion, '3.X.X')) {
    mergeV3Settings()
  }

  // If status is still set to installed, but there are already layers,
  // this is probably incorrect and needs changed to existing.
  if (store.status === 'installed' && store.config.layers?.length > 0) {
    store.status = 'existing'
    setStorage({ status: 'existing' }, 'local')
  }
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
    <PremiumModal />
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
