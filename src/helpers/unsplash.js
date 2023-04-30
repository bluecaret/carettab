/* eslint-disable no-undef */
import { blobToBase64 } from '@/helpers/data.js'
import { useSettingsStore } from '@/store.js'

/**
 * Returns a completed image object from Unsplash API
 * @param {string} endpoint - The Unsplash endpoint to use
 * @returns {Object} Object containing the image data and Unsplash metadata
 */
export const getPhotoFromUnsplash = async (access, endpoint) => {
  // Initialize image object
  let unsplashImage

  // Get keys and setup endpoint url and headers
  const UNSPLASH_ACCESS_KEY = access
  const headers = new Headers()
  headers.append('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`)

  // Request random photo from Unsplash endpoint and assign image data to unsplashImage
  const unsplashResponse = await fetch(endpoint, { headers })
  unsplashImage = await unsplashResponse.json()

  // Use links in Unsplash response to request raw photo data and assign to image as base64
  const unsplashRawImageData = await fetch(unsplashImage.urls.raw + '&q=85&w=2000')
  const unsplashImageBlob = await unsplashRawImageData.blob()
  unsplashImage.base64 = await blobToBase64(unsplashImageBlob)

  // Trigger download location link for Unsplash analytics.
  const unsplashDownloadLocation = unsplashImage.links.download_location
  // eslint-disable-next-line no-unused-vars
  const unsplashDownloadLocationResponse = fetch(unsplashDownloadLocation, { headers })

  // Return entire built image object
  return unsplashImage
}

/**
 * Get random photo from an Unsplash list
 * @param {('topics'|'collections')} type - The Unsplash list selected
 * @param {string} id - The ID of the Unsplash list
 * @returns {Object} Object containing the image data and Unsplash metadata
 */
export const getRandomPhotoFromUnsplashList = async (access, imageType, id) => {
  let type = imageType
  switch (imageType) {
    case 'unphoto':
      type = 'search'
      break
    case 'untopic':
      type = 'topics'
      break
    case 'uncollection':
      type = 'collections'
      break
    default:
      break
  }
  const unsplashEndpoint = `https://api.unsplash.com/photos/random/?${type}=${id}`
  const unsplashImage = await getPhotoFromUnsplash(access, unsplashEndpoint)
  return unsplashImage
}

/**
 * Get single photo from Unsplash
 * @param {string} id - The ID of the Unsplash photo
 * @returns {Object} Object containing the image data and Unsplash metadata
 */
export const getSinglePhotoFromUnsplash = async (access, id) => {
  const unsplashEndpoint = `https://api.unsplash.com/photos/${id}`
  const unsplashImage = await getPhotoFromUnsplash(access, unsplashEndpoint)
  return unsplashImage
}

export const prepareWallpaperObj = (image) => {
  return {
    base64: image.base64,
    id: image.id,
    description: image.description ? image.description : image.alt_description,
    alt_description: image.alt_description,
    user: {
      name: image.user.name,
      username: image.user.username,
      links: { html: image.user.links.html },
    },
    links: { html: image.links.html },
    urls: { thumb: image.urls.thumb },
  }
}

export const saveUnsplashInfoToGlobal = (type, id, image, title, link) => {
  const store = useSettingsStore()

  store.$patch({
    config: {
      global: {
        it: type,
        iid: id, // Image ID
        its: new Date().toString(), // Image timestamp
        unpt: image.description, // Unsplash photo title
        unpl: image.links.html, // Unsplash photo link
        unalt: image.alt_description, // Unsplash alt description
        unau: image.user.name, // Unsplash author
        unal: image.user.links.html, // Unsplash author link
        unli: type === 'search' || type === 'unphoto' ? '' : title, // Unsplash list
        unll: type === 'search' || type === 'unphoto' ? '' : link, // Unsplash list link
      },
    },
  })
}

export const getList = async (access, page) => {
  const store = useSettingsStore()

  if (store.unsplashTab !== 'search' && store.unsplashTab !== 'topics' && store.unsplashTab !== 'collections') {
    return
  }
  store.isLoading = true
  let unsplashEndpoint = `https://api.unsplash.com/topics?per_page=21&page=${page}`
  if (store.unsplashTab === 'collections') {
    unsplashEndpoint = `https://api.unsplash.com/collections?per_page=21&page=${page}`
  }
  if (store.unsplashTab === 'search') {
    unsplashEndpoint = `https://api.unsplash.com/search/photos?per_page=21&page=${page}&query=${store.unsplashSearchTerm.trim()}`
  }

  // Get image
  const headers = new Headers()
  headers.append('Authorization', `Client-ID ${access}`)
  let response = await fetch(unsplashEndpoint, { headers })
  const json = await response.json()

  switch (store.unsplashTab) {
    case 'search':
      store.unsplashSearchResults = json.results
      store.unsplashSearchPage = page
      break
    case 'topics':
      store.unsplashTopicResults = json
      store.unsplashTopicPage = page
      break
    case 'collections':
      store.unsplashCollectionResults = json
      store.unsplashCollectionPage = page
      break

    default:
      break
  }

  store.isLoading = false
}

export const getSelectedUnsplashImage = async (access, id, title = '', link = '') => {
  const store = useSettingsStore()

  try {
    store.isLoading = true
    let unsplashType
    switch (store.unsplashTab) {
      case 'search':
        unsplashType = 'unphoto'
        break
      case 'topics':
        unsplashType = 'untopic'
        break
      case 'collections':
        unsplashType = 'uncollection'
        break
      default:
        break
    }

    // Retreive images from Unsplash
    let image,
      nextImage = {}
    if (['search'].includes(store.unsplashTab)) {
      let getImage = await getSinglePhotoFromUnsplash(access, id)
      let getNextImage = {}

      image = prepareWallpaperObj(getImage)
      nextImage = getNextImage
    }
    if (['topics', 'collections'].includes(store.unsplashTab)) {
      let getImage = await getRandomPhotoFromUnsplashList(access, store.unsplashTab, id)
      let getNextImage = await getRandomPhotoFromUnsplashList(access, store.unsplashTab, id)

      image = prepareWallpaperObj(getImage)
      nextImage = prepareWallpaperObj(getNextImage)
    }

    // Set images to browser local storage
    chrome.storage.local.set({ currentWallpaper: image })
    chrome.storage.local.set({ nextWallpaper: nextImage })

    // Apply settings related to unsplash images
    saveUnsplashInfoToGlobal(unsplashType, id, image, title, link)

    // Apply image to shared bg value
    store.wallpaper = image

    // Save design settings
    store.save()
    store.isLoading = false
  } catch (err) {
    store.isLoading = false
    console.error('Error getting selected Unsplash image', err)
  }
}
