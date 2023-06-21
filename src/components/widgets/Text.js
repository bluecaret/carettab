import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Text {
  id = ''
  text = ''
  base = { ...baseWidgetStyles, font: { ...baseWidgetStyles.font, size: 20 } }
}
