<!-- eslint-disable no-undef -->
<script setup>
import { useI18n } from 'vue-i18n'
import { ref, inject } from 'vue'
import { DateTime } from 'luxon'
import { useSettingsStore, getStorage, setStorage } from '@/store.js'
import { languages } from '@/assets/lists.js'
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
const newWidgetMenu = ref(null)
const { locale } = useI18n({ useScope: 'global' })

const allTimezones = []
for (const zone of Intl.supportedValuesOf('timeZone')) {
  allTimezones.push({
    id: zone,
    label: `${zone} - ${DateTime.local({ zone }).toFormat('ZZZZZ')} (${DateTime.local({ zone }).toFormat('ZZZZ')})`,
  })
}
allTimezones.unshift({ id: 'local', label: 'Local' })

const selectTimezone = (tz) => {
  store.config.global.tabTitle.timezone = tz.id
}

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
  if (newWidgetMenu.value) newWidgetMenu.value.close()
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

const handleLangSelect = (event) => {
  locale.value = event.target.value
}
</script>

<template>
  <div class="page">
    <PageHeading title="Extension Settings"></PageHeading>
    <div class="blockContainer">
      <FieldAccordion>
        <template #label>
          <div class="label">Wallpaper</div>
        </template>
        <template #children>
          <div class="block">
            <div class="group fill">
              <label for="backgroundColor" class="label mra">Color</label>
              <ColorField v-model="store.config.global.wallpaper.background" tag-id="backgroundColor" class="w10">
              </ColorField>
            </div>
          </div>
          <div class="block">
            <div class="group fill">
              <label for="backgroundColor" class="label mra">Background Image</label>
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
                    {{ store.config.global.wallpaper.type === 'none' ? 'Image' : '' }}
                    {{ store.config.global.wallpaper.type === 'upload' ? 'Uploaded image' : '' }}
                    {{
                      store.config.global.wallpaper.type === 'pattern'
                        ? `Pattern: ${store.config.global.wallpaper.id}`
                        : ''
                    }}
                    {{ store.config.global.wallpaper.type === 'unphoto' ? 'Unsplash.com Photo' : '' }}
                    {{ store.config.global.wallpaper.type === 'untopic' ? 'Unsplash.com Topic: ' : '' }}
                    {{ store.config.global.wallpaper.type === 'uncollection' ? 'Unsplash.com Collection: ' : '' }}
                    {{ store.config.global.wallpaper.type === 'pxphoto' ? 'Pexels.com Photo' : '' }}
                    {{ store.config.global.wallpaper.type === 'pxcurated' ? 'Pexels.com Curated Photos' : '' }}
                    {{ store.config.global.wallpaper.type === 'pxcollection' ? 'Pexels.com Collection: ' : '' }}
                    {{ store.config.global.wallpaper.type === 'pxcarettab' ? 'Hand-picked for CaretTab: ' : '' }}
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
                    v-if="
                      ['pxphoto', 'pxcurated', 'pxcollection', 'pxcarettab'].includes(
                        store.config.global.wallpaper.type
                      )
                    "
                    class="btn"
                    type="button"
                    @click="store.goTo('pexels')"
                  >
                    Search Pexels
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
                    Refresh
                  </button>
                  <button class="btn" type="button" @click="handleRemoveImage()"><fa icon="fa-xmark" /> Remove</button>
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
                <div class="desc">Image</div>
                <div class="btnGroup">
                  <DropdownMenu ref="newWidgetMenu">
                    <template #button>
                      <button type="button" class="btn">
                        {{ store.config.global.wallpaper.type === 'default' ? 'Select image' : 'Select an image' }}
                        <fa icon="fa-caret-down"></fa>
                      </button>
                    </template>
                    <template #menu>
                      <ul class="imageSelectMenu">
                        <li v-if="store.config.global.wallpaper.type !== 'default'">
                          <button class="btn btnBlock" type="button" @click="handleRemoveImage(true)">Default</button>
                        </li>
                        <li>
                          <button class="btn btnBlock" type="button" @click="handleUploadBtnClick()">
                            Upload file
                          </button>
                        </li>
                        <li>
                          <button class="btn btnBlock" type="button" @click="store.goTo('patterns')">Pattern</button>
                        </li>
                        <li>
                          <button
                            :disabled="!user.paid"
                            class="btn btnBlock"
                            type="button"
                            @click="store.goTo('pexels')"
                          >
                            <PremiumLabel />Pexels.com
                          </button>
                        </li>
                        <li>
                          <button
                            :disabled="!user.paid"
                            class="btn btnBlock"
                            type="button"
                            @click="store.goTo('unsplash')"
                          >
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
                    title="Remove image"
                    aria-label="Remove image"
                    @click="handleRemoveImage()"
                  >
                    <fa icon="fa-xmark" /> Remove
                  </button>
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
                        :href="store.config.global.wallpaperApi.authorLink + '?utm_source=carettab&utm_medium=referral'"
                      >
                        {{ store.config.global.wallpaperApi.authorName }}
                      </a>
                    </span>
                    <a
                      class="imageDetailsPhotoLink"
                      target="_blank"
                      title="Open link to photo"
                      :href="store.config.global.wallpaperApi.photoLink + '?utm_source=carettab&utm_medium=referral'"
                    >
                      <fa icon="fa-arrow-up-right-from-square" fixed-width></fa>
                    </a>
                  </button>
                </template>
                <template #menu>
                  <div class="imageDetailsDescription">
                    <h3 class="label">Photo details:</h3>
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
                        store.config.global.wallpaperApi.photoAlt &&
                        store.config.global.wallpaperApi.photoAlt.trim() !== ''
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
              <div class="label mra">Brightness</div>
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
                <div><PremiumLabel />Contrast</div>
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
                <div><PremiumLabel />Saturation</div>
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
                <div><PremiumLabel />Blur</div>
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
              <label for="imageFilter" class="label mra">Filter</label>
              <select
                id="imageFilter"
                v-model="store.config.global.wallpaper.filter"
                name="imageFilter"
                class="select w20"
              >
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
            <div class="block">
              <label for="imageFill" class="label mra">Fill</label>
              <select id="imageFill" v-model="store.config.global.wallpaper.size" name="imageFill" class="select w20">
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
              class="block"
            >
              <div class="label mra">Scale</div>
              <div class="range w20">
                <output class="output">{{ store.config.global.wallpaper.scale }}</output>
                <input
                  v-model="store.config.global.wallpaper.scale"
                  type="range"
                  class="rangeInput"
                  min="0"
                  max="200"
                />
              </div>
            </div>
            <div class="block">
              <div class="label mra">Reset styles</div>
              <button type="button" class="btn fit" @click="handleImageAdjustmentReset()">
                <fa icon="fa-rotate-left"></fa> Reset Styles
              </button>
            </div>
          </template>
        </template>
      </FieldAccordion>
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
            <label for="tabTitle">Tab Title</label>
            <div class="desc">
              Choose what to display in the New Tab title (shows on the tab itself as well as in the browser's title
              bar).
            </div>
          </div>
          <div class="group stack">
            <select id="tabTitle" v-model="store.config.global.tabTitle.type" name="tabTitle" class="select w25">
              <option value="newtab">"New Tab"</option>
              <option value="datetime">Date/time</option>
              <option value="custom">Custom text</option>
            </select>
          </div>
        </div>
        <div v-if="store.config.global.tabTitle.type !== 'newtab'" class="group fill">
          <div v-if="store.config.global.tabTitle.type === 'custom'" class="group stack fill">
            <label for="customTabTitle" class="desc">Custom title text</label>
            <input
              id="customTabTitle"
              v-model="store.config.global.tabTitle.custom"
              type="text"
              class="input fill"
              placeholder="Enter custom text"
            />
          </div>
          <div v-if="store.config.global.tabTitle.type === 'datetime'" class="group stack fill">
            <label for="datetimeFormat" class="desc">
              <div>
                Date/time
                <a href="https://moment.github.io/luxon/#/parsing?id=table-of-tokens" target="_blank"> format code </a>
              </div>
            </label>
            <input
              id="datetimeFormat"
              v-model="store.config.global.tabTitle.datetime"
              type="text"
              class="input fill"
              placeholder="Enter date/time format"
            />
          </div>
          <div v-if="store.config.global.tabTitle.type === 'datetime'" class="group stack fill">
            <label for="tabTitleTimezone" class="desc"> Timezone </label>
            <AutocompleteField
              tag-id="tabTitleTimezone"
              class="fill"
              :list="allTimezones"
              :selected="store.config.global.tabTitle.timezone"
              @selected="(item) => selectTimezone(item)"
            ></AutocompleteField>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="disableSelection">Disable text selection</label>
            <div class="desc">
              This will prevent you from selecting text on the new tab page resulting in a cleaner look in case of
              accidental clicks.
            </div>
          </div>
          <ToggleField v-model="store.config.global.disableSelection" tag-id="disableSelection" />
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            <label for="hideSettings">Hide settings button</label>
            <div class="desc">
              When enabled the settings button will display when you hover over the bottom right corner.
            </div>
          </div>
          <ToggleField v-model="store.config.global.hideSettings" tag-id="hideSettings" />
        </div>
      </div>
      <div class="block">
        <div class="label mra">Advanced</div>
        <button class="btn" type="button" @click="store.goTo('advanced')">
          <fa icon="fa-gear" fixed-width></fa>Advanced settings
        </button>
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

.imageSelectMenu {
  list-style: none;
  display: grid;
  grid-template: auto / 1fr;
  margin: 0;
  gap: var(--s4);
  padding: var(--s4);
}
</style>
