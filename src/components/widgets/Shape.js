import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Shape {
  id = ''
  shape = 'rectangle'
  rotate = 0
  base = {
    ...baseWidgetStyles,
    width: 300,
    widthUnit: 'pixels',
    height: 300,
    heightUnit: 'pixels',
    container: { ...baseWidgetStyles.container, override: true, borderSize: 0, radius: 0, padding: 0 },
  }
}
