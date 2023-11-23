import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Countdown {
  id = ''
  target = '2050-01-01T00:00'
  timezone = 'local'
  equalWidth = false
  monospace = true
  spaceBetween = 1
  direction = 'horizontal'
  label = {
    label: 'Countdown',
    on: false,
    position: 'top',
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 20,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  units = {
    on: true,
    position: 'top',
    override: false,
    color: [0, 0, 100, 1],
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    size: 20,
    letterSpacing: 0,
    x: 0,
    y: 0,
  }
  years = {
    on: false,
    label: 'Years',
  }
  months = {
    on: false,
    label: 'Months',
  }
  weeks = {
    on: false,
    label: 'Weeks',
  }
  days = {
    on: true,
    label: 'Days',
  }
  hours = {
    on: true,
    label: 'Hours',
  }
  minutes = {
    on: true,
    label: 'Minutes',
  }
  seconds = {
    on: true,
    label: 'Seconds',
  }
  base = {
    ...baseWidgetStyles,
    font: { ...baseWidgetStyles.font, size: 32 },
  }
}
