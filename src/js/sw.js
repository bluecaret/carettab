import { ExtPay } from "/js/ExtPay.js";

console.log('Service worker is running');

var extpay = ExtPay("carettab");
extpay.startBackground();

extpay.onPaid.addListener(user => {
  // console.log('User just paid or logged in with ExtPay.', user);
  chrome.storage.local.set({user: user}, () => {
    chrome.runtime.sendMessage({ command: 'update-paid-status', user: user }).then(
      () => {},
      (err) => {console.error('update-paid-status failed', err);}
    );
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'get-user') {
    (async () => {
      let user = await extpay.getUser();
      sendResponse(user);
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
