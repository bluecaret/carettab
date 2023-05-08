import { defaultWidgetStyles } from './DefaultWidgetStyles.js'

export class Weather {
  id = '' // id
  loc = {
    // location
    country: 'United States of America',
    id: 2670971,
    lat: 47.61,
    lon: -122.33,
    name: 'Seattle',
    region: 'Washington',
    url: 'seattle-washington-united-states-of-america',
  }
  scale = true // scale: fahrenheit, celsius
  unit = true // units: imperial, metric
  wu = true // wind units: mph, kph | m/s, ft/s
  pd = false // precise digits
  tf = false // twenty four
  hz = true // horizontal
  lb = {
    // name label
    on: true, // on
    cl: [0, 0, 100, 1], // color
  }
  c = {
    // current weather
    on: true, // on
    cd: true, // condition
    ic: {
      // icon
      on: true, // on
      sz: 12, // size
      cl: [0, 0, 100, 1], // color
    },
    tp: {
      // temperature
      cur: true, // currently
      fl: true, // feels like
      de: true, // degree
      ccl: [0, 0, 100, 1], // color
      fcl: [0, 0, 100, 1], // color
    },
    wd: {
      // wind
      on: true, // on
    },
    hy: {
      // humidity
      on: true, // on
    },
    pr: {
      // pressure
      on: true, // on
    },
    ao: {
      // astro
      mp: false, // moon phase
      sr: false, // sunrise
      ss: false, // sunset
    },
  }
  f = {
    // forecast
    on: true, // on
    ds: 3, // days
    ht: true, // hide today
    hz: true, // horizontal
    ic: {
      // icon
      on: true, // on
      sz: 6, // size
      cl: [0, 0, 100, 1], // color
    },
    dy: {
      // day
      on: true, // on
      cl: [0, 0, 100, 1], // color
    },
    tp: {
      // temperature
      h: true, // high
      l: true, // low
      de: true, // degree
      hcl: [0, 0, 100, 1], // color
      lcl: [0, 0, 100, 1], // color
    },
  }
  w = { ...defaultWidgetStyles }
}
