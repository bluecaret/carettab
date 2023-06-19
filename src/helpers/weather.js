export const getLocation = async (query, language) => {
  const request = await fetch(
    `https://dtfv5mvrx9.execute-api.us-west-2.amazonaws.com/prod/weather/location/${encodeURI(query)}?lang=${language}`,
    {
      method: 'GET',
      redirect: 'follow',
      headers: { authorizationToken: chrome.runtime.id },
    }
  )
  const data = await request.json()
  return JSON.parse(data.data)
}

export const getWeather = async (query, language) => {
  const request = await fetch(
    `https://dtfv5mvrx9.execute-api.us-west-2.amazonaws.com/prod/weather/forecast/${encodeURI(query)}?lang=${language}`,
    {
      method: 'GET',
      redirect: 'follow',
      headers: { authorizationToken: chrome.runtime.id },
    }
  )
  const data = await request.json()
  return JSON.parse(data.data)
}
