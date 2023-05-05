<script setup>
import { ref, watch, onMounted, computed, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore, getStorage, setStorage } from '@/store.js'
import { prepareWallpaperObj, saveUnsplashInfoToGlobal, getRandomPhotoFromUnsplashList } from '@/helpers/unsplash.js'

const access = inject('access')
const user = inject('user')
const store = useSettingsStore()
const { wallpaper } = storeToRefs(store)
const wallpaperSrc = ref(store.wallpaper)

onMounted(async () => {
  loadWallpaper()
})

const filter = computed(() => {
  return `brightness(${store.config.global.ibr * 0.1}) saturate(${store.config.global.isa * 0.1}) contrast(${
    store.config.global.ico * 0.1
  }) blur(${store.config.global.ibl}px)`
})

const blendMode = computed(() => {
  return store.config.global.ifi
})

const bgSize = computed(() => {
  let size = 'cover'
  switch (store.config.global.isz) {
    case 'cover':
      size = 'cover'
      break
    case 'contain':
      size = 'contain'
      break
    case 'scale':
      if (store.config.global.it === 'pattern') {
        size = 'cover'
      } else {
        size = `${store.config.global.isc}%`
      }
      break
    case 'scaleRepeat':
      if (store.config.global.it === 'pattern') {
        size = 'cover'
      } else {
        size = `${store.config.global.isc}%`
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
    (store.config.global.isz === 'scale' || store.config.global.isz === 'scaleRepeat') &&
    store.config.global.it === 'pattern'
  ) {
    if (store.config.global.it === 'pattern') {
      scale = `max(1, ${store.config.global.isc * 0.01})`
    } else {
      scale = '1'
    }
  }
  return scale
})

const bgRepeat = computed(() => {
  let repeat = 'cover'
  switch (store.config.global.isz) {
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
  if (globalStorage.global && globalStorage.global.it) imageType = globalStorage.global.it

  loadCurrentWallpaper(imageType)
  if (user.paid) {
    getNextWallpaper(globalStorage.global.it, globalStorage.global.its, globalStorage.global.iid)
  }
}

const loadCurrentWallpaper = async (imageType) => {
  if (['upload'].includes(imageType) || (['unphoto', 'untopic', 'uncollection'].includes(imageType) && user.paid)) {
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
  if (['untopic', 'uncollection'].includes(type)) {
    let now = new Date()
    let then = new Date(timestamp)
    let thenPlusOne = new Date(then.getFullYear(), then.getMonth(), then.getDate() + 1, 0, 0, 0, 0)

    // Get next random wallpaper if it's a new day
    if (thenPlusOne < now) {
      // Set 'next' wallpaper to current wallpaper
      let nextWallpaper = await getStorage('nextWallpaper', 'local')
      if (nextWallpaper.nextWallpaper) {
        let nextImage = prepareWallpaperObj(nextWallpaper.nextWallpaper)
        saveUnsplashInfoToGlobal(type, id, nextImage, store.config.global.unli, store.config.global.unll)

        setStorage({ currentWallpaper: nextImage }, 'local')
        store.wallpaper = nextImage
        wallpaperSrc.value = `url(${nextImage.base64})`
      }

      // Retrieve new 'next' wallpaper
      let newRandomPhoto = await getRandomPhotoFromUnsplashList(access.items.us, type, id)
      if (newRandomPhoto) {
        setStorage({ nextWallpaper: newRandomPhoto }, 'local')
      }

      store.save()
    }
  }
}

watch(
  () => wallpaper.value,
  () => {
    if (wallpaper.value && wallpaper.value.base64) {
      wallpaperSrc.value = `url(${wallpaper.value.base64})`
    } else {
      wallpaperSrc.value = 'none'
    }
  }
)
</script>

<template>
  <div
    class="wallpaper"
    :class="store.config.global.it === 'pattern' ? `wallpaperPattern pattern-${store.config.global.iid}` : ''"
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
  background-image: v-bind(wallpaperSrc);
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
