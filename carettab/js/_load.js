
var timezoneOptions = '\
    <option value="Pacific/Midway">(GMT -11:00) Midway Island, Samoa</option>\
    <option value="Pacific/Honolulu">(GMT -10:00) Hawaii</option>\
    <option value="America/Anchorage">(GMT -9:00) Alaska</option>\
    <option value="America/Los_Angeles">(GMT -8:00) Pacific Time (US &amp; Canada)</option>\
    <option value="America/Boise">(GMT -7:00) Mountain Time (US &amp; Canada)</option>\
    <option value="America/Chicago">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>\
    <option value="America/New_York">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>\
    <option value="America/Caracas">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>\
    <option value="Canada/Newfoundland">(GMT -3:30) Newfoundland</option>\
    <option value="America/Argentina/Buenos_Aires">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>\
    <option value="Atlantic/South_Georgia">(GMT -2:00) Mid-Atlantic</option>\
    <option value="Atlantic/Azores">(GMT -1:00 hour) Azores, Cape Verde Islands</option>\
    <option value="Europe/London">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>\
    <option value="Europe/Paris">(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris</option>\
    <option value="Europe/Kaliningrad">(GMT +2:00) Kaliningrad, South Africa</option>\
    <option value="Asia/Baghdad">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>\
    <option value="Asia/Tehran">(GMT +3:30) Tehran</option>\
    <option value="Asia/Muscat">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>\
    <option value="Asia/Kabul">(GMT +4:30) Kabul</option>\
    <option value="Asia/Karachi">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>\
    <option value="Asia/Calcutta">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>\
    <option value="Asia/Kathmandu">(GMT +5:45) Kathmandu</option>\
    <option value="Asia/Almaty">(GMT +6:00) Almaty, Dhaka, Colombo</option>\
    <option value="Asia/Bangkok">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>\
    <option value="Asia/Hong_Kong">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>\
    <option value="Asia/Tokyo">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>\
    <option value="Australia/Adelaide">(GMT +9:30) Adelaide, Darwin</option>\
    <option value="Pacific/Guam">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>\
    <option value="Asia/Magadan">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>\
    <option value="Pacific/Auckland">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>\
    ';

$(function() {
    $('.timezones').html(timezoneOptions);
});

// ##############################################
// Load settings from storage
// ##############################################

