<script setup>
import { ref, onMounted } from 'vue'
import { checkPermission } from '@/helpers/widgets.js'
const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  icons: {
    type: Boolean,
    required: true,
  },
  titles: {
    type: Boolean,
    default: true,
  },
  openInNewTab: {
    type: Boolean,
    required: true,
  },
  iconPermission: {
    type: Boolean,
    required: true,
  },
  inMenu: {
    type: Boolean,
    default: false,
  },
  noTeleport: {
    type: Boolean,
    default: false,
  },
  more: {
    type: Boolean,
    default: false,
  },
})

onMounted(async () => {
  if (props.node.special === 'mostVisited') {
    topSitesPermission.value = await checkPermission('topSites')
    if (topSitesPermission.value) getMostVisited()
  }
})

const topSitesPermission = ref(false)

const mostVisitedLinks = ref(null)

const getIcon = (link) => {
  const url = new URL(chrome.runtime.getURL('/_favicon/'))
  url.searchParams.append('pageUrl', link)
  url.searchParams.append('size', '128')
  return url.toString()
}

const getMostVisited = () => {
  if (!topSitesPermission.value) return
  chrome.topSites.get((list) => {
    mostVisitedLinks.value = [...list]
  })
}
</script>

<template>
  <DropdownMenu v-if="props.node.special === 'mostVisited' && topSitesPermission" :no-teleport="noTeleport">
    <template #button>
      <button
        type="button"
        :class="{
          childrenMenuFolder: props.inMenu,
          linkFolder: !props.inMenu,
          noTitle: !props.node.title,
        }"
        :title="props.node.title"
      >
        <fa icon="fa-heart" class="linkFavicon linkFaviconSvg" />
        <div v-if="props.node.title && props.titles" class="linkName">{{ props.node.title }}</div>
      </button>
    </template>
    <template #menu>
      <ul class="childrenMenu">
        <li v-for="child in mostVisitedLinks" :key="child.id">
          <a
            :href="child.url"
            class="childrenMenuAnchor"
            :title="`${child.title}&#10;${child.url}`"
            :target="props.openInNewTab ? '_blank' : '_self'"
          >
            <img
              v-if="props.icons && props.iconPermission"
              class="linkFavicon"
              :src="getIcon(child.url)"
              :alt="`Favicon for ${child.url}`"
            />
            <div class="linkName">{{ child.title }}</div>
          </a>
        </li>
      </ul>
    </template>
  </DropdownMenu>
  <DropdownMenu v-if="props.node.children && props.node.special !== 'mostVisited'" :no-teleport="noTeleport">
    <template #button>
      <button
        type="button"
        :class="{
          childrenMenuFolder: props.inMenu,
          linkFolder: !props.inMenu,
          noTitle: !props.node.title,
        }"
        :title="more ? 'More bookmarks' : props.node.title"
      >
        <template v-if="!more">
          <svg
            v-if="props.icons && props.iconPermission"
            class="linkFavicon linkFaviconSvg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"
              alt="Folder icon"
            />
          </svg>
          <div v-if="props.inMenu || (props.node.title && props.titles)" class="linkName">
            {{ props.node.title }}
          </div>
        </template>
        <template v-else>
          <fa icon="fa-angles-right" class="linkFavicon" />
          <div v-if="props.node.title && props.titles" class="linkName">{{ props.node.title }}</div>
        </template>
      </button>
    </template>
    <template #menu>
      <ul class="childrenMenu">
        <li v-for="child in props.node.children" :key="child.id">
          <a
            v-if="!child.children && child.special !== 'mostVisited'"
            :href="child.url"
            class="childrenMenuAnchor"
            :title="`${child.title}&#10;${child.url}`"
            :target="props.openInNewTab ? '_blank' : '_self'"
          >
            <img
              v-if="props.icons && props.iconPermission"
              class="linkFavicon"
              :src="getIcon(child.url)"
              :alt="`Favicon for ${child.url}`"
            />
            <div class="linkName">{{ child.title }}</div>
          </a>
          <QuickLinksNode
            v-else
            :node="child"
            :icons="props.icons"
            :open-in-new-tab="props.openInNewTab"
            :icon-permission="props.iconPermission"
            no-teleport
            in-menu
          />
        </li>
      </ul>
    </template>
  </DropdownMenu>
</template>

<style lang="scss" scoped>
.childrenMenu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3em;
  list-style: none;
  margin: 0;
  padding: 1rem;
  overflow-y: auto;
  max-height: 80dvh;
  li {
    width: 100%;
  }
}

.childrenMenuFolder,
.childrenMenuAnchor {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.4em;
  border: 0;
  padding: 0.6rem 0.8rem;
  background-color: transparent;
  box-shadow: none;
  border-radius: 1.9rem;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.5rem;
  font-weight: 300;
  text-decoration: none;
  color: var(--cText);
  text-shadow: inherit;
  white-space: nowrap;
  transition: background-color 0.2s ease-in-out;
  line-height: 1.3;
  cursor: pointer;
  &:hover,
  &:focus-visible {
    outline: none;
    background-color: hsl(0deg 0% 100% / 0.1);
  }
  .dropdownActive > & {
    background-color: hsl(0deg 0% 100% / 0.1);
  }
  .linkName {
    overflow: hidden;
    max-width: 350px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .linkFavicon {
    display: block;
    width: 16px;
    height: 16px;
  }
}
</style>
