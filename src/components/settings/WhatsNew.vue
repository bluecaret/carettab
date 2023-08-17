<!-- eslint-disable no-undef -->
<script setup>
import { ref, onMounted } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore, setStorage } from '@/store.js'
import { checkVersionInRange, compareVersions } from '@/helpers/data.js'

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
            <div class="fill">
              <h4 class="subtitle">v4.1.1 {{ $t('updates.fixesAndOthers') }}</h4>
              <ul class="ul">
                <li>Fixed: Default items such as Todo tasks, quotes and quick links sometimes could not be removed.</li>
                <li>Fixed: French translation of the word "save"</li>
                <li>Fixed: Added error handling when weather data is unavailable</li>
                <li>Fixed: Quick Links may not move overflow links to the "more" menu correctly</li>
              </ul>
              <h4 class="subtitle">v4.1.1 Known bugs</h4>
              <ul class="ul">
                <li>
                  Bug: Weather data not downloading - I've discovered a problem with weather not loading correctly
                  around 8PM PST every night. I haven't found a fix but am looking into it. It appears to only be an
                  issue for about 1 hour at that time each night so far.
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="compareVersions(store.prevVersion, '4.1.0') === -1 && checkVersionInRange(store.prevVersion, '4.X.X')"
            class="group"
          >
            <div class="fill">
              <h4 class="subtitle">v4.1.0 {{ $t('updates.newFeatures') }}</h4>
              <ul class="ul">
                <li>
                  Added multiple color modes for the settings UI, choose from dark, dark gray, light, or light gray.
                </li>
                <li>
                  Added three additional fonts, all based on a 7-segment LED display: "7 segments", "7 segmental digital
                  display", and "Display Free TFB"
                </li>
                <li>Added new "Vintage Digits" blueprint using the new segmented font.</li>
                <li>
                  Added new unit option for placement of widgets. You can now set the position of widgets based on a
                  percentage of the screen.
                </li>
                <li>Added a small preview of blueprints so you know what you are getting into.</li>
                <li>
                  Added a settings shortcut for Global Container Styles and Global Font styles from within a widget's
                  settings.
                </li>
                <li>
                  Added ability to copy current global settings to the container or font styles when overriding the
                  global.
                </li>
                <li>Backend change to ensure new features are correctly added to existing settings.</li>
              </ul>
            </div>
            <div class="fill">
              <h4 class="subtitle">v4.1.0 {{ $t('updates.fixesAndOthers') }}</h4>
              <ul class="ul">
                <li>Fixed: Todo widget label toggle wasn't toggling.</li>
                <li>Fixed: Todo widget font setting was not applying.</li>
                <li>
                  Fixed: better error handling for version 3.x migration for those still experiencing the stuck loading
                  screen.
                </li>
                <li>
                  Fixed: Sync issue where a new install on a different machine will be stuck on the welcome page after
                  settings have synced potentially leading to a loss of settings.
                </li>
                <li>Fixed: The 90's fever dream blueprint had the incorrect weather layout set.</li>
                <li>Many changes to the Chinese translation (thank you @future93)</li>
              </ul>
            </div>
          </div>
          <div v-if="checkVersionInRange(store.prevVersion, '3.X.X')" class="group">
            <div class="fill">
              <h4 class="subtitle">v4.0.0 {{ $t('updates.newFeatures') }}</h4>
              <ul class="ul">
                <li>Improved settings panel design</li>
                <li>Todo widget. Keep track of your tasks.</li>
                <li>
                  Shape and Text widgets. These are purely presentational widgets to help you design the perfect tab.*
                </li>
                <li>
                  Toolbar with tools such as AI Chat*, calculator, unit conversion, password generator, timer,
                  stopwatch.
                </li>
                <li>Add multiples of any widget. *Some widgets require Premium Access to add multiple.</li>
                <li>Blueprints. Quickly get a New Tab layout with the click of a button.</li>
                <li>Give the widget a name for easier managing of your multiple widgets.</li>
                <li>
                  Show an outline around widgets and a grid on the page to help with widget positioning. You can also
                  temporarily move the settings to the other side if it is in the way.
                </li>
                <li>Get wallpapers from Pexels.com.*</li>
                <li>Easily set default styling for widgets.</li>
                <li>Add container styles to every widget such as a background color and border.*</li>
                <li>Set a different font, color, and text styles for every widget.</li>
                <li>
                  New positioning system for widgets. Placing widgets will now be easier, more precise, and provide tons
                  more freedom.
                </li>
                <li>Search engine select menu. Easily change the search engine temporarily from the tab page.*</li>
                <li>
                  Some widgets have even more customization that allow you to customize the color and other styles of
                  specific elements within the widget.
                </li>
                <li>
                  New color picker with color sliders, swatches, opacity, and an option to save colors to use them
                  elsewhere.
                </li>
                <li>
                  Weather layouts. Now choose between several layouts for the weather widget including some utility
                  layouts that make it easier to show a single detail for extra customization.
                </li>
                <li>
                  The weather icons have been updated and are now animated* and multi-colored. And yes, you can
                  customize the colors!
                </li>
                <li>
                  Improved use of storage space in your browser. This allows even more widgets and content before
                  hitting the storage limit. A warning will also show in case you do get close to that limit anyway.
                </li>
                <li>
                  Default wallpaper. CaretTab now comes out of the box with a beautiful photo of a Juniper plant as the
                  default background. You can easily switch to this photo at any time.
                </li>
                <li>
                  New layout options for Quick Links including the option of placing the "Bookmarks bar" anywhere like a
                  standard widget.
                </li>
                <li>
                  But wait, there's more! I've been at this for a while now, there are many, many new additions and
                  changes that are just too numerous to list here. Explore the settings panel to find them all!
                </li>
              </ul>
            </div>
            <div class="fill">
              <h4 class="subtitle">v4.0.0 Changes from previous version</h4>
              <ul class="ul">
                <li>
                  Rebuilt the entire extension from scratch in a new, modern framework. This will make it easier and
                  quicker for me to build out more features in the future.
                </li>
                <li>
                  Saved settings been tweaked for better performance and space utilization. The result in this is an
                  unfortunate clearing of your saved settings. I tried to migrate as many settings as I was able.
                </li>
                <li>Smaller file size!</li>
                <li>
                  Dynamic scaling is no longer an option. This option added too much complexity and issues with the
                  improved positioning system.
                </li>
                <li>
                  Global size is no longer an option. Each widget has a default size applied, and can be changed
                  independently.
                </li>
                <li>All fonts are available under the free plan.</li>
                <li>All fonts other than the default Source Sans 3 now require internet to load.</li>
                <li>
                  Color themes and random color theme options have been removed. These may come back in a different
                  manner in the future.
                </li>
                <li>
                  Tab title no longer relies on an added clock to show the time/date. You can now set the title's own
                  timezone and time format.
                </li>
                <li>
                  Offset and margin options have been removed as they are no longer needed with the new positioning
                  system.
                </li>
                <li>Settings panel only has dark mode now. Light mode may return in the future.</li>
                <li>
                  Due to so many changes, translations have been completely redone using DeepL. This means some
                  translations are possibly worse now. Contact me if you notice any major issues.
                </li>
                <li>Clock styles (digital, analog, binary) have been split into individual widgets.</li>
                <li>All analog clock face and hand styles are now available in the free plan.</li>
                <li>The notepad widget is now available in the free plan. Add multiple notepads with Premium.</li>
                <li>The message widget is now called Quotes with a new optional Author field.</li>
                <li>New extension logo!</li>
                <li>Better support website: <a href="https://carettab.com/help">carettab.com/help</a></li>
              </ul>
            </div>
          </div>
          <div v-if="checkVersionInRange(store.prevVersion, '3.X.X')">
            <small>* Only available with Premium Access</small>
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
</style>
