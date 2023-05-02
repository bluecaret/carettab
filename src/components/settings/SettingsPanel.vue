<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { storeToRefs } from 'pinia'
import DashboardSettings from '@/components/settings/DashboardSettings.vue'
import PatternsList from '@/components/settings/PatternsList.vue'
import UnsplashList from '@/components/settings/UnsplashList.vue'
import AnalogClockSettings from '@/components/settings/AnalogClockSettings.vue'
import DigitalClockSettings from '@/components/settings/DigitalClockSettings.vue'
import DateSettings from '@/components/settings/DateSettings.vue'
import PremiumModal from '@/components/PremiumModal.vue'

const user = inject('user')
const store = useSettingsStore()
const { settingsPage } = storeToRefs(store)

let ver = ref('#.#.#')

onMounted(async () => {
  const response = await fetch('/manifest.json')
  const file = await response.json()
  ver.value = await file.version
})

onUnmounted(() => {
  store.save()
})

const togglePanelPreview = ref(false)
const showPremiumModal = ref(false)

const getReviewLink = () => {
  if (navigator.userAgent.match(/edg/i)) {
    return 'https://microsoftedge.microsoft.com/addons/detail/bfpmncaohmjelebfobabccfjgmeolloe'
  }
  return 'https://chrome.google.com/webstore/detail/carettab-new-tab-clock-an/cojpndognjdcakkimaloeealehpkljna'
}

const handleSave = () => {
  store.save()
  store.isLoading = true
  setTimeout(() => {
    store.isLoading = false
  }, 500)
}
</script>