function loadSettings(caretTabStatus, sLoad, data, loaded) {
    console.log("^CaretTab - Existing, Load Settings");

    setVars();

    if (data.sAnimation != undefined) { sAnimation = data.sAnimation; } tAnimation(loaded);
    if (data.sPrimaryClock != undefined) { sPrimaryClock = data.sPrimaryClock; } tPrimaryClock(loaded); 
    if (data.sSeconds != undefined) { sSeconds = data.sSeconds; } tSeconds(loaded);
    if (data.sDimSeconds != undefined) { sDimSeconds = data.sDimSeconds; } tDimSeconds(loaded);
    if (data.sDimDelimiter != undefined) { sDimDelimiter = data.sDimDelimiter; } tDimDelimiter(loaded);
    if (data.sMeridiem != undefined) { sMeridiem = data.sMeridiem; } tMeridiem(loaded);
    if (data.sMilitary != undefined) { sMilitary = data.sMilitary; } tMilitary(loaded);
    if (data.sDelimiter != undefined) { sDelimiter = data.sDelimiter; } tDelimiter(loaded);
    if (data.sBlinking != undefined) { sBlinking = data.sBlinking; } tBlinking(loaded);
    if (data.sPrimaryClockTimezone != undefined) { sPrimaryClockTimezone = data.sPrimaryClockTimezone; } tPrimaryClockTimezone(sPrimaryClockTimezone, loaded);
    if (data.s2ndClock != undefined) { s2ndClock = data.s2ndClock; } t2ndClock(loaded);
    if (data.s2ndClockTimezone != undefined) { s2ndClockTimezone = data.s2ndClockTimezone; } t2ndClockTimezone(s2ndClockTimezone, loaded);
    if (data.s2ndClockLabel != undefined) { s2ndClockLabel = data.s2ndClockLabel; } t2ndClockLabel(s2ndClockLabel, loaded);
    if (data.s3rdClock != undefined) { s3rdClock = data.s3rdClock; } t3rdClock(loaded);
    if (data.s3rdClockTimezone != undefined) { s3rdClockTimezone = data.s3rdClockTimezone; } t3rdClockTimezone(s3rdClockTimezone, loaded);
    if (data.s3rdClockLabel != undefined) { s3rdClockLabel = data.s3rdClockLabel; } t3rdClockLabel(s3rdClockLabel, loaded);
    if (data.s4thClock != undefined) { s4thClock = data.s4thClock; } t4thClock(loaded);
    if (data.s4thClockTimezone != undefined) { s4thClockTimezone = data.s4thClockTimezone; } t4thClockTimezone(s4thClockTimezone, loaded);
    if (data.s4thClockLabel != undefined) { s4thClockLabel = data.s4thClockLabel; } t4thClockLabel(s4thClockLabel, loaded);
    if (data.sDate != undefined) { sDate = data.sDate; } tDate(loaded);
    if (data.sDay != undefined) { sDay = data.sDay; } tDay(loaded);
    if (data.sYear != undefined) { sYear = data.sYear; } tYear(loaded);
    if (data.sShortDate != undefined) { sShortDate = data.sShortDate; } tShortDate(loaded);
    if (data.sDateFormat != undefined) { sDateFormat = data.sDateFormat; } tDateFormat(sDateFormat, loaded);
    if (data.sWeek != undefined) { sWeek = data.sWeek; } tWeek(loaded);
    if (data.sBackground != undefined) { sBackground = data.sBackground; } tBackground(sBackground, loaded);
    if (data.sForeground != undefined) { sForeground = data.sForeground; } tForeground(sForeground, loaded);
    if (data.s1stLink != undefined) { s1stLink = data.s1stLink; } t1stLink(loaded);
    if (data.s1stLinkUrl != undefined) { s1stLinkUrl = data.s1stLinkUrl; } t1stLinkUrl(s1stLinkUrl, loaded);
    if (data.s1stLinkLabel != undefined) { s1stLinkLabel = data.s1stLinkLabel; } t1stLinkLabel(s1stLinkLabel, loaded);
    if (data.s2ndLink != undefined) { s2ndLink = data.s2ndLink; } t2ndLink(loaded);
    if (data.s2ndLinkUrl != undefined) { s2ndLinkUrl = data.s2ndLinkUrl; } t2ndLinkUrl(s2ndLinkUrl, loaded);
    if (data.s2ndLinkLabel != undefined) { s2ndLinkLabel = data.s2ndLinkLabel; } t2ndLinkLabel(s2ndLinkLabel, loaded);
    if (data.s3rdLink != undefined) { s3rdLink = data.s3rdLink; } t3rdLink(loaded);
    if (data.s3rdLinkUrl != undefined) { s3rdLinkUrl = data.s3rdLinkUrl; } t3rdLinkUrl(s3rdLinkUrl, loaded);
    if (data.s3rdLinkLabel != undefined) { s3rdLinkLabel = data.s3rdLinkLabel; } t3rdLinkLabel(s3rdLinkLabel, loaded);
    if (data.s4thLink != undefined) { s4thLink = data.s4thLink; } t4thLink(loaded);
    if (data.s4thLinkUrl != undefined) { s4thLinkUrl = data.s4thLinkUrl; } t4thLinkUrl(s4thLinkUrl, loaded);
    if (data.s4thLinkLabel != undefined) { s4thLinkLabel = data.s4thLinkLabel; } t4thLinkLabel(s4thLinkLabel, loaded);
    if (data.s5thLink != undefined) { s5thLink = data.s5thLink; } t5thLink(loaded);
    if (data.s5thLinkUrl != undefined) { s5thLinkUrl = data.s5thLinkUrl; } t5thLinkUrl(s5thLinkUrl, loaded);
    if (data.s5thLinkLabel != undefined) { s5thLinkLabel = data.s5thLinkLabel; } t5thLinkLabel(s5thLinkLabel, loaded);
    if (data.s6thLink != undefined) { s6thLink = data.s6thLink; } t6thLink(loaded);
    if (data.s6thLinkUrl != undefined) { s6thLinkUrl = data.s6thLinkUrl; } t6thLinkUrl(s6thLinkUrl, loaded);
    if (data.s6thLinkLabel != undefined) { s6thLinkLabel = data.s6thLinkLabel; } t6thLinkLabel(s6thLinkLabel, loaded);
    if (data.sTabTitle != undefined) { sTabTitle = data.sTabTitle; } tTabTitle(sTabTitle, loaded);
    if (data.sTabTitleCustomMessage != undefined) { sTabTitleCustomMessage = data.sTabTitleCustomMessage; } tTabTitleCustomMessage(sTabTitleCustomMessage, loaded);
    if (data.sCustomMessage != undefined) { sCustomMessage = data.sCustomMessage; } tCustomMessage(loaded);
    if (data.sCustomMessageText != undefined) { sCustomMessageText = data.sCustomMessageText; } tCustomMessageText(sCustomMessageText, loaded);
    if (data.sSearch != undefined) { sSearch = data.sSearch; } tSearch(loaded);
    if (data.sEngine != undefined) { sEngine = data.sEngine; } tEngine(sEngine, loaded);
    if (data.sScale != undefined) { sScale = data.sScale; } tScale(loaded);
    if (data.sBrackets != undefined) { sBrackets = data.sBrackets; } tBrackets(loaded);
    if (data.sDimBrackets != undefined) { sDimBrackets = data.sDimBrackets; } tDimBrackets(loaded);
    if (data.sBracketStyle != undefined) { sBracketStyle = data.sBracketStyle; } tBracketStyle(loaded);
    if (data.sDateDelimiter != undefined) { sDateDelimiter = data.sDateDelimiter; } tDateDelimiter(loaded);
    if (data.sWeekLabel != undefined) { sWeekLabel = data.sWeekLabel; } tWeekLabel(loaded);
    if (data.sFont != undefined) { sFont = data.sFont; } tFont(loaded);
    if (data.sHideSettingsToggle != undefined) { sHideSettingsToggle = data.sHideSettingsToggle; } tHideSettingsToggle(loaded);
    if (data.sAnalog != undefined) { sAnalog = data.sAnalog; } tAnalog(loaded);

}

