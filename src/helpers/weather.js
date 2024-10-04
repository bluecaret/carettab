export const getLocation = async (query, language) => {
  const request = await fetch('https://filplrhe2she7oc2pc3wmqvzvq0gdffl.lambda-url.us-west-2.on.aws/', {
    headers: { authorizationtoken: chrome.runtime.id, resource: 'location', query: encodeURI(query), lang: language },
  })
  const data = await request.json()
  return data.data
}

export const getWeather = async (query, language) => {
  try {
    const request = await fetch('https://filplrhe2she7oc2pc3wmqvzvq0gdffl.lambda-url.us-west-2.on.aws/', {
      headers: { authorizationtoken: chrome.runtime.id, resource: 'forecast', query: encodeURI(query), lang: language },
    })
    const data = await request.json()
    return data.data
  } catch (error) {
    console.warn('Unable to retrieve weather data from server.')
    return false
  }
}
