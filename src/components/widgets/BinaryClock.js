import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class BinaryClock {
  id = ''
  timezone = 'local'
  indicator = {
    size: 50,
    dot: false,
    extras: false,
    seconds: true,
    offLabel: '0',
    onLabel: '1',
    padding: 10,
    overrideColors: false,
    hourOnColor: [0, 0, 100, 1],
    hourOffColor: [0, 0, 100, 0.5],
    minOnColor: [0, 0, 100, 1],
    minOffColor: [0, 0, 100, 0.5],
    secOnColor: [0, 0, 100, 1],
    secOffColor: [0, 0, 100, 0.5],
    shadow: [true, 1, 1, 5, 0, 0, 0, 1],
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
