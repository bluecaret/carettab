import { ExtPay } from './assets/ExtPay.js'

const extpay = ExtPay('carettab')
extpay.startBackground()

// Check whether new version is installed
if (typeof chrome.runtime.onInstalled !== 'undefined') {
  chrome.runtime.onInstalled.addListener(function (details) {
    let status = 'existing'
    let prevVersion = details.previousVersion ? details.previousVersion : ''
    let newVersion = ''
    let timestamp = new Date().toLocaleString()
    let clearBox = true
    let showTour = false

    if (details.reason === 'install') {
      status = 'installed'
      showTour = true
    } else if (details.reason === 'update') {
      newVersion = chrome.runtime.getManifest().version
      status = 'updated'
      clearBox = false
    }

    chrome.storage.local.set({
      status: status,
      prevVersion: prevVersion,
      newVersion: newVersion,
      updatedTimestamp: timestamp,
      clearWhatsNewBox: clearBox,
      showTour: showTour,
    })
  })
}

// Send user to uninstall page
chrome.runtime.setUninstallURL('https://www.carettab.com/thank-you')
