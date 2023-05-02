export class DateWidget {
  id = '' // id
  tz = 'America/Los_Angeles' // timezone
  ft = 'middle' // format
  sd = false // short date
  dl = {
    // Delimiter
    on: true, // on
    ss1: ':', // symbol
    ss2: ':', // symbol
    ss3: '', // symbol
    ls1: ' ', // symbol
    ls2: ', ', // symbol
    ls3: '', // symbol
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
    on: true, // on
    lb: 'day of year', // Label text
    ft: 'DDDo', // format
    or: false, // override widget styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  wk = {
    on: true, // on
    lb: 'Week', // Label text
    iso: false, // ISO format
    or: false, // override widget styles
    cl: [0, 0, 100, 1], // color
    ts: [false, 1, 1, 5, 0, 0, 0, 0.8], // text shadow
    fs: 24, // font size
    ls: 0, // Letter spacing
    ox: 0, // offset X
    oy: 0, // offset Y
  }
  qr = {
    on: true, // on
    lb: 'quarter', // Label text
    ft: 'Qo', // format
    st: '0', // start
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
