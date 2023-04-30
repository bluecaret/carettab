<!-- eslint-disable no-undef -->
<script setup>
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

const selectFont = (font) => {
  if (font) {
    let newGlobal = { ...store.config.global }
    newGlobal.ff = font
    store.$patch({ config: { global: newGlobal } })
  }
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
          it: 'upload',
          iid: '', // Image ID
          its: '', // Image timestamp
          unpt: '', // Unsplash photo title
          unpl: '', // Unsplash photo link
          unalt: '', // Unsplash alt description
          unau: '', // Unsplash author
          unal: '', // Unsplash author link
          unli: '', // Unsplash list
          unll: '', // Unsplash list link
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
        it: 'none',
        iid: '', // Image ID
        its: '', // Image timestamp
        unpt: '', // Unsplash photo title
        unpl: '', // Unsplash photo link
        unalt: '', // Unsplash alt description
        unau: '', // Unsplash author
        unal: '', // Unsplash author link
        unli: '', // Unsplash list
        unll: '', // Unsplash list link
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
      store.config.global.it,
      store.config.global.iid,
      nextImage,
      store.config.global.unli,
      store.config.global.unll
    )

    setStorage({ currentWallpaper: nextImage }, 'local')
    store.wallpaper = nextImage
  }

  // Retrieve new 'next' wallpaper
  let newRandomPhoto = await getRandomPhotoFromUnsplashList(
    access.items.us,
    store.config.global.it,
    store.config.global.iid
  )
  if (newRandomPhoto) {
    setStorage({ nextWallpaper: newRandomPhoto }, 'local')
  }
}

const handleImageAdjustmentReset = () => {
  store.$patch({
    config: {
      global: {
        isz: 'cover', // Image size
        ifi: 'normal', // Image filter
        ibr: 10, // Image brightness
        isa: 10, // Image saturation
        ico: 10, // Image contrast
        ibl: 0, // Image blur
        isc: 100, // Image scale
      },
    },
  })
}
</script>

