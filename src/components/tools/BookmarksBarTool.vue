<script setup>
import { reactive, ref, onMounted, computed, nextTick, onBeforeUnmount } from 'vue'
import { useSettingsStore } from '@/store.js'
import { hsl, shadow, checkPermission } from '@/helpers/widgets.js'

const store = useSettingsStore()
const bookmarksBar = reactive(store.config.bookmarksBar)
const bookmarksPermission = ref(false)
const faviconPermission = ref(false)
const loading = ref(false)
const bookmarks = ref([])
const visibleBookmarks = ref([])
const moreBookmarks = ref([])
const bookmarksListEl = ref(null)
const moreButtonEl = ref(null)

const barWidth = ref(0)
const availableSpace = ref(0)
const showMore = ref(false)
let resizeTimer = null

onMounted(async () => {
  bookmarksPermission.value = await checkPermission('bookmarks')
  faviconPermission.value = await checkPermission('favicon')

  if (bookmarksPermission.value) {
    loading.value = true
    const tree = await chrome.bookmarks.getTree()
    bookmarks.value = [...tree[0].children.find((node) => node.id === '1' && node.parentId === '0').children]
    loading.value = false
    nextTick(() => organizeBookmarks())
  }

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const setBarStyles = () => {
  return `
    ${bookmarksBar.bar.position === 'bottom' ? 'bottom: 0' : 'top: 0'};
    background-color: ${hsl(bookmarksBar.bar.background)};
    box-shadow: ${shadow(bookmarksBar.bar.shadow)};
    padding: ${bookmarksBar.bar.padding}px;
    margin: ${bookmarksBar.bar.margin}px;
    border: ${bookmarksBar.bar.borderSize}px solid ${hsl(bookmarksBar.bar.borderColor)};
    border-radius: ${bookmarksBar.bar.borderRadius}px;
    text-shadow: ${shadow(
      bookmarksBar.base.font.override ? bookmarksBar.base.font.shadow : store.config.global.font.shadow
    )};
    color: ${hsl(bookmarksBar.base.font.override ? bookmarksBar.base.font.color : store.config.global.font.color)};

  `
}

const setRootBookmarksBarStyles = computed(() => {
  return `
  <style>
    :root {
      --bookmarkLinkColor: ${hsl(
        bookmarksBar.base.font.override ? bookmarksBar.base.font.color : store.config.global.font.color
      )};
      --bookmarkLinkMaxWidth: ${bookmarksBar.link.maxWidth}px;
      --bookmarkLinkMargin: ${bookmarksBar.link.margin}px;
      --bookmarkLinkPadding: ${bookmarksBar.link.padding}px;
      --bookmarkLinkBorder: ${bookmarksBar.link.borderSize}px solid ${hsl(bookmarksBar.link.borderColor)};
      --bookmarkLinkBackground: ${hsl(bookmarksBar.link.background)};
      --bookmarkLinkHoverBackground: ${hsl(bookmarksBar.link.hoverBackground)};
      --bookmarkLinkBorderRadius: ${bookmarksBar.link.borderRadius}px;
      --bookmarkLinkFamily: "${
        bookmarksBar.base.font.override ? bookmarksBar.base.font.family : store.config.global.font.family
      }";
      --bookmarkLinkSize: ${
        bookmarksBar.base.font.override ? bookmarksBar.base.font.size : store.config.global.font.size
      }px;
      --bookmarkLinkIconSize: ${bookmarksBar.link.iconSize}px;
      --bookmarkLinkLetterSpacing: ${
        bookmarksBar.base.font.override ? bookmarksBar.base.font.letterSpacing : store.config.global.font.letterSpacing
      }px;
      --bookmarkLinkBold: ${
        bookmarksBar.base.font.override ? bookmarksBar.base.font.bold : store.config.global.font.weight
      };
      --bookmarkLinkItalic: ${
        bookmarksBar.base.font.override ? bookmarksBar.base.font.italic : store.config.global.font.style
      };
      --bookmarkLinkUnderline: ${
        bookmarksBar.base.font.override ? bookmarksBar.base.font.underline : store.config.global.font.underline
      };
      --bookmarkLinkTransform: ${
        bookmarksBar.base.font.override ? bookmarksBar.base.font.transform : store.config.global.font.transform
      };
    }
  </style>
  `
})

const getIcon = (link) => {
  const url = new URL(chrome.runtime.getURL('/_favicon/'))
  url.searchParams.append('pageUrl', link)
  url.searchParams.append('size', '128')
  return url.toString()
}

const getBarWidth = () => {
  let width = 0
  Array.from(bookmarksListEl.value.children).map((item) => {
    width = width + item.getBoundingClientRect().width
  })
  barWidth.value = width
}

const organizeBookmarks = () => {
  visibleBookmarks.value = [...bookmarks.value]
  moreBookmarks.value = []

  // Above we reset visible bookmarks to all bookmarks, then we run nextTick to wait for DOM to update before recalculating moreBookmarks
  nextTick(() => {
    getBarWidth()
    availableSpace.value =
      bookmarksListEl.value.getBoundingClientRect().width - moreButtonEl.value.getBoundingClientRect().width
    if (barWidth.value > availableSpace.value) {
      let width = 0
      let index = 0
      Array.from(bookmarksListEl.value.children).map((item, i) => {
        width = width + item.getBoundingClientRect().width + store.config.bookmarksBar.link.margin
        if (width < availableSpace.value) {
          index = index + 1
        }
      })

      moreBookmarks.value = [...visibleBookmarks.value.splice(index, bookmarks.value.length)]
      visibleBookmarks.value = [...visibleBookmarks.value.splice(0, index)]
    }
    showMore.value = moreBookmarks.value.length > 0
  })
}

const handleResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => organizeBookmarks(), 200)
}
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="setRootBookmarksBarStyles"></div>
  <div class="bookmarksBar" :style="setBarStyles()">
    <FontLink v-if="bookmarksBar.base.font.override" :widget="bookmarksBar"></FontLink>
    <div v-if="!bookmarksPermission && !loading" class="noPermissions">
      Permissions needed to display bookmarks
      <RequestPermissionModal
        permission="bookmarks"
        permission-label="Bookmarks"
        reason="The Bookmarks permission is needed to retrieve the bookmarks you have saved in the browser. Denying this permission will prevent the Bookmarks bar from being shown."
        @requested="checkBookmarksPermission()"
      />
    </div>
    <div v-if="bookmarksPermission && loading" class="noPermissions">Loading bookmarks...</div>
    <ul v-if="bookmarksPermission && !loading" ref="bookmarksListEl" class="bookmarks">
      <li v-for="bookmark in visibleBookmarks" :key="bookmark.id" class="bookmark">
        <a
          v-if="!bookmark.children"
          :href="bookmark.url"
          class="bookmarksBarAnchor"
          :title="bookmark.title"
          :target="bookmarksBar.link.openInNewTab ? '_blank' : '_self'"
        >
          <img
            v-if="bookmarksBar.link.icons && faviconPermission"
            class="bookmarksBarFavicon"
            :src="getIcon(bookmark.url)"
            :alt="`Favicon for ${bookmark.url}`"
          />
          <div class="bookmarksBarName">{{ bookmark.title }}</div>
        </a>
        <BookmarksBarNode v-else :node="bookmark" :icon-permission="faviconPermission" />
      </li>
      <li ref="moreButtonEl" class="bookmark more">
        <BookmarksBarNode :node="{ id: 'more', children: moreBookmarks }" :icon-permission="faviconPermission" more />
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.bookmarksBarFolder,
.bookmarksBarAnchor {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.4em;
  border: var(--bookmarkLinkBorder);
  padding: var(--bookmarkLinkPadding);
  background-color: var(--bookmarkLinkBackground);
  box-shadow: var(--bookmarkLinkShadow);
  border-radius: var(--bookmarkLinkBorderRadius);
  letter-spacing: var(--bookmarkLinkLetterSpacing);
  font-family: var(--bookmarkLinkFamily);
  font-size: var(--bookmarkLinkSize);
  font-weight: var(--bookmarkLinkBold);
  font-style: var(--bookmarkLinkItalic);
  text-decoration: var(--bookmarkLinkUnderline);
  text-transform: var(--bookmarkLinkTransform);
  color: inherit;
  text-shadow: inherit;
  white-space: nowrap;
  transition: background-color 0.2s ease-in-out;
  line-height: 1.3;
  cursor: pointer;
  &:hover,
  &:focus-visible {
    outline: none;
    background-color: var(--bookmarkLinkHoverBackground);
  }
  .dropdownActive > & {
    background-color: var(--bookmarkLinkHoverBackground);
  }
  .bookmarksBarName {
    overflow: hidden;
    max-width: var(--bookmarkLinkMaxWidth);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.bookmarksBarFavicon {
  display: block;
  width: var(--bookmarkLinkIconSize);
  height: var(--bookmarkLinkIconSize);
  * {
    fill: var(--bookmarkLinkColor);
  }
}
</style>

<style lang="scss" scoped>
.bookmarksBar {
  position: fixed;
  left: var(--toolbarSize);
  right: 0;
  z-index: 11;
  display: block;
  padding: 0 10px;
}

.bookmarks {
  display: flex;
  align-items: center;
  gap: var(--bookmarkLinkMargin);
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.bookmark.more {
  margin-left: auto;
}

.noPermissions {
  display: flex;
  align-items: center;
  gap: 1em;
}
</style>
