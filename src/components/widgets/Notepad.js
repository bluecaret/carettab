import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Notepad {
  id = ''
  sync = false
  spellCheck = true
  showCharLimit = true
  width = 300
  height = 200
  padding = 12
  borderWidth = 1
  borderRadius = 8
  borderColor = [255, 255, 255, 1]
  background = [0, 0, 0, 0.5]
  shadow = [true, 1, 1, 5, 0, 0, 0, 0.8]
  overrideColors = false
  base = { ...baseWidgetStyles }
}
