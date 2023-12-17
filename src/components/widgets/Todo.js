import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Todo {
  id = ''
  filter = 'all'
  label = {
    on: true,
    label: 'Todo',
  }
  done = {
    strikethrough: true,
    overrideColor: false,
    color: [0, 0, 100, 1],
  }
  list = [
    { id: 'one', name: 'Leave a review for CaretTab', done: true, flag: false },
    { id: 'two', name: 'Customize my NEW New Tab page', done: false, flag: true },
    { id: 'three', name: 'Fill out this todo list', done: false, flag: false },
  ]
  base = { ...baseWidgetStyles, font: { ...baseWidgetStyles.font, size: 20 } }
}

export class TodoItem {
  id = ''
  name = ''
  done = false
  flag = false
}
