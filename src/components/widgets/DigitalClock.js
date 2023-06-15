import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class DigitalClock {
  id = ''
  timezone = 'America/Los_Angeles'
  monospace = true
  spaceBetween = 0
  label = {
    label: 'Clock',
    on: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 20,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  hour = {
    on: true,
    twoDigit: false,
    twentyFour: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 20,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  min = {
    on: true,
    twoDigit: true,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 20,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  sec = {
    on: true,
    twoDigit: true,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 20,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  meridiem = {
    on: true,
    am: 'am',
    pm: 'pm',
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 20,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  delimiter = {
    on: true,
    symbol1: ':',
    symbol2: ':',
    symbol3: '',
    blink: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 20,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  relative = {
    on: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 20,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  base = { ...baseWidgetStyles, font: { ...baseWidgetStyles.font, size: 72 } }
}
