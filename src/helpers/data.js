/**
 * Convert image blob data to base64
 * @param blob
 * @returns image as base64
 */
export const blobToBase64 = async (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

/**
 * Check license against AWS
 */
export const checkLicense = async (license) => {
  let validLicense = false
  try {
    const request = await fetch(`https://dtfv5mvrx9.execute-api.us-west-2.amazonaws.com/prod/license/${license}`, {
      method: 'GET',
      redirect: 'follow',
      headers: { authorizationToken: chrome.runtime.id },
    })
    const data = await request.json()
    validLicense = JSON.parse(data.data)
  } catch (error) {
    console.warn('Failed to check license', error)
    validLicense = false
  }
  return validLicense
}
