<script setup>
import { ref, onMounted, toRaw } from 'vue'
import { DateTime } from 'luxon'
import draggable from 'vuedraggable'
import { useSettingsStore, setStorage } from '@/store.js'
import { widgetTypes } from '@/assets/lists.js'
import ToolBarSettings from '@/components/tools/ToolBarSettings.vue'
import AddWidgetModal from '@/components/elements/AddWidgetModal.vue'
import BlueprintModal from '@/components/elements/BlueprintModal.vue'
import WallpaperSettings from '@/components/settings/WallpaperSettings.vue'
import GlobalWidgetSettings from '@/components/settings/GlobalWidgetSettings.vue'
import ExtensionSettings from '@/components/settings/ExtensionSettings.vue'

const store = useSettingsStore()

const whatsNewModal = ref(false)
const drag = ref(false)
const renaming = ref(null)
const renamingName = ref('')

onMounted(async () => {
  if (store.status === 'updated' || store.status === 'highlightSettings') {
    await setStorage({ status: 'existing' }, 'local')
    store.status = 'existing'
  }
  if ((!store.clearWhatsNewBox, store.updatedTimestamp)) {
    let updated = DateTime.fromFormat(store.updatedTimestamp, 'F').plus({ days: 7 })
    let now = DateTime.now()
    if (updated <= now) {
      handleClearWhatsNew()
    }
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

const toggleWidget = (id) => {
  const index = store.config.layers.findIndex((c) => c.id === id)
  const layer = store.config.layers[index]
  layer.on = !layer.on
}

const duplicateWidget = (id, type) => {
  store.duplicateWidget(id, type)
}

const deleteWidget = (id, type) => {
  store.deleteWidget(id, type)
}

const openWidget = (id, type) => {
  store.editing = id
  store.goTo(type)
}

const getWidgetDetails = (t) => {
  return widgetTypes.find((w) => w.type === t)
}

const handleNewWidgetClick = (type) => {
  store.newWidget(type)
}

const handleRenameOpen = (id) => {
  const layer = store.config.layers.find((l) => l.id === id)
  renamingName.value = layer.name
  renaming.value = id
}

const handleRenameSave = (id) => {
  const layer = store.config.layers.find((l) => l.id === id)
  layer.name = renamingName.value
  renaming.value = null
  setStorage({ layers: [...toRaw(store.config.layers)] }, 'sync')
}
</script>

<template>
  <PageHeading :title="$t('dashboard.settingsDashboard')"></PageHeading>
  <div class="page">
    <ModalWindow v-if="!store.clearWhatsNewBox" :show="whatsNewModal" @close="whatsNewModal = false">
      <template #button>
        <div class="whatsNewBox" @click="whatsNewModal = true">
          <div class="group fill">
            <fa class="whatsNewIcon" icon="fa-bell"></fa>
            <h3 class="newUpdateTitle fill">
              {{ $t('dashboard.newUpdate') }} &mdash; {{ $t('settings.version', ['4.0.0']) }}
            </h3>
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
            <h1 class="modalTitle">{{ $t('updates.whatsNewInVersion', ['4.0.0']) }}</h1>
            <button class="modalClose" type="button" :aria-label="$t('common.close')" @click="whatsNewModal = false">
              <fa icon="fa-xmark" />
            </button>
          </header>
          <div class="modalContent">
            <p>This is a big one! In no particular order:</p>
            <div class="group">
              <div class="fill">
                <h4 class="subtitle">{{ $t('updates.newFeatures') }}</h4>
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
                    New positioning system for widgets. Placing widgets will now be easier, more precise, and provide
                    tons more freedom.
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
                    Default wallpaper. CaretTab now comes out of the box with a beautiful photo of a Juniper plant as
                    the default background. You can easily switch to this photo at any time.
                  </li>
                  <li>
                    New layout options for Quick Links including the option of placing the "Bookmarks bar" anywhere like
                    a standard widget.
                  </li>
                  <li>
                    But wait, there's more! I've been at this for a while now, there are many, many new additions and
                    changes that are just too numerous to list here. Explore the settings panel to find them all!
                  </li>
                </ul>
              </div>
              <div class="fill">
                <h4 class="subtitle">Changes from previous version</h4>
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
            <div>
              <small>* Only available with Premium Access</small>
            </div>
          </div>
        </div>
      </template>
    </ModalWindow>
    <div v-if="store.storageWarning.includes('sync')" class="storageWarning">
      <div class="group fill">
        <fa size="lg" icon="fa-triangle-exclamation"></fa>
        <h3 class="fill">
          {{ $t('settings.cautionYouAreAboutToRunOutOfStorage') }}
        </h3>
      </div>
    </div>
    <h2 class="introHeader">{{ $t('common.slogan') }}</h2>
    <draggable
      class="blockContainer"
      :list="store.config.layers"
      item-key="id"
      ghost-class="dragGhost"
      chosen-class="dragChosen"
      drag-class="dragMove"
      @start="drag = true"
      @end="drag = false"
    >
      <template #header>
        <div v-if="store.config.layers.length < 500" class="block addWidgetBar">
          <AddWidgetModal @selected="handleNewWidgetClick($event)"></AddWidgetModal>
          <BlueprintModal />
        </div>
        <div v-if="store.config.layers.length >= 500" class="block">
          {{ $t('settings.youHaveReachedTheMaximumNumberOfWidgets') }}
        </div>
        <div v-if="store.config.layers.length < 1" class="block">
          <div class="group stack fill widgetHeader">
            <fa icon="fa-shapes" class="widgetHeaderIcon"></fa>
            <h3>{{ $t('dashboard.youHaveNoWidgetsYet') }}</h3>
            <p>{{ $t('dashboard.startCreatingYourOwnNewTabPage') }}</p>
          </div>
        </div>
      </template>
      <template #item="{ element, index }">
        <div class="block" :class="{ outliner: store.showOutliner, disabled: !element.on }" :data-index="index">
          <button type="button" class="drag" :title="$t('settings.dragToReorderWidgets')">
            <fa icon="fa-grip-vertical" size="xs" fixed-width></fa>
          </button>
          <div class="group">
            <div class="label" :title="`${getWidgetDetails(element.widget).name} (ID: ${element.id})`">
              <div>
                <fa :icon="getWidgetDetails(element.widget).icon" size="lg" fixed-width></fa>
                {{ element.name ?? getWidgetDetails(element.widget).name }}
              </div>
            </div>
            <DropdownMenu v-if="store.storageWarning.includes(element.id)" style="width: auto">
              <template #button>
                <button
                  type="button"
                  class="btn btnText storageWarningIcon"
                  :aria-label="$t('settings.widgetIsRunningOutOfStorageSpace')"
                >
                  <fa size="lg" icon="fa-triangle-exclamation"></fa>
                </button>
              </template>
              <template #menu>
                <div class="block stack">
                  <div class="label">{{ $t('settings.widgetIsRunningOutOfStorageSpace') }}</div>
                  <div class="desc">{{ $t('settings.addingMoreContent') }}</div>
                </div>
              </template>
            </DropdownMenu>
          </div>
          <div class="group mla">
            <ToggleField :model-value="element.on" @update:model-value="toggleWidget(element.id)"></ToggleField>
            <div class="btnGroup">
              <button type="button" class="btn" :disabled="!element.on" @click="openWidget(element.id, element.widget)">
                <fa icon="fa-cog" fixed-width></fa>{{ $t('common.edit') }}
              </button>
              <ModalWindow :show="renaming === element.id" size="460px" @close="renaming = null">
                <template #button>
                  <button
                    class="btn"
                    type="button"
                    :disabled="!element.on"
                    :aria-label="$t('settings.renameWidget')"
                    :title="$t('settings.renameWidget')"
                    @click="handleRenameOpen(element.id)"
                  >
                    <fa icon="fa-i-cursor" fixed-width></fa>
                  </button>
                </template>
                <template #window>
                  <div class="modal">
                    <header class="modalHeader">
                      <h1 class="modalTitle">{{ $t('settings.renameWidget') }}</h1>
                      <button
                        class="modalClose"
                        type="button"
                        :aria-label="$t('common.close')"
                        @click="renaming = null"
                      >
                        <fa icon="fa-xmark" />
                      </button>
                    </header>
                    <div class="modalContent">
                      <form class="group fill compact" novalidate @submit.prevent="handleRenameSave(element.id)">
                        <input v-model="renamingName" type="text" class="input" />
                        <button type="submit" class="btn">
                          {{ $t('common.save') }}
                        </button>
                      </form>
                    </div>
                  </div>
                </template>
              </ModalWindow>
              <button
                type="button"
                class="btn"
                :aria-label="$t('dashboard.duplicateWidget')"
                :title="$t('dashboard.duplicateWidget')"
                @click="duplicateWidget(element.id, element.widget)"
              >
                <fa icon="fa-copy" fixed-width></fa>
              </button>
              <button
                type="button"
                class="btn"
                :aria-label="$t('dashboard.deleteWidget')"
                :title="$t('dashboard.deleteWidget')"
                @click="deleteWidget(element.id, element.widget)"
              >
                <fa icon="fa-trash" fixed-width></fa>
              </button>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <ToolBarSettings />

    <div class="blockContainer">
      <WallpaperSettings />
      <GlobalWidgetSettings />
      <ExtensionSettings />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.disabled {
  background-color: hsl(var(--cBlockH) var(--cBlockS) var(--cBlockL) / 0.5);
  .label {
    color: var(--cTextSubtle);
  }
}

.introHeader {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  margin: 0 auto 2rem auto;
  text-align: center;
  color: var(--b2);
}

.outliner {
  position: relative;

  &::before,
  &::after {
    outline-offset: -6px;
  }
  &.disabled {
    &::before,
    &::after {
      outline: none;
    }
  }
}

.addWidgetMenu {
  list-style: none;
  display: grid;
  grid-template: auto / 1fr 1fr;
  margin: 0;
  gap: var(--s4);
  padding: var(--s5);
}

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

.widgetHeader {
  padding: var(--s4);
  gap: var(--s3);
  h3,
  p {
    width: 100%;
    text-align: center;
    margin: 0;
    color: var(--cTextSubtle);
  }
  h3 {
    font-weight: 600;
  }
  p {
    font-weight: 400;
    font-size: 1.4rem;
    color: var(--cTextSubtle);
  }
  .widgetHeaderIcon {
    margin: 0 auto;
    font-size: 4rem;
    color: var(--cTextSubtle);
  }
}

.addWidgetBar {
  padding: var(--s4);
  min-height: 0;
  gap: var(--s4);
  // background-color: hsl(var(--cBlockH) calc(var(--cBlockS) + 20%) calc(var(--cBlockL) + 3%));
}

.selectBlueprintBar {
  padding: 0;
  min-height: 0;
  background-color: hsl(var(--cBlockH) calc(var(--cBlockS) + 20%) calc(var(--cBlockL) + 3%));
}

.storageWarning {
  border: 2px solid var(--cWarning);
  color: hsl(var(--cWarningH) var(--cWarningS) calc(var(--cWarningL) + 25%));
  margin-block-end: var(--s5);
  border-radius: var(--s4);
  padding: var(--s4) var(--s5);

  h3 {
    display: block;
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 400;
    font-size: 1.6rem;
    margin: 0;
  }
}

.storageWarningIcon {
  color: var(--cWarning);
  cursor: help;
}
</style>
