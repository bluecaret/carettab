import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class SearchBar {
  id = ''
  engine = 'google'
  customEngine = false
  customEngineUrl = 'https://www.google.com/search?q=%s'
  autocomplete = true
  icon = true
  engineLabel = false
  dropdown = false
  padding = 10
  borderSize = 1
  borderBottom = false
  radius = 6
  overrideColors = false
  background = [0, 0, 100, 0]
  borderColor = [0, 0, 100, 1]
  boxShadow = [false, 1, 1, 5, 0, 0, 0, 0.8]
  label = 'Search the web...'
  base = {
    ...baseWidgetStyles,
    width: 500,
    widthUnit: 'pixels',
    font: { ...baseWidgetStyles.font, size: 20 },
  }
}
