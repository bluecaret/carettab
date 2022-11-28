// import { ExtPay } from "./lib/ExtPay";

// var extpay = ExtPay("carettab");
// extpay.startBackground();

// extpay.onPaid.addListener(user => {
//   console.log('User just paid or logged in with ExtPay.', user);
//   chrome.storage.sync.set({extpay: user}, () => {
//     chrome.runtime.sendMessage({ command: 'update-paid-status', user: user }).then(
//       () => {},
//       (err) => {console.log('update-paid-status failed', err);}
//     );
//   });
// });

// async function getExtPayUser() {
//   extpay.getUser().then((user) => {
//     // console.log('Found user data for extpay', user);
//     chrome.storage.sync.set({extpay: user});
//   }).catch((err) => {
//     console.log("%cError fetching extpay data", "color:red;", err);
//     chrome.storage.sync.set({extpay: {paid: false, paidAt: null, trialStartedAt: null}});
//   });
// }

chrome.runtime.onMessage.addListener((request) => {
  console.log('SW got message', request);
  if (request.command === 'get-weather') {
    console.log('got request to check weather');
    let currentWeather = getWeather(request.loc, request.days, request.lang);
    console.log('return weather', currentWeather);
    return Promise.resolve({response: currentWeather});
  }
  return false;
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
