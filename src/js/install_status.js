// ##############################################
// Check install status of CaretTab
// ##############################################

$(function() {
  var caretTabStatus = "";
  var sLoad = "";
  chrome.storage.sync.get(null, function(data) {
    // Check if extension was just installed or updated
    var caretTabStatus = data.caretTabStatus;
    console.log("^CaretTab - Status: " + caretTabStatus);
    if (caretTabStatus == "installed") {
      $("#installed").show();
    } else if (caretTabStatus == "updated") {
      $("#updated").show();
    }

    // Load settings or Set defaults if first time
    // If a new version requires user settings to be reset, change the sLoad number to the current version
    var sLoad = data.sLoad;
    console.log("^CaretTab - Reset Config If Less Than: v" + sLoad);
    if (sLoad == "1.2.0") {
      var loaded = true;
      loadSettings(caretTabStatus, sLoad, data, loaded);
    } else {
      var loaded = false;
      setDefaults(caretTabStatus, sLoad, loaded);
    }
  });
});