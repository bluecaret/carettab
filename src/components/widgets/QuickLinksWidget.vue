<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch, inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { hsl, shadow, checkPermission, setWidgetContainerStyles } from '@/helpers/widgets.js'
import QuickLinksNode from '@/components/widgets/QuickLinksNode.vue'

const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
})

const store = useSettingsStore()
const user = inject('user')
const loading = ref(false)
const containerSize = ref(0)
const availableSpace = ref(0)
const showMore = ref(true)
let resizeTimer = null

// Temp link lists
const visibleLinks = ref([])
const hiddenLinks = ref([])

// Permissions
const faviconPermission = ref(false)
const bookmarksPermission = ref(false)
const topSitesPermission = ref(false)
const allLinks = ref([])

// DOM elements
const linkListEl = ref(null)
const moreButtonEl = ref(null)

// Find index of quickLinks in store
const qlIndex = ref(store.config.quickLinks.findIndex((c) => c.id === props.widget.id))

onMounted(async () => {
  faviconPermission.value = await checkPermission('favicon')
  prepareLinkList()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

watch(
  () => [props.widget.type, props.widget.layout, props.widget.quickLinks.length],
  () => {
    prepareLinkList()
  }
)

const prepareLinkList = async () => {
  if (props.widget.type === 'ql') {
    getQuickLinks()
  }
  if (props.widget.type === 'bk') {
    loading.value = true
    bookmarksPermission.value = await checkPermission('bookmarks')
    loading.value = false
    if (bookmarksPermission.value) getBookmarks()
  }
  if (props.widget.type === 'mv') {
    loading.value = true
    topSitesPermission.value = await checkPermission('topSites')
    loading.value = false
    if (topSitesPermission.value) getMostVisited()
  }
}

const checkBookmarksPermission = async () => {
  bookmarksPermission.value = await checkPermission('bookmarks')
}

const checkTopSitesPermission = async () => {
  topSitesPermission.value = await checkPermission('topSites')
}

const getQuickLinks = () => {
  allLinks.value = [...props.widget.quickLinks]
  nextTick(() => organizeLinks())
}

const getBookmarks = () => {
  if (!bookmarksPermission.value) return
  loading.value = true
  chrome.bookmarks.getTree((tree) => {
    const bookmarks = tree[0].children.find((node) => node.id === '1' && node.parentId === '0').children
    allLinks.value = [...bookmarks]
    loading.value = false
    nextTick(() => organizeLinks())
  })
}

const getMostVisited = () => {
  if (!topSitesPermission.value) return
  loading.value = true
  chrome.topSites.get((list) => {
    list.forEach((link, index) => {
      link.id = index
      link.special = 'none'
    })
    allLinks.value = [...list]
    loading.value = false
    nextTick(() => organizeLinks())
  })
}

const getContainerSize = () => {
  if (
    (bookmarksPermission.value && props.widget.type === 'bk') ||
    (topSitesPermission.value && props.widget.type === 'mv') ||
    props.widget.type === 'ql'
  ) {
    let size = 0
    Array.from(linkListEl.value.children).map((item) => {
      if (['ch', 'ih'].includes(props.widget.layout)) {
        size = size + item.getBoundingClientRect().width
      } else if (['cv', 'iv'].includes(props.widget.layout)) {
        size = size + item.getBoundingClientRect().height
      }
    })
    containerSize.value = size
  }
}

const organizeLinks = () => {
  visibleLinks.value = [...allLinks.value]
  hiddenLinks.value = []

  // Above we reset visible links to all links, then we run nextTick to wait for DOM to update before recalculating hiddenLinks
  nextTick(() => {
    getContainerSize()

    // If grid, don't use the "more bookmarks" menu
    if (['cg', 'ig'].includes(props.widget.layout)) {
      showMore.value = false
      return
    }

    if (['ch', 'ih'].includes(props.widget.layout)) {
      availableSpace.value =
        linkListEl.value.getBoundingClientRect().width - moreButtonEl.value.getBoundingClientRect().width
    } else if (['cv', 'iv'].includes(props.widget.layout)) {
      availableSpace.value =
        linkListEl.value.getBoundingClientRect().height - moreButtonEl.value.getBoundingClientRect().height
    }
    if (containerSize.value > availableSpace.value) {
      let size = 0
      let index = 0
      Array.from(linkListEl.value.children).map((item) => {
        if (['ch', 'ih'].includes(props.widget.layout)) {
          size = size + item.getBoundingClientRect().width + props.widget.link.margin
        } else if (['cv', 'iv'].includes(props.widget.layout)) {
          size = size + item.getBoundingClientRect().height + props.widget.link.margin
        }
        if (size < availableSpace.value) {
          index = index + 1
        }
      })

      hiddenLinks.value = [
        ...visibleLinks.value.splice(
          ['cv', 'iv'].includes(props.widget.layout) ? index - 1 : index,
          allLinks.value.length
        ),
      ]
      visibleLinks.value = [
        ...visibleLinks.value.splice(0, ['cv', 'iv'].includes(props.widget.layout) ? index - 1 : index),
      ]
    }
    showMore.value = hiddenLinks.value.length > 0
  })
}

const handleResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => organizeLinks(), 200)
}

