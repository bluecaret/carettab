// ##############################################
// Set default settings
// ##############################################

function setVars() {
  updateAllTimer = null;
  sPrimaryClock = "on";
  sSeconds = "on";
  sDimSeconds = "off";
  sDimDelimiter = "on";
  sMeridiem = "on";
  sMilitary = "off";
  sDelimiter = "on";
  sBlinking = "off";
  sPrimaryClockTimezone = moment.tz.guess();
  s2ndClock = "off";
  s2ndClockTimezone = moment.tz.guess();
  s2ndClockLabel = "";
  s3rdClock = "off";
  s3rdClockTimezone = moment.tz.guess();
  s3rdClockLabel = "";
  s4thClock = "off";
  s4thClockTimezone = moment.tz.guess();
  s4thClockLabel = "";
  sDate = "on";
  sDay = "on";
  sYear = "on";
  sShortDate = "off";
  sDateFormat = "middle";
  sWeek = "off";
  sBackground = "#FFFFFF";
  sForeground = "#000000";
  sTabTitle = "tab-time";
  sTabTitleCustomMessage = "Welcome to the World Wide Web!";
  sCustomMessage = "off";
  sCustomMessageText = "Welcome to the World Wide Web!";
  sSearch = "on";
  sEngine = "google";
  sAnimation = "on";
  sScale = "75";
  sBrackets = "on";
  sDimBrackets = "on";
  sBracketStyle = "curly";
  sDateDelimiter = "slash";
  sWeekLabel = "week";
  sFont = "exo-2";
  sHideSettingsToggle = "off";
  sAnalog = "off";
}

function setDefaults(caretTabStatus, sLoad, loaded) {
  console.log("^CaretTab - First time/Reset Config, Set Default Settings");

  chrome.storage.sync.clear(function() {
    if (!chrome.runtime.lastError) {
      console.log("^CaretTab - Prepare for defaults, cleared all settings");
    }
  });
  chrome.storage.sync.set({
    "caretTabStatus": caretTabStatus
  }, function() {
    if (!chrome.runtime.lastError) {
      console.log("^CaretTab - SAVED caretTabStatus: " + caretTabStatus);
    }
  });
  chrome.storage.sync.set({
    "sLoad": "1.2.0"
  }, function() {
    if (!chrome.runtime.lastError) {
      console.log("^CaretTab - SAVED sLoad: 1.2.0");
    }
  });

  setVars();

  tAnimation();
  tPrimaryClock();
  tSeconds();
  tDimSeconds();
  tDimDelimiter();
  tMeridiem();
  tMilitary();
  tDelimiter();
  tBlinking();
  tPrimaryClockTimezone(sPrimaryClockTimezone);
  t2ndClock();
  t2ndClockTimezone(s2ndClockTimezone);
  t2ndClockLabel(s2ndClockLabel);
  t3rdClock();
  t3rdClockTimezone(s3rdClockTimezone);
  t3rdClockLabel(s3rdClockLabel);
  t4thClock();
  t4thClockTimezone(s4thClockTimezone);
  t4thClockLabel(s4thClockLabel);
  tDate();
  tDay();
  tYear();
  tShortDate();
  tDateFormat(sDateFormat);
  tWeek();
  tBackground(sBackground);
  tForeground(sForeground);
  tTabTitle(sTabTitle);
  tTabTitleCustomMessage(sTabTitleCustomMessage);
  tCustomMessage();
  tCustomMessageText(sCustomMessageText);
  tSearch();
  tEngine(sEngine);
  tScale();
  tBrackets();
  tDimBrackets();
  tBracketStyle();
  tDateDelimiter();
  tWeekLabel();
  tFont();
  tHideSettingsToggle();
  tAnalog();

  updateAll();
}