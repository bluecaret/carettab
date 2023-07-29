<script setup>
import { ref, watch, onMounted, computed, inject } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore, getStorage, setStorage } from '@/store.js'
import { prepareUnsplashWallpaperObj, getRandomPhotoFromUnsplashList } from '@/helpers/unsplash.js'
import { preparePexelsWallpaperObj, getRandomPhotoFromPexelsList } from '@/helpers/pexels.js'
import cloneDeep from 'lodash/cloneDeep'

const user = inject('user')
const store = useSettingsStore()
const wallpaperSrc = ref(store.wallpaper)
const defaultWallpaper = 'url("/img/juniper.jpg")'
// Photo credited to Wyxina Tresse
// https://www.pexels.com/@wyxina-tresse-311038210/
// https://www.pexels.com/photo/juniper-bush-tree-14537809/

onMounted(async () => {
  loadWallpaper()
})

const filter = computed(() => {
  return `brightness(${store.config.global.wallpaper.brightness * 0.1}) saturate(${
    user.value.paid ? store.config.global.wallpaper.saturation * 0.1 : 1
  }) contrast(${user.value.paid ? store.config.global.wallpaper.contrast * 0.1 : 1}) blur(${
    user.value.paid ? store.config.global.wallpaper.blur : 0
  }px)`
})

const blendMode = computed(() => {
  return store.config.global.wallpaper.filter
})

const bgSize = computed(() => {
  let size = 'cover'
  switch (store.config.global.wallpaper.size) {
    case 'cover':
      size = 'cover'
      break
    case 'contain':
      size = 'contain'
      break
    case 'scale':
      if (store.config.global.wallpaper.type === 'pattern') {
        size = 'cover'
      } else {
        size = `${store.config.global.wallpaper.scale}%`
      }
      break
    case 'scaleRepeat':
      if (store.config.global.wallpaper.type === 'pattern') {
        size = 'cover'
      } else {
        size = `${store.config.global.wallpaper.scale}%`
      }
      break
    default:
      size = 'cover'
      break
  }
  return size
})

const bgScale = computed(() => {
  let scale = '1'
  if (
    (store.config.global.wallpaper.size === 'scale' || store.config.global.wallpaper.size === 'scaleRepeat') &&
    store.config.global.wallpaper.type === 'pattern'
  ) {
    if (store.config.global.wallpaper.type === 'pattern') {
      scale = `max(1, ${store.config.global.wallpaper.scale * 0.01})`
    } else {
      scale = '1'
    }
  }
  return scale
})

const bgRepeat = computed(() => {
  let repeat = 'cover'
  switch (store.config.global.wallpaper.size) {
    case 'repeat':
      repeat = 'repeat'
      break
    case 'scaleRepeat':
      repeat = 'repeat'
      break
    default:
      repeat = 'no-repeat'
      break
  }
  return repeat
})

const loadWallpaper = async () => {
  const globalStorage = await getStorage('global', 'sync')

  let imageType = ''
  if (globalStorage.global && globalStorage.global.wallpaper.type) {
    imageType = globalStorage.global.wallpaper.type
  }

  loadCurrentWallpaper(imageType)
  if (
    user.value.paid &&
    globalStorage.global &&
    globalStorage.global.wallpaper &&
    globalStorage.global.wallpaper.lock === false
  ) {
    getNextWallpaper(
      globalStorage.global.wallpaper.type,
      globalStorage.global.wallpaper.timestamp,
      globalStorage.global.wallpaper.id
    )
  }
}

const loadCurrentWallpaper = async (imageType) => {
  if (!imageType || ['default'].includes(imageType)) {
    wallpaperSrc.value = defaultWallpaper
  }
  if (
    ['upload'].includes(imageType) ||
    (['unphoto', 'untopic', 'uncollection', 'pxphoto', 'pxcurated', 'pxcollection', 'pxcarettab'].includes(imageType) &&
      user.value.paid)
  ) {
    let getCurrentWallpaper = await getStorage('currentWallpaper', 'local')

    if (getCurrentWallpaper && getCurrentWallpaper.currentWallpaper) {
      store.wallpaper = getCurrentWallpaper.currentWallpaper
      wallpaperSrc.value = `url(${getCurrentWallpaper.currentWallpaper.base64})`
    }
  }
  if (['pattern'].includes(imageType)) {
    wallpaperSrc.value = 'none'
  }
}

