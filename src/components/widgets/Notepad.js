import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Notepad {
  id = ''
  sync = false
  spellCheck = true
  showCharLimit = true
  padding = 12
  borderWidth = 1
  borderRadius = 5
  borderColor = [0, 0, 25, 1]
  background = [0, 0, 0, 1]
  shadow = [true, 1, 1, 5, 0, 0, 0, 0.8]
  overrideColors = true
  base = {
    ...baseWidgetStyles,
    autoSize: false,
    width: 400,
    widthUnit: 'pixels',
    height: 400,
    heightUnit: 'pixels',
    font: { ...baseWidgetStyles.font, override: true, size: 14, family: 'Roboto Mono', color: [0, 0, 80, 1] },
  }
}