<template>
  <div class="blockContainer">
    <WidgetFontField
      v-if="props.openDefault"
      v-model:cl="store.config.global.cl"
      v-model:ts="store.config.global.ts"
      v-model:fs="store.config.global.fs"
      v-model:fb="store.config.global.fb"
      v-model:fi="store.config.global.fi"
      v-model:fu="store.config.global.fu"
      v-model:ls="store.config.global.ls"
      v-model:tt="store.config.global.tt"
      no-override
      :ff="store.config.global.ff"
      @update:ff="selectFont($event)"
    >
    </WidgetFontField>
    <WidgetBoxField
      v-if="props.openDefault"
      v-model:rounded="store.config.global.crd"
      v-model:bs="store.config.global.cbs"
      v-model:bc="store.config.global.cbc"
      v-model:bg="store.config.global.cbg"
      v-model:shadow="store.config.global.csh"
      v-model:padding="store.config.global.cpd"
      no-override
    >
    </WidgetBoxField>
  </div>
  <h3 class="subtitle">Wallpaper</h3>
  <div class="blockContainer">
    <div class="block">
      <label for="backgroundColor" class="label mra">Wallpaper color</label>
      <ColorPickerField v-model="store.config.global.bg" tag-id="backgroundColor" class="w10"> </ColorPickerField>
    </div>
    <div class="block">
      <div class="group fill">
        <div class="label mra">
          <label for="">Wallpaper image</label>
          <div v-if="!store.config.global.it || store.config.global.it === 'none'" class="desc">
            Select a type of wallpaper image to use.
          </div>
          <div v-if="store.config.global.it && store.config.global.it !== 'none'" class="desc">
            {{ store.config.global.it === 'upload' ? 'Uploaded file' : '' }}
            {{ store.config.global.it === 'pattern' ? `Pattern: ${store.config.global.iid}` : '' }}
            {{ store.config.global.it === 'unphoto' ? 'Unsplash.com Photo' : '' }}
            {{ store.config.global.it === 'untopic' ? 'Unsplash.com Topic' : '' }}
            {{ store.config.global.it === 'uncollection' ? 'Unsplash.com Collection' : '' }}
            <br
              v-if="
                store.config.global.it &&
                store.config.global.it !== 'none' &&
                store.config.global.it !== 'upload' &&
                store.config.global.it !== 'unphoto'
              "
            />
            <a
              v-if="store.config.global.it === 'untopic'"
              target="_blank"
              :href="store.config.global.unll + '?utm_source=carettab&utm_medium=referral'"
              >{{ store.config.global.unli }}</a
            >
            <a
              v-if="store.config.global.it === 'uncollection'"
              target="_blank"
              :href="store.config.global.unll + '?utm_source=carettab&utm_medium=referral'"
              >{{ store.config.global.unli }}</a
            >
          </div>
        </div>
        <div v-if="store.config.global.it && store.config.global.it !== 'none'" class="group compact">
          <button v-if="store.config.global.it === 'pattern'" class="btn" type="button" @click="store.goTo('patterns')">
            Select pattern
          </button>
          <button
            v-if="['unphoto', 'untopic', 'uncollection'].includes(store.config.global.it)"
            class="btn"
            type="button"
            @click="store.goTo('unsplash')"
          >
            Search Unsplash
          </button>
          <button
            v-if="['untopic', 'uncollection'].includes(store.config.global.it)"
            class="btn"
            type="button"
            @click="handleRefreshImage()"
          >
            <fa icon="fa-rotate-left" fixed-width></fa>
            New image
          </button>
          <button class="btn" type="button" @click="handleRemoveImage()">
            Remove {{ store.config.global.it === 'pattern' ? 'pattern' : 'image' }}
          </button>
        </div>
        <div v-if="!store.config.global.it || store.config.global.it === 'none'" class="group compact">
          <input
            id="uploadImg"
            ref="uploadImageField"
            class="file"
            name="imageUrl"
            type="file"
            accept="image/*"
            @change="getUploadedImage($event)"
          />
          <div class="btnGroup">
            <button class="btn" type="button" @click="handleUploadBtnClick()">Upload file</button>
            <button class="btn" type="button" @click="store.goTo('patterns')">Pattern</button>
            <button class="btn" type="button" @click="store.goTo('unsplash')"><PremiumLabel />Unsplash.com</button>
          </div>
        </div>
      </div>
      <div v-if="['unphoto', 'untopic', 'uncollection'].includes(store.config.global.it)" class="group stack fill">
        <div class="paragraph">
          Current
          <a
            target="_blank"
            title="Open link to photo"
            :href="store.config.global.unpl + '?utm_source=carettab&utm_medium=referral'"
            >photo</a
          >
          by
          <a target="_blank" :href="store.config.global.unal + '?utm_source=carettab&utm_medium=referral'">
            {{ store.config.global.unau }}
          </a>
          <div v-if="store.config.global.unpt && store.config.global.unpt.trim() !== ''">
            <small>Photo title:</small> <strong>{{ store.config.global.unpt }}</strong>
          </div>
          <div v-if="store.config.global.unalt && store.config.global.unalt.trim() !== ''">
            <small>Photo description:</small> <strong>{{ store.config.global.unalt }}</strong>
          </div>
        </div>
      </div>
    </div>
    <div v-if="store.config.global.it && store.config.global.it !== 'none'" class="block">
      <label for="" class="label">Image adjustments</label>
      <div class="group fill">
        <div class="group stack">
          <div class="desc">Brightness</div>
          <div class="range">
            <output class="output">{{ store.config.global.ibr }}</output>
            <input v-model="store.config.global.ibr" type="range" class="rangeInput" min="0" max="30" />
          </div>
        </div>
        <div class="group stack">
          <div class="desc">
            <div><PremiumLabel />Contrast</div>
          </div>
          <div class="range">
            <output class="output">{{ store.config.global.ico }}</output>
            <input v-model="store.config.global.ico" type="range" class="rangeInput" min="0" max="30" />
          </div>
        </div>
        <div class="group stack">
          <div class="desc">
            <div><PremiumLabel />Saturation</div>
          </div>
          <div class="range">
            <output class="output">{{ store.config.global.isa }}</output>
            <input v-model="store.config.global.isa" type="range" class="rangeInput" min="0" max="30" />
          </div>
        </div>
        <div class="group stack">
          <div class="desc">
            <div><PremiumLabel />Blur</div>
          </div>
          <div class="range">
            <output class="output">{{ store.config.global.ibl }}</output>
            <input v-model="store.config.global.ibl" type="range" class="rangeInput" min="0" max="50" />
          </div>
        </div>
      </div>
      <div class="group fill">
        <div class="group stack fill">
          <label for="imageFilter" class="desc">Filter</label>
          <select id="imageFilter" v-model="store.config.global.ifi" name="imageFilter" class="select">
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
          <select id="imageFill" v-model="store.config.global.isz" name="imageFill" class="select">
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="repeat">Repeat</option>
            <option value="scale">Scale</option>
            <option value="scaleRepeat">Scale and repeat</option>
          </select>
        </div>
        <div
          v-if="store.config.global.isz === 'scale' || store.config.global.isz === 'scaleRepeat'"
          class="group stack"
        >
          <div class="desc">Scale</div>
          <div class="range w12">
            <output class="output">{{ store.config.global.isc }}</output>
            <input v-model="store.config.global.isc" type="range" class="rangeInput" min="0" max="200" />
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
  <h3 class="subtitle">General settings</h3>
  <div class="blockContainer">
    <div class="block">
      <label for="lang" class="label mra">Language</label>
      <select id="lang" v-model="store.config.global.lang" class="select w25" name="lang">
        <option v-for="lang in languages" :key="lang.id" :value="lang.id">{{ lang.label }}</option>
      </select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file {
  display: none;
}
</style>
