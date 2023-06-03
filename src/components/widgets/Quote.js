import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Quote {
  id = ''
  quotes = [
    {
      id: '2o384l',
      text: 'The best way to predict the future is to invent it.',
      author: 'Alan Kay',
    },
  ]
  currentQuote = 0
  lastUpdate = '2000-01-01T00:00:00.000-07:00'
  random = false
  showAuthor = true
  showQuoteMarks = true
  quoteList = ''
  base = { ...baseWidgetStyles }
}
