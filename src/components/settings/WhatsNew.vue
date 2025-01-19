<!-- eslint-disable no-undef -->
<script setup>
import { ref, onMounted } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore, setStorage } from '@/store.js'
// import { checkVersionInRange, compareVersions } from '@/helpers/data.js'

const store = useSettingsStore()
const whatsNewModal = ref(false)
const ver = ref('#.#.#')

onMounted(async () => {
  if ((!store.clearWhatsNewBox, store.updatedTimestamp)) {
    let updated = DateTime.fromFormat(store.updatedTimestamp, 'F').plus({ days: 7 })
    let now = DateTime.now()
    if (updated <= now) {
      handleClearWhatsNew()
    }
  }
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
      const manifest = chrome.runtime.getManifest()
      ver.value = manifest.version
    }
  } catch (error) {
    console.warn('Warning, failed to get version number:', error)
  }
})

const handleClearWhatsNew = async () => {
  await setStorage({ status: 'existing' }, 'local')
  await setStorage({ updatedTimestamp: null }, 'local')
  await setStorage({ clearWhatsNewBox: true }, 'local')
  store.status = 'existing'
  store.updatedTimestamp = null
  store.clearWhatsNewBox = true
}
</script>

<template>
  <ModalWindow v-if="!store.clearWhatsNewBox" :show="whatsNewModal" @close="whatsNewModal = false">
    <template #button>
      <div class="whatsNewBox" @click="whatsNewModal = true">
        <div class="group fill">
          <fa class="whatsNewIcon" icon="fa-bell"></fa>
          <h3 class="fill">{{ $t('dashboard.newUpdate') }} &mdash; {{ $t('settings.version', [ver]) }}</h3>
          <button type="button" class="btn fit" @click="whatsNewModal = true">
            <div class="fit">{{ $t('dashboard.readWhatsNew') }}</div>
          </button>
          <button
            type="button"
            class="btn fit btnText"
            :title="$t('dashboard.dismiss')"
            :aria-label="$t('dashboard.dismiss')"
            @click.stop="handleClearWhatsNew"
          >
            <fa icon="fa-xmark"></fa>
          </button>
        </div>
      </div>
    </template>
    <template #window>
      <div class="modal whatsNewModal">
        <header class="modalHeader">
          <h1 class="modalTitle">{{ $t('updates.whatsNewInVersion', [ver]) }}</h1>
          <button class="modalClose" type="button" :aria-label="$t('common.close')" @click="whatsNewModal = false">
            <fa icon="fa-xmark" />
          </button>
        </header>
        <div class="modalContent">
          <div class="group">
            <!-- <div class="fill">
              <h4 class="subtitle">v{{ ver }} {{ $t('updates.newFeatures') }}</h4>
              <ul class="ul">
                <li>
                  Wallpapers can now be any file size! You will still receive a warning message if the file is large
                  saying that it can affect performance, but the wallpaper will apply regardless.
                </li>
                <li>
                  Added additional "special links" to Quick Links include downloads page, extensions page, browser
                  inspect, browser flags, browser settings, browser about.
                </li>
              </ul>
            </div> -->
            <div class="fill">
              <h4 class="subtitle">v{{ ver }} {{ $t('updates.fixesAndOthers') }}</h4>
              <ul class="ul">
                <li>
                  SEARCH BAR CHANGES: Due to restrictions by Google Chrome, CaretTab can no longer provide a custom
                  search experience. CaretTab is now limited to only being able to search the default search engine that
                  is set in your browser settings (the same engine that is used when you search from the browser address
                  bar). I apologize for this inconvenience, however it was either this or CaretTab gets removed from the
                  web store by Google.
                </li>
                <li>Fixed styling bug in settings.</li>
                <li>Fixed missing suffix label on date widget.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ModalWindow>
</template>

<style lang="scss" scoped>
.whatsNewBox {
  color: var(--g1);
  background-color: var(--b2);
  margin-block-end: var(--s5);
  border-radius: var(--s4);
  padding: var(--s5);
  cursor: pointer;

  .btn {
    border-color: var(--g1);
    color: var(--g1);
    &:hover {
      box-shadow: 0 0 0.5rem 0 var(--g1);
    }
  }

  .whatsNewIcon {
    font-size: 2.4rem;
    transform-origin: top center;
    animation: bell 0.7s ease-in-out infinite alternate;
  }
  h3 {
    display: block;
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 600;
    font-size: 1.8rem;
    margin: 0;
  }
}

.whatsNewModal {
  .subtitle {
    margin-block: 0;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .modalContent .group {
    align-items: start;
  }
}

@keyframes bell {
  0% {
    rotate: 10deg;
  }

  100% {
    rotate: -10deg;
  }
}
</style>
