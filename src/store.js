/* eslint-disable no-undef */
import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { Layer } from '@/classes/Layer.js'
import { widgetTypes, toolTypes } from '@/assets/lists.js'
import { Defaults } from '@/defaults.js'
import { DigitalClock } from '@/components/widgets/DigitalClock.js'
import { AnalogClock } from '@/components/widgets/AnalogClock.js'
import { BinaryClock } from '@/components/widgets/BinaryClock.js'
import { DateWidget } from '@/components/widgets/Date.js'
import { SearchBar } from '@/components/widgets/SearchBar.js'
import { Weather } from '@/components/widgets/Weather.js'
import { Notepad } from '@/components/widgets/Notepad.js'
import { Quote } from '@/components/widgets/Quote.js'
import { QuickLinks } from '@/components/widgets/QuickLinks.js'
import { Loadshedding } from '@/components/widgets/Loadshedding.js'
import { Shape } from '@/components/widgets/Shape.js'
import { Text } from '@/components/widgets/Text.js'
import { Todo } from '@/components/widgets/Todo.js'

const availableWidgets = new Map([
  ['digitalClock', DigitalClock],
  ['analogClock', AnalogClock],
  ['binaryClock', BinaryClock],
  ['date', DateWidget],
  ['weather', Weather],
  ['quote', Quote],
  ['notepad', Notepad],
  ['searchBar', SearchBar],
  ['quickLinks', QuickLinks],
  ['loadshedding', Loadshedding],
  ['shape', Shape],
  ['text', Text],
  ['todo', Todo],
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
      chrome.storage[area].get(key ? key : null, function (result) {
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

export const clearAllStorage = async (area = 'local') => {
  return new Promise((resolve, reject) => {
    if (chrome && chrome.storage) {
      chrome.storage[area].clear(function (result) {
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
  const togglePanelPreview = ref(false)
  const panelMove = ref(false)
  const editing = ref('')
  const isLoading = ref(false)
  const showModal = ref(false)
  const showPremiumModal = ref(false)
  const premiumModalBtnRef = ref(null)
  const showOutliner = ref(false)
  const currentTime = ref('Sat Jan 01 2000 00:00:00 GMT-0800 (Pacific Standard Time)')
  const wallpaper = ref('default')
  const palette = ref([[], [], [], [], [], [], [], []])
  const useSwatches = ref(false)
  const unsplashStatus = ref('default')
  const unsplashSearchTerm = ref('')
  const unsplashTab = ref('search')
  const unsplashSearchResults = ref([])
  const unsplashSearchPage = ref(1)
  const unsplashTopicResults = ref([])
  const unsplashTopicPage = ref(1)
  const unsplashCollectionResults = ref([])
  const unsplashCollectionPage = ref(1)
  const pexelsStatus = ref('default')
  const pexelsSearchTerm = ref('')
  const pexelsTab = ref('search')
  const pexelsSearchResults = ref([])
  const pexelsSearchPage = ref(1)
  const pexelsCuratedResults = ref([])
  const pexelsCuratedPage = ref(1)
  const pexelsCollectionResults = ref([])
  const pexelsCollectionPage = ref(1)
  const pexelsCarettabResults = ref([])
  const pexelsCarettabPage = ref(1)

  const config = reactive(new Defaults())

  const load = async () => {
    let store = await getStorage(null, 'sync')

    if (store) {
      let keys = Object.keys(store)

      if (store.global) config.global = store.global
      if (store.toolbar) config.toolbar = store.toolbar
      if (store.layers) config.layers = store.layers

      // Check if all tools exist in toolbar by comparing with toolTypes, if not add them to the store:
      toolTypes.forEach((tool) => {
        if (!config.toolbar.tools.find((t) => t.id === tool.tool)) {
          const getDefault = new Defaults().toolbar.tools
          const newTool = getDefault.find((t) => t.id === tool.tool)
          store.toolbar.tools.push(newTool)
        }
      })

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
    return new Promise((resolve, reject) => {
      try {
        let newStore = {}

        newStore['global'] = JSON.parse(JSON.stringify(config.global))
        newStore['toolbar'] = JSON.parse(JSON.stringify(config.toolbar))
        newStore['layers'] = JSON.parse(JSON.stringify(config.layers))

        widgetTypes.forEach((widget) => {
          if (config[widget.store].length > 0) {
            config[widget.store].forEach((c) => {
              newStore[c.id] = JSON.parse(JSON.stringify(c))
            })
          }
        })

        setStorage(newStore, 'sync')
          .then(() => {
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      } catch (error) {
        reject(error)
      }
    })
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
      createLayer(newId, type)
      config[widget.store].unshift(newWidget)
      save()
    }
  }

  const duplicateWidget = async (id, type) => {
    const widgetType = widgetTypes.find((w) => w.type === type)
    const originalWidget = config[widgetType.store].find((w) => w.id === id)
    const getNewId = widgetType.id + '-' + generateUID()

    // Copy supplemental storage if needed
    if (widgetType.type === 'notepad') {
      const supplementalStorageLocal = await getStorage(`notes-${originalWidget.id}`, 'local')
      const supplementalStorageSync = await getStorage(`notes-${originalWidget.id}`, 'sync')
      if (supplementalStorageLocal[`notes-${originalWidget.id}`]) {
        await setStorage({ [`notes-${getNewId}`]: supplementalStorageLocal[`notes-${originalWidget.id}`] })
      } else if (supplementalStorageSync[`notes-${originalWidget.id}`]) {
        await setStorage({ [`notes-${getNewId}`]: supplementalStorageSync[`notes-${originalWidget.id}`] })
      }
    }

    let widgetClass = availableWidgets.get(widgetType.type)
    let newWidget = new widgetClass()
    newWidget = { ...originalWidget }
    newWidget.id = ''
    newWidget.id = getNewId
    createLayer(newWidget.id, widgetType.type)
    config[widgetType.store].unshift(newWidget)
    save()
  }

  const deleteWidget = async (id, type) => {
    if (
      confirm(
        'Are you sure you want to delete this widget? Settings will be saved immediately, you will not be able to undo this.'
      ) == true
    ) {
      isLoading.value = true
      let layerIndex = config.layers.findIndex((l) => l.id === id)
      config.layers.splice(layerIndex, 1)

      const widget = widgetTypes.find((w) => w.type === type)
      if (widget && widget.id) {
        let widgetIndex = config[widget.store].findIndex((w) => w.id === id)
        config[widget.store].splice(widgetIndex, 1)
      }

      await removeStorage(id, 'sync')
      await clearSupplementalSettings(id, type)
      await save()
      setTimeout(() => {
        isLoading.value = false
      }, 300)
    }
  }

  const reset = async () => {
    // Reset all settings to default
    if (confirm('Are you sure you want to reset all settings to default?') == true) {
      isLoading.value = true

      config.global = new Defaults().global
      config.toolbar = new Defaults().toolbar
      config.layers = new Defaults().layers
      widgetTypes.forEach(async (widget) => {
        config[widget.store].forEach(async (w) => {
          await removeStorage(w.id, 'sync')
          await clearSupplementalSettings(w.id, widget.type)
        })
        config[widget.store] = []
      })
      await save()

      palette.value = [[], [], [], [], [], [], [], []]
      await removeStorage('palette', 'local')
      await removeStorage('useSwatches', 'local')
      await removeStorage('currentWallpaper', 'local')
      await removeStorage('nextWallpaper', 'local')

      isLoading.value = false
      window.location.reload()
    }
  }

  const resetAll = async () => {
    // clear all settings in chrome.storage
    if (
      confirm(
        'Are you sure you want to clear everything and start completely fresh? If signed into Premium, you will need to login again.'
      ) == true
    ) {
      await clearAllStorage('sync')
      await clearAllStorage('local')
      window.location.reload()
    }
  }

  const clearSupplementalSettings = (id, type) => {
    return new Promise((resolve, reject) => {
      try {
        if (type === 'weather') {
          removeStorage(`weather-${id}`, 'local')
            .then(() => {
              resolve()
            })
            .catch((error) => {
              reject(error)
            })
        } else if (type === 'notepad') {
          removeStorage(`notes-${id}`, 'local')
            .then(() => {
              return removeStorage(`notepad-${id}`, 'sync')
            })
            .then(() => {
              resolve()
            })
            .catch((error) => {
              reject(error)
            })
        } else if (type === 'loadshedding') {
          removeStorage(`loadshedding-area-${id}`, 'local')
            .then(() => {
              resolve()
            })
            .catch((error) => {
              reject(error)
            })
        } else {
          resolve()
        }
      } catch (error) {
        reject(error)
      }
    })
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
    togglePanelPreview,
    panelMove,
    editing,
    isLoading,
    showModal,
    showPremiumModal,
    premiumModalBtnRef,
    showOutliner,
    currentTime,
    wallpaper,
    palette,
    useSwatches,
    unsplashStatus,
    unsplashSearchTerm,
    unsplashTab,
    unsplashSearchResults,
    unsplashSearchPage,
    unsplashTopicResults,
    unsplashTopicPage,
    unsplashCollectionResults,
    unsplashCollectionPage,
    pexelsStatus,
    pexelsSearchTerm,
    pexelsTab,
    pexelsSearchResults,
    pexelsSearchPage,
    pexelsCuratedResults,
    pexelsCuratedPage,
    pexelsCollectionResults,
    pexelsCollectionPage,
    pexelsCarettabResults,
    pexelsCarettabPage,

    // Saved Settings
    config,

    // Getters

    // Actions
    load,
    save,
    newWidget,
    duplicateWidget,
    deleteWidget,
    reset,
    resetAll,
    tSplit,
    goTo,
  }
})
