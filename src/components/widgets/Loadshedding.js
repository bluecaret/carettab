import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Loadshedding {
  id = ''
  citizen = false
  license = ''
  area = {
    id: '',
    name: '',
    region: '',
  }
  base = { ...baseWidgetStyles }
}