const getNextWallpaper = async (type, timestamp, id) => {
  const globalStorage = await getStorage('global', 'sync')
  const newStore = cloneDeep(globalStorage.global)
  let now = DateTime.now()
  let thenPlusOne = DateTime.fromJSDate(new Date(timestamp))
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .plus({ days: 1 })
  if (['untopic', 'uncollection'].includes(type)) {
    // Get next random wallpaper if it's a new day
    if (thenPlusOne < now) {
      // Set 'next' wallpaper to current wallpaper
      let nextWallpaper = await getStorage('nextWallpaper', 'local')
      if (nextWallpaper.nextWallpaper) {
        let nextImage = prepareUnsplashWallpaperObj(nextWallpaper.nextWallpaper)

        newStore.wallpaper.type = type
        newStore.wallpaper.id = id
        newStore.wallpaper.timestamp = new Date().toString()
        newStore.wallpaperApi.photoTitle = nextImage.description
        newStore.wallpaperApi.photoLink = nextImage.links.html
        newStore.wallpaperApi.photoAlt = nextImage.alt_description
        newStore.wallpaperApi.authorName = nextImage.user.name
        newStore.wallpaperApi.authorLink = nextImage.user.links.html

        await setStorage({ currentWallpaper: nextImage }, 'local')
        store.wallpaper = nextImage
        wallpaperSrc.value = `url(${nextImage.base64})`
      }

      // Retrieve new 'next' wallpaper
      let newRandomPhoto = await getRandomPhotoFromUnsplashList(type, id)
      if (newRandomPhoto) {
        setStorage({ nextWallpaper: newRandomPhoto }, 'local')
      }

      setStorage({ global: newStore }, 'sync')
    }
  } else if (['pxcurated', 'pxcollection', 'pxcarettab'].includes(type)) {
    // Get next random wallpaper if it's a new day
    if (thenPlusOne < now) {
      // Set 'next' wallpaper to current wallpaper
      let nextWallpaper = await getStorage('nextWallpaper', 'local')
      if (nextWallpaper.nextWallpaper) {
        let nextImage = nextWallpaper.nextWallpaper

        newStore.wallpaper.type = type
        newStore.wallpaper.id = id
        newStore.wallpaper.timestamp = new Date().toString()
        newStore.wallpaperApi.photoTitle = nextImage.description
        newStore.wallpaperApi.photoLink = nextImage.links.html
        newStore.wallpaperApi.photoAlt = nextImage.alt_description
        newStore.wallpaperApi.authorName = nextImage.user.name
        newStore.wallpaperApi.authorLink = nextImage.user.links.html

        await setStorage({ currentWallpaper: nextImage }, 'local')
        store.wallpaper = nextImage
        wallpaperSrc.value = `url(${nextImage.base64})`
      }

      // Retrieve new 'next' wallpaper
      let newRandomPhoto = await getRandomPhotoFromPexelsList(type, id)
      if (newRandomPhoto) {
        let modifiedNew = await preparePexelsWallpaperObj(newRandomPhoto)
        setStorage({ nextWallpaper: modifiedNew }, 'local')
      }

      setStorage({ global: newStore }, 'sync')
    }
  }
}

watch(
  () => store.wallpaper,
  () => {
    if (store.wallpaper && store.wallpaper.base64) {
      wallpaperSrc.value = `url(${store.wallpaper.base64})`
    } else if (store.wallpaper === 'default') {
      wallpaperSrc.value = defaultWallpaper
    } else {
      wallpaperSrc.value = 'none'
    }
  }
)
</script>

<template>
  <div
    class="wallpaper"
    :class="
      store.config.global.wallpaper.type === 'pattern'
        ? `wallpaperPattern pattern-${store.config.global.wallpaper.id}`
        : ''
    "
    :style="`background-image: ${wallpaperSrc};`"
  >
    <div class="wallpaperBackdrop"></div>
  </div>
</template>

<style lang="scss" scoped>
.wallpaper {
  position: absolute;
  z-index: 1;
  inset: 0;
  height: 100vh;
  background-position: center;
  background-size: v-bind(bgSize);
  background-repeat: v-bind(bgRepeat);
  scale: v-bind(bgScale);
  mix-blend-mode: v-bind(blendMode);
}

.wallpaperBackdrop {
  position: absolute;
  inset: 0;
  background-position: center;
  backdrop-filter: v-bind(filter);
  pointer-events: none;
}
</style>
