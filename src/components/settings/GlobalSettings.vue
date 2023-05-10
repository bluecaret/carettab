<!-- eslint-disable no-undef -->
<script setup>
import { useI18n } from 'vue-i18n'
import { ref, inject } from 'vue'
import { useSettingsStore, getStorage, setStorage } from '@/store.js'
import { languages } from '@/assets/lists.js'
import { prepareWallpaperObj, saveUnsplashInfoToGlobal, getRandomPhotoFromUnsplashList } from '@/helpers/unsplash.js'

if (typeof browser === 'undefined') {
  var browser = chrome
}

const props = defineProps({
  openDefault: {
    type: Boolean,
  },
})

const access = inject('access')
const store = useSettingsStore()
const uploadImageField = ref(null)
const { locale } = useI18n({ useScope: 'global' })

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
      alert('Invalid file type. Please select an image file.')
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
      let msg = 'Sorry, the file size of your image is too big.'
      msg += ' Try a smaller image or resize your image at'
      msg += ' https://www.reduceimages.com/'
      alert(msg)
      console.error('Background image failed, image file too large', chrome.runtime.lastError.message)
      return
    }
    if (chrome.runtime.lastError) {
      let msg = 'Sorry, image failed to save. Please try again.'
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
          unsplash: {
            photoTitle: '', // Unsplash photo title
            photoLink: '', // Unsplash photo link
            photoAlt: '', // Unsplash alt description
            authorName: '', // Unsplash author
            authorLink: '', // Unsplash author link
            listName: '', // Unsplash list
            listLink: '', // Unsplash list link
          },
        },
      },
    })
    store.save()
  })
}

const handleRemoveImage = () => {
  store.wallpaper = 'none'
  chrome.storage.local.remove('currentWallpaper')
  chrome.storage.local.remove('nextWallpaper')
  store.$patch({
    config: {
      global: {
        wallpaper: {
          type: 'none',
          id: '', // Image ID
          timestamp: '', // Image timestamp
        },
        unsplash: {
          photoTitle: '', // Unsplash photo title
          photoLink: '', // Unsplash photo link
          photoAlt: '', // Unsplash alt description
          authorName: '', // Unsplash author
          authorLink: '', // Unsplash author link
          listName: '', // Unsplash list
          listLink: '', // Unsplash list link
        },
      },
    },
  })
  store.save()
}

