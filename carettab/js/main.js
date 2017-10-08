// CaretTab by bluecaret
// http://bluecaret.com/project/carettab

// Variable naming convention:
// Starts with "s" = represents a specific setting
// Starts with "t" = represents toggling the setting

console.log("                                        "); 
console.log("## Welcome to CaretTab!"); 
console.log("## NEW TAB REPLACEMENT FOR GOOGLE CHROME"); 
console.log("## Created by BlueCaret - http://bluecaret.com/project/carettab"); 
console.log("                                        "); 

// Translate HTML via data-i18n attribute
var objects = document.getElementsByTagName('*'), i;
for(i = 0; i < objects.length; i++) {
  if (objects[i].dataset && objects[i].dataset.i18n) {
    objects[i].innerHTML = chrome.i18n.getMessage(objects[i].dataset.i18n);
  }
}

// @koala-append "_install_status.js"
// @koala-append "_load.js"
// @koala-append "_set_default.js"
// @koala-append "_actions.js"
// @koala-append "_functions.js"
// @koala-append "_run.js"
// @koala-append "_analytics.js"