import { ExtPay } from "/js/ExtPay.js";

// console.log('Service worker is running');

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

// Check whether new version is installed
if (typeof chrome.runtime.onInstalled  !== 'undefined') {
  chrome.runtime.onInstalled.addListener(function (details) {
    // Set caretTabStatus if existing, installed or updated.
    let status = "existing";
    let prevVersion = details.previousVersion ? details.previousVersion : '';
    let newVersion = '';
    let timestamp = new Date().toLocaleString();
    let clearBox = true;

    if (details.reason === "install"){
      status = "installed";
    } else if (details.reason === "update"){
      newVersion = chrome.runtime.getManifest().version;
      status = "updated";
      clearBox = false;
    }

    chrome.storage.local.set({
      caretTabStatus: status,
      caretTabPrevVersion: prevVersion,
      caretTabNewVersion: newVersion,
      updateTimestamp: timestamp,
      clearWhatsNewBox: clearBox
    });
  });
}

// Send user to uninstall page
chrome.runtime.setUninstallURL('https://www.carettab.com/thank-you');
