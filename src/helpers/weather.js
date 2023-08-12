export const getLocation = async (query, language) => {
  const request = await fetch(
    `https://dtfv5mvrx9.execute-api.us-west-2.amazonaws.com/v1/weather/location/${encodeURI(query)}?lang=${language}`,
    {
      method: 'GET',
      redirect: 'follow',
      headers: { authorizationToken: chrome.runtime.id },
    }
  )
  const data = await request.json()
  return data.data
}

export const getWeather = async (query, language) => {
  try {
    const request = await fetch(
      `https://dtfv5mvrx9.execute-api.us-west-2.amazonaws.com/v1/weather/forecast/${encodeURI(query)}?lang=${language}`,
      {
        method: 'GET',
        redirect: 'follow',
        headers: { authorizationToken: chrome.runtime.id },
      }
    )
    const data = await request.json()
    return data.data
  } catch (error) {
    console.warn('Unable to retrieve weather data from server.')
    return false
  }
}
