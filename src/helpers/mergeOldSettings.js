import { hexToHSLArray } from '@/helpers/widgets.js'
import { useSettingsStore, generateUID, getStorage, removeStorage, setStorage } from '@/store.js'
import { Layer } from '@/classes/Layer.js'
import { widgetTypes } from '@/assets/lists.js'
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
])

export const mergeV3Settings = async (allowMigration) => {
  const store = useSettingsStore()
  const oldDesignSettings = await getStorage('ct-misc', 'sync')
  if (!oldDesignSettings['ct-misc'] || oldDesignSettings['ct-misc'].schema !== '1.1') {
    return
  }
  console.info('%cVersion 3 settings found. Attempting to migrate to version 4.', 'color:teal;font-weight:bold;')
  store.isLoading = true

  let allLocalConfigs = await getStorage('', 'local')
  let allSyncConfigs = await getStorage('', 'sync')

  if (allowMigration) {
    let oldBookmark = allSyncConfigs['ct-bookmark']
    let oldDate = allSyncConfigs['ct-date']
    let oldDesign = allSyncConfigs['ct-design']
    let oldI18n = allSyncConfigs['ct-i18n']
    let oldLoadshedding = allSyncConfigs['ct-loadshedding']
    let oldMessage = allSyncConfigs['ct-message']
    let oldMisc = allSyncConfigs['ct-misc']
    let oldNotepad = allSyncConfigs['ct-notepad']
    let oldQuickLink = allSyncConfigs['ct-quick-link']
    let oldsearch = allSyncConfigs['ct-search']
    let oldTime = allSyncConfigs['ct-time']
    let oldWeather = allSyncConfigs['ct-weather']

    let merge = {}
    merge.config = {}
    merge.config.layers = []
    merge.config.global = {}

    switch (oldI18n.lang) {
      case 'de-DE':
        merge.config.global.lang = 'de'
        break
      case 'en-US':
        merge.config.global.lang = 'en'
        break
      case 'es-MX':
        merge.config.global.lang = 'es'
        break
      case 'fr-FR':
        merge.config.global.lang = 'fr'
        break
      case 'he-IL':
        merge.config.global.lang = 'he'
        break
      case 'it-IT':
        merge.config.global.lang = 'it'
        break
      case 'ja-JP':
        merge.config.global.lang = 'ja'
        break
      case 'ko-KR':
        merge.config.global.lang = 'ko'
        break
      case 'pt-BR':
        merge.config.global.lang = 'pt'
        break
      case 'pt-PT':
        merge.config.global.lang = 'pt'
        break
      case 'ru-RU':
        merge.config.global.lang = 'ru'
        break
      case 'sv-SE':
        merge.config.global.lang = 'sv'
        break
      case 'uk-UA':
        merge.config.global.lang = 'uk'
        break
      case 'ur-PK':
        merge.config.global.lang = 'ur'
        break
      case 'vi-VN':
        merge.config.global.lang = 'vi'
        break
      case 'zh-CN':
        merge.config.global.lang = 'zh'
        break
      case 'zh-TW':
        merge.config.global.lang = 'zh'
        break

      default:
        merge.config.global.lang = 'en'
        break
    }

    merge.config.global.disableSelection = oldMisc.disableSelect
    merge.config.global.hideSettings = oldMisc.hideMenu

    merge.config.global.tabTitle = {}
    merge.config.global.tabTitle.type = [20, 30, 40, 50].includes(oldMisc.title)
      ? 'newtab'
      : oldMisc.title === 60
      ? 'custom'
      : 'newtab'
    merge.config.global.tabTitle.custom = oldMisc.title.text ? 'newtab' : 'New Tab'

    merge.config.global.font = {}
    merge.config.global.font.color = hexToHSLArray(oldDesign.foreground)
    merge.config.global.font.shadow = [
      oldDesign.shadow,
      oldDesign.shadowXOffset,
      oldDesign.shadowYOffset,
      oldDesign.shadowBlur,
      ...hexToHSLArray(oldDesign.shadowColor),
    ]

    merge.config.global.container = {}
    merge.config.global.container.shadow = [
      oldDesign.shadow,
      oldDesign.shadowXOffset,
      oldDesign.shadowYOffset,
      oldDesign.shadowBlur,
      ...hexToHSLArray(oldDesign.shadowColor),
    ]

    merge.config.global.element = {}
    merge.config.global.element.shadow = [
      oldDesign.shadow,
      oldDesign.shadowXOffset,
      oldDesign.shadowYOffset,
      oldDesign.shadowBlur,
      ...hexToHSLArray(oldDesign.shadowColor),
    ]

    merge.config.global.wallpaper = {}
    merge.config.global.wallpaper.background = hexToHSLArray(oldDesign.background)
    merge.config.global.wallpaper.brightness = oldDesign.brightness
    merge.config.global.wallpaper.contrast = oldDesign.contrast
    merge.config.global.wallpaper.saturation = oldDesign.saturation
    merge.config.global.wallpaper.blur = oldDesign.imageBlur
    merge.config.global.wallpaper.scale = oldDesign.imageScale
    let oldImageSize = ''
    switch (oldDesign.imageSize) {
      case 10:
        oldImageSize = 'auto'
        break
      case 20:
        oldImageSize = 'cover'
        break
      case 30:
        oldImageSize = 'contain'
        break
      case 40:
        oldImageSize = 'scale'
        break

      default:
        break
    }
    merge.config.global.wallpaper.size = oldImageSize

    if (oldMessage && oldMessage.enabled) {
      let newWidget = setupNewWidget('quote')
      let newLayer = setupNewLayer(newWidget.id, 'quote')
      newLayer.on = false

      newWidget.quotes = [
        ...oldMessage.messageList.map((q) => {
          return { id: q.id, text: q.text, author: '' }
        }),
      ]
      newWidget.random = oldMessage.random

      merge.config.quotes = []
      merge.config.quotes.push(newWidget)
      merge.config.layers.push(newLayer)
    }

    if (oldQuickLink && oldQuickLink.enabled) {
      let newWidget = setupNewWidget('quickLinks')
      let newLayer = setupNewLayer(newWidget.id, 'quickLinks')
      newLayer.on = false

      newWidget.type = 'ql'
      newWidget.quickLinks = [
        ...oldQuickLink.links.map((l) => {
          return { id: l.id, title: l.label, url: l.url, special: 'none' }
        }),
      ]
      newWidget.link.icons = oldQuickLink.icons
      newWidget.link.openInNewTab = oldQuickLink.openInNewTab

      merge.config.quickLinks = []
      merge.config.quickLinks.push(newWidget)
      merge.config.layers.push(newLayer)
    }

    if (oldBookmark && oldBookmark.enabled) {
      let newWidget = setupNewWidget('quickLinks')
      let newLayer = setupNewLayer(newWidget.id, 'quickLinks')
      newLayer.on = false

      newWidget.type = 'bk'
      newWidget.link.icons = oldQuickLink.icons
      newWidget.link.openInNewTab = oldQuickLink.openInNewTab
      newWidget.specialLinks.apps = oldQuickLink.apps
      newWidget.specialLinks.bookmarksManager = oldQuickLink.bookmarksManager
      newWidget.specialLinks.history = oldQuickLink.history
      newWidget.specialLinks.chromeTab = oldQuickLink.chromeTab
      newWidget.specialLinks.mostVisited = oldQuickLink.mostVisited

      merge.config.quickLinks = []
      merge.config.quickLinks.push(newWidget)
      merge.config.layers.push(newLayer)
    }

    if (oldTime && oldTime.clocks.length > 0) {
      merge.config.analogClocks = []
      merge.config.digitalClocks = []
      merge.config.binaryClocks = []
      oldTime.clocks.forEach((clock) => {
        if (clock.analog.enabled && !clock.binary.enabled) {
          let newWidget = setupNewWidget('analogClock')
          let newLayer = setupNewLayer(newWidget.id, 'analogClock')
          newLayer.on = false

          newWidget.face.style = clock.analog.faceStyle
          newWidget.face.borderSize = clock.analog.borderSize
          newWidget.hand.style = clock.analog.handStyle
          newWidget.sec.smoothSeconds = clock.analog.smoothSeconds

          newWidget.timezone = clock.timezone === 'Automatic' ? 'local' : clock.timezone
          newWidget.sec.on = clock.analog.enabled
          newWidget.label.on = clock.label.enabled
          newWidget.label.label = clock.label.text
          newWidget.relative.on = clock.relativeTime.enabled

          merge.config.analogClocks.push(newWidget)
          merge.config.layers.push(newLayer)
        }
        if (clock.binary.enabled && !clock.analog.enabled) {
          let newWidget = setupNewWidget('binaryClock')
          let newLayer = setupNewLayer(newWidget.id, 'binaryClock')
          newLayer.on = false

          newWidget.indicator.offLabel = clock.binary.offValueText
          newWidget.indicator.onLabel = clock.binary.onValueText
          newWidget.indicator.dot = !clock.binary.useNumbers

          newWidget.timezone = clock.timezone === 'Automatic' ? 'local' : clock.timezone
          newWidget.sec.on = clock.analog.enabled
          newWidget.label.on = clock.label.enabled
          newWidget.label.label = clock.label.text
          newWidget.relative.on = clock.relativeTime.enabled

          merge.config.binaryClocks.push(newWidget)
          merge.config.layers.push(newLayer)
        }
        if (!clock.analog.enabled && !clock.binary.enabled) {
          let newWidget = setupNewWidget('digitalClock')
          let newLayer = setupNewLayer(newWidget.id, 'digitalClock')
          newLayer.on = false

          newWidget.delimiter.on = clock.delimiter.enabled
          newWidget.delimiter.blink = clock.delimiter.blink
          newWidget.delimiter.symbol1 = clock.delimiter.symbol
          newWidget.delimiter.symbol2 = clock.delimiter.symbol
          newWidget.delimiter.symbol3 = clock.delimiter.symbol
          newWidget.meridiem.on = clock.meridiem.enabled
          newWidget.meridiem.am = clock.meridiem.am
          newWidget.meridiem.pm = clock.meridiem.pm
          newWidget.hour.twentyFour = clock.twentyFour
          newWidget.hour.twoDigit = clock.twoDigit

          newWidget.timezone = clock.timezone === 'Automatic' ? 'local' : clock.timezone
          newWidget.sec.on = clock.analog.enabled
          newWidget.label.on = clock.label.enabled
          newWidget.label.label = clock.label.text
          newWidget.relative.on = clock.relativeTime.enabled

          merge.config.digitalClocks.push(newWidget)
          merge.config.layers.push(newLayer)
        }
      })
    }

    if (oldDate && oldDate.enabled) {
      let newWidget = setupNewWidget('date')
      let newLayer = setupNewLayer(newWidget.id, 'date')
      newLayer.on = false

      newWidget.timezone = oldDate.timezone
      if (oldDate.day) {
        newWidget.day.on = oldDate.day.enabled
        newWidget.day.twoDigit = oldDate.day.twoDigit
      }
      if (oldDate.dayOfWeek) {
        newWidget.dayOfWeek.on = oldDate.dayOfWeek.enabled
        newWidget.dayOfWeek.abbreviated = oldDate.dayOfWeek.abbr
      }
      if (oldDate.dayOfYear) {
        newWidget.dayOfYear.on = oldDate.dayOfYear.enabled
        newWidget.dayOfYear.suffixLabel = oldDate.dayOfYear.label
      }
      if (oldDate.month) {
        newWidget.month.on = oldDate.month.enabled
        newWidget.month.abbreviated = oldDate.month.abbr
        newWidget.month.twoDigit = oldDate.month.twoDigit
      }
      if (oldDate.quarter) {
        newWidget.quarter.on = oldDate.quarter.enabled
        newWidget.quarter.suffixLabel = oldDate.quarter.label
        newWidget.quarter.start = oldDate.quarter.start
      }
      if (oldDate.week) {
        newWidget.week.on = oldDate.week.enabled
        newWidget.week.prefixLabel = oldDate.week.label
      }
      if (oldDate.year) {
        newWidget.year.on = oldDate.year.enabled
        newWidget.year.twoDigit = oldDate.year.twoDigit
      }

      merge.config.dates = []
      merge.config.dates.push(newWidget)
      merge.config.layers.push(newLayer)
    }

    if (oldsearch && oldsearch.enabled) {
      let newWidget = setupNewWidget('searchBar')
      let newLayer = setupNewLayer(newWidget.id, 'searchBar')
      newLayer.on = false

      newWidget.autocomplete = oldsearch.autocomplete
      newWidget.customEngine = oldsearch.enableCustomEngine
      newWidget.customEngineUrl = oldsearch.customEngine
      newWidget.label = oldsearch.label
      newWidget.label = oldsearch.label
      let engine = ''
      switch (oldsearch.engine) {
        case 10:
          engine = 'google'
          break
        case 20:
          engine = 'bing'
          break
        case 30:
          engine = 'baidu'
          break
        case 40:
          engine = 'yahoo'
          break
        case 50:
          engine = 'ask'
          break
        case 60:
          engine = 'duckduckgo'
          break
        case 70:
          engine = 'wolframalpha'
          break
        case 80:
          engine = 'github'
          break
        case 90:
          engine = 'yandex'
          break

        default:
          break
      }
      newWidget.engine = engine

      merge.config.searchBars = []
      merge.config.searchBars.push(newWidget)
      merge.config.layers.push(newLayer)
    }

    if (oldWeather && oldWeather.enabled) {
      let newWidget = setupNewWidget('weather')
      let newLayer = setupNewLayer(newWidget.id, 'weather')
      newLayer.on = false

      newWidget.location.url = oldWeather.location.url
      newWidget.location.url = oldWeather.location.url
      newWidget.unit = !oldWeather.metric
      newWidget.scale = !oldWeather.celsius
      newWidget.precise = oldWeather.preciseDigits
      newWidget.twentyFour = oldWeather.twentyFour
      newWidget.windUnit = oldWeather.windUnits
      newWidget.forecast.day.on = oldWeather.forecast.day.enabled
      newWidget.forecast.days = oldWeather.forecast.days
      newWidget.forecast.horizontal = oldWeather.forecast.horizontal
      newWidget.forecast.icon.on = oldWeather.forecast.icon.enabled
      newWidget.forecast.temperature.degree = oldWeather.forecast.temp.degree
      newWidget.forecast.temperature.high = oldWeather.forecast.temp.high
      newWidget.forecast.temperature.low = oldWeather.forecast.temp.low
      newWidget.current.on = oldWeather.current.enabled
      newWidget.current.astro.moonPhase = oldWeather.current.astro.moonPhase
      newWidget.current.astro.sunrise = oldWeather.current.astro.sunrise
      newWidget.current.astro.sunset = oldWeather.current.astro.sunset
      newWidget.current.humidity.on = oldWeather.current.humidity.enabled
      newWidget.current.icon.on = oldWeather.current.icon.enabled
      newWidget.current.pressure.on = oldWeather.current.pressure.enabled
      newWidget.current.wind.on = oldWeather.current.wind.enabled
      newWidget.current.temperature.currently = oldWeather.current.temp.currently
      newWidget.current.temperature.degree = oldWeather.current.temp.degree
      newWidget.current.temperature.feelsLike = oldWeather.current.temp.feelsLike

      merge.config.weathers = []
      merge.config.weathers.push(newWidget)
      merge.config.layers.push(newLayer)
    }

    if (oldNotepad && oldNotepad.enabled) {
      let newWidget = setupNewWidget('notepad')
      let newLayer = setupNewLayer(newWidget.id, 'notepad')
      newLayer.on = false

      newWidget.showCharLimit = oldNotepad.showCharLimit
      newWidget.spellCheck = oldNotepad.spellCheck
      newWidget.sync = oldNotepad.sync

      merge.config.notepads = []
      merge.config.notepads.push(newWidget)
      merge.config.layers.push(newLayer)

      if (oldNotepad.sync && allSyncConfigs['ct-notes']) {
        await setStorage({ ['notes-' + newWidget.id]: '' + allSyncConfigs['ct-notes'] }, 'sync')
      } else if (!oldNotepad.sync && allLocalConfigs['ct-notes']) {
        await setStorage({ ['notes-' + newWidget.id]: '' + allLocalConfigs['ct-notes'] }, 'local')
      }
    }

    if (oldLoadshedding && oldLoadshedding.areas.length > 0) {
      merge.config.loadsheddings = []
      oldLoadshedding.areas.clocks.forEach((ls) => {
        let newWidget = setupNewWidget('loadshedding')
        let newLayer = setupNewLayer(newWidget.id, 'loadshedding')
        newLayer.on = false

        newWidget.citizen = oldLoadshedding.citizen
        newWidget.license = oldLoadshedding.license
        newWidget.area.id = generateUID()
        newWidget.area.name = ls.name
        newWidget.area.region = ls.region

        merge.config.loadsheddings.push(newWidget)
        merge.config.layers.push(newLayer)
      })
    }

    store.$patch({ config: merge.config })
    await store.save()
    console.info('%cSettings have been migrated.', 'color:teal;font-weight:bold;', merge)
  }

  await removeStorage('caretTabNewVersion', 'local')
  await removeStorage('caretTabPrevVersion', 'local')
  await removeStorage('caretTabStatus', 'local')
  await removeStorage('ct-notes', 'local')
  await removeStorage('ct-bookmark', 'sync')
  await removeStorage('ct-date', 'sync')
  await removeStorage('ct-design', 'sync')
  await removeStorage('ct-i18n', 'sync')
  await removeStorage('ct-loadshedding', 'sync')
  await removeStorage('ct-message', 'sync')
  await removeStorage('ct-misc', 'sync')
  await removeStorage('ct-notepad', 'sync')
  await removeStorage('ct-notes', 'sync')
  await removeStorage('ct-order', 'sync')
  await removeStorage('ct-quick-link', 'sync')
  await removeStorage('ct-search', 'sync')
  await removeStorage('ct-time', 'sync')
  await removeStorage('ct-weather', 'sync')
  console.info('%cOld settings been removed.', 'color:teal;font-weight:bold;')
  console.info('%cMigration has been complete.', 'color:teal;font-weight:bold;')
  store.isLoading = false
}

const setupNewLayer = (id, type) => {
  let newLayer = new Layer()
  newLayer.id = id
  newLayer.widget = type
  return newLayer
}

const setupNewWidget = (type) => {
  const widget = widgetTypes.find((w) => w.type === type)
  if (widget && widget.id) {
    let newId, newWidget
    newId = widget.id + '-' + generateUID()

    let widgetClass = availableWidgets.get(widget.type)
    newWidget = new widgetClass()

    newWidget.id = newId
    return newWidget
  }
}
