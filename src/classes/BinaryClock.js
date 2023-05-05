import { defaultWidgetStyles } from './DefaultWidgetStyles.js'

export class BinaryClock {
  id = '' // id
  tz = 'America/Los_Angeles' // timezone
  ind = {
    sz: 50, // size
    dot: false, // use dots
    se: false, // show unused dots
    ss: true, // show seconds
    lboff: '0', // off label
    lbon: '1', // on label
    pd: 10, // padding
    hronc: [0, 0, 100, 1], // color
    hroffc: [0, 0, 100, 0.5], // color
    minonc: [0, 0, 100, 1], // color
    minoffc: [0, 0, 100, 0.5], // color
    seconc: [0, 0, 100, 1], // color
    secoffc: [0, 0, 100, 0.5], // color
    sh: [false, 1, 1, 5, 0, 0, 0, 0.8], // shadow
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