<template>
  <div id="settings" class="panel" :class="{ panelPreview: togglePanelPreview }">
    <header class="header">
      <h1 class="appName">
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
      </h1>
      <small>{{ $t('options.common.version') }} {{ ver }}</small>
      <div class="headerLinks">
        <div class="btnGroup">
          <button
            class="btn previewBtn"
            @mouseenter="togglePanelPreview = true"
            @mouseleave="togglePanelPreview = false"
            @click="togglePanelPreview = true"
            @blur="togglePanelPreview = false"
          >
            <fa icon="fa-eye" fixed-width></fa>
          </button>
          <button
            class="btn"
            :class="{ active: store.showOutliner }"
            title="Shows an outline around all widgets. Useful when positioning widgets."
            @click="store.showOutliner = !store.showOutliner"
          >
            <fa icon="fa-vector-square" fixed-width></fa>
          </button>
        </div>
        <button
          class="btn"
          :aria-label="$t('options.common.saveAndClose')"
          :title="$t('options.common.saveAndClose')"
          @click="handleSave"
        >
          <fa icon="fa-floppy-disk"></fa>
          {{ $t('options.common.save') }}
        </button>
      </div>
    </header>
    <DashboardSettings v-if="['dashboard'].includes(settingsPage)"></DashboardSettings>
    <PatternsList v-if="['patterns'].includes(settingsPage)"></PatternsList>
    <UnsplashList v-if="['unsplash'].includes(settingsPage)"></UnsplashList>
    <AnalogClockSettings v-if="['analogClock'].includes(settingsPage)"></AnalogClockSettings>
    <DigitalClockSettings v-if="['digitalClock'].includes(settingsPage)"></DigitalClockSettings>
    <DateSettings v-if="['date'].includes(settingsPage)"></DateSettings>
    <footer class="footer">
      <DropdownMenu ref="newWidgetMenu" style="width: auto">
        <template #button>
          <button class="btn footerBtn" type="button">
            <fa icon="fa-share" fixed-width></fa>
            {{ $t('options.dashboard.share') }}
          </button>
        </template>
        <template #menu>
          <div class="block">
            <div class="group stack">
              <div class="label">Share on...</div>
              <div class="group compact fit">
                <a
                  href="mailto:?subject=Check%20out%20this%20New%20Tab%20extension!&body=I%20found%20this%20browser%20extension%20that%20replaces%20the%20New%20Tab%20page%20with%20tons%20of%20customization.%20I%20thought%20you'd%20like%20it.%20%0A%0ACaretTab%20-%20https%3A%2F%2Fwww.carettab.com%2F"
                  class="btn"
                  >Email</a
                >
                <a href="https://twitter.com/intent/tweet?url=https://www.carettab.com/" class="btn">Twitter</a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.carettab.com/" class="btn"
                  >Facebook</a
                >
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://www.carettab.com/" class="btn"
                  >LinkedIn</a
                >
              </div>
            </div>
          </div>
        </template>
      </DropdownMenu>
      <a :href="getReviewLink" class="btn footerBtn" target="_blank">
        <fa icon="fa-star-half-stroke" fixed-width></fa>
        {{ $t('options.dashboard.review') }}
      </a>
      <PremiumModal :show="showPremiumModal" @close="showPremiumModal = false">
        <button
          class="btn footerPremium mla mra"
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
      <a href="https://github.com/bluecaret/carettab/discussions" class="btn footerBtn" target="_blank">
        <fa icon="fa-question" fixed-width></fa>
        Support
      </a>
      <DropdownMenu ref="newWidgetMenu" style="width: auto">
        <template #button>
          <button class="btn footerBtn" type="button">
            <fa icon="fa-info" fixed-width></fa>
            Info
          </button>
        </template>
        <template #menu>
          <div class="block">
            <div class="group stack" style="gap: 1.6rem">
              <div class="group">
                <div>
                  <a href="https://www.carettab.com/" class="link">CaretTab</a> is created by
                  <a href="https://www.bluecaret.com" class="link">BlueCaret</a> and licensed by
                  <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" class="link">GPL 3.0</a
                  >{{ store.tSplit($t('options.dashboard.credit'))[5] }}
                </div>
              </div>
              <div class="group compact">
                <a class="btn fit" href="https://github.com/bluecaret/carettab/wiki/Changelog">Changelog</a>
                <a class="btn fit" href="https://www.bluecaret.com/about">{{ $t('options.common.aboutLink') }}</a>
                <a class="btn fit" href="https://www.bluecaret.com/privacy">Privacy Policy</a>
                <a class="btn fit" href="https://www.bluecaret.com/terms">Terms of Use</a>
              </div>
            </div>
          </div>
        </template>
      </DropdownMenu>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  margin-inline: -0.8rem;
  z-index: +1;
  display: grid;
  grid-template: 6rem / 1fr auto auto;
  gap: var(--s5);
  align-items: center;
  border-radius: 0 0 var(--s4) var(--s4);

  .logo {
    width: var(--s6);
    height: auto;

    * {
      fill: var(--cText);
    }
  }

  .appName {
    display: flex;
    align-items: center;
    gap: var(--s4);
    font-size: 2.6rem;
    font-weight: 300;
    letter-spacing: 0.05em;
    margin: 0;
  }
}

.headerLinks {
  display: flex;
  gap: var(--s5);
}

.previewBtn {
  cursor: zoom-in;
}

.footer {
  position: sticky;
  bottom: 0;
  margin-top: auto;
  margin-inline: -0.8rem;
  display: flex;
  padding: var(--s4) var(--s5);
  gap: var(--s2);
  border-radius: var(--s4) var(--s4) 0 0;
  font-size: 1.4rem;
  font-weight: 400;

  p {
    margin: 0;
  }
}

.footerBtn {
  border: 0;
  font-size: 1.4rem;
}

.footerPremium {
  --getPremiumAdBg: hsla(205, 100%, 18%, 1);
  --getPremiumAdBg2: hsla(205, 100%, 30%, 1);
  --getPremiumAdColor: hsla(205, 100%, 90%, 1);
  color: var(--getPremiumAdColor);
  background-color: var(--getPremiumAdBg);
  background-image: radial-gradient(80% 85% at 0% 0%, var(--getPremiumAdBg2) 0%, var(--getPremiumAdBg) 100%);
  font-size: 1.8rem;
  border-width: 0;
  padding: 1.4rem var(--s5);
  border-radius: var(--s4);
}

.footerPremiumPaid {
  background-color: transparent;
  background-image: none;
  color: var(--cBlue7);
  flex-direction: column;
  gap: var(--s2);
  padding: var(--s3) var(--s4);
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
    color: var(--cBlue8);
  }
}
</style>
