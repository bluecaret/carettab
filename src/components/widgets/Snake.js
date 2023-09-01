import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Snake {
  id = ''
  highScore = 0
  fruit = {
    color: [6, 78, 57, 1],
  }
  snake = {
    color: [145, 63, 49, 1],
  }
  grid = {
    cellColor: [0, 0, 100, 0.15],
    borderColor: [0, 0, 0, 0.2],
    cellSize: 28,
  }
  base = {
    ...baseWidgetStyles,
    width: 400,
    widthUnit: 'pixels',
    height: 500,
    heightUnit: 'pixels',
    font: { ...baseWidgetStyles.font, size: 20 },
  }
}
