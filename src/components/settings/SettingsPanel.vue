<script setup>
import { ref, onMounted, onUnmounted, inject, watch, nextTick } from 'vue'
import { useSettingsStore } from '@/store.js'
import { storeToRefs } from 'pinia'
import DashboardSettings from '@/components/settings/DashboardSettings.vue'
import AdvancedSettings from '@/components/settings/AdvancedSettings.vue'
import PatternsList from '@/components/settings/PatternsList.vue'
import UnsplashList from '@/components/settings/UnsplashList.vue'
import PexelsList from '@/components/settings/PexelsList.vue'
import AnalogClockSettings from '@/components/widgets/AnalogClockSettings.vue'
import BinaryClockSettings from '@/components/widgets/BinaryClockSettings.vue'
import DigitalClockSettings from '@/components/widgets/DigitalClockSettings.vue'
import DateSettings from '@/components/widgets/DateSettings.vue'
import SearchBarSettings from '@/components/widgets/SearchBarSettings.vue'
import WeatherSettings from '@/components/widgets/WeatherSettings.vue'
import NotepadSettings from '@/components/widgets/NotepadSettings.vue'
import QuoteSettings from '@/components/widgets/QuoteSettings.vue'
import QuickLinksSettings from '@/components/widgets/QuickLinksSettings.vue'
import IframeSettings from '@/components/widgets/IframeSettings.vue'
import CountdownSettings from '@/components/widgets/CountdownSettings.vue'
import LoadsheddingSettings from '@/components/widgets/LoadsheddingSettings.vue'
import FidgetSettings from '@/components/widgets/FidgetSettings.vue'
import SnakeSettings from '@/components/widgets/SnakeSettings.vue'
import ShapeSettings from '@/components/widgets/ShapeSettings.vue'
import TextSettings from '@/components/widgets/TextSettings.vue'
import TodoSettings from '@/components/widgets/TodoSettings.vue'

const user = inject('user')
const store = useSettingsStore()
const { settingsPage } = storeToRefs(store)
const panelEl = ref(null)
const premiumBtnRef = ref(null)

let ver = ref('#.#.#')

onMounted(async () => {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
      const manifest = chrome.runtime.getManifest()
      ver.value = manifest.version
    }
  } catch (error) {
    console.warn('Warning, failed to get version number:', error)
  }
})

onUnmounted(() => {
  store.save()
})

watch(
  () => store.settingsPage,
  () => {
    nextTick(() => {
      panelEl.value.scrollTo({ top: 0 })
    })
  }
)

const getReviewLink = () => {
  if (navigator.userAgent.match(/edg/i)) {
    return 'https://microsoftedge.microsoft.com/addons/detail/bfpmncaohmjelebfobabccfjgmeolloe'
  }
  return 'https://chrome.google.com/webstore/detail/carettab-new-tab-clock-an/cojpndognjdcakkimaloeealehpkljna/reviews'
}

const handleOpenPremiumModal = () => {
  store.showPremiumModal = true
  store.premiumModalBtnRef = premiumBtnRef.value
}
</script>

