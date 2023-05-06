import { defaultWidgetStyles } from './DefaultWidgetStyles.js'

export class SearchBar {
  id = '' // id
  en = 'google' // engine
  ce = false // custom engine
  ceu = 'https://www.google.com/search?q=%s' // custom engine url
  ac = true // autocomplete
  ic = true // show icon
  el = false // engine label
  ed = false // engine dropdown
  pd = 5 // padding
  sz = 500 // size
  bsz = 1 // border size
  bb = true // border bottom
  br = 0 // border radius
  cl = [0, 0, 100, 1] // color
  bg = [0, 0, 100, 0] // background color
  bc = [0, 0, 100, 1] // border color
  ts = [false, 1, 1, 5, 0, 0, 0, 0.8] // text shadow
  bs = [false, 1, 1, 5, 0, 0, 0, 0.8] // box shadow
  lb = 'Search the web...' // Label text
  w = { ...defaultWidgetStyles }
}
