const endpointBase = 'https://api.weatherapi.com/v1/'
const endpointForecast = 'forecast.json?key='
const endpointLocation = 'search.json?key='

export const getLocation = async (query, access, lang) => {
  let language = `&lang=${lang}`
  let locationData
  const endpoint = `${endpointBase}${endpointLocation}${access}&q=${encodeURI(query)}${language}`

  const wapiResponse = await fetch(endpoint, { method: 'GET' })
  locationData = await wapiResponse.json()

  return locationData
}

export const getWeather = async (query, access, lang) => {
  let language = `&lang=${lang}`
  let weatherData
  const endpoint = `${endpointBase}${endpointForecast}${access}&q=${encodeURI(
    query
  )}&days=5&aqi=no&alerts=no${language}`

  const wapiResponse = await fetch(endpoint, { method: 'GET' })
  weatherData = await wapiResponse.json()

  return weatherData
}