<template>
  <div
    id="settings"
    ref="panelEl"
    class="panel"
    :class="{ panelPreview: store.togglePanelPreview, panelMove: store.panelMove }"
  >
    <DashboardSettings v-if="['dashboard'].includes(settingsPage)"></DashboardSettings>
    <AdvancedSettings v-if="['advanced'].includes(settingsPage)" />
    <PatternsList v-if="['patterns'].includes(settingsPage)"></PatternsList>
    <UnsplashList v-if="['unsplash'].includes(settingsPage)"></UnsplashList>
    <PexelsList v-if="['pexels'].includes(settingsPage)"></PexelsList>
    <AnalogClockSettings v-if="['analogClock'].includes(settingsPage)"></AnalogClockSettings>
    <BinaryClockSettings v-if="['binaryClock'].includes(settingsPage)"></BinaryClockSettings>
    <DigitalClockSettings v-if="['digitalClock'].includes(settingsPage)"></DigitalClockSettings>
    <DateSettings v-if="['date'].includes(settingsPage)"></DateSettings>
    <SearchBarSettings v-if="['searchBar'].includes(settingsPage)"></SearchBarSettings>
    <WeatherSettings v-if="['weather'].includes(settingsPage)"></WeatherSettings>
    <NotepadSettings v-if="['notepad'].includes(settingsPage)"></NotepadSettings>
    <QuoteSettings v-if="['quote'].includes(settingsPage)"></QuoteSettings>
    <QuickLinksSettings v-if="['quickLinks'].includes(settingsPage)"></QuickLinksSettings>
    <IframeSettings v-if="['iframe'].includes(settingsPage)"></IframeSettings>
    <CountdownSettings v-if="['countdown'].includes(settingsPage)"></CountdownSettings>
    <LoadsheddingSettings v-if="['loadshedding'].includes(settingsPage)"></LoadsheddingSettings>
    <FidgetSettings v-if="['fidget'].includes(settingsPage)"></FidgetSettings>
    <SnakeSettings v-if="['snake'].includes(settingsPage)"></SnakeSettings>
    <ShapeSettings v-if="['shape'].includes(settingsPage)"></ShapeSettings>
    <TextSettings v-if="['text'].includes(settingsPage)"></TextSettings>
    <TodoSettings v-if="['todo'].includes(settingsPage)"></TodoSettings>
    <footer class="footer">
      <a href="https://carettab.com" class="btn btnText appName">
        <svg :alt="$t('settings.logoAlt')" class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 369">
          <path
            d="M20 332 201 18h99l181 314-10 19H334l-83-145-84 145H31l-11-19Zm32-7h101l87-150h21l87 150h101L286 43h-70L52 325Z"
          />
          <circle cx="208.3" cy="30.1" r="30.1" />
          <circle cx="292.7" cy="30.1" r="30.1" />
          <circle cx="250.6" cy="184" r="30.1" />
          <circle cx="470.5" cy="338" r="30.1" />
          <circle cx="340.8" cy="338.4" r="30.1" />
          <circle cx="160.2" cy="338.4" r="30.1" />
          <circle cx="30.7" cy="338" r="30.1" />
        </svg>
        CaretTab
      </a>
      <DropdownMenu ref="newWidgetMenu" style="width: auto">
        <template #button>
          <button class="btn btnText" type="button">
            <fa icon="fa-info" fixed-width></fa>
            {{ $t('settings.infoMenu') }}
          </button>
        </template>
        <template #menu>
          <div class="block">
            <div class="group stack" style="gap: 1.6rem">
              <div class="group stack compact">
                <div>
                  <small class="version">{{ $t('settings.version', [ver]) }}</small>
                </div>
                <div>
                  <a href="https://www.carettab.com/" class="link">{{ store.tSplit($t('settings.credit'))[0] }}</a
                  >{{ store.tSplit($t('settings.credit'))[1] }}
                  <a href="https://www.bluecaret.com" class="link">{{ store.tSplit($t('settings.credit'))[2] }}</a
                  >{{ store.tSplit($t('settings.credit'))[3] }}
                  <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" class="link">{{
                    store.tSplit($t('settings.credit'))[4]
                  }}</a
                  >{{ store.tSplit($t('settings.credit'))[5] }}
                </div>
              </div>
              <div class="group compact">
                <a class="btn fit" href="https://github.com/bluecaret/carettab/wiki/Changelog">{{
                  $t('settings.changelog')
                }}</a>
                <a class="btn fit" href="https://www.bluecaret.com/about">{{ $t('settings.aboutBluecaret') }}</a>
                <a class="btn fit" href="https://www.bluecaret.com/privacy">{{ $t('settings.privacyPolicy') }}</a>
                <a class="btn fit" href="https://www.bluecaret.com/terms">{{ $t('settings.termsOfUse') }}</a>
              </div>
            </div>
          </div>
        </template>
      </DropdownMenu>
      <a href="https://carettab.com/help" class="btn btnText" target="_blank">
        <fa icon="fa-question" fixed-width></fa>
        {{ $t('settings.help') }}
      </a>
      <a :href="getReviewLink()" class="btn btnText" target="_blank">
        <fa icon="fa-star-half-stroke" fixed-width></fa>
        {{ $t('dashboard.review') }}
      </a>
      <button
        ref="premiumBtnRef"
        class="btn footerPremium mla"
        :class="user.paid ? 'footerPremiumPaid' : ''"
        type="button"
        @click="handleOpenPremiumModal()"
      >
        <div>
          <fa icon="fa-gem" fixed-width></fa>
          {{ user.paid ? $t('settings.youHavePremiumAccess') : $t('settings.getPremiumAccess') }}
        </div>
        <span v-if="user.paid">{{ $t('settings.manageSubscription') }}</span>
      </button>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  width: var(--s7);
  height: auto;

  * {
    fill: var(--cText);
  }
}

.appName {
  display: flex;
  align-items: center;
  gap: var(--s4);
  color: var(--cText);
  // font-size: 2rem;
  // font-weight: 300;
  letter-spacing: 0.03em;
  margin: 0;
  cursor: pointer;
}

.version {
  color: var(--cTextSubtle);
}

.previewBtn {
  cursor: zoom-in;
}

.footer {
  position: sticky;
  bottom: 0;
  margin-top: auto;
  display: flex;
  border-radius: var(--s4) var(--s4) 0 0;
  font-size: 1.4rem;
  font-weight: 400;
  background-color: var(--cSettingsFooter);
  padding: var(--s4) var(--s4) var(--s4) var(--s5);
  gap: var(--s4);
  align-items: center;
}

.footerPremium {
  --getPremiumAdBg: var(--cPremium);
  --getPremiumAdBg2: var(--cPremium2);
  --getPremiumAdColor: hsla(0, 0%, 0%, 1);
  color: var(--getPremiumAdColor);
  background-color: var(--getPremiumAdBg);
  background-image: radial-gradient(80% 85% at 0% 0%, var(--getPremiumAdBg2) 0%, var(--getPremiumAdBg) 100%);
  font-size: 1.8rem;
  font-weight: 600;
  border-width: 0;
  padding: 1rem var(--s5);
  border-radius: var(--s4);
}

.footerPremiumPaid {
  background-color: transparent;
  background-image: none;
  color: var(--cTextSubtle);
  flex-direction: column;
  gap: var(--s1);
  padding: var(--s2) var(--s4);
  font-size: 1.6rem;
  div {
    display: flex;
    align-items: center;
    gap: var(--s3);
  }
  span {
    font-size: 1.4rem;
  }
  .svg-inline--fa {
    color: var(--cTextSubtle);
  }
}
</style>
