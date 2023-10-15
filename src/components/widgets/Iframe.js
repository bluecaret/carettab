import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Iframe {
  id = ''
  url = 'https://en.wikipedia.org'
  base = {
    ...baseWidgetStyles,
    width: 600,
    widthUnit: 'pixels',
    height: 400,
    heightUnit: 'pixels',
    container: { ...baseWidgetStyles.container, padding: 10 },
  }
}
