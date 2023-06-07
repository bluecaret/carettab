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
      --bookmarkBarBackground: ${hsl(bookmarksBar.bar.background)};
      --bookmarkBarMargin: ${bookmarksBar.bar.margin}px;
      --bookmarkBarBorderWidth: ${bookmarksBar.bar.borderSize}px;
      --bookmarkBarPadding: ${bookmarksBar.bar.padding}px;
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
        <BookmarksBarNode
          v-if="moreBookmarks.length > 0"
          :node="{ id: 'more', children: moreBookmarks }"
          :icon-permission="faviconPermission"
          more
        />
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
  position: relative;
  display: block;
  width: var(--bookmarkLinkIconSize);
  height: var(--bookmarkLinkIconSize);
  * {
    fill: var(--bookmarkLinkColor);
  }
  &:not(.bookmarksBarFaviconSvg)::before {
    content: '';
    width: 100%;
    height: 100%;
    background-color: currentColor;
    position: absolute;
    inset: 0;
  }
  &:not(.bookmarksBarFaviconSvg)::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    filter: brightness(50%);
    background-color: currentColor;
    background-position: center;
    background-repeat: no-repeat;
    -webkit-mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg>');
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 75%;
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
