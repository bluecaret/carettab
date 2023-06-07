import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class BookmarksBar {
  id = 'bookmarksBar'
  on = false
  bar = {
    position: 'top',
    margin: 5,
    padding: 8,
    background: [0, 0, 10, 0],
    borderSize: 0,
    borderColor: [0, 0, 100, 1],
    borderRadius: 4,
    shadow: [false, 1, 1, 5, 0, 0, 0, 0.8],
  }
  link = {
    margin: 5,
    padding: 8,
    color: [220, 15, 85, 1],
    background: [0, 0, 10, 0],
    hoverBackground: [0, 0, 10, 0.1],
    borderSize: 0,
    borderColor: [0, 0, 100, 1],
    borderRadius: 4,
    openInNewTab: false,
    icons: true,
    iconSize: 16,
    maxWidth: 130,
  }
  base = { ...baseWidgetStyles }
}
