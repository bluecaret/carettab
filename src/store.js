/* eslint-disable no-undef */
import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { DigitalClock } from '@/classes/DigitalClock.js'
import { AnalogClock } from '@/classes/AnalogClock.js'
import { BinaryClock } from '@/classes/BinaryClock.js'
import { DateWidget } from '@/classes/Date.js'
import { SearchBar } from '@/classes/SearchBar.js'
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
      lang: 'enUS', // language
      hsb: false, // hide settings button
      dts: false, // disable text selection
      tabt: 'New Tab', // tab title
      bg: [220, 15, 15, 1], // background color
      cl: [220, 15, 85, 1], // color
      ts: [true, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
      ff: 'Source Sans Pro', // Font family
      fs: 20, // Font size
      fb: 400, // Font Bold
      fi: false, // Font Italic
      fu: false, // Font Underline
      tt: 'none', // Text transform
      ls: 0, // Letter spacing
      crd: 0, // Container rounded radius
      cbs: 0, // Container border size
      cbc: [0, 0, 100, 1], // Container border color
      cbg: [0, 0, 10, 0], // Container background color
      csh: [false, 1, 1, 5, 0, 0, 0, 0.8], // Container shadow
      cpd: 0, // Container padding
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
    binaryClocks: [],
    digitalClocks: [],
    dates: [],
    searchBars: [],
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

      let allBinaryClocks = []
      let filterBinaryClocks = keys.filter((k) => k.startsWith('bc-'))
      if (filterBinaryClocks.length > 0) {
        filterBinaryClocks.forEach((k) => {
          allBinaryClocks.push(store[k])
        })
      }

      let allDigitalClocks = []
      let filterDigitalClocks = keys.filter((k) => k.startsWith('dc-'))
      if (filterDigitalClocks.length > 0) {
        filterDigitalClocks.forEach((k) => {
          allDigitalClocks.push(store[k])
        })
      }

      let allDates = []
      let filterDates = keys.filter((k) => k.startsWith('dt-'))
      if (filterDates.length > 0) {
        filterDates.forEach((k) => {
          allDates.push(store[k])
        })
      }

      let allSearchBars = []
      let filterSearchBars = keys.filter((k) => k.startsWith('sb-'))
      if (filterSearchBars.length > 0) {
        filterSearchBars.forEach((k) => {
          allSearchBars.push(store[k])
        })
      }

      if (store.global) config.global = store.global
      if (store.layers) config.layers = store.layers
      if (allAnalogClocks) config.analogClocks = allAnalogClocks
      if (allBinaryClocks) config.binaryClocks = allBinaryClocks
      if (allDigitalClocks) config.digitalClocks = allDigitalClocks
      if (allDates) config.dates = allDates
      if (allSearchBars) config.searchBars = allSearchBars
    }
  }

  const save = () => {
    let newStore = {}

    newStore['global'] = JSON.parse(JSON.stringify(config.global))
    newStore['layers'] = JSON.parse(JSON.stringify(config.layers))

    if (config.analogClocks.length > 0) {
      config.analogClocks.forEach((c) => {
        newStore[c.id] = JSON.parse(JSON.stringify(c))
      })
    }
    if (config.binaryClocks.length > 0) {
      config.binaryClocks.forEach((c) => {
        newStore[c.id] = JSON.parse(JSON.stringify(c))
      })
    }
    if (config.digitalClocks.length > 0) {
      config.digitalClocks.forEach((c) => {
        newStore[c.id] = JSON.parse(JSON.stringify(c))
      })
    }
    if (config.searchBars.length > 0) {
      config.searchBars.forEach((c) => {
        newStore[c.id] = JSON.parse(JSON.stringify(c))
      })
    }

    setStorage(newStore, 'sync')
  }

  const createLayer = (id, type) => {
    let newLayer = new Layer()
    newLayer.id = id
    newLayer.widget = type
    config.layers.unshift(newLayer)
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
        case 'binaryClock':
          newWidget = new BinaryClock()
          break
        case 'date':
          newWidget = new DateWidget()
          break
        case 'searchBar':
          newWidget = new SearchBar()
          break

        default:
          break
      }

      newWidget.id = newId
      newWidget.w.cl = [...config.global.cl]
      newWidget.w.ff = config.global.ff
      console.log(newWidget.w.fs)
      console.log(config.global.fs)
      newWidget.w.fs = config.global.fs
      console.log(newWidget.w.fs)
      newWidget.w.fb = config.global.fb
      newWidget.w.fi = config.global.fi
      newWidget.w.fu = config.global.fu
      newWidget.w.ls = config.global.ls
      newWidget.w.ts = [...config.global.ts]
      newWidget.w.tt = config.global.tt
      newWidget.w.crd = config.global.crd
      newWidget.w.cbs = config.global.cbs
      newWidget.w.cbc = [...config.global.cbc]
      newWidget.w.cbg = [...config.global.cbg]
      newWidget.w.csh = [...config.global.csh]
      newWidget.w.cpd = config.global.cpd
      createLayer(newId, type)
      config[widget.store].unshift(newWidget)
    }
  }

  const deleteWidget = async (id, type) => {
    if (
      confirm(
        'Are you sure you want to delete this widget? Settings will be saved immediately, you will not be able to undo this.'
      ) == true
    ) {
      let layerIndex = config.layers.findIndex((l) => l.id === id)
      config.layers.splice(layerIndex, 1)

      const widget = widgetTypes.find((w) => w.type === type)
      if (widget && widget.id) {
        let widgetIndex = config[widget.store].findIndex((w) => w.id === id)
        config[widget.store].splice(widgetIndex, 1)
      }

      chrome.storage.sync.remove(id, function () {
        if (chrome.runtime.lastError) {
          console.error('Failed to remove storage', chrome.runtime.lastError)
        } else {
          save()
        }
      })
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
