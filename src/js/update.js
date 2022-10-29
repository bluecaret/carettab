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
chrome.runtime.setUninstallURL('https://www.carettab.com/thank-you');

(function() {
  chrome.storage.local.get(['ctBackground'], function (data) {
    document.body.style.backgroundColor = data.ctBackground;
  });
});
