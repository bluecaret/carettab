// Check whether new version is installed
if(typeof chrome.runtime.onInstalled  !== 'undefined')
{
    chrome.runtime.onInstalled.addListener(function (details)
    {
        if(details.reason == "install"){
            chrome.storage.sync.set({'caretTabStatus':"installed"}, function() { if (!chrome.runtime.lastError) { console.log("saved caretTabStatus: installed"); }});
        }else if(details.reason == "update"){
            chrome.storage.sync.set({'caretTabStatus':"updated"}, function() { if (!chrome.runtime.lastError) { console.log("saved caretTabStatus: updated"); }});
        }else{
            chrome.storage.sync.set({'caretTabStatus':"existing"}, function() { if (!chrome.runtime.lastError) { console.log("saved caretTabStatus: existing"); }});
        }
    });
}
