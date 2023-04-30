export class DigitalClock {
  id = '' // id
  tz = 'America/Los_Angeles' // timezone
  ms = true // monospace
  sb = 5 // spacing between digits
  lb = {
    // Label
    lb: 'Clock', // Label text
    on: true, // on
    or: false, // override clock styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  hr = {
    // Hour
    on: true, // on
    td: true, // two-digit
    tf: true, // 24-hour
    or: false, // override clock styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
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
    fs: 24, // font size
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
    fs: 24, // font size
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
    fs: 24, // font size
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
    fs: 24, // font size
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
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  w = {
    // Widget generic settings
    w: 400, // Container Width
    h: 100, // Container Height
    as: true, // Auto Size
    a: 'c', // Alignment
    ca: 'c', // Alignment within Widget Container
    x: 20, // Position X
    y: 5, // Position Y
    or: false, // override global styles
    orf: false, // override global font styles
    cl: [0, 0, 100, 1], // color
    ff: 'Source Sans Pro', // Font family
    fs: 72, // Font size
    fb: 400, // Font Bold
    fi: false, // Font Italic
    fu: false, // Font Underline
    ls: 0, // Letter spacing
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    tt: 'none', // text case
    cor: false, // Container override
    crd: 0, // Container rounded radius
    cbs: 0, // Container border size
    cbc: [0, 0, 100, 1], // Container border color
    cbg: [0, 0, 10, 0.8], // Container background color
    csh: [false, 1, 1, 5, 0, 0, 0, 0.8], // Container shadow
    cpd: 20, // Container padding
  }
}
