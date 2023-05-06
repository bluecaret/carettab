import { defaultWidgetStyles } from './DefaultWidgetStyles.js'

export class DigitalClock {
  id = '' // id
  tz = 'America/Los_Angeles' // timezone
  ms = true // monospace
  sb = 0 // spacing between digits
  lb = {
    // Label
    lb: 'Clock', // Label text
    on: false, // on
    or: false, // override clock styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 20, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  hr = {
    // Hour
    on: true, // on
    td: false, // two-digit
    tf: false, // 24-hour
    or: false, // override clock styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 20, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  min = {
    // Minute
    on: true, // on
    td: true, // two-digit
    or: false, // override clock styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 20, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  sec = {
    // Seconds
    on: true, // on
    td: true, // two-digit
    or: false, // override clock styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 20, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  md = {
    // Meridiem
    on: true, // on
    am: 'am', // a.m. label
    pm: 'pm', // p.m. label
    or: false, // override clock styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 20, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  dl = {
    // Delimiter
    on: true, // on
    sym1: ':', // symbol
    sym2: ':', // symbol
    sym3: '', // symbol
    bl: false, // blink
    or: false, // override clock styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 20, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  rt = {
    // Relative time
    on: false, // on
    or: false, // override clock styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 20, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  w = { ...defaultWidgetStyles }
}
