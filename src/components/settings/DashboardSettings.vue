<script setup>
import { ref, onMounted, inject } from 'vue'
import draggable from 'vuedraggable'
import { useSettingsStore, setStorage } from '@/store.js'
import { storeToRefs } from 'pinia'
import PremiumModal from '@/components/PremiumModal.vue'
import { widgetTypes } from '@/assets/lists.js'

const user = inject('user')
const store = useSettingsStore()
const { status, clearWhatsNewBox } = storeToRefs(store)

const showWhatsNew = ref(false)
const drag = ref(false)
const showPremiumModal = ref(false)
const newWidgetMenu = ref(null)

onMounted(async () => {
  if (status === 'updated' || status === 'highlightSettings') {
    await setStorage({ caretTabStatus: 'existing' }, 'local')
    store.status = 'existing'
  }
})

const handleClearWhatsNew = async () => {
  await setStorage({ caretTabStatus: 'existing' }, 'local')
  await setStorage({ updateTimestamp: null }, 'local')
  await setStorage({ clearWhatsNewBox: true }, 'local').ca
  store.status = 'existing'
  store.clearWhatsNewBox = true
}

const toggleWidget = (id) => {
  const index = store.config.layers.findIndex((c) => c.id === id)
  const layer = store.config.layers[index]
  layer.on = !layer.on
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
    <div v-if="!clearWhatsNewBox" class="blockContainer whatsNewBox">
      <div class="block">
        <h3 class="newUpdateHeading">
          <fa class="newUpdateIcon" icon="fa-bell"></fa>
          <div class="newUpdateContent">
            <div class="newUpdateTitle">{{ $t('options.dashboard.updatedTo') }} v3.8.0</div>
            <button v-if="!showWhatsNew" type="button" class="btn newUpdateCloseRead" @click="showWhatsNew = true">
              {{ $t('options.dashboard.whatsNew') }}
            </button>
            <button type="button" class="btn newUpdateClose" @click="handleClearWhatsNew">
              <fa icon="fa-xmark"></fa>{{ $t('options.dashboard.closeMessage') }}
            </button>
          </div>
        </h3>
        <template v-if="showWhatsNew">
          <h4 class="label">v3.8.0 {{ $t('updates.newFeatures') }}</h4>
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
          <h4 class="label">v3.8.0 {{ $t('updates.fixesAndOthers') }}</h4>
          <ul class="ul">
            <li>{{ $t('updates.v380.timeDrift') }}</li>
            <li>{{ $t('updates.v380.weather') }}</li>
            <li>{{ $t('updates.v380.shortcuts') }}</li>
          </ul>
        </template>
      </div>
    </div>
    <PremiumModal :show="showPremiumModal" @close="showPremiumModal = false">
      <button
        type="button"
        class="getPremiumAd"
        :class="{ getPremiumAdManage: user.paid }"
        @click="showPremiumModal = true"
      >
        <fa icon="fa-gem"></fa>
        <div v-if="user.paid">
          <h2>{{ $t('options.dashboard.youHavePremium') }}</h2>
          <p>{{ $t('options.dashboard.clickToManageSubscription') }}</p>
        </div>
        <div v-if="!user.paid">
          <h2>{{ $t('options.dashboard.getPremiumAccess') }}</h2>
          <p>{{ $t('options.dashboard.getPremiumAccessDesc') }}</p>
        </div>
      </button>
    </PremiumModal>
    <h2 class="title">
      <fa icon="fa-shapes" fixed-width></fa>
      <span class="mra">Widgets</span>
      <DropdownMenu ref="newWidgetMenu">
        <template #button>
          <button type="button" class="btn">
            <fa icon="fa-plus"></fa>
            Add widget
          </button>
        </template>
        <template #menu>
          <ul class="addWidgetMenu">
            <li v-for="widget in widgetTypes" :key="widget.type">
              <button type="button" class="btn btnBlock" @click="handleNewWidgetClick(widget.type)">
                <fa class="fa-fw" :icon="widget.icon" />{{ widget.name }}
              </button>
            </li>
          </ul>
        </template>
      </DropdownMenu>
      <button type="button" class="btn" @click="store.goTo('global')">
        <fa icon="fa-globe"></fa>
        Edit global settings
      </button>
    </h2>
    <draggable
      class="blockContainer"
      :list="store.config.layers"
      item-key="id"
      ghost-class="widgetDragGhost"
      chosen-class="widgetDragChosen"
      drag-class="widgetDragMove"
      @start="drag = true"
      @end="drag = false"
    >
      <template #item="{ element }">
        <div class="block" :class="{ outliner: store.showOutliner }">
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
            <span style="font-size: 0.8em; opacity: 0.7">{{ element.id }}</span>
          </div>
          <div class="group mla">
            <div class="btnGroup">
              <button type="button" class="btn" @click="openWidget(element.id, element.widget)">
                <fa icon="fa-pen" fixed-width></fa>Edit
              </button>
              <button type="button" class="btn" :class="{ active: element.on }" @click="toggleWidget(element.id)">
                <fa :icon="element.on ? 'fa-eye' : 'fa-eye-slash'" fixed-width></fa>
              </button>
              <button type="button" class="btn" @click="deleteWidget(element.id, element.widget)">
                <fa icon="fa-trash" fixed-width></fa>
              </button>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <h3 class="subtitle">{{ $t('options.dashboard.moreFromBluecaret') }}</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group stack">
          <h4 id="tsfLink" class="label">Two Steps Forward</h4>
          <p class="desc">{{ $t('options.dashboard.tsfDesc') }}</p>
        </div>
        <a
          href="https://chrome.google.com/webstore/detail/two-steps-forward-a-new-t/ehfogconngjcielhngfamnbdgfomlimb"
          class="btn mla"
          aria-pressed="true"
          :aria-label="$t('options.dashboard.tsfLink')"
        >
          <fa icon="fa-arrow-up-right-from-square" fixed-width></fa>
        </a>
      </div>
      <div class="block">
        <div class="group stack">
          <h4 id="tsfLink" class="label">RMS (Run My Script)</h4>
          <p class="desc">{{ $t('options.dashboard.rmsDesc') }}</p>
        </div>
        <a
          href="https://chrome.google.com/webstore/detail/rms-run-my-script-script/bifnofbpdbdmgopjoidbicngijjmlogj"
          class="btn mla"
          aria-pressed="true"
          :aria-label="$t('options.dashboard.rmsLink')"
        >
          <fa icon="fa-arrow-up-right-from-square" fixed-width></fa>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.widgetDragGhost {
  background: transparent;
  outline: var(--s4) solid var(--cGrey2);
  outline-offset: calc(var(--s4) * -1);

  * {
    opacity: 0;
  }
}

.addWidgetMenu {
  list-style: none;
  margin: var(--s4);
  padding: 0;
  display: grid;
  grid-template: auto / 1fr 1fr;
  gap: var(--s4);
}

.getPremiumAd {
  --getPremiumAdBg: hsla(215, 20%, 78%, 1);
  --getPremiumAdBg2: hsla(215, 40%, 78%, 1);
  --getPremiumAdColor: hsla(205, 100%, 10%, 1);
  @media (prefers-color-scheme: dark) {
    --getPremiumAdBg: hsla(205, 100%, 18%, 1);
    --getPremiumAdBg2: hsla(205, 100%, 30%, 1);
    --getPremiumAdColor: hsla(205, 100%, 90%, 1);
  }
  border-radius: var(--s4);
  border: 0;
  overflow: hidden;
  background-color: var(--getPremiumAdBg);
  background-image: radial-gradient(80% 85% at 0% 0%, var(--getPremiumAdBg2) 0%, var(--getPremiumAdBg) 100%);
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  color: var(--getPremiumAdColor);
  padding-left: 0;

  > .svg-inline--fa {
    display: grid;
    place-items: center;
    width: 5.8rem;
    color: var(--getPremiumAdColor);
    font-size: 3rem;
  }

  > div {
    padding: var(--s4);
    padding-left: 0;
    flex: 1 1 100%;
  }

  h2 {
    font-size: 1.8rem;
    line-height: 1.3;
    font-weight: 600;
    margin: 0;
  }

  p {
    margin: 0;
    font-size: 1.4rem;
    line-height: 1.3;
  }
}

.getPremiumAdManage {
  background-image: none;
  background-color: var(--cGrey2);
  color: var(--cText);

  > .svg-inline--fa {
    width: 5.8rem;
    font-size: 2.4rem;
    color: var(--cText);
  }

  h2 {
    font-size: 1.6rem;
  }
}

.whatsNewBox {
  margin-block-start: var(--s5);
  margin-block-end: var(--s5);
}

.newUpdateHeading {
  display: flex;
  align-items: center;
  margin: 0;
  gap: 1.4rem;
}

.newUpdateIcon.svg-inline--fa {
  font-size: 2.4rem;
}

.newUpdateContent {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem;
}

.newUpdateTitle {
  display: block;
  width: 100%;
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 600;
  font-size: 1.8rem;
  margin-right: auto;
}

.newUpdateClose {
  border: 0;
  font-size: 1.4rem;

  .svg-inline--fa {
    font-size: 1.6rem;
  }
}
</style>