const getShortcut = (index) => {
  // Only return a shortcut if this is the first quickLink widget to avoid duplicate shortcuts
  if (qlIndex.value > 0) return ''
  if (index > 3) return ''
  let i = index + 1
  return `Shortcut: [alt]+${i}`
}

const handleSpecialClick = (special) => {
  if (special === 'apps') {
    if (props.widget.openInNewTab) {
      chrome.tabs.create({ url: 'chrome://apps' })
    } else {
      chrome.tabs.update({ url: 'chrome://apps' })
    }
  }
  if (special === 'bookmarksManager') {
    if (props.widget.openInNewTab) {
      chrome.tabs.create({ url: 'chrome://bookmarks' })
    } else {
      chrome.tabs.update({ url: 'chrome://bookmarks' })
    }
  }
  if (special === 'history') {
    if (props.widget.openInNewTab) {
      chrome.tabs.create({ url: 'chrome://history' })
    } else {
      chrome.tabs.update({ url: 'chrome://history' })
    }
  }
  if (special === 'defaultTab') {
    if (props.widget.openInNewTab) {
      chrome.tabs.create({ url: 'chrome-search://local-ntp/local-ntp.html' })
    } else {
      chrome.tabs.update({ url: 'chrome-search://local-ntp/local-ntp.html' })
    }
  }
}

const getIcon = (link) => {
  const url = new URL(chrome.runtime.getURL('/_favicon/'))
  url.searchParams.append('pageUrl', link)
  url.searchParams.append('size', '128')
  return url.toString()
}

const containerStyles = computed(() => {
  return setWidgetContainerStyles(props.widget, store.config.global, user.value.paid)
})

const setQuickLinksVars = computed(() => {
  return `
      --linkMaxWidth: ${props.widget.link.maxWidth}px;
      --linkMargin: ${props.widget.link.margin}px;
      --linkPadding: ${props.widget.link.padding}px;
      --linkBorder: ${props.widget.link.borderSize}px solid ${hsl(props.widget.link.borderColor)};
      --linkShadow: ${shadow(props.widget.link.background)};
      --linkBackground: ${hsl(props.widget.link.background)};
      --linkHoverBackground: ${hsl(props.widget.link.hoverBackground)};
      --linkBorderRadius: ${props.widget.link.borderRadius}px;
      --linkFamily: "${
        props.widget.base.font.override ? props.widget.base.font.family : store.config.global.font.family
      }";
      --linkSize: ${props.widget.base.font.size}px;
      --linkIconSize: ${props.widget.link.iconSize}px;
      --linkLetterSpacing: ${
        props.widget.base.font.override ? props.widget.base.font.letterSpacing : store.config.global.font.letterSpacing
      }px;
      --linkBold: ${props.widget.base.font.override ? props.widget.base.font.bold : store.config.global.font.weight};
      --linkItalic: ${props.widget.base.font.override ? props.widget.base.font.italic : store.config.global.font.style};
      --linkUnderline: ${
        props.widget.base.font.override ? props.widget.base.font.underline : store.config.global.font.underline
      };
      --linkTransform: ${
        props.widget.base.font.override ? props.widget.base.font.transform : store.config.global.font.transform
      };
  `
})
</script>

