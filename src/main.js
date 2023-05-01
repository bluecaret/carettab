/* eslint-disable no-undef */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from './i18n.js'
import App from './App.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import ModalWindow from '@/components/ModalWindow.vue'
import ColorPickerField from '@/components/forms/ColorPickerField.vue'
import ShadowField from '@/components/forms/ShadowField.vue'
import ToggleField from '@/components/forms/ToggleField.vue'
import NumberField from '@/components/forms/NumberField.vue'
import AutocompleteField from '@/components/forms/AutocompleteField.vue'
import SizeAndPositionField from '@/components/forms/SizeAndPositionField.vue'
import WidgetFontField from '@/components/forms/WidgetFontField.vue'
import WidgetBoxField from '@/components/forms/WidgetBoxField.vue'
import PremiumLabel from '@/components/PremiumLabel.vue'
import { getStorage, setStorage } from '@/store.js'
import { accessAws } from '@/helpers/data.js'

import './assets/main.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faItalic,
  faUnderline,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faWindowMaximize,
  faClockRotateLeft,
  faBookmark,
  faFolder,
  faMinus,
  faPlus,
  faLeftRight,
  faUpDown,
  faCircleLeft,
  faSquarePlus,
  faXmark,
  faGem,
  faShapes,
  faGripVertical,
  faPen,
  faTrash,
  faEye,
  faEyeSlash,
  faArrowUpRightFromSquare,
  faClock,
  faCalendarDay,
  faLink,
  faCloudSun,
  faNoteSticky,
  faQuoteLeft,
  faMagnifyingGlass,
  faFloppyDisk,
  faRocket,
  faBell,
  faVectorSquare,
  faCheck,
  faArrowsLeftRightToLine,
  faTextHeight,
  faFont,
  faBold,
  faFillDrip,
  fa1,
  faHashtag,
  faBarsProgress,
  faCalendarDays,
  faSearch,
  faGlobe,
  faRotateLeft,
  faImages,
  faCircleHalfStroke,
  faBan,
  faInfo,
  faQuestion,
  faShare,
  faStarHalfStroke,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faItalic,
  faUnderline,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faWindowMaximize,
  faClockRotateLeft,
  faBookmark,
  faFolder,
  faMinus,
  faPlus,
  faLeftRight,
  faUpDown,
  faCircleLeft,
  faSquarePlus,
  faXmark,
  faGem,
  faShapes,
  faGripVertical,
  faPen,
  faTrash,
  faEye,
  faEyeSlash,
  faArrowUpRightFromSquare,
  faClock,
  faCalendarDay,
  faLink,
  faCloudSun,
  faNoteSticky,
  faQuoteLeft,
  faMagnifyingGlass,
  faFloppyDisk,
  faRocket,
  faBell,
  faVectorSquare,
  faCheck,
  faArrowsLeftRightToLine,
  faTextHeight,
  faFont,
  faBold,
  faFillDrip,
  fa1,
  faHashtag,
  faBarsProgress,
  faCalendarDays,
  faSearch,
  faGlobe,
  faRotateLeft,
  faImages,
  faCircleHalfStroke,
  faBan,
  faInfo,
  faQuestion,
  faShare,
  faStarHalfStroke,
  faInfoCircle
)

const getAccess = async () => {
  let cachedAccess = await getStorage(['a', 'userLicense'], 'local')
  let then = 'Invalid Date'
  let thenPlusOne = 'Invalid Date'
  if (cachedAccess && cachedAccess.a && cachedAccess.a.ts) {
    then = new Date(cachedAccess.a.ts)
  }

  const isValidDate = then.toString() !== 'Invalid Date'
  let today = new Date()
  let license = ''

  if (isValidDate) {
    thenPlusOne = new Date(
      then.getFullYear(),
      then.getMonth(),
      then.getDate() + 1,
      then.getHours(),
      then.getMinutes(),
      0,
      0
    )
  }

  let btoaAccess = []
  let atobAccess = {}
  if (!isValidDate || (isValidDate && thenPlusOne < today)) {
    // Get fresh access from aws

    let aws = await accessAws()
    license = aws.l
    for (const [key, value] of Object.entries(aws.k)) {
      btoaAccess.push({ t: key, a: btoa(value) })
      atobAccess[key] = value
    }

    if (aws.k && aws.l) {
      await setStorage({ a: { ts: new Date().toJSON(), l: btoa(license), items: btoaAccess } }, 'local')
    }
  } else if (isValidDate) {
    // Grab from cached data
    license = atob(cachedAccess.a.l)
    cachedAccess.a.items.forEach((item) => {
      atobAccess[item.t] = atob(item.a)
    })
  }

  return { license, userLicense: cachedAccess.userLicense, items: atobAccess }
}

// Run quick user check based on storage for a faster load
const quickUserCheck = async () => {
  return await getStorage('extensionpay_user', 'sync')
}

// Prevents app from loading till quick check is done.
quickUserCheck().then(async (user) => {
  const app = createApp(App)

  let access = await getAccess()

  if (access.license !== '' && access.license === access.userLicense) {
    console.log('%c* Thank you for being a loyal user of CaretTab! Enjoy the perks! *', 'color:green;font-weight:bold;')
    user.paid = true
  }

  app.provide('user', user)
  app.provide('access', access)
  // eslint-disable-next-line vue/multi-word-component-names
  app.component('Fa', FontAwesomeIcon)
  app.use(i18n)
  app.component('DropdownMenu', DropdownMenu)
  app.component('ModalWindow', ModalWindow)
  app.component('ColorPickerField', ColorPickerField)
  app.component('ShadowField', ShadowField)
  app.component('ToggleField', ToggleField)
  app.component('NumberField', NumberField)
  app.component('AutocompleteField', AutocompleteField)
  app.component('SizeAndPositionField', SizeAndPositionField)
  app.component('WidgetFontField', WidgetFontField)
  app.component('WidgetBoxField', WidgetBoxField)
  app.component('PremiumLabel', PremiumLabel)
  app.use(createPinia())

  app.mount('#app')
})
