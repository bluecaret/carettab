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