<template>
  <div
    class="quickLinks widget"
    :class="[props.widget.base.alignment, `container-${props.widget.base.container.alignment}`]"
    :style="containerStyles + setQuickLinksVars"
  >
    <FontLink v-if="props.widget.base.font.override" :widget="props.widget"></FontLink>
    <template v-if="true">
      <div v-if="loading" class="noPermissions">Loading links...</div>
      <div v-if="!bookmarksPermission && props.widget.type === 'bk' && !loading" class="noPermissions">
        Permissions needed to display bookmarks
        <RequestPermissionModal
          permission="bookmarks"
          permission-label="Bookmarks"
          reason="The Bookmarks permission is needed to retrieve the bookmarks you have saved in the browser. Denying this permission will prevent the Bookmarks from being shown."
          @requested="checkBookmarksPermission()"
        />
      </div>
      <div v-if="!topSitesPermission && props.widget.type === 'mv' && !loading" class="noPermissions">
        Permissions needed to display most visited
        <RequestPermissionModal
          permission="topSites"
          permission-label="Top Sites"
          reason="The top sites permission is needed to retrieve the list of tope sites you have visited. Denying this permission will prevent the Most Visited list from being shown."
          @requested="checkTopSitesPermission()"
        />
      </div>
      <ul
        v-if="
          ((bookmarksPermission && props.widget.type === 'bk') ||
            (topSitesPermission && props.widget.type === 'mv') ||
            (props.widget.type !== 'bk' && props.widget.type !== 'mv')) &&
          !loading
        "
        ref="linkListEl"
        class="linkList"
        :class="{
          linkListHorizontal: ['ch', 'ih'].includes(props.widget.layout),
          linkListVertical: ['cv', 'iv'].includes(props.widget.layout),
          linkListIconified: ['ih', 'iv', 'ig'].includes(props.widget.layout),
          linkListGrid: ['cg', 'ig'].includes(props.widget.layout),
        }"
      >
        <li v-for="(link, index) in visibleLinks" :key="link.id" class="linkNode">
          <button
            v-if="link.special !== 'none' && link.special !== 'mostVisited'"
            class="linkAnchor"
            :class="{ noTitle: !link.title }"
            :title="`${link.title}`"
            :accesskey="index <= 9 && qlIndex === 0 ? index + 1 : null"
            @click="handleSpecialClick(link.special)"
          >
            <fa v-if="link.special === 'apps'" icon="fa-table-cells" class="linkFavicon linkFaviconSvg" />
            <fa v-if="link.special === 'bookmarksManager'" icon="fa-star" class="linkFavicon linkFaviconSvg" />
            <fa v-if="link.special === 'history'" icon="fa-clock-rotate-left" class="linkFavicon linkFaviconSvg" />
            <fa v-if="link.special === 'defaultTab'" icon="fa-globe" class="linkFavicon linkFaviconSvg" />
            <div v-if="link.title && props.widget.link.titles" class="linkName">{{ link.title }}</div>
          </button>
          <QuickLinksNode
            v-if="link.special === 'mostVisited'"
            :icons="props.widget.link.icons"
            :titles="props.widget.link.titles"
            :open-in-new-tab="props.widget.link.openInNewTab"
            :node="link"
            :icon-permission="faviconPermission"
          />
          <a
            v-if="!link.children && link.special === 'none'"
            :href="link.url"
            class="linkAnchor"
            :class="{ noTitle: !link.title }"
            :title="`${link.title}&#10;${link.url}&#10;${getShortcut(index)}`"
            :accesskey="index <= 9 && qlIndex === 0 ? index + 1 : null"
            :target="props.widget.link.openInNewTab ? '_blank' : '_self'"
          >
            <img
              v-if="props.widget.link.icons && faviconPermission && link.special === 'none'"
              class="linkFavicon"
              :src="getIcon(link.url)"
              :alt="`Favicon for ${link.url}`"
            />
            <div v-if="link.title && props.widget.link.titles" class="linkName">{{ link.title }}</div>
          </a>
          <QuickLinksNode
            v-if="link.children && link.special === 'none'"
            :icons="props.widget.link.icons"
            :titles="props.widget.link.titles"
            :open-in-new-tab="props.widget.link.openInNewTab"
            :node="link"
            :icon-permission="faviconPermission"
          />
        </li>
        <li ref="moreButtonEl" class="linkNode more">
          <QuickLinksNode
            v-if="showMore"
            :icons="props.widget.link.icons"
            :titles="props.widget.link.titles"
            :open-in-new-tab="props.widget.link.openInNewTab"
            :node="{
              id: 'more',
              title: ['cv', 'iv', 'ih', 'ig'].includes(props.widget.layout) ? 'More' : '',
              special: 'more',
              children: hiddenLinks,
            }"
            :icon-permission="faviconPermission"
            more
          />
        </li>
      </ul>
    </template>
  </div>
