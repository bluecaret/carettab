<!-- eslint-disable no-undef -->
<script setup>
import { ref, inject } from 'vue'
import { useSettingsStore, getStorage, setStorage } from '@/store.js'
import {
  prepareUnsplashWallpaperObj,
  saveUnsplashInfoToGlobal,
  getRandomPhotoFromUnsplashList,
} from '@/helpers/unsplash.js'
import { preparePexelsWallpaperObj, savePexelsInfoToGlobal, getRandomPhotoFromPexelsList } from '@/helpers/pexels.js'

if (typeof browser === 'undefined') {
  var browser = chrome
}

const user = inject('user')
const store = useSettingsStore()
const uploadImageField = ref(null)
const imageTypeMenu = ref(null)

const handleUploadBtnClick = () => {
  uploadImageField.value.click()
}

const getUploadedImage = () => {
  const fileTypePattern = /image-*/
  const input = uploadImageField.value
  const files = input.files
  if (files && files[0]) {
    const reader = new FileReader()

    if (!files[0].type.match(fileTypePattern)) {
      alert($t('settings.invalidFileType'))
      return
    }

    reader.onload = (e) => {
      processImage(e.target.result)
    }

    reader.readAsDataURL(files[0])
  }
  uploadImageField.value.value = ''
}

const processImage = (imgSrc) => {
  const newBg = { base64: imgSrc }

  browser.storage.local.set({ currentWallpaper: newBg }, () => {
    if (chrome.runtime.lastError && chrome.runtime.lastError.message.startsWith('QUOTA_BYTES')) {
      let msg = $t('settings.fileSizeTooBig', ['https://www.reduceimages.com/'])
      alert(msg)
      console.error('Background image failed, image file too large', chrome.runtime.lastError.message)
      return
    }
    if (chrome.runtime.lastError) {
      let msg = $t('settings.imageFailedToSave')
      alert(msg)
      console.error(
        'Background image failed for unknown reason',
        chrome.runtime.lastError.message,
        uploadSrc.substr(0, 20)
      )
      return
    }

    chrome.storage.local.remove('nextWallpaper')
    store.wallpaper = newBg

    store.$patch({
      config: {
        global: {
          wallpaper: {
            type: 'upload',
            id: '', // Image ID
            timestamp: '', // Image timestamp
          },
          wallpaperApi: {
            photoTitle: '',
            photoLink: '',
            photoAlt: '',
            authorName: '',
            authorLink: '',
            listName: '',
            listLink: '',
          },
        },
      },
    })
    store.save()
  })
}

const handleRemoveImage = (isDefault = false) => {
  if (imageTypeMenu.value) imageTypeMenu.value.close()
  store.wallpaper = isDefault ? 'default' : 'none'
  chrome.storage.local.remove('currentWallpaper')
  chrome.storage.local.remove('nextWallpaper')
  store.$patch({
    config: {
      global: {
        wallpaper: {
          type: isDefault ? 'default' : 'none',
          id: '', // Image ID
          timestamp: '', // Image timestamp
        },
        wallpaperApi: {
          photoTitle: '',
          photoLink: '',
          photoAlt: '',
          authorName: '',
          authorLink: '',
          listName: '',
          listLink: '',
        },
      },
    },
  })
  store.save()
}

const handleRefreshImage = async () => {
  store.isLoading = true
  if (['unphoto', 'untopic', 'uncollection'].includes(store.config.global.wallpaper.type)) {
    let nextWallpaper = await getStorage('nextWallpaper', 'local')
    if (nextWallpaper.nextWallpaper) {
      let nextImage = prepareUnsplashWallpaperObj(nextWallpaper.nextWallpaper)
      saveUnsplashInfoToGlobal(
        store.config.global.wallpaper.type,
        store.config.global.wallpaper.id,
        nextImage,
        store.config.global.wallpaperApi.listName,
        store.config.global.wallpaperApi.listLink
      )

      setStorage({ currentWallpaper: nextImage }, 'local')
      store.wallpaper = nextImage
    }

    // Retrieve new 'next' wallpaper
    let newRandomPhoto = await getRandomPhotoFromUnsplashList(
      store.config.global.wallpaper.type,
      store.config.global.wallpaper.id
    )
    if (newRandomPhoto) {
      setStorage({ nextWallpaper: newRandomPhoto }, 'local')
    }
  } else if (['pxphoto', 'pxcurated', 'pxcollection', 'pxcarettab'].includes(store.config.global.wallpaper.type)) {
    let nextWallpaper = await getStorage('nextWallpaper', 'local')
    if (nextWallpaper.nextWallpaper) {
      let nextImage = nextWallpaper.nextWallpaper
      savePexelsInfoToGlobal(
        store.config.global.wallpaper.type,
        store.config.global.wallpaper.id,
        nextImage,
        store.config.global.wallpaperApi.listName,
        store.config.global.wallpaperApi.listLink
      )

      setStorage({ currentWallpaper: nextImage }, 'local')
      store.wallpaper = nextImage
    }

    // Retrieve new 'next' wallpaper
    let newRandomPhoto = await getRandomPhotoFromPexelsList(
      store.config.global.wallpaper.type,
      store.config.global.wallpaper.id
    )
    if (newRandomPhoto) {
      let modifiedNew = await preparePexelsWallpaperObj(newRandomPhoto)
      setStorage({ nextWallpaper: modifiedNew }, 'local')
    }
  }
  store.isLoading = false
}

