import { defaultWidgetStyles } from './DefaultWidgetStyles.js'

export class AnalogClock {
  id = '' // id
  tz = 'America/Los_Angeles' // timezone
  sz = 100 // size
  face = {
    st: 'dash', // style
    sh: [false, 1, 1, 5, 0, 0, 0, 0.8], // shadow
    bs: 0, // border size
    or: false, // override global styles
    bc: [0, 0, 100, 1], // border color
    qmc: [0, 0, 100, 1], // quarter mark color
    hmc: [0, 0, 100, 1], // hour mark color
    mmc: [0, 0, 100, 1], // minute mark color
  }
  hand = {
    st: 'minimalMedium', // style
    or: false, // override global styles
    sh: [false, 1, 1, 5, 0, 0, 0, 0.8], // shadow
  }
  hr = {
    // Hour
    on: true, // on
    cl: [0, 0, 100, 1], // color
  }
  min = {
    // Minute
    on: true, // on
    cl: [0, 0, 100, 1], // color
  }
  sec = {
    // Seconds
    on: true, // on
    ss: false, // smooth seconds
    cl: [0, 0, 100, 1], // color
  }
  cr = {
    // Center
    on: true, // on
    cl: [0, 0, 100, 1], // color
  }
  lb = {
    // Label
    lb: 'Clock', // Label text
    on: true, // on
    or: false, // override widget styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  rt = {
    // Relative time
    on: false, // on
    or: false, // override widget styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  w = { ...defaultWidgetStyles }
}
