/* eslint-disable no-undef */
import { blobToBase64 } from '@/helpers/data.js'
import { useSettingsStore } from '@/store.js'

export const requestUnsplashData = async (headers) => {
  let retrievedData
  const fullHeaders = {
    authorizationtoken: chrome.runtime.id,
    ...headers,
  }
  try {
    const request = await fetch('https://7xhdzsrkjuon7xubpy3htk4u740fwtmk.lambda-url.us-west-2.on.aws/', {
      headers: fullHeaders,
    })
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
  const headers = {
    resource: 'downloadlocation',
    loc: unsplashDownloadLocation,
  }
  // eslint-disable-next-line no-unused-vars
  const unsplashDownloadLocationResponse = requestUnsplashData(headers)

  // Return entire built image object
  return unsplashImage
}

export const getRandomPhotoFromUnsplashList = async (imageType, id) => {
  let headers = {}
  switch (imageType) {
    case 'unphoto':
      headers = {
        resource: 'photo/random',
        type: 'search',
        id: id,
      }
      break
    case 'untopic':
      headers = {
        resource: 'photo/random',
        type: 'topics',
        id: id,
      }
      break
    case 'uncollection':
      headers = {
        resource: 'photo/random',
        type: 'collections',
        id: id,
      }
      break
    default:
      break
  }
  const unsplashImage = await requestUnsplashData(headers)
  const modifiedImage = await setupBase64Data(unsplashImage)
  return modifiedImage
}

export const getSinglePhotoFromUnsplash = async (id) => {
  const headers = {
    resource: 'photo/single',
    id: id,
  }
  const unsplashImage = await requestUnsplashData(headers)
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

  let headers = {
    resource: 'list/topics',
    page: page,
  }
  if (store.unsplashTab === 'collections') {
    headers = {
      resource: 'list/collections',
      page: page,
    }
  }
  if (store.unsplashTab === 'search') {
    headers = {
      resource: 'list/search',
      query: encodeURI(store.unsplashSearchTerm.trim()),
      page: page,
    }
  }

  // send request to Unsplash
  const list = await requestUnsplashData(headers)

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

    let headers = {
      resource: 'photo/single',
      id: id,
    }
    if (['topics'].includes(store.unsplashTab)) {
      headers = {
        resource: 'photo/random',
        phototype: 'topics',
        id: id,
      }
    }
    if (['collections'].includes(store.unsplashTab)) {
      headers = {
        resource: 'photo/random',
        phototype: 'collection',
        id: id,
      }
    }

    // send request to Unsplash
    const getImage = await requestUnsplashData(headers)
    const modifiedImage = await setupBase64Data(getImage)
    const getNextImage = unsplashType !== 'search' ? await requestUnsplashData(headers) : {}
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
