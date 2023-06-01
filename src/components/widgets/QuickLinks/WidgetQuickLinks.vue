<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/store.js'

const store = useSettingsStore()
const { quickLink } = storeToRefs(store)

const iconTemp = ref({})

const getShortcut = (index) => {
  let i

  if (index > 3) return null
  if (index <= 3) i = index + 1

  return `Shortcut: [alt]+${i}`
}

const getQuickLinksIcon = (url) => {
  if (!iconTemp[url]) {
    let faviconUrl = new URL(`chrome-extension://${chrome.runtime.id}/_favicon/`)
    faviconUrl.searchParams.append('pageUrl', url)
    faviconUrl.searchParams.append('size', '32')
    iconTemp[url] = faviconUrl.href
  }
  return iconTemp[url]
}

const bookmarksManager = () => {
  if (quickLink.openInNewTab) {
    chrome.tabs.create({ url: 'chrome://bookmarks' })
  } else {
    chrome.tabs.update({ url: 'chrome://bookmarks' })
  }
}

const history = () => {
  if (quickLink.openInNewTab) {
    chrome.tabs.create({ url: 'chrome://history' })
  } else {
    chrome.tabs.update({ url: 'chrome://history' })
  }
}

const apps = () => {
  if (quickLink.openInNewTab) {
    chrome.tabs.create({ url: 'chrome://apps' })
  } else {
    chrome.tabs.update({ url: 'chrome://apps' })
  }
}

const chromeTab = () => {
  if (quickLink.openInNewTab) {
    chrome.tabs.create({ url: 'chrome-search://local-ntp/local-ntp.html' })
  } else {
    chrome.tabs.update({ url: 'chrome-search://local-ntp/local-ntp.html' })
  }
}
</script>

<template>
  <div class="quickLinksBar">
    <ul
      :class="{
        quickLinksVertical: quickLink.vertical,
        quickLinksAlignLeft: quickLink.textAlign === 'left',
        quickLinksAlignCenter: quickLink.textAlign === 'center',
        quickLinksAlignRight: quickLink.textAlign === 'right',
      }"
      :style="{ gap: store.getPadding(quickLink.padding, 0.5) }"
    >
      <li v-if="quickLink.apps">
        <button :title="$('tab.bookmarks.links.apps')" class="link allowPointerEvent" @click="apps()">
          <!-- <img v-if="quickLink.icons" src="/img/apps.png" class="quickLinksIcon"> -->
          <div class="quickLinksLabel">
            {{ $t('tab.bookmarks.links.apps') }}
          </div>
        </button>
      </li>
      <li v-if="quickLink.chromeTab">
        <button :title="$t('tab.bookmarks.links.chromeTab')" class="link allowPointerEvent" @click="chromeTab()">
          <fa v-if="quickLink.icons" icon="fa-window-maximize" fixed-width></fa>
          <div class="quickLinksLabel">
            {{ $t('tab.bookmarks.links.chromeTab') }}
          </div>
        </button>
      </li>
      <li v-if="quickLink.history">
        <button :title="$('tab.bookmarks.links.history')" class="link allowPointerEvent" @click="history()">
          <fa v-if="quickLink.icons" icon="fa-clock-rotate-left" fixed-width></fa>
          <div class="quickLinksLabel">
            {{ $t('tab.bookmarks.links.history') }}
          </div>
        </button>
      </li>
      <li v-if="quickLink.bookmarksManager">
        <button
          :title="$t('tab.bookmarks.links.bookmarksManager')"
          class="link allowPointerEvent"
          @click="bookmarksManager()"
        >
          <fa v-if="quickLink.icons" icon="fa-bookmark" fixed-width></fa>
          <div class="quickLinksLabel">
            {{ $t('tab.bookmarks.links.bookmarksManager') }}
          </div>
        </button>
      </li>
      <!-- <li class="mostVisitedLink" v-if="quickLink.mostVisited">
        <button #quickLinkMostVisitedBtn :title="$t('tab.bookmarks.links.mostVisited')"
        class="link allowPointerEvent" @click="toggleMostVisited($event)">
          <fa v-if="quickLink.icons" icon="fa-folder" fixed-width></fa>
          <div class="quickLinksLabel">{{ $t('tab.bookmarks.links.mostVisited') }}</div>
        </button>
      </li> -->
      <template v-if="quickLink.links.length > 0">
        <li v-for="(item, i) in quickLink.links" :key="i">
          <a
            :href="item.url"
            class="link allowPointerEvent"
            :title="getShortcut(i)"
            :accesskey="i <= 9 ? i + 1 : null"
            :target="quickLink.openInNewTab ? '_blank' : '_self'"
          >
            <img v-if="quickLink.icons" :src="getQuickLinksIcon(item.url)" class="quickLinksIcon" />
            <div class="quickLinksLabel">{{ item.label }}</div>
          </a>
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.wallpaper {
  position: absolute;
  inset: 0;
  height: 100vh;
  background-position: center;
  z-index: 1;
}
</style>
