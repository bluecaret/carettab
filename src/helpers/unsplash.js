/* eslint-disable no-undef */
import { blobToBase64 } from '@/helpers/data.js'
import { useSettingsStore } from '@/store.js'

export const requestUnsplashData = async (path) => {
  let retrievedData
  try {
    const request = await fetch(
      `https://dtfv5mvrx9.execute-api.us-west-2.amazonaws.com/v1/unsplash${encodeURI(path)}`,
      {
        method: 'GET',
        redirect: 'follow',
        headers: { authorizationToken: chrome.runtime.id },
      }
    )
    const data = await request.json()
    retrievedData = data.data
  } catch (error) {
    console.warn('Failed to retrieve data from Unsplash', error)
    retrievedData = null
  }
  return retrievedData
}

export const setupBase64Data = async (image) => {
  let unsplashImage = image
  // Use links in Unsplash response to request raw photo data and assign to image as base64
  const unsplashRawImageData = await fetch(unsplashImage.urls.raw + '&q=85&w=2000')
  const unsplashImageBlob = await unsplashRawImageData.blob()
  unsplashImage.base64 = await blobToBase64(unsplashImageBlob)

  // Trigger download location link for Unsplash analytics.
  const unsplashDownloadLocation = unsplashImage.links.download_location
  // eslint-disable-next-line no-unused-vars
  const unsplashDownloadLocationResponse = requestUnsplashData('/downloadlocation?loc=' + unsplashDownloadLocation)

  // Return entire built image object
  return unsplashImage
}

export const getRandomPhotoFromUnsplashList = async (imageType, id) => {
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
  let path = `/photo/random/${type}/${id}`
  const unsplashImage = await requestUnsplashData(path)
  const modifiedImage = await setupBase64Data(unsplashImage)
  return modifiedImage
}

export const getSinglePhotoFromUnsplash = async (id) => {
  let path = `/photo/single/${id}`
  const unsplashImage = await requestUnsplashData(path)
  const modifiedImage = await setupBase64Data(unsplashImage)
  return modifiedImage
}

export const prepareUnsplashWallpaperObj = (image) => {
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
        wallpaper: {
          type: type,
          id: id,
          timestamp: new Date().toString(),
        },
        wallpaperApi: {
          photoTitle: image.description,
          photoLink: image.links.html,
          photoAlt: image.alt_description,
          authorName: image.user.name,
          authorLink: image.user.links.html,
          listName: type === 'search' || type === 'unphoto' ? '' : title,
          listLink: type === 'search' || type === 'unphoto' ? '' : link,
        },
      },
    },
  })
}

export const getList = async (page) => {
  const store = useSettingsStore()

  if (store.unsplashTab !== 'search' && store.unsplashTab !== 'topics' && store.unsplashTab !== 'collections') {
    return
  }
  store.isLoading = true

  let path = `/list/topics/${page}`
  if (store.unsplashTab === 'collections') {
    path = `/list/collections/${page}`
  }
  if (store.unsplashTab === 'search') {
    path = `/list/search/${encodeURI(store.unsplashSearchTerm.trim())}/${page}`
  }

  // send request to Unsplash
  const list = await requestUnsplashData(path)

  switch (store.unsplashTab) {
    case 'search':
      store.unsplashSearchResults = list.results
      store.unsplashSearchPage = page
      break
    case 'topics':
      store.unsplashTopicResults = list
      store.unsplashTopicPage = page
      break
    case 'collections':
      store.unsplashCollectionResults = list
      store.unsplashCollectionPage = page
      break

    default:
      break
  }

  store.isLoading = false
}

export const getSelectedUnsplashImage = async (id, title = '', link = '') => {
  const store = useSettingsStore()

  try {
    store.isLoading = true
    let unsplashType = ''
    let image = {}
    let nextImage = {}

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

    let path = `/photo/single/${id}`
    if (['topics', 'collections'].includes(store.unsplashTab)) {
      path = `/photo/random/${unsplashType}/${id}`
    }

    // send request to Unsplash
    const getImage = await requestUnsplashData(path)
    const modifiedImage = await setupBase64Data(getImage)
    const getNextImage = unsplashType !== 'search' ? await requestUnsplashData(path) : {}
    const modifiedNextImage = unsplashType !== 'search' ? await setupBase64Data(getNextImage) : {}

    image = prepareUnsplashWallpaperObj(modifiedImage)
    nextImage = unsplashType !== 'search' ? prepareUnsplashWallpaperObj(modifiedNextImage) : modifiedNextImage

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