const handleImageAdjustmentReset = () => {
  store.$patch({
    config: {
      global: {
        wallpaper: {
          size: 'cover',
          filter: 'normal',
          brightness: 10,
          saturation: 10,
          contrast: 10,
          blur: 0,
          scale: 100,
        },
      },
    },
  })
}
</script>

<template>
  <FieldAccordion>
    <template #label>
      <div class="label">{{ $t('settings.wallpaper') }}</div>
    </template>
    <template #children>
      <div class="block">
        <div class="group fill">
          <label for="backgroundColor" class="label mra">{{ $t('settings.color') }}</label>
          <ColorField v-model="store.config.global.wallpaper.background" tag-id="backgroundColor" class="w20">
          </ColorField>
        </div>
      </div>
      <div class="block stack">
        <div class="group fill">
          <label for="backgroundColor" class="label mra">{{ $t('settings.backgroundImage') }}</label>
          <div
            v-if="
              store.config.global.wallpaper.type &&
              store.config.global.wallpaper.type !== 'none' &&
              store.config.global.wallpaper.type !== 'default'
            "
            class="group stack"
          >
            <div class="desc">
              <span>
                {{ store.config.global.wallpaper.type === 'none' ? $t('settings.image') : '' }}
                {{ store.config.global.wallpaper.type === 'upload' ? $t('settings.uploadedImage') : '' }}
                {{
                  store.config.global.wallpaper.type === 'pattern'
                    ? $t('settings.patternName', [store.config.global.wallpaper.id])
                    : ''
                }}
                {{ store.config.global.wallpaper.type === 'unphoto' ? $t('settings.unsplashComPhoto') : '' }}
                {{ store.config.global.wallpaper.type === 'untopic' ? $t('settings.unsplashComTopicName') : '' }}
                {{
                  store.config.global.wallpaper.type === 'uncollection' ? $t('settings.unsplashComCollectionName') : ''
                }}
                {{ store.config.global.wallpaper.type === 'pxphoto' ? $t('settings.pexelsComPhoto') : '' }}
                {{ store.config.global.wallpaper.type === 'pxcurated' ? $t('settings.pexelsComCuratedPhotos') : '' }}
                {{
                  store.config.global.wallpaper.type === 'pxcollection' ? $t('settings.pexelsComCollectionName') : ''
                }}
                {{
                  store.config.global.wallpaper.type === 'pxcarettab' ? $t('settings.handPickedForCarettabName') : ''
                }}
                <a
                  v-if="store.config.global.wallpaper.type === 'untopic'"
                  target="_blank"
                  :href="store.config.global.wallpaperApi.listLink + '?utm_source=carettab&utm_medium=referral'"
                  >{{ store.config.global.wallpaperApi.listName }}</a
                >
                <a
                  v-if="store.config.global.wallpaper.type === 'uncollection'"
                  target="_blank"
                  :href="store.config.global.wallpaperApi.listLink + '?utm_source=carettab&utm_medium=referral'"
                  >{{ store.config.global.wallpaperApi.listName }}</a
                >
              </span>
            </div>
            <div class="btnGroup fill">
              <button
                v-if="store.config.global.wallpaper.type === 'pattern'"
                class="btn"
                type="button"
                @click="store.goTo('patterns')"
              >
                {{ $t('settings.selectPattern') }}
              </button>
              <button
                v-if="['unphoto', 'untopic', 'uncollection'].includes(store.config.global.wallpaper.type)"
                class="btn"
                type="button"
                @click="store.goTo('unsplash')"
              >
                {{ $t('settings.searchUnsplash') }}
              </button>
              <button
                v-if="
                  ['pxphoto', 'pxcurated', 'pxcollection', 'pxcarettab'].includes(store.config.global.wallpaper.type)
                "
                class="btn"
                type="button"
                @click="store.goTo('pexels')"
              >
                {{ $t('settings.searchPexels') }}
              </button>
              <button
                v-if="
                  ['untopic', 'uncollection', 'pxcurated', 'pxcollection', 'pxcarettab'].includes(
                    store.config.global.wallpaper.type
                  )
                "
                class="btn"
                type="button"
                @click="handleRefreshImage()"
              >
                {{ $t('common.refresh') }}
              </button>
              <button class="btn" type="button" @click="handleRemoveImage()">
                <fa icon="fa-xmark" /> {{ $t('common.remove') }}
              </button>
            </div>
          </div>
          <div
            v-if="
              !store.config.global.wallpaper.type ||
              store.config.global.wallpaper.type === 'none' ||
              store.config.global.wallpaper.type === 'default'
            "
            class="group stack"
          >
            <input
              id="uploadImg"
              ref="uploadImageField"
              class="file"
              name="imageUrl"
              type="file"
              accept="image/*"
              @change="getUploadedImage($event)"
            />
            <div v-if="store.config.global.wallpaper.type === 'default'" class="desc">
              {{ $t('settings.currentlyShowingDefaultImage') }}
            </div>
            <div class="group compact">
              <DropdownMenu ref="imageTypeMenu">
                <template #button>
                  <button type="button" class="btn">
                    {{ store.config.global.wallpaper.type === 'default' ? 'Select image' : 'Select an image' }}
                    <fa icon="fa-caret-down"></fa>
                  </button>
                </template>
                <template #menu>
                  <ul class="imageSelectMenu">
                    <li v-if="store.config.global.wallpaper.type !== 'default'">
                      <button class="btn btnBlock" type="button" @click="handleRemoveImage(true)">
                        {{ $t('settings.default') }}
                      </button>
                    </li>
                    <li>
                      <button class="btn btnBlock" type="button" @click="handleUploadBtnClick()">
                        {{ $t('settings.uploadFile') }}
                      </button>
                    </li>
                    <li>
                      <button class="btn btnBlock" type="button" @click="store.goTo('patterns')">
                        {{ $t('settings.pattern') }}
                      </button>
                    </li>
                    <li>
                      <button :disabled="!user.paid" class="btn btnBlock" type="button" @click="store.goTo('pexels')">
                        <PremiumLabel />Pexels.com
                      </button>
                    </li>
                    <li>
                      <button :disabled="!user.paid" class="btn btnBlock" type="button" @click="store.goTo('unsplash')">
                        <PremiumLabel />Unsplash.com
                      </button>
                    </li>
                  </ul>
                </template>
              </DropdownMenu>
              <button
                v-if="store.config.global.wallpaper.type === 'default'"
                class="btn"
                type="button"
                @click="handleRemoveImage()"
              >
                <fa icon="fa-xmark" /> {{ $t('common.remove') }}
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="
            ['unphoto', 'untopic', 'uncollection', 'pxphoto', 'pxcurated', 'pxcollection', 'pxcarettab'].includes(
              store.config.global.wallpaper.type
            )
          "
          class="group fill"
        >
          <DropdownMenu style="width: 100%">
            <template #button>
              <button type="button" class="imageDetails">
                <fa icon="fa-images" fixed-width></fa>
                <span>
                  {{ $t('settings.photoTakenBy') }}
                  <a
                    target="_blank"
                    :href="store.config.global.wallpaperApi.authorLink + '?utm_source=carettab&utm_medium=referral'"
                  >
                    {{ store.config.global.wallpaperApi.authorName }}
                  </a>
                </span>
                <a
                  class="imageDetailsPhotoLink"
                  target="_blank"
                  :title="$t('settings.openLinkToPhoto')"
                  :href="store.config.global.wallpaperApi.photoLink + '?utm_source=carettab&utm_medium=referral'"
                >
                  <fa icon="fa-arrow-up-right-from-square" fixed-width></fa>
                </a>
              </button>
            </template>
            <template #menu>
              <div class="imageDetailsDescription">
                <h3 class="label">{{ $t('settings.photoDetails') }}</h3>
                <p
                  v-if="
                    store.config.global.wallpaperApi.photoTitle &&
                    store.config.global.wallpaperApi.photoTitle.trim() !== ''
                  "
                  class="paragraph"
                >
                  {{ store.config.global.wallpaperApi.photoTitle }}
                </p>
                <p
                  v-if="
                    store.config.global.wallpaperApi.photoAlt && store.config.global.wallpaperApi.photoAlt.trim() !== ''
                  "
                  class="paragraph"
                >
                  {{ store.config.global.wallpaperApi.photoAlt }}
                </p>
              </div>
            </template>
          </DropdownMenu>
        </div>
      </div>
      <template v-if="store.config.global.wallpaper.type && store.config.global.wallpaper.type !== 'none'">
        <div class="block">
          <div class="label mra">{{ $t('settings.brightness') }}</div>
          <div class="range w20">
            <output class="output">{{ store.config.global.wallpaper.brightness }}</output>
            <input
              v-model="store.config.global.wallpaper.brightness"
              type="range"
              class="rangeInput"
              min="0"
              max="30"
            />
          </div>
        </div>
        <div class="block">
          <div class="label mra">
            <div><PremiumLabel />{{ $t('settings.contrast') }}</div>
          </div>
          <div class="range w20">
            <output class="output">{{ store.config.global.wallpaper.contrast }}</output>
            <input
              v-model="store.config.global.wallpaper.contrast"
              type="range"
              class="rangeInput"
              min="0"
              max="30"
              :disabled="!user.paid"
            />
          </div>
        </div>
        <div class="block">
          <div class="label mra">
            <div><PremiumLabel />{{ $t('settings.saturation') }}</div>
          </div>
          <div class="range w20">
            <output class="output">{{ store.config.global.wallpaper.saturation }}</output>
            <input
              v-model="store.config.global.wallpaper.saturation"
              type="range"
              class="rangeInput"
              min="0"
              max="30"
              :disabled="!user.paid"
            />
          </div>
        </div>
        <div class="block">
          <div class="label mra">
            <div><PremiumLabel />{{ $t('settings.blur') }}</div>
          </div>
          <div class="range w20">
            <output class="output">{{ store.config.global.wallpaper.blur }}</output>
            <input
              v-model="store.config.global.wallpaper.blur"
              type="range"
              class="rangeInput"
              min="0"
              max="50"
              :disabled="!user.paid"
            />
          </div>
        </div>
        <div class="block">
          <label for="imageFilter" class="label mra">{{ $t('settings.filter') }}</label>
          <select id="imageFilter" v-model="store.config.global.wallpaper.filter" name="imageFilter" class="select w20">
            <option value="normal">{{ $t('settings.normal') }}</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
            <option value="darken">Darken</option>
            <option value="lighten">Lighten</option>
            <option value="color-dodge">Color dodge</option>
            <option value="color-burn">Color burn</option>
            <option value="hard-light">Hard light</option>
            <option value="soft-light">Soft light</option>
            <option value="difference">Difference</option>
            <option value="exclusion">Exclusion</option>
            <option value="hue">Hue</option>
            <option value="saturation">Saturation</option>
            <option value="color">Color</option>
            <option value="luminosity">Luminosity</option>
          </select>
        </div>
        <div class="block">
          <label for="imageFill" class="label mra">{{ $t('settings.fill') }}</label>
          <select id="imageFill" v-model="store.config.global.wallpaper.size" name="imageFill" class="select w20">
            <option value="cover">{{ $t('settings.cover') }}</option>
            <option value="contain">{{ $t('settings.contain') }}</option>
            <option value="repeat">{{ $t('settings.repeat') }}</option>
            <option value="scale">{{ $t('settings.scale') }}</option>
            <option value="scaleRepeat">{{ $t('settings.scaleAndRepeat') }}</option>
          </select>
        </div>
        <div
          v-if="store.config.global.wallpaper.size === 'scale' || store.config.global.wallpaper.size === 'scaleRepeat'"
          class="block"
        >
          <div class="label mra">{{ $t('settings.scale') }}</div>
          <div class="range w20">
            <output class="output">{{ store.config.global.wallpaper.scale }}</output>
            <input v-model="store.config.global.wallpaper.scale" type="range" class="rangeInput" min="0" max="200" />
          </div>
        </div>
        <div class="block">
          <div class="label mra">{{ $t('settings.resetStyles') }}</div>
          <button type="button" class="btn fit" @click="handleImageAdjustmentReset()">
            <fa icon="fa-rotate-left"></fa> {{ $t('settings.resetStyles') }}
          </button>
        </div>
      </template>
    </template>
  </FieldAccordion>
</template>

<style lang="scss" scoped>
.file {
  display: none;
}

.imageDetails {
  position: relative;
  cursor: help;
  display: flex;
  gap: var(--s4);
  border: 0;
  width: 100%;
  border-radius: var(--s4);
  background-color: var(--cBlock);
  padding: var(--s5) var(--s5);
  font-size: 1.6rem;
  .imageDetailsPhotoLink {
    margin-left: auto;
  }
}
.imageDetailsDescription {
  display: block;
  width: 57.5rem;
  padding: var(--s5);
}

.imageSelectMenu {
  list-style: none;
  display: grid;
  grid-template: auto / 1fr;
  margin: 0;
  gap: var(--s4);
  padding: var(--s4);
}
</style>
