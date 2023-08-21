import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Fidget {
  id = ''
  type = 'spinnercircles'
  overrideColors = false
  primaryColor = [0, 0, 100, 1]
  shadow = [false, 1, 1, 5, 0, 0, 0, 0.8]
  bubblewrap = {
    popOnHover: false,
    size: 10,
  }
  base = { ...baseWidgetStyles, widthUnit: 'pixels', heightUnit: 'pixels' }
}
