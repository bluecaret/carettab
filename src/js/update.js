// Check whether new version is installed
if(typeof chrome.runtime.onInstalled  !== 'undefined')
{
  chrome.runtime.onInstalled.addListener(function (details)
  {
    // Set caretTabStatus if existing, intalled or updated.
    let status = "existing";
    if (details.reason === "install"){
      status = "installed";
    } else if (details.reason === "update"){
      status = "updated";
    }
    localStorage.setItem('caretTabStatus', status);

    if (details.reason === "update") {
      let newVersion = chrome.runtime.getManifest().version;

      localStorage.setItem('caretTabPrevVersion', details.previousVersion);
      localStorage.setItem('caretTabNewVersion', newVersion);

      // console.log(`Updated from ${details.previousVersion} to ${newVersion}.`);
    }
  });
}

// Send user to uninstall page
chrome.runtime.setUninstallURL('https://www.carettab.com/thank-you');
