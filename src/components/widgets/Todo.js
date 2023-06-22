import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Todo {
  id = ''
  filter = 'all'
  list = [
    { id: 'one', name: 'Leave a review for CaretTab', done: true, flag: false },
    { id: 'two', name: 'Signup for CaretTab Premium', done: false, flag: true },
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
