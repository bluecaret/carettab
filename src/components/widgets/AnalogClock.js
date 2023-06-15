import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class AnalogClock {
  id = ''
  timezone = 'America/Los_Angeles'
  size = 70
  face = {
    style: 'dash',
    shadow: [true, 1, 1, 5, 0, 0, 0, 0.8],
    borderSize: 1,
    override: false,
    borderColor: [0, 0, 100, 1],
    quarterColor: [0, 0, 100, 1],
    hourColor: [0, 0, 100, 1],
    minuteColor: [0, 0, 100, 1],
  }
  hand = {
    style: 'minimalMedium',
    override: false,
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
  }
  hour = {
    on: true,
    color: [0, 0, 100, 1],
  }
  min = {
    on: true,
    color: [0, 0, 100, 1],
  }
  sec = {
    on: true,
    smoothSeconds: false,
    color: [0, 0, 100, 1],
  }
  center = {
    on: true,
    color: [0, 0, 100, 1],
  }
  label = {
    label: 'Clock',
    on: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 30,
    letterSpacing: 0,
    x: 0,
    y: -7,
  }
  relative = {
    on: false,
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 30,
    letterSpacing: 0,
    x: 0,
    y: -7,
  }
  base = { ...baseWidgetStyles, font: { ...baseWidgetStyles.font, size: 30 } }
}
