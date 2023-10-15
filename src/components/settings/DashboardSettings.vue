<script setup>
import { ref, onMounted, toRaw } from 'vue'
import introJs from 'intro.js'
import draggable from 'vuedraggable'
import { useSettingsStore, setStorage } from '@/store.js'
import { widgetTypes } from '@/assets/lists.js'
import WhatsNew from '@/components/settings/WhatsNew.vue'
import ToolBarSettings from '@/components/tools/ToolBarSettings.vue'
import AddWidgetModal from '@/components/elements/AddWidgetModal.vue'
import BlueprintModal from '@/components/elements/BlueprintModal.vue'
import WallpaperSettings from '@/components/settings/WallpaperSettings.vue'
import GlobalWidgetSettings from '@/components/settings/GlobalWidgetSettings.vue'
import ExtensionSettings from '@/components/settings/ExtensionSettings.vue'

const store = useSettingsStore()

const drag = ref(false)
const renaming = ref(null)
const renamingName = ref('')

let tour = introJs()

onMounted(async () => {
  if (store.status === 'updated' || store.status === 'highlightSettings') {
    await setStorage({ status: 'existing' }, 'local')
    store.status = 'existing'
  }
  console.log('Show tour?', store.showTour)
  if (store.showTour) {
    tour
      .setOptions({
        steps: [
          {
            element: document.querySelector('#settings'),
            title: 'Welcome to CaretTab!',
            intro:
              "Get started creating your custom New Tab page! Let's take a quick tour to show you how to personalize your settings and make the most of your new tab page.",
          },
          {
            element: document.querySelector('.addWidgetBar .addBtn:first-child'),
            title: 'Add widgets',
            intro:
              'Widgets are the core of CaretTab. The Add Widget button is where you can add a widget from a wide range of options.',
          },
          {
            element: document.querySelector('.addWidgetBar .addBtn:last-child'),
            title: 'Blueprints',
            intro: 'Save some time and choose a predefined layout. Blueprints are a great way to get started quickly.',
          },
          {
            element: document.querySelector('.tourWidgetList'),
            title: 'Widget list',
            intro:
              'Widgets you have added are listed here. You can drag them to reorder the list. Widgets higher up on the list will display above other widgets on the New Tab page.',
          },
          {
            element: document.querySelector('.tourToolbarSettings'),
            title: 'Toolbar',
            intro:
              'Enable a toolbar with several useful tools. Click the toggle button to enable the toolbar. Select "tools" to choose which tools are available.',
          },
          {
            element: document.querySelector('.tourDashboardOtherSettings > .fieldAccordion:nth-child(1)'),
            title: 'Wallpaper',
            intro: 'Change the background color and image of the New Tab inside the Wallpaper settings.',
          },
          {
            element: document.querySelector('.tourDashboardOtherSettings > .fieldAccordion:nth-child(2)'),
            title: 'Default container settings',
            intro:
              'Set the default settings for widget containers here. The container is the box the widget sits inside of, you can add a background color, border, shadow, and more. These options can be overridden within the widget settings page.',
          },
          {
            element: document.querySelector('.tourDashboardOtherSettings > .fieldAccordion:nth-child(3)'),
            title: 'Default font settings',
            intro:
              'Set the default font and text styles for widgets here. Change the text color, font, spacing and more. These options can be overridden within the widget settings page.',
          },
          {
            element: document.querySelector('.tourDashboardOtherSettings > .fieldAccordion:nth-child(5)'),
            title: 'Other settings',
            intro:
              'Additional, general settings for the extension can be found here. Change things such as the language, tab title or import/export settings.',
          },
          {
            element: document.querySelector('.headerLinks > .btnGroup > .btn:nth-child(1)'),
            title: 'Preview changes',
            intro:
              'When making changes to your settings you may find the settings panel to be in the way. Hover your mouse over this button and the settings panel will temporarily disappear until you move your mouse off.',
          },
          {
            element: document.querySelector('.headerLinks > .btnGroup > .btn:nth-child(2)'),
            title: 'Outline widgets',
            intro:
              'Get better accuracy with your widget placement by clicking this button to enable an outline around widgets. Each widget will have a border added temporarily that helps you know the exact edges of a widget allowing for perfect alignment.',
          },
          {
            element: document.querySelector('.headerLinks > .btnGroup > .btn:nth-child(3)'),
            title: 'Outline widgets',
            intro:
              'Another option to help with positioning is the grid. Toggle this option to overlay a grid on the New Tab page for easy alignment.',
          },
          {
            element: document.querySelector('.headerLinks > .btnGroup > .btn:nth-child(4)'),
            title: 'Outline widgets',
            intro:
              'Changing a widget on the right side of the screen? Slide the settings panel to the other side of the screen temporarily for easier edits.',
          },
          {
            element: document.querySelector('.goBack'),
            title: 'Close and Save',
            intro:
              'Clicking the close button or clicking anywhere outside the settings panel will close the panel and save your settings.',
          },
          {
            element: document.querySelector('.headerLinks > .btn'),
            title: 'Save changes',
            intro: 'The save button will save all of your current settings without closing the settings panel.',
          },
          {
            element: document.querySelector('.footer'),
            title: 'More information',
            intro:
              'Get info about the extension, access help and tips, leave a review for the extension, or sign up for Premium Access',
          },
          {
            element: document.querySelector('.introHeader'),
            title: 'Your tab, your rules',
            intro:
              'As the slogan says, this is your tab, it follows your rules. There are endless customization options available to make it exactly what you want. Time to get started!',
          },
        ],
        tooltipClass: 'tourTooltip',
        highlightClass: 'tourHighlight',
        buttonClass: 'btn',
        showProgress: false,
        showBullets: false,
        exitOnOverlayClick: false,
        disableInteraction: true,
        doneLabel: 'Continue',
      })
      .onbeforeexit(function () {
        console.log('exit tour', this._currentStep)
      })
      .onbeforechange(function (targetElement) {
        console.log('open settings', this._currentStep, targetElement)
      })
    tour.start()
  }
})

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
  <PageHeading class="tourDashboardTitle" :title="$t('dashboard.settingsDashboard')"></PageHeading>
  <div class="page">
    <WhatsNew />
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
      class="blockContainer tourWidgetList"
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

    <ToolBarSettings class="tourToolbarSettings" />

    <div class="blockContainer tourDashboardOtherSettings">
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
  .lightGrayMode &,
  .lightMode & {
    font-weight: 400;
  }
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
