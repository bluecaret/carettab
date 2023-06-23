<script setup>
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { useSettingsStore, setStorage, getStorage } from '@/store.js'
import { storeToRefs } from 'pinia'
import { widgetTypes } from '@/assets/lists.js'
import ToolBarSettings from '@/components/tools/ToolBarSettings.vue'

const store = useSettingsStore()
const { status } = storeToRefs(store)

const whatsNewModal = ref(false)
const drag = ref(false)
const newWidgetMenu = ref(null)

onMounted(async () => {
  const whatsNew = await getStorage('clearWhatsNewBox', 'local')
  store.clearWhatsNewBox = whatsNew.clearWhatsNewBox

  if (status === 'updated' || status === 'highlightSettings') {
    await setStorage({ caretTabStatus: 'existing' }, 'local')
    store.status = 'existing'
  }
})

const handleClearWhatsNew = async () => {
  await setStorage({ caretTabStatus: 'existing' }, 'local')
  await setStorage({ updateTimestamp: null }, 'local')
  await setStorage({ clearWhatsNewBox: true }, 'local')
  store.status = 'existing'
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
  newWidgetMenu.value.close()
}
</script>

<template>
  <div class="page">
    <ModalWindow v-if="!store.clearWhatsNewBox" :show="whatsNewModal">
      <template #button>
        <div class="whatsNewBox" @click="whatsNewModal = true">
          <div class="group fill">
            <fa class="whatsNewIcon" icon="fa-bell"></fa>
            <h3 class="newUpdateTitle fill">NEW UPDATE &mdash; Version 4.0.0</h3>
            <button type="button" class="btn fit" @click="whatsNewModal = true">
              <div class="fit">Read what's new!</div>
            </button>
            <button
              type="button"
              class="btn fit btnText"
              title="Dismiss"
              aria-label="Dismiss"
              @click.stop="handleClearWhatsNew"
            >
              <fa icon="fa-xmark"></fa>
            </button>
          </div>
        </div>
      </template>
      <template #window>
        <div class="block whatsNewModal">
          <button
            class="btn btnText mla whatsNewModalClose"
            type="button"
            aria-label="{{'options.common.close' | translate}}"
            @click="whatsNewModal = false"
          >
            <fa icon="fa-close" />
          </button>
          <div class="whatsNewModalContent">
            <h3>What's new in version 4.0.0</h3>
            <div class="group">
              <div class="fill">
                <h4>{{ $t('updates.newFeatures') }}</h4>
                <ul class="ul">
                  <li>{{ $t('updates.v380.shadows') }}</li>
                  <li>{{ $t('updates.v380.randomColor') }}</li>
                  <li>{{ $t('updates.v380.dayOfYear') }}</li>
                  <li>{{ $t('updates.v380.quarter') }}</li>
                  <li>{{ $t('updates.v380.suffix') }}</li>
                  <li>{{ $t('updates.v380.delimiter') }}</li>
                  <li>{{ $t('updates.v380.search') }}</li>
                  <li>{{ $t('updates.v380.open') }}</li>
                </ul>
              </div>
              <div class="fill">
                <h4>{{ $t('updates.fixesAndOthers') }}</h4>
                <ul class="ul">
                  <li>{{ $t('updates.v380.timeDrift') }}</li>
                  <li>{{ $t('updates.v380.weather') }}</li>
                  <li>{{ $t('updates.v380.shortcuts') }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ModalWindow>
    <h2 class="introHeader" :class="{ dashboardPadding: store.clearWhatsNewBox }">
      Your Tab, Your Rules - Infinite customization at your fingertips!
    </h2>
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
        <div v-if="store.config.layers.length < 1" class="block">
          <div class="group stack fill widgetHeader">
            <fa icon="fa-shapes" class="widgetHeaderIcon"></fa>
            <h3>You have no widgets yet</h3>
            <p>Start creating your own New Tab page</p>
          </div>
        </div>
      </template>
      <template #item="{ element }">
        <div class="block" :class="{ outliner: store.showOutliner, outlinerHidden: !element.on }">
          <button type="button" class="drag">
            <fa icon="fa-grip-vertical" size="xs" fixed-width></fa>
          </button>
          <div class="group">
            <div class="label">
              <div>
                <fa :icon="getWidgetDetails(element.widget).icon" size="lg" fixed-width></fa>
                {{ getWidgetDetails(element.widget).name }}
              </div>
            </div>
          </div>
          <div class="mla" style="font-size: 0.65em; opacity: 0.5">
            <strong title="Widget ID Number" style="text-transform: uppercase">{{ element.id }}</strong>
          </div>
          <div class="group">
            <ToggleField :model-value="element.on" @update:model-value="toggleWidget(element.id)"></ToggleField>
            <div class="btnGroup">
              <button type="button" class="btn" @click="openWidget(element.id, element.widget)">
                <fa icon="fa-pen" fixed-width></fa>Edit
              </button>
              <button
                type="button"
                class="btn"
                aria-label="Duplicate widget"
                title="Duplicate widget"
                @click="duplicateWidget(element.id, element.widget)"
              >
                <fa icon="fa-copy" fixed-width></fa>
              </button>
              <button
                type="button"
                class="btn"
                aria-label="Delete widget"
                title="Delete widget"
                @click="deleteWidget(element.id, element.widget)"
              >
                <fa icon="fa-trash" fixed-width></fa>
              </button>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="block addWidgetBar">
          <DropdownMenu ref="newWidgetMenu">
            <template #button>
              <button type="button" class="btn btnText">
                <fa icon="fa-plus"></fa>
                Add new widget
              </button>
            </template>
            <template #menu>
              <ul class="addWidgetMenu">
                <li v-for="widget in widgetTypes" :key="widget.type">
                  <button type="button" class="btn fit fill btnBlock" @click="handleNewWidgetClick(widget.type)">
                    <fa class="fa-fw" :icon="widget.icon" />{{ widget.name }}
                  </button>
                </li>
              </ul>
            </template>
          </DropdownMenu>
        </div>
      </template>
    </draggable>

    <ToolBarSettings />

    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">General settings</div>
          <button class="btn btnDesc" type="button" @click="store.goTo('extension')">
            <fa icon="fa-gear" fixed-width></fa>
            <div>
              Extension settings
              <small>Wallpaper, Language, etc.</small>
            </div>
          </button>
          <button class="btn btnDesc" type="button" @click="store.goTo('global')">
            <fa icon="fa-globe" fixed-width></fa>
            <div>
              Global widget styles
              <small>Font, Container, Elements</small>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.introHeader {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  margin: 2rem auto;
  text-align: center;
  color: var(--cBlue12);
}

.dashboardPadding {
  margin-block-start: var(--s5);
}

.outliner {
  position: relative;

  &::before,
  &::after {
    outline-offset: -6px;
  }
  &.outlinerHidden {
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
  color: var(--cText);
  background-color: var(--cBlue2);
  margin-inline: -1.6rem;
  margin-block-end: var(--s5);
  border-top-left-radius: var(--s4);
  border-top-right-radius: var(--s4);
  padding: var(--s5);
  cursor: pointer;

  .whatsNewIcon {
    font-size: 2.4rem;
  }
  h3 {
    display: block;
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 600;
    font-size: 1.8rem;
    margin: 0;
  }
}

.whatsNewModal {
  position: relative;
  .whatsNewModalClose {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: transparent;
    padding: 1rem;
    border: 0;
    cursor: pointer;
    .svg-inline--fa {
      font-size: 2.4rem;
      color: var(--getPremiumModalColor);
    }
  }
  h3 {
    margin: 0 0 var(--s5) 0;
    font-size: 2.4rem;
  }
  h4 {
    margin: 0 0 var(--s4) 0;
    font-size: 2rem;
    font-weight: 400;
  }
  .group {
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
    color: var(--cBlue10);
  }
  h3 {
    font-weight: 600;
  }
  p {
    font-weight: 300;
    font-size: 1.4rem;
    color: var(--cBlue11);
  }
  .widgetHeaderIcon {
    margin: 0 auto;
    font-size: 4rem;
    color: var(--cBlue10);
  }
}

.addWidgetBar {
  padding: 0;
  min-height: 0;
  background-color: var(--cGrey4);
  .dropdownWrapper {
    width: 100%;
  }
  .btn {
    width: 100%;
    justify-content: center;
    padding: var(--s5);
  }
}
</style>