</template>

<style lang="scss">
.quickLinks {
  grid-template-columns: 1fr;
}
.quickLinks:has(.linkListGrid) {
  justify-content: initial;
}
.linkList {
  display: flex;
  align-items: center;
  gap: var(--linkMargin);
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  .container-nw &,
  .container-w &,
  .container-sw & {
    justify-content: start;
  }
  .container-c &,
  .container-n &,
  .container-s & {
    justify-content: center;
  }
  .container-ne &,
  .container-e &,
  .container-se & {
    justify-content: end;
  }
  &.linkListVertical {
    flex-direction: column;
    justify-content: center;
    align-items: unset;
    height: 100%;
    .container-c &,
    .container-n &,
    .container-s & {
      align-items: center;
    }
    .container-w &,
    .container-nw &,
    .container-sw & {
      align-items: flex-start;
    }
    .container-e &,
    .container-ne &,
    .container-se & {
      align-items: flex-end;
    }

    .container-nw &,
    .container-n &,
    .container-ne & {
      justify-content: flex-start;
    }
    .container-w &,
    .container-c &,
    .container-sew & {
      justify-content: center;
    }
    .container-sw &,
    .container-s &,
    .container-se & {
      justify-content: flex-end;
    }
  }
  &.linkListIconified {
    .linkAnchor,
    .linkFolder {
      flex-direction: column;
      .container-c &,
      .container-n &,
      .container-s & {
        align-items: center;
      }
      .container-w &,
      .container-nw &,
      .container-sw & {
        align-items: flex-start;
      }
      .container-e &,
      .container-ne &,
      .container-se & {
        align-items: flex-end;
      }

      .container-nw &,
      .container-n &,
      .container-ne & {
        justify-content: flex-start;
      }
      .container-w &,
      .container-c &,
      .container-sew & {
        justify-content: center;
      }
      .container-sw &,
      .container-s &,
      .container-se & {
        justify-content: flex-end;
      }
    }
  }
  &.linkListGrid {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(calc(var(--linkMaxWidth) + var(--linkPadding) + var(--linkPadding)), 1fr)
    );
  }
}

.linkFolder,
.linkAnchor {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.4em;
  border: var(--linkBorder);
  padding: var(--linkPadding) 0 var(--linkPadding) var(--linkPadding);
  background-color: var(--linkBackground);
  box-shadow: var(--linkShadow);
  border-radius: var(--linkBorderRadius);
  letter-spacing: var(--linkLetterSpacing);
  font-family: var(--linkFamily);
  font-size: var(--linkSize);
  font-weight: var(--linkBold);
  font-style: var(--linkItalic);
  text-decoration: var(--linkUnderline);
  text-transform: var(--linkTransform);
  color: inherit;
  text-shadow: inherit;
  white-space: nowrap;
  transition: background-color 0.2s ease-in-out;
  line-height: 1.3;
  cursor: pointer;
  &:hover,
  &:focus-visible {
    outline: none;
    background-color: var(--linkHoverBackground);
  }
  .linkList:not(.linkListVertical) .more & {
    padding: var(--linkPadding);
  }
  &.noTitle {
    padding: var(--linkPadding);
  }
  .dropdownActive > & {
    background-color: var(--linkHoverBackground);
  }
  .linkName {
    overflow: hidden;
    max-width: var(--linkMaxWidth);
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-inline-end: var(--linkPadding);
  }
  .linkListIconified & {
    padding: var(--linkPadding);
    .linkName {
      padding-inline-end: 0;
    }
  }
}

.linkFavicon {
  position: relative;
  display: block;
  width: var(--linkIconSize);
  height: var(--linkIconSize);
  font-size: var(--linkIconSize);
  &.linkFaviconSvg * {
    fill: currentColor;
  }
  &:not(.linkFaviconSvg)::before {
    content: '';
    width: 100%;
    height: 100%;
    background-color: currentColor;
    position: absolute;
    inset: 0;
  }
  &:not(.linkFaviconSvg)::after {
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
  .more & {
    width: calc(var(--linkIconSize) * 0.75);
    height: calc(var(--linkIconSize) * 0.75);
    margin: calc(var(--linkIconSize) * 0.125);
  }
}
</style>

<style lang="scss" scoped>
.noPermissions {
  display: flex;
  align-items: center;
  gap: 1em;
}
</style>
