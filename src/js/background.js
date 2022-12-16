import { ExtPay } from "/js/ExtPay.js";

console.log('Service worker is running');

var extpay = ExtPay("carettab");
extpay.startBackground();

extpay.onPaid.addListener(user => {
  console.log('User just paid or logged in with ExtPay.', user);
  chrome.storage.local.set({ctUser: user}, () => {
    chrome.runtime.sendMessage({ command: 'update-paid-status', user: user }).then(
      () => {},
      (err) => {console.log('update-paid-status failed', err);}
    );
  });
});

// chrome.runtime.onInstalled.addListener(getExtPayUser);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log('SW got message', request, sender);

  if (request.command === 'get-user') {
    (async () => {
      let user = await extpay.getUser();
      // console.log('getExtPayUser send response', user);
      sendResponse(user);
    })();
    return true; // keep the messaging channel open for sendResponse
  }

  if (request.command === 'get-weather') {
    (async () => {
      let currentWeather = await getWeather(request.loc, request.days, request.lang);
      // console.log('return weather', currentWeather);
      sendResponse({response: currentWeather});
    })();
    return true; // keep the messaging channel open for sendResponse
  }
});

// Check whether new version is installed
if(typeof chrome.runtime.onInstalled  !== 'undefined')
{
  chrome.runtime.onInstalled.addListener(function (details)
  {
    // Set caretTabStatus if existing, intalled or updated.
    // console.log('ON INSTALL DETAILS', details);
    let status = "existing";
    let newVersion = '';
    if (details.reason === "install"){
      status = "installed";
    } else if (details.reason === "update"){
      status = "updated";
    }
    if (details.reason === "update") {
      newVersion = chrome.runtime.getManifest().version;
    }

    chrome.storage.local.set({caretTabStatus: status});
    chrome.storage.local.set({caretTabNewVersion: newVersion});
    chrome.storage.local.set({caretTabPrevVersion: details.previousVersion ? details.previousVersion : ''});
  });
}

// Send user to uninstall page
// chrome.runtime.setUninstallURL('https://www.carettab.com/thank-you');

(function() {
  chrome.storage.local.get(['ctBackground'], function (data) {
    document.body.style.backgroundColor = data.ctBackground;
  });
});
