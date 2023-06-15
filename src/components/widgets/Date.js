import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class DateWidget {
  id = ''
  timezone = 'America/Los_Angeles'
  format = 'middle'
  short = false
  delimiter = {
    on: true,
    shortSymbol1: '',
    shortSymbol2: ', ',
    shortSymbol3: '/',
    shortSymbol4: '/',
    shortSymbol5: '',
    longSymbol1: '',
    longSymbol2: ', ',
    longSymbol3: ' ',
    longSymbol4: ', ',
    longSymbol5: '',
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 24,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  year = {
    on: true,
    twoDigit: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 24,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  month = {
    on: true,
    abbreviated: false,
    twoDigit: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 24,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  day = {
    on: true,
    twoDigit: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 24,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  dayOfWeek = {
    on: true,
    abbreviated: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 24,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  dayOfYear = {
    on: false,
    prefixLabel: 'Day of year: ',
    suffixLabel: '',
    threeDigit: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 24,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  week = {
    on: false,
    prefixLabel: 'Week: ',
    suffixLabel: '',
    twoDigit: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 24,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  quarter = {
    on: false,
    prefixLabel: 'Quarter: ',
    suffixLabel: '',
    start: '0',
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 24,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  base = { ...baseWidgetStyles, font: { ...baseWidgetStyles.font, size: 45 } }
}
