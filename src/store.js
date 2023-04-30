/* eslint-disable no-undef */
import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { DigitalClock } from '@/classes/DigitalClock.js'
import { AnalogClock } from '@/classes/AnalogClock.js'
import { Layer } from '@/classes/Layer.js'
import { widgetTypes } from '@/assets/lists.js'

export const generateUID = () => {
  var firstPart = (Math.random() * 46656) | 0
  var secondPart = (Math.random() * 46656) | 0
  firstPart = ('000' + firstPart.toString(36)).slice(-3)
  secondPart = ('000' + secondPart.toString(36)).slice(-3)
  return firstPart + secondPart
}

export const getStorage = async (key, area = 'local') => {
  return new Promise((resolve, reject) => {
    if (chrome && chrome.storage) {
      chrome.storage[area].get(key, function (result) {
        if (chrome.runtime.lastError) {
          console.error('Failed to get storage', chrome.runtime.lastError)
          reject()
        } else {
          resolve(result)
        }
      })
    } else {
      resolve()
      console.warn('No storage available')
    }
  })
}

export const setStorage = async (keyValue, area = 'local') => {
  return new Promise((resolve, reject) => {
    if (chrome && chrome.storage) {
      chrome.storage[area]
        .set(keyValue)
        .then(() => {
          if (chrome.runtime.lastError) {
            reject()
            console.error('Failed to set storage')
          }
          resolve()
        })
        .catch(() => {
          reject()
          console.error('Failed to set storage')
        })
    } else {
      resolve()
      console.warn('No storage available')
    }
  })
}

export const useSettingsStore = defineStore('settings', () => {
  const status = ref('existing')
  const clearWhatsNewBox = ref(false)
  const settingsOpen = ref(false)
  const settingsPage = ref('dashboard')
  const editing = ref('')
  const isLoading = ref(false)
  const showModal = ref(false)
  const showOutliner = ref(false)
  const currentTime = ref('Sat Jan 01 2000 00:00:00 GMT-0800 (Pacific Standard Time)')
  const wallpaper = ref('none')
  const unsplashStatus = ref('default')
  const unsplashSearchTerm = ref('')
  const unsplashTab = ref('search')
  const unsplashSearchResults = ref([])
  const unsplashSearchPage = ref(1)
  const unsplashTopicResults = ref([])
  const unsplashTopicPage = ref(1)
  const unsplashCollectionResults = ref([])
  const unsplashCollectionPage = ref(1)

  const config = reactive({
    global: {
      lang: 'en-US', // language
      hsb: false, // hide settings button
      dts: false, // disable text selection
      tabt: '', // tab title
      bg: [0, 0, 20, 1], // background color
      cl: [0, 0, 100, 1], // color
      ts: [true, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
      ff: 'Source+Sans+Pro', // Font family
      fs: 72, // Font size
      fb: 400, // Font Bold
      fi: false, // Font Italic
      fu: false, // Font Underline
      tt: 'none', // Text transform
      ls: 0, // Letter spacing
      crd: 0, // Container rounded radius
      cbs: 0, // Container border size
      cbc: [0, 0, 100, 1], // Container border color
      cbg: [0, 0, 10, 0.8], // Container background color
      csh: [true, 1, 1, 5, 0, 0, 0, 0.8], // Container shadow
      cpd: 20, // Container padding
      it: 'none', // Image type
      iid: '', // Image ID
      its: '', // Image timestamp
      isz: 'cover', // Image size
      ifi: 'normal', // Image filter
      ibr: 10, // Image brightness
      isa: 10, // Image saturation
      ico: 10, // Image contrast
      ibl: 0, // Image blur
      isc: 100, // Image scale
      unpt: '', // Unsplash photo title
      unpl: '', // Unsplash photo link
      unalt: '', // Unsplash alt description
      unau: '', // Unsplash author
      unal: '', // Unsplash author link
      unli: '', // Unsplash list
      unll: '', // Unsplash list link
    },
    layers: [],
    analogClocks: [],
    digitalClocks: [],
  })

  const load = async () => {
    let store = await getStorage(null, 'sync')

    if (store) {
      let keys = Object.keys(store)

      let allAnalogClocks = []
      let filterAnalogClocks = keys.filter((k) => k.startsWith('ac-'))
      if (filterAnalogClocks.length > 0) {
        filterAnalogClocks.forEach((k) => {
          allAnalogClocks.push(store[k])
        })
      }

      let allDigitalClocks = []
      let filterDigitalClocks = keys.filter((k) => k.startsWith('dc-'))
      if (filterDigitalClocks.length > 0) {
        filterDigitalClocks.forEach((k) => {
          allDigitalClocks.push(store[k])
        })
      }

      if (store.global) config.global = store.global
      if (store.layers) config.layers = store.layers
      if (allAnalogClocks) config.analogClocks = allAnalogClocks
      if (allDigitalClocks) config.digitalClocks = allDigitalClocks
    }
  }

  const save = () => {
    let newStore = {}

    newStore['global'] = JSON.parse(JSON.stringify(config.global))
    newStore['layers'] = JSON.parse(JSON.stringify(config.layers))

    config.analogClocks.forEach((c) => {
      newStore[c.id] = JSON.parse(JSON.stringify(c))
    })
    config.digitalClocks.forEach((c) => {
      newStore[c.id] = JSON.parse(JSON.stringify(c))
    })

    setStorage(newStore, 'sync')
  }

  const createLayer = (id, type) => {
    let newLayer = new Layer()
    newLayer.id = id
    newLayer.widget = type
    config.layers.push(newLayer)
  }

  const newWidget = (type) => {
    const widget = widgetTypes.find((w) => w.type === type)
    if (widget && widget.id) {
      let newId, newWidget
      newId = widget.id + '-' + generateUID()

      switch (widget.type) {
        case 'digitalClock':
          newWidget = new DigitalClock()
          break
        case 'analogClock':
          newWidget = new AnalogClock()
          break

        default:
          break
      }

      newWidget.id = newId
      createLayer(newId, type)
      config[widget.store].push(newWidget)
    }
  }

  const deleteWidget = (id, type) => {
    if (confirm('Are you sure you want to delete this widget?') == true) {
      let layerIndex = config.layers.findIndex((l) => l.id === id)
      config.layers.splice(layerIndex, 1)

      const widget = widgetTypes.find((w) => w.type === type)
      if (widget && widget.id) {
        let widgetIndex = config[widget.store].findIndex((w) => w.id === id)
        config[widget.store].splice(widgetIndex, 1)
      }
    }
  }

  const tSplit = (string) => {
    return string.split('|')
  }

  const goTo = (page) => {
    settingsPage.value = page
  }

  return {
    // Temp Settings
    status,
    clearWhatsNewBox,
    settingsOpen,
    settingsPage,
    editing,
    isLoading,
    showModal,
    showOutliner,
    currentTime,
    wallpaper,
    unsplashStatus,
    unsplashSearchTerm,
    unsplashTab,
    unsplashSearchResults,
    unsplashSearchPage,
    unsplashTopicResults,
    unsplashTopicPage,
    unsplashCollectionResults,
    unsplashCollectionPage,

    // Saved Settings
    config,

    // Getters

    // Actions
    load,
    save,
    newWidget,
    deleteWidget,
    tSplit,
    goTo,
  }
})
