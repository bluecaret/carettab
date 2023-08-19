import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Fidget {
  id = ''
  type = 'bubblewrap'
  bubblewrap = {
    popOnHover: false,
    size: 10,
    bubble: [215, 80, 80, 0.8],
    shadow: [true, 0, 0, 8, 0, 0, 0, 0.9],
  }
  base = { ...baseWidgetStyles, widthUnit: 'pixels', heightUnit: 'pixels' }
}
