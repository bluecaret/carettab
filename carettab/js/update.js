// Check whether new version is installed
if(typeof chrome.runtime.onInstalled  !== 'undefined')
{
    chrome.runtime.onInstalled.addListener(function (details)
    {
        if(details.reason == "install"){
            store.set('caretTabStatus',"installed");
        }else if(details.reason == "update"){
            store.set('caretTabStatus',"updated");
        }
    });
}
