/* eslint-disable no-undef */
import { blobToBase64 } from '@/helpers/data.js'
import { useSettingsStore } from '@/store.js'

export const requestPexelsData = async (path) => {
  let retrievedData
  try {
    const request = await fetch(`https://dtfv5mvrx9.execute-api.us-west-2.amazonaws.com/v1/pexels${encodeURI(path)}`, {
      method: 'GET',
      redirect: 'follow',
      headers: { authorizationToken: chrome.runtime.id },
    })
    const data = await request.json()
    retrievedData = data.data
  } catch (error) {
    console.warn('Failed to retrieve data from Pexels', error)
    retrievedData = null
  }
  return retrievedData
}

export const setupPexelsBase64Data = async (image) => {
  let pexelsImage = image
  // Use links in Pexels response to request raw photo data and assign to image as base64
  const pexelsRawImageData = await fetch(pexelsImage.src.original + '?auto=compress&cs=tinysrgb&w=2000')
  const pexelsImageBlob = await pexelsRawImageData.blob()
  pexelsImage.base64 = await blobToBase64(pexelsImageBlob)

  // Return entire built image object
  return pexelsImage
}

export const preparePexelsWallpaperObj = (image) => {
  return {
    base64: image.base64,
    id: image.id,
    description: image.alt ? image.alt : 'Photo from Pexels.com',
    alt_description: image.alt ? image.alt : 'Photo from Pexels.com',
    user: {
      name: image.photographer,
      username: image.photographer_id,
      links: { html: image.photographer_url },
    },
    links: { html: image.url },
    urls: { thumb: image.src.medium },
  }
}

export const savePexelsInfoToGlobal = (type, id, image, title, link) => {
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
          listName: type === 'search' || type === 'pxphoto' ? '' : title,
          listLink: type === 'search' || type === 'pxphoto' ? '' : link,
        },
      },
    },
  })
}

export const getList = async (page) => {
  const store = useSettingsStore()

  if (
    store.pexelsTab !== 'search' &&
    store.pexelsTab !== 'curated' &&
    store.pexelsTab !== 'collections' &&
    store.pexelsTab !== 'carettab'
  ) {
    return
  }
  store.isLoading = true

  let path = `/curated/list/${page}`
  if (store.pexelsTab === 'collections') {
    path = `/collections/list/${page}`
  }
  if (store.pexelsTab === 'carettab') {
    path = `/collections/carettab/${page}`
  }
  if (store.pexelsTab === 'search') {
    path = `/search/${encodeURI(store.pexelsSearchTerm.trim())}/${page}`
  }

  // send request to Pexels
  const list = await requestPexelsData(path)

  switch (store.pexelsTab) {
    case 'search':
      store.pexelsSearchResults = list.photos
      store.pexelsSearchPage = page
      break
    case 'curated':
      store.pexelsCuratedResults = list.photos
      store.pexelsCuratedPage = page
      break
    case 'collections':
      store.pexelsCollectionResults = list.collections.filter((c) => c.photos_count > 1)
      store.pexelsCollectionPage = page
      break
    case 'carettab':
      store.pexelsCarettabResults = list.collections
      store.pexelsCarettabPage = page
      break

    default:
      break
  }

  store.isLoading = false
}

export const getRandomPhotoFromPexelsList = async (imageType, id) => {
  let path = `/curated/random`
  if (imageType === 'pxcollection') path = `/collections/random/${id}`
  if (imageType === 'pxcarettab') path = `/collections/random/${id}`

  const list = await requestPexelsData(path)
  let randomImage
  if (imageType === 'pxcurated') {
    randomImage = list.photos[Math.floor(Math.random() * list.photos.length)]
  }
  if (imageType === 'pxcollection') {
    const filteredList = list.media.filter((c) => c.type === 'Photo')
    randomImage = filteredList[Math.floor(Math.random() * filteredList.length)]
  }
  if (imageType === 'pxcarettab') {
    randomImage = list.media[Math.floor(Math.random() * list.media.length)]
  }

  const base64Image = await setupPexelsBase64Data(randomImage)
  return base64Image
}

export const getSelectedPexelsImage = async (id = '', title = '', link = '') => {
  const store = useSettingsStore()

  try {
    store.isLoading = true
    let pexelsType = ''
    let image = {}
    let nextImage = {}

    switch (store.pexelsTab) {
      case 'search':
        pexelsType = 'pxphoto'
        break
      case 'curated':
        pexelsType = 'pxcurated'
        break
      case 'collections':
        pexelsType = 'pxcollection'
        break
      case 'carettab':
        pexelsType = 'pxcarettab'
        break
      default:
        break
    }

    let modifiedImage = {}
    let modifiedNextImage = {}

    // send request to Pexels
    if (['collections'].includes(store.pexelsTab)) {
      let getImage = await getRandomPhotoFromPexelsList(pexelsType, id)
      modifiedImage = await preparePexelsWallpaperObj(getImage)

      const getNextImage = await getRandomPhotoFromPexelsList(pexelsType, id)
      modifiedNextImage = await preparePexelsWallpaperObj(getNextImage)
    } else if (['carettab'].includes(store.pexelsTab)) {
      let getImage = await getRandomPhotoFromPexelsList(pexelsType, id)
      modifiedImage = await preparePexelsWallpaperObj(getImage)

      const getNextImage = await getRandomPhotoFromPexelsList(pexelsType, id)
      modifiedNextImage = await preparePexelsWallpaperObj(getNextImage)
    } else if (['curated'].includes(store.pexelsTab)) {
      let getImage = await getRandomPhotoFromPexelsList(pexelsType, null)
      modifiedImage = await preparePexelsWallpaperObj(getImage)

      const getNextImage = await getRandomPhotoFromPexelsList(pexelsType, null)
      modifiedNextImage = await preparePexelsWallpaperObj(getNextImage)
    } else {
      let path = `/photo/${id}`

      const getImage = await requestPexelsData(path)
      const base64Image = await setupPexelsBase64Data(getImage)
      modifiedImage = await preparePexelsWallpaperObj(base64Image)
    }

    image = modifiedImage
    nextImage = modifiedNextImage

    // Set images to browser local storage
    chrome.storage.local.set({ currentWallpaper: image })
    chrome.storage.local.set({ nextWallpaper: nextImage })

    // Apply settings related to pexels images
    const createListLink = link ? link : `https://www.pexels.com/collections/${id}/`
    savePexelsInfoToGlobal(pexelsType, id, image, title, createListLink)

    // Apply image to shared bg value
    store.wallpaper = image

    // Save design settings
    store.save()
    store.isLoading = false
  } catch (err) {
    store.isLoading = false
    console.error('Error getting selected Pexels image', err)
  }
}
