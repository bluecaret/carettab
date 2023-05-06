import { defaultWidgetStyles } from './DefaultWidgetStyles.js'

export class DateWidget {
  id = '' // id
  tz = 'America/Los_Angeles' // timezone
  ft = 'middle' // format
  sd = false // short date
  dl = {
    // Delimiter
    on: true, // on
    ss1: '', // symbol
    ss2: ', ', // symbol
    ss3: '/', // symbol
    ss4: '/', // symbol
    ss5: '', // symbol
    ls1: '', // symbol
    ls2: ', ', // symbol
    ls3: ' ', // symbol
    ls4: ', ', // symbol
    ls5: '', // symbol
    or: false, // override widget styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  yr = {
    on: true, // on
    td: false, // two-digit
    or: false, // override widget styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  mh = {
    on: true, // on
    ab: false, // abbreviated
    td: false, // two-digit
    or: false, // override widget styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  dy = {
    on: true, // on
    td: false, // two-digit
    or: false, // override widget styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  dow = {
    on: true, // on
    ab: false, // abbreviated
    or: false, // override widget styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  doy = {
    on: false, // on
    lbp: 'Day of year: ', // Label prefix
    lbs: '', // Label suffix
    td: false, // three-digit
    or: false, // override widget styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  wk = {
    on: false, // on
    lbp: 'Week: ', // Label prefix
    lbs: '', // Label suffix
    td: false, // two-digit
    or: false, // override widget styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  qr = {
    on: false, // on
    lbp: 'Quarter: ', // Label prefix
    lbs: '', // Label suffix
    st: '0', // start
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
