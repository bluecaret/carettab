/**
 * Get keys from AWS
 * @returns {Object} Keys - {"w", "us"}
 */
export const accessAws = async () => {
  const awsEndpoint = 'https://wdaewgzjt5.execute-api.us-west-2.amazonaws.com/default/carettab'
  const fetchAws = await fetch(awsEndpoint, { method: 'post' })
  const awsText = await fetchAws.text()
  if (awsText) {
    const aws = JSON.parse(awsText)
    if (aws.message && aws.license) return { k: aws.message, l: aws.license }
  }
  console.warn('Failed to access aws.')
  return { k: {}, l: '' }
}

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
