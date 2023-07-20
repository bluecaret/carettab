import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Weather {
  id = ''
  layout = 'Classic'
  location = {
    country: 'United States of America',
    id: 2670971,
    lat: 47.61,
    lon: -122.33,
    name: 'Seattle',
    region: 'Washington',
    url: 'seattle-washington-united-states-of-america',
  }
  scale = true // fahrenheit, celsius
  unit = true // imperial, metric
  windUnit = true // mph, kph | ft/s, m/s
  roundDecimals = true
  twentyFour = false
  overrideColors = false
  label = {
    on: true,
    color: [0, 0, 100, 0.5],
  }
  current = {
    on: true,
    condition: {
      on: true,
      color: [0, 0, 100, 1],
    },
    icon: {
      on: true,
      animated: false,
      colors: {
        sun: [39, 100, 50, 1],
        moon: [39, 100, 50, 1],
        cloud: [211, 82, 64, 1],
        rain: [213, 87, 76, 1],
        snow: [211, 82, 64, 1],
        thunder: [39, 100, 50, 1],
        stroke: [0, 0, 100, 0],
      },
    },
    temperature: {
      currently: true,
      feelsLike: true,
      degree: true,
      currentlyColor: [50, 100, 70, 1],
      feelsLikeColor: [50, 40, 80, 1],
    },
    wind: {
      on: true,
      color: [0, 0, 100, 0.5],
    },
    humidity: {
      on: true,
      color: [0, 0, 100, 0.5],
    },
    pressure: {
      on: false,
      color: [0, 0, 100, 0.5],
    },
    astro: {
      moonPhase: false,
      sunrise: true,
      sunset: true,
      moonPhaseColor: [0, 0, 100, 0.5],
      sunriseColor: [0, 0, 100, 0.5],
      sunsetColor: [0, 0, 100, 0.5],
    },
  }
  forecast = {
    on: true,
    days: 5,
    hideToday: false,
    icon: {
      on: true,
      animated: false,
      colors: {
        sun: [39, 100, 50, 1],
        moon: [39, 100, 50, 1],
        cloud: [211, 82, 64, 1],
        rain: [213, 87, 76, 1],
        snow: [211, 82, 64, 1],
        thunder: [39, 100, 50, 1],
        stroke: [0, 0, 100, 0],
      },
    },
    day: {
      on: true,
      color: [0, 0, 100, 1],
    },
    temperature: {
      high: true,
      low: true,
      degree: true,
      highColor: [25, 100, 70, 1],
      lowColor: [213, 87, 76, 1],
    },
  }
  base = {
    ...baseWidgetStyles,
    container: { ...baseWidgetStyles.conatiner, alignment: 'w' },
    font: { ...baseWidgetStyles.font, size: 22 },
  }
}
