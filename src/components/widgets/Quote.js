import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Quote {
  id = ''
  quotes = [
    {
      id: '2o384l',
      text: 'The best way to predict the future is to invent it.',
      author: 'Alan Kay',
    },
    {
      id: '346bd5',
      text: "I have not failed. I've just found 10,000 ways that won't work.",
      author: 'Thomas A. Edison',
    },
    {
      id: '64s838',
      text: "Believe you can and you're halfway there.",
      author: 'Theodore Roosevelt',
    },
    {
      id: 's6484g',
      text: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
      author: 'Winston Churchill',
    },
    {
      id: '46dbr8',
      text: 'In the middle of difficulty lies opportunity.',
      author: 'Albert Einstein',
    },
    {
      id: '9dg001',
      text: 'The secret of getting ahead is getting started.',
      author: 'Mark Twain',
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