const handleRefreshImage = async () => {
  let nextWallpaper = await getStorage('nextWallpaper', 'local')
  if (nextWallpaper.nextWallpaper) {
    let nextImage = prepareWallpaperObj(nextWallpaper.nextWallpaper)
    saveUnsplashInfoToGlobal(
      store.config.global.wallpaper.type,
      store.config.global.wallpaper.id,
      nextImage,
      store.config.global.unsplash.listName,
      store.config.global.unsplash.listLink
    )

    setStorage({ currentWallpaper: nextImage }, 'local')
    store.wallpaper = nextImage
  }

  // Retrieve new 'next' wallpaper
  let newRandomPhoto = await getRandomPhotoFromUnsplashList(
    access.items.us,
    store.config.global.wallpaper.type,
    store.config.global.wallpaper.id
  )
  if (newRandomPhoto) {
    setStorage({ nextWallpaper: newRandomPhoto }, 'local')
  }
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

const handleLangSelect = (event) => {
  locale.value = event.target.value
}
</script>

<template>
  <div v-if="props.openDefault" class="blockContainer">
    <WidgetFontField
      v-model:cl="store.config.global.font.color"
      v-model:ts="store.config.global.font.shadow"
      v-model:fs="store.config.global.font.size"
      v-model:fb="store.config.global.font.bold"
      v-model:fi="store.config.global.font.italic"
      v-model:fu="store.config.global.font.underline"
      v-model:ls="store.config.global.font.letterSpacing"
      v-model:tt="store.config.global.font.transform"
      v-model:ff="store.config.global.font.family"
      no-override
    >
    </WidgetFontField>
    <WidgetBoxField
      v-model:rounded="store.config.global.container.radius"
      v-model:bs="store.config.global.container.borderSize"
      v-model:bc="store.config.global.container.borderColor"
      v-model:bg="store.config.global.container.background"
      v-model:shadow="store.config.global.container.shadow"
      v-model:padding="store.config.global.container.padding"
      no-override
    >
    </WidgetBoxField>
  </div>
  <h3 class="subtitle">General settings</h3>
  <div class="blockContainer">
    <div class="block">
      <label for="lang" class="label mra">Language</label>
      <select
        id="lang"
        v-model="store.config.global.lang"
        class="select w25"
        name="lang"
        @change="handleLangSelect($event)"
      >
        <option v-for="lang in languages" :key="lang.id" :value="lang.id">{{ lang.label }}</option>
      </select>
      <!-- <select id="locale" v-model="$i18n.locale" style="position: fixed; z-index: 9999; bottom: 0">
        <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
      </select> -->
    </div>
    <div class="block">
      <div class="group fill">
        <div class="label mra">
          <label for="">Wallpaper</label>
        </div>
        <div class="group">
          <div class="group stack">
            <label for="backgroundColor" class="desc">Color</label>
            <ColorField v-model="store.config.global.wallpaper.background" tag-id="backgroundColor" class="w10 mra">
            </ColorField>
          </div>
          <div
            v-if="store.config.global.wallpaper.type && store.config.global.wallpaper.type !== 'none'"
            class="group stack"
          >
            <div class="desc">
              <span>
                {{ store.config.global.wallpaper.type === 'none' ? 'Image' : '' }}
                {{ store.config.global.wallpaper.type === 'upload' ? 'Uploaded image' : '' }}
                {{
                  store.config.global.wallpaper.type === 'pattern' ? `Pattern: ${store.config.global.wallpaper.id}` : ''
                }}
                {{ store.config.global.wallpaper.type === 'unphoto' ? 'Unsplash.com Photo' : '' }}
                {{ store.config.global.wallpaper.type === 'untopic' ? 'Unsplash.com Topic: ' : '' }}
                {{ store.config.global.wallpaper.type === 'uncollection' ? 'Unsplash.com Collection: ' : '' }}
                <a
                  v-if="store.config.global.wallpaper.type === 'untopic'"
                  target="_blank"
                  :href="store.config.global.unsplash.listLink + '?utm_source=carettab&utm_medium=referral'"
                  >{{ store.config.global.unsplash.listName }}</a
                >
                <a
                  v-if="store.config.global.wallpaper.type === 'uncollection'"
                  target="_blank"
                  :href="store.config.global.unsplash.listLink + '?utm_source=carettab&utm_medium=referral'"
                  >{{ store.config.global.unsplash.listName }}</a
                >
              </span>
            </div>
            <div class="btnGroup">
              <button
                v-if="store.config.global.wallpaper.type === 'pattern'"
                class="btn"
                type="button"
                @click="store.goTo('patterns')"
              >
                Select pattern
              </button>
              <button
                v-if="['unphoto', 'untopic', 'uncollection'].includes(store.config.global.wallpaper.type)"
                class="btn"
                type="button"
                @click="store.goTo('unsplash')"
              >
                Search Unsplash
              </button>
              <button
                v-if="['untopic', 'uncollection'].includes(store.config.global.wallpaper.type)"
                class="btn"
                type="button"
                @click="handleRefreshImage()"
              >
                Refresh
              </button>
              <button class="btn" type="button" @click="handleRemoveImage()">Remove</button>
            </div>
          </div>
          <div
            v-if="!store.config.global.wallpaper.type || store.config.global.wallpaper.type === 'none'"
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
            <div class="desc">Image</div>
            <div class="btnGroup">
              <button class="btn" type="button" @click="handleUploadBtnClick()">Upload file</button>
              <button class="btn" type="button" @click="store.goTo('patterns')">Pattern</button>
              <button class="btn" type="button" @click="store.goTo('unsplash')"><PremiumLabel />Unsplash.com</button>
            </div>
          </div>
        </div>
      </div>
      <DropdownMenu
        v-if="['unphoto', 'untopic', 'uncollection'].includes(store.config.global.wallpaper.type)"
        style="width: 100%"
      >
        <template #button>
          <button type="button" class="imageDetails">
            <fa icon="fa-images" fixed-width></fa>
            <span>
              Photo taken by
              <a
                target="_blank"
                :href="store.config.global.unsplash.authorLink + '?utm_source=carettab&utm_medium=referral'"
              >
                {{ store.config.global.unsplash.authorName }}
              </a>
            </span>
            <a
              class="imageDetailsPhotoLink"
              target="_blank"
              title="Open link to photo"
              :href="store.config.global.unsplash.photoLink + '?utm_source=carettab&utm_medium=referral'"
            >
              <fa icon="fa-arrow-up-right-from-square" fixed-width></fa>
            </a>
          </button>
        </template>
        <template #menu>
          <div class="imageDetailsDescription">
            <h3 class="label">Photo details:</h3>
            <p
              v-if="store.config.global.unsplash.photoTitle && store.config.global.unsplash.photoTitle.trim() !== ''"
              class="paragraph"
            >
              {{ store.config.global.unsplash.photoTitle }}
            </p>
            <p
              v-if="store.config.global.unsplash.photoAlt && store.config.global.unsplash.photoAlt.trim() !== ''"
              class="paragraph"
            >
              {{ store.config.global.unsplash.photoAlt }}
            </p>
          </div>
        </template>
      </DropdownMenu>
      <div
        v-if="store.config.global.wallpaper.type && store.config.global.wallpaper.type !== 'none'"
        class="group fill stack"
      >
        <div class="group fill">
          <div class="group stack">
            <div class="desc">Brightness</div>
            <div class="range">
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
          <div class="group stack">
            <div class="desc">
              <div><PremiumLabel />Contrast</div>
            </div>
            <div class="range">
              <output class="output">{{ store.config.global.wallpaper.contrast }}</output>
              <input
                v-model="store.config.global.wallpaper.contrast"
                type="range"
                class="rangeInput"
                min="0"
                max="30"
              />
            </div>
          </div>
          <div class="group stack">
            <div class="desc">
              <div><PremiumLabel />Saturation</div>
            </div>
            <div class="range">
              <output class="output">{{ store.config.global.wallpaper.saturation }}</output>
              <input
                v-model="store.config.global.wallpaper.saturation"
                type="range"
                class="rangeInput"
                min="0"
                max="30"
              />
            </div>
          </div>
          <div class="group stack">
            <div class="desc">
              <div><PremiumLabel />Blur</div>
            </div>
            <div class="range">
              <output class="output">{{ store.config.global.wallpaper.blur }}</output>
              <input v-model="store.config.global.wallpaper.blur" type="range" class="rangeInput" min="0" max="50" />
            </div>
          </div>
        </div>
        <div class="group fill">
          <div class="group stack fill">
            <label for="imageFilter" class="desc">Filter</label>
            <select id="imageFilter" v-model="store.config.global.wallpaper.filter" name="imageFilter" class="select">
              <option value="normal">Normal</option>
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
          <div class="group stack fill">
            <label for="imageFill" class="desc">Fill</label>
            <select id="imageFill" v-model="store.config.global.wallpaper.size" name="imageFill" class="select">
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="repeat">Repeat</option>
              <option value="scale">Scale</option>
              <option value="scaleRepeat">Scale and repeat</option>
            </select>
          </div>
          <div
            v-if="
              store.config.global.wallpaper.size === 'scale' || store.config.global.wallpaper.size === 'scaleRepeat'
            "
            class="group stack"
          >
            <div class="desc">Scale</div>
            <div class="range w12">
              <output class="output">{{ store.config.global.wallpaper.scale }}</output>
              <input v-model="store.config.global.wallpaper.scale" type="range" class="rangeInput" min="0" max="200" />
            </div>
          </div>
          <div class="group stack">
            <div class="desc">Reset styles</div>
            <button type="button" class="btn fit" @click="handleImageAdjustmentReset()">
              <fa icon="fa-rotate-left"></fa> Reset Styles
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
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
  background-color: var(--cGrey3Alt);
  padding: var(--s5) var(--s5);
  font-size: 1.6rem;
  .imageDetailsPhotoLink {
    margin-left: auto;
  }
}
.imageDetailsDescription {
  display: block;
  width: 40rem;
  padding: var(--s5);
}
</style>
