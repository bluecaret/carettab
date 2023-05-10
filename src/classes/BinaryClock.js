import { defaultWidgetStyles } from './DefaultWidgetStyles.js'

export class BinaryClock {
  id = ''
  timezone = 'America/Los_Angeles'
  indicator = {
    size: 30,
    dot: false,
    extras: false,
    seconds: true,
    offLabel: '0',
    onLabel: '1',
    padding: 10,
    hourOnColor: [0, 0, 100, 1],
    hourOffColor: [0, 0, 100, 0.5],
    minOnColor: [0, 0, 100, 1],
    minOffColor: [0, 0, 100, 0.5],
    secOnColor: [0, 0, 100, 1],
    secOffColor: [0, 0, 100, 0.5],
    shadow: [true, 1, 1, 5, 0, 0, 0, 0.8],
  }
  label = {
    label: 'Clock',
    on: true,
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
  base = { ...defaultWidgetStyles }
}
