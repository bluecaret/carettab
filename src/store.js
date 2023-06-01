/* eslint-disable no-undef */
import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { Layer } from '@/classes/Layer.js'
import { widgetTypes } from '@/assets/lists.js'
import { DigitalClock } from '@/components/widgets/DigitalClock/DigitalClock.js'
import { AnalogClock } from '@/components/widgets/AnalogClock/AnalogClock.js'
import { BinaryClock } from '@/components/widgets/BinaryClock/BinaryClock.js'
import { DateWidget } from '@/components/widgets/Date/Date.js'
import { SearchBar } from '@/components/widgets/SearchBar/SearchBar.js'
import { Weather } from '@/components/widgets/Weather/Weather.js'
import { Notepad } from '@/components/widgets/Notepad/Notepad.js'

const availableWidgets = new Map([
  ['digitalClock', DigitalClock],
  ['analogClock', AnalogClock],
  ['binaryClock', BinaryClock],
  ['date', DateWidget],
  // ['bookmarks', Bookmarks],
  // ['quickLinks', QuickLinks],
  ['weather', Weather],
  // ['quote', Quote],
  ['notepad', Notepad],
  ['searchBar', SearchBar],
])

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

export const removeStorage = async (key, area = 'local') => {
  return new Promise((resolve, reject) => {
    if (chrome && chrome.storage) {
      chrome.storage[area].remove(key, function (result) {
        if (chrome.runtime.lastError) {
          console.error('Failed to remove storage', chrome.runtime.lastError)
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
  const palette = ref([[], [], [], [], [], [], [], []])
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
      lang: 'enUS',
      hideSettings: false,
      disableSelection: false,
      tabTitle: 'New Tab',
      wallpaper: {
        background: [220, 15, 15, 1],
        type: 'none',
        id: '',
        timestamp: '',
        size: 'cover',
        filter: 'normal',
        brightness: 10,
        saturation: 10,
        contrast: 10,
        blur: 0,
        scale: 100,
      },
      unsplash: {
        photoTitle: '',
        photoLink: '',
        photoAlt: '',
        authorName: '',
        authorLink: '',
        listName: '',
        listLink: '',
      },
      font: {
        color: [220, 15, 85, 1],
        shadow: [true, 1, 1, 5, 0, 0, 0, 0.8],
        family: 'Source Sans Pro',
        size: 20,
        bold: 400,
        italic: false,
        underline: false,
        transform: 'none',
        letterSpacing: 0,
      },
      container: {
        background: [0, 0, 10, 0],
        shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
        borderColor: [0, 0, 100, 1],
        borderSize: 0,
        radius: 0,
        padding: 0,
      },
      element: {
        primaryColor: [220, 15, 85, 1],
        secondaryColor: [220, 15, 85, 1],
        tertiaryColor: [220, 15, 85, 1],
        shadow: [true, 1, 1, 5, 0, 0, 0, 0.8],
      },
    },
    layers: [],
  })

  const load = async () => {
    let store = await getStorage(null, 'sync')

    if (store) {
      let keys = Object.keys(store)

      if (store.global) config.global = store.global
      if (store.layers) config.layers = store.layers

      widgetTypes.forEach((widget) => {
        let allOfType = []
        let filterToType = keys.filter((k) => k.startsWith(widget.id + '-'))
        if (filterToType.length > 0) {
          filterToType.forEach((k) => {
            allOfType.push(store[k])
          })
        }

        config[widget.store] = allOfType
      })
    }

    const colors = await getStorage('palette', 'local')
    if (colors && colors.palette && colors.palette.length > 0) {
      palette.value = [...colors.palette]
    }
  }

  const save = () => {
    let newStore = {}

    newStore['global'] = JSON.parse(JSON.stringify(config.global))
    newStore['layers'] = JSON.parse(JSON.stringify(config.layers))

    widgetTypes.forEach((widget) => {
      if (config[widget.store].length > 0) {
        config[widget.store].forEach((c) => {
          newStore[c.id] = JSON.parse(JSON.stringify(c))
        })
      }
    })

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

      let widgetClass = availableWidgets.get(widget.type)
      newWidget = new widgetClass()

      newWidget.id = newId
      newWidget.base.font.color = [...config.global.font.color]
      newWidget.base.font.family = config.global.font.family
      newWidget.base.font.size = config.global.font.size
      newWidget.base.font.bold = config.global.font.bold
      newWidget.base.font.italic = config.global.font.italic
      newWidget.base.font.underline = config.global.font.underline
      newWidget.base.font.letterSpacing = config.global.font.letterSpacing
      newWidget.base.font.shadow = [...config.global.font.shadow]
      newWidget.base.font.transform = config.global.font.transform
      newWidget.base.container.radius = config.global.container.radius
      newWidget.base.container.borderSize = config.global.container.borderSize
      newWidget.base.container.borderColor = [...config.global.container.borderColor]
      newWidget.base.container.background = [...config.global.container.background]
      newWidget.base.container.shadow = [...config.global.container.shadow]
      newWidget.base.container.padding = config.global.container.padding
      createLayer(newId, type)
      config[widget.store].unshift(newWidget)
      save()
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

      await removeStorage(id, 'sync')
      if (type === 'weather') {
        await removeStorage(`weather-${id}`, 'local')
      }
      save()
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
    palette,
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
