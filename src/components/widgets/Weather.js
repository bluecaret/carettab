import { baseWidgetStyles } from '@/classes/BaseWidgetStyles.js'

export class Weather {
  id = ''
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
  precise = false
  twentyFour = false
  horizontal = true
  overrideColors = false
  label = {
    on: true,
    color: [0, 0, 100, 1],
  }
  current = {
    on: true,
    condition: true,
    icon: {
      on: true,
      size: 12,
      color: [0, 0, 100, 1],
    },
    temperature: {
      currently: true,
      feelsLike: true,
      degree: true,
      currentlyColor: [0, 0, 100, 1],
      feelsLikeColor: [0, 0, 100, 1],
    },
    wind: {
      on: true,
    },
    humidity: {
      on: true,
    },
    pressure: {
      on: true,
    },
    astro: {
      moonPhase: false,
      sunrise: false,
      sunset: false,
    },
  }
  forecast = {
    on: true,
    days: 3,
    hideToday: true,
    horizontal: true,
    icon: {
      on: true,
      size: 6,
      color: [0, 0, 100, 1],
    },
    day: {
      on: true,
      color: [0, 0, 100, 1],
    },
    temperature: {
      high: true,
      low: true,
      degree: true,
      highColor: [0, 0, 100, 1],
      lowColor: [0, 0, 100, 1],
    },
  }
  base = { ...baseWidgetStyles }
}
