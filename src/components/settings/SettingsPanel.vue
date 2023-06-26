<script setup>
import { ref, onMounted, onUnmounted, inject, watch, nextTick } from 'vue'
import { useSettingsStore } from '@/store.js'
import { storeToRefs } from 'pinia'
import DashboardSettings from '@/components/settings/DashboardSettings.vue'
import AdvancedSettings from '@/components/settings/AdvancedSettings.vue'
import PatternsList from '@/components/settings/PatternsList.vue'
import UnsplashList from '@/components/settings/UnsplashList.vue'
import PexelsList from '@/components/settings/PexelsList.vue'
import PremiumModal from '@/components/elements/PremiumModal.vue'
import AnalogClockSettings from '@/components/widgets/AnalogClockSettings.vue'
import BinaryClockSettings from '@/components/widgets/BinaryClockSettings.vue'
import DigitalClockSettings from '@/components/widgets/DigitalClockSettings.vue'
import DateSettings from '@/components/widgets/DateSettings.vue'
import SearchBarSettings from '@/components/widgets/SearchBarSettings.vue'
import WeatherSettings from '@/components/widgets/WeatherSettings.vue'
import NotepadSettings from '@/components/widgets/NotepadSettings.vue'
import QuoteSettings from '@/components/widgets/QuoteSettings.vue'
import QuickLinksSettings from '@/components/widgets/QuickLinksSettings.vue'
import LoadsheddingSettings from '@/components/widgets/LoadsheddingSettings.vue'
import ShapeSettings from '@/components/widgets/ShapeSettings.vue'
import TextSettings from '@/components/widgets/TextSettings.vue'
import TodoSettings from '@/components/widgets/TodoSettings.vue'

const user = inject('user')
const store = useSettingsStore()
const { settingsPage } = storeToRefs(store)
const panelEl = ref(null)

let ver = ref('#.#.#')

onMounted(async () => {
  const response = await fetch('/manifest.json')
  const file = await response.json()
  ver.value = await file.version
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

const showPremiumModal = ref(false)

const getReviewLink = () => {
  if (navigator.userAgent.match(/edg/i)) {
    return 'https://microsoftedge.microsoft.com/addons/detail/bfpmncaohmjelebfobabccfjgmeolloe'
  }
  return 'https://chrome.google.com/webstore/detail/carettab-new-tab-clock-an/cojpndognjdcakkimaloeealehpkljna/reviews'
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
    <LoadsheddingSettings v-if="['loadshedding'].includes(settingsPage)"></LoadsheddingSettings>
    <ShapeSettings v-if="['shape'].includes(settingsPage)"></ShapeSettings>
    <TextSettings v-if="['text'].includes(settingsPage)"></TextSettings>
    <TodoSettings v-if="['todo'].includes(settingsPage)"></TodoSettings>
    <footer class="footer">
      <a href="https://carettab.com" class="btn btnText appName">
        <svg
          alt="Logo for CaretTab shown as a depiction of a browser tab with a pixelated caret symbol on the inside"
          class="logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 128 128"
        >
          <rect x="24" y="80" width="16" height="16" />
          <rect x="40" y="64" width="16" height="16" />
          <rect x="72" y="64" width="16" height="16" />
          <rect x="56" y="48" width="16" height="16" />
          <rect x="88" y="80" width="16" height="16" />
          <path
            d="M123 20V0H88v20h-9V0H44v20h-9V10 0H25 10 0v10 10 10 20 78h128V20H123zM118 118H10V10h15v20h19 35 9 30V118z"
          />
        </svg>
        CaretTab
      </a>
      <DropdownMenu ref="newWidgetMenu" style="width: auto">
        <template #button>
          <button class="btn btnText" type="button">
            <fa icon="fa-info" fixed-width></fa>
            Info
          </button>
        </template>
        <template #menu>
          <div class="block">
            <div class="group stack" style="gap: 1.6rem">
              <div class="group stack compact">
                <div>
                  <small class="version">{{ $t('options.common.version') }} {{ ver }}</small>
                </div>
                <div>
                  <a href="https://www.carettab.com/" class="link">CaretTab</a> is created by
                  <a href="https://www.bluecaret.com" class="link">BlueCaret</a> and licensed by
                  <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" class="link">GPL 3.0</a
                  >{{ store.tSplit($t('options.dashboard.credit'))[5] }}
                </div>
              </div>
              <div class="group compact">
                <a class="btn fit" href="https://github.com/bluecaret/carettab/wiki/Changelog">Changelog</a>
                <a class="btn fit" href="https://www.bluecaret.com/about">About BlueCaret</a>
                <a class="btn fit" href="https://www.bluecaret.com/privacy">Privacy Policy</a>
                <a class="btn fit" href="https://www.bluecaret.com/terms">Terms of Use</a>
              </div>
            </div>
          </div>
        </template>
      </DropdownMenu>
      <a href="https://github.com/bluecaret/carettab/discussions" class="btn btnText" target="_blank">
        <fa icon="fa-question" fixed-width></fa>
        Help
      </a>
      <a :href="getReviewLink()" class="btn btnText" target="_blank">
        <fa icon="fa-star-half-stroke" fixed-width></fa>
        {{ $t('options.dashboard.review') }}
      </a>
      <PremiumModal :show="showPremiumModal" @close="showPremiumModal = false">
        <button
          class="btn footerPremium mla"
          :class="user.paid ? 'footerPremiumPaid' : ''"
          type="button"
          @click="showPremiumModal = true"
        >
          <div>
            <fa icon="fa-gem" fixed-width></fa>
            {{ user.paid ? 'You have Premium Access!' : 'Get Premium Access' }}
          </div>
          <span v-if="user.paid">Manage subscription</span>
        </button>
      </PremiumModal>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  width: var(--s5);
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
