import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class QuickLinks {
  id = ''
  type = 'ql'
  layout = 'ch'
  link = {
    margin: 5,
    padding: 8,
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
    background: [0, 0, 10, 0],
    hoverBackground: [0, 0, 10, 0.1],
    borderSize: 0,
    borderColor: [0, 0, 100, 1],
    borderRadius: 4,
    openInNewTab: false,
    icons: true,
    titles: true,
    iconSize: 16,
    maxWidth: 130,
  }
  quickLinks = [
    { title: 'CaretTab', url: 'https://www.carettab.com', id: 'carettab', special: 'none' },
    { title: 'Google', url: 'https://www.google.com', id: 'google', special: 'none' },
    { title: 'Gmail', url: 'https://www.gmail.com', id: 'gmail', special: 'none' },
  ]
  base = { ...baseWidgetStyles, alignment: 'n', widthUnit: 'percent', width: 100, height: 100 }
}
