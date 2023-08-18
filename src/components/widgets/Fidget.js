import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Fidget {
  id = ''
  type = 'bubblewrap'
  base = { ...baseWidgetStyles, font: { ...baseWidgetStyles.font, size: 20 } }
}
