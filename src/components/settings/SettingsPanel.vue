<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/store.js'
import { storeToRefs } from 'pinia'
import DashboardSettings from '@/components/settings/DashboardSettings.vue'
import GlobalSettings from '@/components/settings/GlobalSettings.vue'
import AnalogClockSettings from '@/components/settings/AnalogClockSettings.vue'
import DigitalClockSettings from '@/components/settings/DigitalClockSettings.vue'

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

const getReviewLink = () => {
  if (navigator.userAgent.match(/edg/i)) {
    return 'https://microsoftedge.microsoft.com/addons/detail/bfpmncaohmjelebfobabccfjgmeolloe'
  }
  return 'https://chrome.google.com/webstore/detail/carettab-new-tab-clock-an/cojpndognjdcakkimaloeealehpkljna'
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
          @click="store.settingsOpen = false"
        >
          <fa icon="fa-floppy-disk"></fa>
          {{ $t('options.common.save') }}
        </button>
      </div>
    </header>
    <DashboardSettings v-if="['dashboard'].includes(settingsPage)"></DashboardSettings>
    <GlobalSettings v-if="['global'].includes(settingsPage)"></GlobalSettings>
    <AnalogClockSettings v-if="['analogClock'].includes(settingsPage)"></AnalogClockSettings>
    <DigitalClockSettings v-if="['digitalClock'].includes(settingsPage)"></DigitalClockSettings>
    <footer class="footer">
      <p>
        <a :href="getReviewLink" class="supportBtn">{{ $t('options.dashboard.review') }}</a>
        |
        <a href="https://github.com/bluecaret/carettab" class="supportBtn">{{ $t('options.dashboard.contribute') }}</a>
        |
        {{ $t('options.dashboard.share') }}:
        <a href="https://twitter.com/intent/tweet?url=https://www.carettab.com/" class="supportBtn">Twitter</a>,
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.carettab.com/" class="supportBtn">Facebook</a
        >,
        <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://www.carettab.com/" class="supportBtn"
          >LinkedIn</a
        >,
        <a href="mailto:?body=https://www.carettab.com/" class="supportBtn">Email</a>
        <br />
        <a href="https://github.com/bluecaret/carettab">{{ $t('options.common.supportLink') }}</a>
        |
        <a href="https://github.com/bluecaret/carettab/wiki/Changelog">Changelog</a>
        |
        <a href="https://www.bluecaret.com/about">{{ $t('options.common.aboutLink') }}</a>
        |
        <a href="https://www.bluecaret.com/contact">{{ $t('options.common.contactLink') }}</a>
        | <a href="https://www.bluecaret.com/privacy">Privacy Policy</a> |
        <a href="https://www.bluecaret.com/terms">Terms of Use</a>
      </p>
      <p>
        {{ store.tSplit($t('options.dashboard.supportBox'))[0]
        }}<a href="https://github.com/bluecaret/carettab" class="supportBtn">{{
          store.tSplit($t('options.dashboard.supportBox'))[1]
        }}</a
        >{{ store.tSplit($t('options.dashboard.supportBox'))[2]
        }}<a href="mailto:bluecaret@outlook.com" class="supportBtn">{{
          store.tSplit($t('options.dashboard.supportBox'))[3]
        }}</a>
      </p>
      <p>
        <a href="https://www.carettab.com/">{{ store.tSplit($t('options.dashboard.credit'))[0] }}</a
        >{{ store.tSplit($t('options.dashboard.credit'))[1]
        }}<a href="https://www.bluecaret.com">{{ store.tSplit($t('options.dashboard.credit'))[2] }}</a
        >{{ store.tSplit($t('options.dashboard.credit'))[3]
        }}<a href="https://opensource.org/licenses/MIT">{{ store.tSplit($t('options.dashboard.credit'))[4] }}</a
        >{{ store.tSplit($t('options.dashboard.credit'))[5] }}
      </p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
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
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  padding: var(--s5);
  border-radius: var(--s4) var(--s4) 0 0;
  font-size: 1.4rem;
  font-weight: 400;

  p {
    margin: 0;
  }
}
</style>
