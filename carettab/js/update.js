// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        localStorage.setItem('caretTabStatus',"installed");
    }else if(details.reason == "update"){
        localStorage.setItem('caretTabStatus',"updated");
    }
});

