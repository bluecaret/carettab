// CaretTab by bluecaret
// http://bluecaret.com/project/carettab

// Variable naming convention:
// Starts with "s" = represents a specific setting
// Starts with "t" = represents toggling the setting

console.log("Welcome to CaretTab!"); 
console.log("Created by BlueCaret - http://bluecaret.com/project/carettab"); 
console.log("                                        "); 
console.log("   #########   #########   #########    "); 
console.log("   ##     ##############################"); 
console.log("   ##                                 ##"); 
console.log("   ##              $$$$               ##"); 
console.log("   ##              $$$$               ##"); 
console.log("   ##          $$$$    $$$$           ##"); 
console.log("   ##          $$$$    $$$$           ##"); 
console.log("   ##      $$$$            $$$$       ##"); 
console.log("   ##      $$$$            $$$$       ##"); 
console.log("   ##                                 ##"); 
console.log("   #####################################"); 
console.log("             C a r e t T a b            "); 
console.log("   NEW TAB REPLACEMENT FOR GOOGLE CHROME"); 
console.log("                                        "); 

$(function() {
	var caretTabStatus = "";
	var sLoad = "";
	chrome.storage.sync.get(null, function(data) { 
		// Check if extension was just installed or updated
		var caretTabStatus = data.caretTabStatus; 
		console.log("^CaretTab - Status: "+caretTabStatus); 
		if (caretTabStatus == 'installed') { 
			$("#installed").show(); 
		} else if (caretTabStatus == 'updated') { 
			$("#updated").show(); 
		}

		// Load settings or Set defaults if first time
		// If a new version requires user settings to be reset, change the sLoad number to the current version
		var sLoad = data.sLoad;
		console.log("^CaretTab - Reset Config If Less Than: v"+sLoad);
		if (sLoad == "1.2.0") { 
			var loaded = true;
			loadSettings(caretTabStatus, sLoad, data, loaded); 
		} else { 
			var loaded = false;
			setDefaults(caretTabStatus, sLoad, loaded); 
		}
	});
});

// ##############################################
// Load settings from storage
// ##############################################

function loadSettings(caretTabStatus, sLoad, data, loaded) {
	console.log("^CaretTab - Existing, Load Settings");

	setVars();

	if (data.sPrimaryClock != undefined) { sPrimaryClock = data.sPrimaryClock; } tPrimaryClock(loaded); 
	if (data.sSeconds != undefined) { sSeconds = data.sSeconds; } tSeconds(loaded);
	if (data.sMeridiem != undefined) { sMeridiem = data.sMeridiem; } tMeridiem(loaded);
	if (data.sMilitary != undefined) { sMilitary = data.sMilitary; } tMilitary(loaded);
	if (data.sDelimiter != undefined) { sDelimiter = data.sDelimiter; } tDelimiter(loaded);
	if (data.sBlinking != undefined) { sBlinking = data.sBlinking; } tBlinking(loaded);
	if (data.sBrackets != undefined) { sBrackets = data.sBrackets; } tBrackets(loaded);
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
	if (data.sDateFormat != undefined) { sDateFormat = data.sDateFormat; } tDateFormat(loaded);
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
	if (data.sTabTitle != undefined) { sTabTitle = data.sTabTitle; } tTabTitle(loaded);
	if (data.sTabTitleCustomMessage != undefined) { sTabTitleCustomMessage = data.sTabTitleCustomMessage; } tTabTitleCustomMessage(sTabTitleCustomMessage, loaded);
	if (data.sCustomMessage != undefined) { sCustomMessage = data.sCustomMessage; } tCustomMessage(loaded);
	if (data.sCustomMessageText != undefined) { sCustomMessageText = data.sCustomMessageText; } tCustomMessageText(sCustomMessageText, loaded);
	if (data.sSearch != undefined) { sSearch = data.sSearch; } tSearch(loaded);
	if (data.sEngine != undefined) { sEngine = data.sEngine; } tEngine(loaded);
	if (data.sAnimation != undefined) { sAnimation = data.sAnimation; } tAnimation(loaded);
}

// ##############################################
// Set default settings
// ##############################################

function setVars() {
	sPrimaryClock = 'on'; 
	sSeconds = 'on'; 
	sMeridiem = 'on'; 
	sMilitary = 'off'; 
	sDelimiter = 'on'; 
	sBlinking = 'off'; 
	sBrackets = 'on'; 
	s2ndClock = 'off'; 
	s2ndClockTimezone = moment.tz.guess(); 
	s2ndClockLabel = 'Secondary Clock'; 
	s3rdClock = 'off'; 
	s3rdClockTimezone = moment.tz.guess(); 
	s3rdClockLabel = 'Tertiary Clock'; 
	s4thClock = 'off'; 
	s4thClockTimezone = moment.tz.guess(); 
	s4thClockLabel = 'Quaternary Clock'; 
	sDate = 'on'; 
	sDay = 'on'; 
	sYear = 'on'; 
	sShortDate = 'off'; 
	sDateFormat = 'middle'; 
	sBackground = '#FFFFFF'; 
	sForeground = '#000000'; 
	s1stLink = 'off'; 
	s1stLinkUrl = ''; 
	s1stLinkLabel = ''; 
	s2ndLink = 'off'; 
	s2ndLinkUrl = ''; 
	s2ndLinkLabel = ''; 
	s3rdLink = 'off'; 
	s3rdLinkUrl = ''; 
	s3rdLinkLabel = ''; 
	s4thLink = 'off'; 
	s4thLinkUrl = ''; 
	s4thLinkLabel = ''; 
	s5thLink = 'off'; 
	s5thLinkUrl = ''; 
	s5thLinkLabel = ''; 
	s6thLink = 'off'; 
	s6thLinkUrl = ''; 
	s6thLinkLabel = ''; 
	sTabTitle = 'tab-time'; 
	sTabTitleCustomMessage = 'New Tab'; 
	sCustomMessage = ''; 
	sCustomMessageText = ''; 
	sSearch = 'on'; 
	sEngine = 'google'; 
	sAnimation = 'on';
}

function setDefaults(caretTabStatus, sLoad, loaded) {
	console.log("^CaretTab - First time/Reset Config, Set Default Settings");

    chrome.storage.sync.clear(function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - Prepare for defaults, cleared all settings"); }}); 
    chrome.storage.sync.set({'caretTabStatus':caretTabStatus}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED caretTabStatus: "+caretTabStatus); } }); 
    chrome.storage.sync.set({'sLoad':'1.2.0'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sLoad: 1.0.0"); } }); 

    setVars();

    tPrimaryClock(); tSeconds(); tMeridiem(); tMilitary(); tDelimiter(); tBlinking(); tBrackets(); t2ndClock(); t2ndClockTimezone(s2ndClockTimezone); t2ndClockLabel(s2ndClockLabel); t3rdClock(); t3rdClockTimezone(s3rdClockTimezone); t3rdClockLabel(s3rdClockLabel); t4thClock(); t4thClockTimezone(s4thClockTimezone); t4thClockLabel(s4thClockLabel); tDate(); tDay(); tYear(); tShortDate(); tDateFormat(); tBackground(sBackground); tForeground(sForeground); t1stLink(); t1stLinkUrl(s1stLinkUrl); t1stLinkLabel(s1stLinkLabel); t2ndLink(); t2ndLinkUrl(s2ndLinkUrl); t2ndLinkLabel(s2ndLinkLabel); t3rdLink(); t3rdLinkUrl(s3rdLinkUrl); t3rdLinkLabel(s3rdLinkLabel); t4thLink(); t4thLinkUrl(s4thLinkUrl); t4thLinkLabel(s4thLinkLabel); t5thLink(); t5thLinkUrl(s5thLinkUrl); t5thLinkLabel(s5thLinkLabel); t6thLink(); t6thLinkUrl(s6thLinkUrl); t6thLinkLabel(s6thLinkLabel); tTabTitle(); tTabTitleCustomMessage(sTabTitleCustomMessage); tCustomMessage(); tCustomMessageText(sCustomMessageText); tSearch(); tEngine(); tAnimation();
}

// ##############################################
// Actions
// ##############################################

$('#set-clock1').click(function() { 
	if ($('#set-clock1').is(':checked')) { sPrimaryClock = 'on'; tPrimaryClock(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sPrimaryClock on']); } 
	else { sPrimaryClock = 'off'; tPrimaryClock(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sPrimaryClock off']); } });
$('#set-seconds').click(function() { 
	if ($('#set-seconds').is(':checked')) { sSeconds = 'on'; tSeconds(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sSeconds on']); } 
	else { sSeconds = 'off'; tSeconds(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sSeconds off']); } });
$('#set-meridiem').click(function() { 
	if ($('#set-meridiem').is(':checked')) { sMeridiem = 'on'; tMeridiem(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sMeridiem on']); } 
	else { sMeridiem = 'off'; tMeridiem(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sMeridiem off']); } });
$('#set-military').click(function() { 
	if ($('#set-military').is(':checked')) { sMilitary = 'on'; tMilitary(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sMilitary on']); } 
	else { sMilitary = 'off'; tMilitary(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sMilitary off']); } });
$('#set-delimiter').click(function() { 
	if ($('#set-delimiter').is(':checked')) { sDelimiter = 'on'; tDelimiter(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sDelimiter on']); } 
	else { sDelimiter = 'off'; tDelimiter(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sDelimiter off']); } });
$('#set-blinking').click(function() { 
	if ($('#set-blinking').is(':checked')) { sBlinking = 'on'; tBlinking(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sBlinking on']); } 
	else { sBlinking = 'off'; tBlinking(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sBlinking off']); } });
$('#set-brackets').click(function() { 
	if ($('#set-brackets').is(':checked')) { sBrackets = 'on'; tBrackets(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sBrackets on']); } 
	else { sBrackets = 'off'; tBrackets(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sBrackets off']); } });
$('#set-time2').click(function() { 
	if ($('#set-time2').is(':checked')) { s2ndClock = 'on'; t2ndClock(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's2ndClock on']); } 
	else { s2ndClock = 'off'; t2ndClock(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's2ndClock off']); } });
$('#set-time2-zone').change(function() { 
	s2ndClockTimezone = $(this).val(); t2ndClockTimezone(s2ndClockTimezone); _gaq.push(['_trackEvent', 'Settings', 'Select', 's2ndClockTimezone']); });
$('#set-time2-label').change(function() { 
	s2ndClockLabel = $(this).val(); t2ndClockLabel(s2ndClockLabel); _gaq.push(['_trackEvent', 'Settings', 'Type', 's2ndClockLabel']); });
$('#set-time3').click(function() { 
	if ($('#set-time3').is(':checked')) { s3rdClock = 'on'; t3rdClock(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's3rdClock on']); } 
	else { s3rdClock = 'off'; t3rdClock(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's3rdClock off']); } });
$('#set-time3-zone').change(function() { 
	s3rdClockTimezone = $(this).val(); t3rdClockTimezone(s3rdClockTimezone); _gaq.push(['_trackEvent', 'Settings', 'Select', 's3rdClockTimezone']); });
$('#set-time3-label').change(function() { 
	s3rdClockLabel = $(this).val(); t3rdClockLabel(s3rdClockLabel); _gaq.push(['_trackEvent', 'Settings', 'Type', 's3rdClockLabel']); });
$('#set-time4').click(function() { 
	if ($('#set-time4').is(':checked')) { s4thClock = 'on'; t4thClock(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's4thClock on']); } 
	else { s4thClock = 'off'; t4thClock(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's4thClock off']); } });
$('#set-time4-zone').change(function() { 
	s4thClockTimezone = $(this).val(); t4thClockTimezone(s4thClockTimezone); _gaq.push(['_trackEvent', 'Settings', 'Select', 's4thClockTimezone']); });
$('#set-time4-label').change(function() { 
	s4thClockLabel = $(this).val(); t4thClockLabel(s4thClockLabel); _gaq.push(['_trackEvent', 'Settings', 'Type', 's4thClockLabel']); });
$('#set-date').click(function() { 
	if ($('#set-date').is(':checked')) { sDate = 'on'; tDate(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sDate on']); } 
	else { sDate = 'off'; tDate(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sDate off']); } });
$('#set-day').click(function() { 
	if ($('#set-day').is(':checked')) { sDay = 'on'; tDay(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sDay on']); } 
	else { sDay = 'off'; tDay(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sDay off']); } });
$('#set-year').click(function() { 
	if ($('#set-year').is(':checked')) { sYear = 'on'; tYear(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sYear on']); } 
	else { sYear = 'off'; tYear(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sYear off']); } });
$('#set-shortdate').click(function() { 
	if ($('#set-shortdate').is(':checked')) { sShortDate = 'on'; tShortDate(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sShortDate on']); } 
	else { sShortDate = 'off'; tShortDate(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sShortDate off']); } });
$('input[name="set-dateformat"]').click(function() { 
	sDateFormat = $(this).val(); tDateFormat(); _gaq.push(['_trackEvent', 'Settings', 'Radio', 'sDateFormat '+sDateFormat]); });
$('#set-background').change(function() { 
	sBackground = $(this).val(); tBackground(sBackground); _gaq.push(['_trackEvent', 'sBackground', 'Type', sBackground]); });
$('#set-foreground').change(function() { 
	sForeground = $(this).val(); tForeground(sForeground); _gaq.push(['_trackEvent', 'sForeground', 'Type', sForeground]); });
$('#set-link1').click(function() { 
	if ($('#set-link1').is(':checked')) { s1stLink = 'on'; t1stLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's1stLink on']); } 
	else { s1stLink = 'off'; t1stLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's1stLink off']); } });
$('#set-link1-url').change(function() { 
	s1stLinkUrl = $(this).val(); t1stLinkUrl(s1stLinkUrl); _gaq.push(['_trackEvent', 'Settings', 'Type', 's1stLinkUrl']); });
$('#set-link1-label').change(function() { 
	s1stLinkLabel = $(this).val(); t1stLinkLabel(s1stLinkLabel); _gaq.push(['_trackEvent', 'Settings', 'Type', 's1stLinkLabel']); });
$('#set-link2').click(function() { 
	if ($('#set-link2').is(':checked')) { s2ndLink = 'on'; t2ndLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's2ndLink on']); } 
	else { s2ndLink = 'off'; t2ndLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's2ndLink off']); } });
$('#set-link2-url').change(function() { 
	s2ndLinkUrl = $(this).val(); t2ndLinkUrl(s2ndLinkUrl); _gaq.push(['_trackEvent', 'Settings', 'Type', 's2ndLinkUrl']); });
$('#set-link2-label').change(function() { 
	s2ndLinkLabel = $(this).val(); t2ndLinkLabel(s2ndLinkLabel); _gaq.push(['_trackEvent', 'Settings', 'Type', 's2ndLinkLabel']); });
$('#set-link3').click(function() { 
	if ($('#set-link3').is(':checked')) { s3rdLink = 'on'; t3rdLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's3rdLink on']); } 
	else { s3rdLink = 'off'; t3rdLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's3rdLink off']); } });
$('#set-link3-url').change(function() { 
	s3rdLinkUrl = $(this).val(); t3rdLinkUrl(s3rdLinkUrl); _gaq.push(['_trackEvent', 'Settings', 'Type', 's3rdLinkUrl']); });
$('#set-link3-label').change(function() { 
	s3rdLinkLabel = $(this).val(); t3rdLinkLabel(s3rdLinkLabel); _gaq.push(['_trackEvent', 'Settings', 'Type', 's3rdLinkLabel']); });
$('#set-link4').click(function() { 
	if ($('#set-link4').is(':checked')) { s4thLink = 'on'; t4thLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's4thLink on']); } 
	else { s4thLink = 'off'; t4thLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's4thLink off']); } });
$('#set-link4-url').change(function() { 
	s4thLinkUrl = $(this).val(); t4thLinkUrl(s4thLinkUrl); _gaq.push(['_trackEvent', 'Settings', 'Type', 's4thLinkUrl']); });
$('#set-link4-label').change(function() { 
	s4thLinkLabel = $(this).val(); t4thLinkLabel(s4thLinkLabel); _gaq.push(['_trackEvent', 'Settings', 'Type', 's4thLinkLabel']); });
$('#set-link5').click(function() { 
	if ($('#set-link5').is(':checked')) { s5thLink = 'on'; t5thLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's5thLink on']); } 
	else { s5thLink = 'off'; t5thLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's5thLink off']); } });
$('#set-link5-url').change(function() { 
	s5thLinkUrl = $(this).val(); t5thLinkUrl(s5thLinkUrl); _gaq.push(['_trackEvent', 'Settings', 'Type', 's5thLinkUrl']); });
$('#set-link5-label').change(function() { 
	s5thLinkLabel = $(this).val(); t5thLinkLabel(s5thLinkLabel); _gaq.push(['_trackEvent', 'Settings', 'Type', 's5thLinkLabel']); });
$('#set-link6').click(function() { 
	if ($('#set-link6').is(':checked')) { s6thLink = 'on'; t6thLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's6thLink on']); } 
	else { s6thLink = 'off'; t6thLink(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 's6thLink off']); } });
$('#set-link6-url').change(function() { 
	s6thLinkUrl = $(this).val(); t6thLinkUrl(s6thLinkUrl); _gaq.push(['_trackEvent', 'Settings', 'Type', 's6thLinkUrl']); });
$('#set-link6-label').change(function() { 
	s6thLinkLabel = $(this).val(); t6thLinkLabel(s6thLinkLabel); _gaq.push(['_trackEvent', 'Settings', 'Type', 's6thLinkLabel']); });
$('input[name="set-tab-title"]').click(function() { 
	sTabTitle = $(this).val(); tTabTitle(); _gaq.push(['_trackEvent', 'Settings', 'Radio', 'sTabTitle '+sTabTitle]); });
$('#set-tab-custom-message').change(function() { 
	sTabTitleCustomMessage = $(this).val(); tTabTitleCustomMessage(sTabTitleCustomMessage); _gaq.push(['_trackEvent', 'Settings', 'Type', 'sTabTitleCustomMessage']); });
$('#set-message').click(function() { 
	if ($('#set-message').is(':checked')) { sCustomMessage = 'on'; tCustomMessage(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sCustomMessage on']); } 
	else { sCustomMessage = 'off'; tCustomMessage(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sCustomMessage off']); } });
$('#set-message-text').change(function() { 
	sCustomMessageText = $(this).val(); tCustomMessageText(sCustomMessageText); _gaq.push(['_trackEvent', 'Settings', 'Type', 'sCustomMessageText']); });
$('#set-search').click(function() { 
	if ($('#set-search').is(':checked')) { sSearch = 'on'; tSearch(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sSearch on']); } 
	else { sSearch = 'off'; tSearch(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sSearch off']); } });
$('input[name="set-engine"]').click(function() { 
	sEngine = $(this).val(); tEngine(); _gaq.push(['_trackEvent', 'Settings', 'Radio', 'sEngine '+sEngine]); });
$('#set-animation').click(function() { 
	if ($('#set-animation').is(':checked')) { sAnimation = 'on'; tAnimation(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sAnimation on']); } 
	else { sAnimation = 'off'; tAnimation(); _gaq.push(['_trackEvent', 'Settings', 'Toggle', 'sAnimation off']); } });

// CLick theme
	$('#theme01').click(function() {
		sBackground = '#FFFFFF'; sForeground = '#000000'; 
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme02').click(function() {
		sBackground = '#d6d6d6'; sForeground = '#565656'; 
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme03').click(function() {
		sBackground = '#A6AAB2'; sForeground = '#373a3d'; 
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme04').click(function() {
		sBackground = '#5b6677'; sForeground = '#bdc2c8'; 
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme05').click(function() {
		sBackground = '#313840'; sForeground = '#acafb2'; 
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme06').click(function() {
		sBackground = '#1f2327'; sForeground = '#a5a7a8'; 
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme07').click(function() {
		sBackground = '#000000'; sForeground = '#FFFFFF'; 
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme08').click(function() {
		sBackground = '#3FA9F5'; sForeground = '#FFFFFF'; 
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme09').click(function() {
		sBackground = '#ff8f7e'; sForeground = '#663932'; 
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme10').click(function() {
		sBackground = '#cc3e28'; sForeground = '#ebb1a9'; 
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme11').click(function() {
		sBackground = '#7f2719'; sForeground = '#cca8a3';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme12').click(function() {
		sBackground = '#70adff'; sForeground = '#2d4566';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme13').click(function() {
		sBackground = '#1c68cc'; sForeground = '#a4c2eb';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme14').click(function() {
		sBackground = '#12417f'; sForeground = '#a0b3cc';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme15').click(function() {
		sBackground = '#FFFFFF'; sForeground = '#3FA9F5';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme16').click(function() {
		sBackground = '#d2ffbf'; sForeground = '#54664c';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme17').click(function() {
		sBackground = '#7dcc5c'; sForeground = '#325225';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme18').click(function() {
		sBackground = '#4e7f39'; sForeground = '#b8ccaf';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme19').click(function() {
		sBackground = '#d08eff'; sForeground = '#533966';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme20').click(function() {
		sBackground = '#a672cc'; sForeground = '#422d52';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme21').click(function() {
		sBackground = '#68477f'; sForeground = '#c2b5cc';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme22').click(function() {
		sBackground = '#F646C0'; sForeground = '#70127C';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme23').click(function() {
		sBackground = '#6F8ACE'; sForeground = '#FDBDFF';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme24').click(function() {
		sBackground = '#6E1F7F'; sForeground = '#FF970B';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
	});
	$('#theme25').click(function() {
		sBackground = '#F4742B'; sForeground = '#760909';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
		$(this).blur();
	});
	$('#theme26').click(function() {
		sBackground = '#DFF490'; sForeground = '#4A5A48';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
		$(this).blur();
	});
	$('#theme27').click(function() {
		sBackground = '#A0F4CD'; sForeground = '#403F94';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
		$(this).blur();
	});
	$('#theme28').click(function() {
		sBackground = '#F4A2E5'; sForeground = '#D80090';
		document.getElementById('set-background').jscolor.fromString(sBackground);document.getElementById('set-foreground').jscolor.fromString(sForeground);
		tBackground(sBackground); tForeground(sForeground);
		$(this).blur();
	});

// Change tabs in Settings panel
$('#settings-tabs li').click(function(){
	var tab_id = $(this).attr('data-tab');

	$('#settings-tabs li').removeClass('active');
	$('.settings-content').removeClass('active');

	$(this).addClass('active');
	$("#"+tab_id).addClass('active');
});

// Open settings panel
$('#settings-toggle').click(function() {
	$('#settings-toggle').blur();
	$('#settings').toggleClass("active");
	$('.carettab-status').fadeOut();
	chrome.storage.sync.set({'caretTabStatus':"existing"}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - Set Status: existing"); }});
});

// Close settings panel via close button
$('#close-settings').click(function() {
	$('#settings').toggleClass("active");
});

// Close status message via close button
$('.status-x').click(function() {
	$('.carettab-status').fadeOut();
	chrome.storage.sync.set({'caretTabStatus':"existing"}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - Set Status: existing"); }});
});

// Close settings panel via clicking outside menu
$(document).mousedown(function (e) {
    var container = $("#settings");
    if (container.hasClass("active")) {
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	        container.removeClass("active");
	        $('#content').removeClass("blur");
	    }
    }
});

// Reset Defaults
$('#reset').click(function() {
	var val = confirm('Are you sure you want to reset all settings back to default?');
	if (val == true) {
		setDefaults();
	}
});

// ##############################################
// Settings Functions
// ##############################################
function tPrimaryClock(loaded) {
	if (sPrimaryClock == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sPrimaryClock':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sPrimaryClock: on"); }}); }
		$('html').addClass('on-clock1');
		$('#set-clock1').attr('Checked','Checked');
        updateTime();
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sPrimaryClock':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sPrimaryClock: off"); }}); }
		$('html').removeClass('on-clock1');
		$('#set-clock1').removeAttr('Checked');
	}
}

function tSeconds(loaded) {
	if (sSeconds == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sSeconds':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sSeconds: on"); }}); }
		$('html').addClass('on-seconds');
		$('#set-seconds').attr('Checked','Checked');
        updateTime();
		if (sTabTitle == "tab-time") { updateTabTitle(); }
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sSeconds':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sSeconds: off"); }}); }
		$('html').removeClass('on-seconds');
		$('#set-seconds').removeAttr('Checked');
		if (sTabTitle == "tab-time") { updateTabTitle(); }
	}
}

function tMeridiem(loaded) {
	if (sMeridiem == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sMeridiem':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sMeridiem: on"); }}); }
		$('html').addClass('on-meridiem');
		$('#set-meridiem').attr('Checked','Checked');
		if (sTabTitle == "tab-time") { updateTabTitle(); }
        updateTime();
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sMeridiem':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sMeridiem: off"); }}); }
		$('html').removeClass('on-meridiem');
		$('#set-meridiem').removeAttr('Checked');
		if (sTabTitle == "tab-time") { updateTabTitle(); }
	}
}

function tMilitary(loaded) {
	if (sMilitary == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sMilitary':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sMilitary: on"); }}); }
		$('html').addClass('on-military');
		$('#set-military').attr('Checked','Checked');
        updateTime();
        updateAdditionalClocks();
		if (sTabTitle == "tab-time") { updateTabTitle(); }
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sMilitary':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sMilitary: off"); }}); }
		$('html').removeClass('on-military');
		$('#set-military').removeAttr('Checked');
        updateTime();
        updateAdditionalClocks();
		if (sTabTitle == "tab-time") { updateTabTitle(); }
	}
}

function tDelimiter(loaded) {
	if (sDelimiter == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sDelimiter':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sDelimiter: on"); }}); }
		$('html').addClass('on-delimiter');
		$('#set-delimiter').attr('Checked','Checked');
        var delimiter = $('.clock1 .delimiter');
        $(delimiter).css({'opacity':'0.5'});
        updateTime();
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sDelimiter':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sDelimiter: off"); }}); }
		$('html').removeClass('on-delimiter');
		$('#set-delimiter').removeAttr('Checked');
        var delimiter = $('.clock1 .delimiter');
        $(delimiter).css({'opacity':'0'});
	}
}

function tBlinking(loaded) {
	if (sBlinking == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sBlinking':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sBlinking: on"); }}); }
		$('html').addClass('on-blinking');
		$('#set-blinking').attr('Checked','Checked');
        updateTime();
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sBlinking':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sBlinking: off"); }}); }
		$('html').removeClass('on-blinking');
		$('#set-blinking').removeAttr('Checked');
        var delimiter = $('.clock1 .delimiter');
        if (sDelimiter == 'on') { $(delimiter).css({'opacity':'0.5'}); }
	}
}

function tBrackets(loaded) {
	if (sBrackets == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sBrackets':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sBrackets: on"); }}); }
		$('html').addClass('on-brackets');
		$('#set-brackets').attr('Checked','Checked');
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sBrackets':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sBrackets: off"); }}); }
		$('html').removeClass('on-brackets');
		$('#set-brackets').removeAttr('Checked');
	}
}

function t2ndClock(loaded) {
	if (s2ndClock == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'s2ndClock':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s2ndClock: on"); }}); }
		$('html').addClass('on-clock2');
		$('#set-time2').attr('Checked','Checked');
        updateAdditionalClocks();
	} else {
		if(loaded != true) { chrome.storage.sync.set({'s2ndClock':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s2ndClock: off"); }}); }
		$('html').removeClass('on-clock2');
		$('#set-time2').removeAttr('Checked');
	}
}

function t2ndClockTimezone(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s2ndClockTimezone':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s2ndClockTimezone: "+value); }}); }
	$('#set-time2-zone').val(value);
    updateAdditionalClocks();
}

function t2ndClockLabel(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s2ndClockLabel':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s2ndClockLabel: "+value); }}); }
	$('#set-time2-label').val(value);
	$('.clock2 .label').text(value);
}

function t3rdClock(loaded) {
	if (s3rdClock == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'s3rdClock':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s3rdClock: on"); }}); }
		$('html').addClass('on-clock3');
		$('#set-time3').attr('Checked','Checked');
        updateAdditionalClocks();
	} else {
		if(loaded != true) { chrome.storage.sync.set({'s3rdClock':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s3rdClock: off"); }}); }
		$('html').removeClass('on-clock3');
		$('#set-time3').removeAttr('Checked');
	}
}

function t3rdClockTimezone(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s3rdClockTimezone':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s3rdClockTimezone: "+value); }}); }
	$('#set-time3-zone').val(value);
    updateAdditionalClocks();
}

function t3rdClockLabel(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s3rdClockLabel':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s3rdClockLabel: "+value); }}); }
	$('#set-time3-label').val(value);
	$('.clock3 .label').text(value);
}

function t4thClock(loaded) {
	if (s4thClock == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'s4thClock':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s4thClock: on"); }}); }
		$('html').addClass('on-clock4');
		$('#set-time4').attr('Checked','Checked');
        updateAdditionalClocks();
	} else {
		if(loaded != true) { chrome.storage.sync.set({'s4thClock':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s4thClock: off"); }}); }
		$('html').removeClass('on-clock4');
		$('#set-time4').removeAttr('Checked');
	}
}

function t4thClockTimezone(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s4thClockTimezone':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s4thClockTimezone: "+value); }}); }
	$('#set-time4-zone').val(value);
    updateAdditionalClocks();
}

function t4thClockLabel(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s4thClockLabel':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s4thClockLabel: "+value); }}); }
	$('#set-time4-label').val(value);
	$('.clock4 .label').text(value);
}

function tDate(loaded) {
	if (sDate == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sDate':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sDate: on"); }}); }
		$('html').addClass('on-date');
		$('#set-date').attr('Checked','Checked');
        updateDate();
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sDate':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sDate: off"); }}); }
		$('html').removeClass('on-date');
		$('#set-date').removeAttr('Checked');
	}
}

function tDay(loaded) {
	if (sDay == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sDay':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sDay: on"); }}); }
		$('html').addClass('on-day');
		$('#set-day').attr('Checked','Checked');
        updateDate();
		if (sTabTitle == "tab-date") { updateTabTitle(); }
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sDay':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sDay: off"); }}); }
		$('html').removeClass('on-day');
		$('#set-day').removeAttr('Checked');
        updateDate();
		if (sTabTitle == "tab-date") { updateTabTitle(); }
	}
}

function tYear(loaded) {
	if (sYear == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sYear':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sYear: on"); }}); }
		$('html').addClass('on-year');
		$('#set-year').attr('Checked','Checked');
        updateDate();
		if (sTabTitle == "tab-date") { updateTabTitle(); }
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sYear':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sYear: off"); }}); }
		$('html').removeClass('on-year');
		$('#set-year').removeAttr('Checked');
        updateDate();
		if (sTabTitle == "tab-date") { updateTabTitle(); }
	}
}

function tShortDate(loaded) {
	if (sShortDate == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sShortDate':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sShortDate: on"); }}); }
		$('html').addClass('on-shortdate');
		$('#set-shortdate').attr('Checked','Checked');
        updateDate();
		if (sTabTitle == "tab-date") { updateTabTitle(); }
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sShortDate':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sShortDate: off"); }}); }
		$('html').removeClass('on-shortdate');
		$('#set-shortdate').removeAttr('Checked');
        updateDate();
		if (sTabTitle == "tab-date") { updateTabTitle(); }
	}
}

function tDateFormat(loaded) {
    if(loaded != true) { chrome.storage.sync.set({'sDateFormat':sDateFormat}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sDateFormat: "+sDateFormat); }}); }
    $('input[name="set-dateformat"][value="'+sDateFormat+'"]').attr('Checked','Checked');
    updateDate();
	if (sTabTitle == "tab-date") { updateTabTitle(); }
}

function tBackground(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'sBackground':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sBackground: "+value); }}); }
	$('#set-background').val(value);
	$('body').css({'background-color':value});
}

function tForeground(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'sForeground':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sForeground: "+value); }}); }
	$('#set-foreground').val(value);
	$('body').css({'color':value});
	$('a').css({'color':value});
	$('.search input').css({'border-color':value});
	$('.btn').css({'border-color':value, 'color':value});
}

function checkLink(value, loaded) {
	if (value != undefined) {
		value = (value.indexOf('//') === -1) ? 'http://' + value : value;
	}
	return value;
}

function t1stLink(loaded) {
	if (s1stLink == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'s1stLink':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s1stLink: on"); }}); }
		$('html').addClass('on-link1');
		$('#set-link1').attr('Checked','Checked');
	} else {
		if(loaded != true) { chrome.storage.sync.set({'s1stLink':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s1stLink: off"); }}); }
		$('html').removeClass('on-link1');
		$('#set-link1').removeAttr('Checked');
	}
}

function t1stLinkUrl(value, loaded) {
	value = checkLink(value);
	if(loaded != true) { chrome.storage.sync.set({'s1stLinkUrl':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s1stLinkUrl: "+value); }}); }
	$('#set-link1-url').val(value);
	$('.link1').attr('href',value);
}

function t1stLinkLabel(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s1stLinkLabel':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s1stLinkLabel: "+value); }}); }
	$('#set-link1-label').val(value);
	$('.link1').text(value);
}

function t2ndLink(loaded) {
	if (s2ndLink == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'s2ndLink':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s2ndLink: on"); }}); }
		$('html').addClass('on-link2');
		$('#set-link2').attr('Checked','Checked');
	} else {
		if(loaded != true) { chrome.storage.sync.set({'s2ndLink':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s2ndLink: off"); }}); }
		$('html').removeClass('on-link2');
		$('#set-link2').removeAttr('Checked');
	}
}

function t2ndLinkUrl(value, loaded) {
	value = checkLink(value);
	if(loaded != true) { chrome.storage.sync.set({'s2ndLinkUrl':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s2ndLinkUrl: "+value); }}); }
	$('#set-link2-url').val(value);
	$('.link2').attr('href',value);
}

function t2ndLinkLabel(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s2ndLinkLabel':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s2ndLinkLabel: "+value); }}); }
	$('#set-link2-label').val(value);
	$('.link2').text(value);
}

function t3rdLink(loaded) {
	if (s3rdLink == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'s3rdLink':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s3rdLink: on"); }}); }
		$('html').addClass('on-link3');
		$('#set-link3').attr('Checked','Checked');
	} else {
		if(loaded != true) { chrome.storage.sync.set({'s3rdLink':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s3rdLink: off"); }}); }
		$('html').removeClass('on-link3');
		$('#set-link3').removeAttr('Checked');
	}
}

function t3rdLinkUrl(value, loaded) {
	value = checkLink(value);
	if(loaded != true) { chrome.storage.sync.set({'s3rdLinkUrl':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s3rdLinkUrl: "+value); }}); }
	$('#set-link3-url').val(value);
	$('.link3').attr('href',value);
}

function t3rdLinkLabel(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s3rdLinkLabel':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s3rdLinkLabel: "+value); }}); }
	$('#set-link3-label').val(value);
	$('.link3').text(value);
}

function t4thLink(loaded) {
	if (s4thLink == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'s4thLink':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s4thLink: on"); }}); }
		$('html').addClass('on-link4');
		$('#set-link4').attr('Checked','Checked');
	} else {
		if(loaded != true) { chrome.storage.sync.set({'s4thLink':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s4thLink: off"); }}); }
		$('html').removeClass('on-link4');
		$('#set-link4').removeAttr('Checked');
	}
}

function t4thLinkUrl(value, loaded) {
	value = checkLink(value);
	if(loaded != true) { chrome.storage.sync.set({'s4thLinkUrl':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s4thLinkUrl: "+value); }}); }
	$('#set-link4-url').val(value);
	$('.link4').attr('href',value);
}

function t4thLinkLabel(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s4thLinkLabel':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s4thLinkLabel: "+value); }}); }
	$('#set-link4-label').val(value);
	$('.link4').text(value);
}

function t5thLink(loaded) {
	if (s5thLink == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'s5thLink':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s5thLink: on"); }}); }
		$('html').addClass('on-link5');
		$('#set-link5').attr('Checked','Checked');
	} else {
		if(loaded != true) { chrome.storage.sync.set({'s5thLink':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s5thLink: off"); }}); }
		$('html').removeClass('on-link5');
		$('#set-link5').removeAttr('Checked');
	}
}

function t5thLinkUrl(value, loaded) {
	value = checkLink(value);
	if(loaded != true) { chrome.storage.sync.set({'s5thLinkUrl':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s5thLinkUrl: "+value); }}); }
	$('#set-link5-url').val(value);
	$('.link5').attr('href',value);
}

function t5thLinkLabel(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s5thLinkLabel':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s5thLinkLabel: "+value); }}); }
	$('#set-link5-label').val(value);
	$('.link5').text(value);
}

function t6thLink(loaded) {
	if (s6thLink == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'s6thLink':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s6thLink: on"); }}); }
		$('html').addClass('on-link6');
		$('#set-link6').attr('Checked','Checked');
	} else {
		if(loaded != true) { chrome.storage.sync.set({'s6thLink':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s6thLink: off"); }}); }
		$('html').removeClass('on-link6');
		$('#set-link6').removeAttr('Checked');
	}
}

function t6thLinkUrl(value, loaded) {
	value = checkLink(value);
	if(loaded != true) { chrome.storage.sync.set({'s6thLinkUrl':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s6thLinkUrl: "+value); }}); }
	$('#set-link6-url').val(value);
	$('.link6').attr('href',value);
}

function t6thLinkLabel(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'s6thLinkLabel':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED s6thLinkLabel: "+value); }}); }
	$('#set-link6-label').val(value);
	$('.link6').text(value);
}

function tTabTitle(loaded) {
    if(loaded != true) { chrome.storage.sync.set({'sTabTitle':sTabTitle}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sTabTitle: "+sTabTitle); }}); }
    $('input[name="set-tab-title"][value="'+sTabTitle+'"]').attr('Checked','Checked');
    updateTabTitle();
}

function tTabTitleCustomMessage(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'sTabTitleCustomMessage':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sTabTitleCustomMessage: "+value); }}); }
	$('#set-tab-custom-message').val(value);
	updateTabTitle();
}

function tCustomMessage(loaded) {
	if (sCustomMessage == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sCustomMessage':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sCustomMessage: on"); }}); }
		$('html').addClass('on-message');
		$('#set-message').attr('Checked','Checked');
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sCustomMessage':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sCustomMessage: off"); }}); }
		$('html').removeClass('on-message');
		$('#set-message').removeAttr('Checked');
	}
}

function tCustomMessageText(value, loaded) {
	if(loaded != true) { chrome.storage.sync.set({'sCustomMessageText':value}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sCustomMessageText: "+value); }}); }
	$('#set-message-text').val(value);
	$('.message p').text(value);
}

function tSearch(loaded) {
	if (sSearch == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sSearch':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sSearch: on"); }}); }
		$('html').addClass('on-search');
		$('#set-search').attr('Checked','Checked');
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sSearch':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sSearch: off"); }}); }
		$('html').removeClass('on-search');
		$('#set-search').removeAttr('Checked');
	}
}

function tEngine(loaded) {
    if(loaded != true) { chrome.storage.sync.set({'sEngine':sEngine}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sEngine:"+sEngine); }}); }
    $('input[name="set-engine"][value="'+sEngine+'"]').attr('Checked','Checked');
	if (sEngine == "bing") {
		$('#search-form').attr('action', 'http://www.bing.com/search');
		$('#search-box').attr('placeholder', 'Search Bing');
	} else if (sEngine == "duckduckgo") {
		$('#search-form').attr('action', 'http://www.duckduckgo.com/');
		$('#search-box').attr('placeholder', 'Search DuckDuckGo');
	} else {
		$('#search-form').attr('action', 'https://www.google.com/search');
		$('#search-box').attr('placeholder', 'Search Google');
	}
}

function tAnimation(loaded) {
	if (sAnimation == 'on') {
		if(loaded != true) { chrome.storage.sync.set({'sAnimation':'on'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sAnimation: on"); }}); }
		$('html').addClass('on-animation');
		$('#set-animation').attr('Checked','Checked');
	} else {
		if(loaded != true) { chrome.storage.sync.set({'sAnimation':'off'}, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED sAnimation: off"); }}); }
		$('html').removeClass('on-animation');
		$('#set-animation').removeAttr('Checked');
	}
}

// ##############################################
// Feature Functions
// ##############################################

function updateTime() { 
    if (sPrimaryClock == 'on') {
        if (sMilitary == "on") {
            $('.clock1 time').attr('datetime',moment().format('HH:mm:ss'));
            $('.clock1 .hour').text(moment().format('H'));
        } else {
            $('.clock1 time').attr('datetime',moment().format('hh:mm:ss'));
            $('.clock1 .hour').text(moment().format('h'));
            if (sMeridiem == "on") {
                $('.clock1 .meridiem').text(moment().format('a'));
            }
        }
        $('.clock1 .hour').each(function (index) { var characters = $(this).text().split(""); $this = $(this); $this.empty(); $.each(characters, function (i, el) { $this.append("<span>" + el + "</span"); }); });
        $('.clock1 .minute').text(moment().format('mm'));
        $('.clock1 .minute').each(function (index) { var characters = $(this).text().split(""); $this = $(this); $this.empty(); $.each(characters, function (i, el) { $this.append("<span>" + el + "</span"); }); });
        if (sSeconds == "on") {
            $('.clock1 .seconds').text(moment().format('ss'));
            $('.clock1 .seconds').each(function (index) { var characters = $(this).text().split(""); $this = $(this); $this.empty(); $.each(characters, function (i, el) { $this.append("<span>" + el + "</span"); }); });
        }
        
        // Blink delimiter every half second
        var dt = new Date();
        if (sDelimiter == "on" && sBlinking == "on") {
            var delimiter = $('.clock1 .delimiter');
            if (dt.getMilliseconds() < 500) {
                $(delimiter).css({'opacity':'0.5'});
            } else {
                $(delimiter).css({'opacity':'0'});
            }
        }
        
        $(".current-timezone").text(moment.tz.guess());
        
        if (sSeconds == 'off' && sBlinking == 'off') {
            setTimeout(updateTime, 60000);
        } else {
            setTimeout(updateTime, 500);
        }
        clearTimeout(updateTime);
    }
};

function updateAdditionalClocks() { 
    if (s2ndClock == 'on') {
        if (s2ndClockTimezone == "" || s2ndClockTimezone == null) {
            s2ndClockTimezone = moment.tz.guess();
        }
        if (sMilitary == "on") {
            $('.clock2 .hour').text(moment().tz(s2ndClockTimezone).format('H'));
            $('.clock2 .minute').text(moment().tz(s2ndClockTimezone).format('mm'));
            $('.clock2 time').attr('datetime',moment().tz(s2ndClockTimezone).format('H:mm'));
        } else {
            $('.clock2 .hour').text(moment().tz(s2ndClockTimezone).format('h'));
            $('.clock2 .minute').text(moment().tz(s2ndClockTimezone).format('mm'));
            $('.clock2 .meridiem').text(moment().tz(s2ndClockTimezone).format('a'));
            $('.clock2 time').attr('datetime',moment().tz(s2ndClockTimezone).format('h:mm'));
        }
    }
    if (s3rdClock == 'on') {
        if (s3rdClockTimezone == "" || s3rdClockTimezone == null) {
            s3rdClockTimezone = moment.tz.guess();
        }
        if (sMilitary == "on") {
            $('.clock3 .hour').text(moment().tz(s3rdClockTimezone).format('H'));
            $('.clock3 .minute').text(moment().tz(s3rdClockTimezone).format('mm'));
            $('.clock3 time').attr('datetime',moment().tz(s3rdClockTimezone).format('H:mm'));
        } else {
            $('.clock3 .hour').text(moment().tz(s3rdClockTimezone).format('h'));
            $('.clock3 .minute').text(moment().tz(s3rdClockTimezone).format('mm'));
            $('.clock3 .meridiem').text(moment().tz(s3rdClockTimezone).format('a'));
            $('.clock3 time').attr('datetime',moment().tz(s3rdClockTimezone).format('h:mm'));
        }
    }
    if (s4thClock == 'on') {
        if (s4thClockTimezone == "" || s4thClockTimezone == null) {
            s4thClockTimezone = moment.tz.guess();
        }
        if (sMilitary == "on") {
            $('.clock4 .hour').text(moment().tz(s4thClockTimezone).format('H'));
            $('.clock4 .minute').text(moment().tz(s4thClockTimezone).format('mm'));
            $('.clock4 time').attr('datetime',moment().tz(s4thClockTimezone).format('H:mm'));
        } else {
            $('.clock4 .hour').text(moment().tz(s4thClockTimezone).format('h'));
            $('.clock4 .minute').text(moment().tz(s4thClockTimezone).format('mm'));
            $('.clock4 .meridiem').text(moment().tz(s4thClockTimezone).format('a'));
            $('.clock4 time').attr('datetime',moment().tz(s4thClockTimezone).format('h:mm'));
        }
    }

    if (sSeconds == 'off' && sBlinking == 'off') {
        setTimeout(updateAdditionalClocks, 60000);
    } else {
        setTimeout(updateAdditionalClocks, 500);
    }
    clearTimeout(updateAdditionalClocks);
};

function getDateVars() {
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    dt = new Date();
    day = days[dt.getDay()];
    year = dt.getFullYear();
    shortYear = dt.getFullYear().toString().substr(2,2);
    month = months[dt.getMonth()];
    shortMonth = ("0" + (dt.getMonth() + 1)).slice(-2); // Returns a double digit month (01 vs 1)
    date = dt.getDate();
    shortDate = ("0" + dt.getDate()).slice(-2); // Returns a double digit date (01 vs 1)
}
    
function updateDate() { 
	getDateVars();
    
    $('.date time').attr('datetime',year+'-'+shortMonth+'-'+shortDate);
    
    if (sDateFormat == 'little') {
        if (sShortDate == 'on') {
            if (sYear == 'on') {
                $('.date time').html(shortDate+'/'+shortMonth+'/'+shortYear);
            } else {
                $('.date time').html(shortDate+'/'+shortMonth);
            }
        } else {
            if (sDay == 'on' && sYear == 'on') {
                $('.date time').html('<span class="day">'+day+', </span>'+date+'&nbsp;'+month+'&nbsp;'+year);
            } else if (sDay == 'off' && sYear == 'on') {
                $('.date time').html(date+'&nbsp;'+month+'&nbsp;'+year);
            } else if (sDay == 'on' && sYear == 'off') {
                $('.date time').html('<span class="day">'+day+', </span>'+date+'&nbsp;'+month);
            } else if (sDay == 'off' && sYear == 'off') {
                $('.date time').html(date+'&nbsp;'+month);
            }
        }
    } else if (sDateFormat == 'big') {
        if (sShortDate == 'on') {
            if (sYear == 'on') {
                $('.date time').html(shortYear+'/'+shortMonth+'/'+shortDate);
            } else {
                $('.date time').html(shortMonth+'/'+shortDate);
            }
        } else {
            if (sDay == 'on' && sYear == 'on') {
                $('.date time').html('<span class="day">'+day+', </span>'+year+'&nbsp;'+month+'&nbsp;'+date);
            } else if (sDay == 'off' && sYear == 'on') {
                $('.date time').html(year+'&nbsp;'+month+'&nbsp;'+date);
            } else if (sDay == 'on' && sYear == 'off') {
                $('.date time').html('<span class="day">'+day+', </span>'+month+'&nbsp;'+date);
            } else if (sDay == 'off' && sYear == 'off') {
                $('.date time').html(month+'&nbsp;'+date);
            }
        }
    } else {
        if (sShortDate == 'on') {
            if (sYear == 'on') {
                $('.date time').html(shortMonth+'/'+shortDate+'/'+shortYear);
            } else {
                $('.date time').html(shortMonth+'/'+shortDate);
            }
        } else {
            if (sDay == 'on' && sYear == 'on') {
                $('.date time').html('<span class="day">'+day+', </span>'+month+'&nbsp;'+date+',&nbsp;'+year);
            } else if (sDay == 'off' && sYear == 'on') {
                $('.date time').html(month+'&nbsp;'+date+',&nbsp;'+year);
            } else if (sDay == 'on' && sYear == 'off') {
                $('.date time').html('<span class="day">'+day+', </span>'+month+'&nbsp;'+date);
            } else if (sDay == 'off' && sYear == 'off') {
                $('.date time').html(month+'&nbsp;'+date);
            }
        }
    }

    setTimeout(updateDate, 60000);
    clearTimeout(updateDate);
};
    
function updateTabTitle()  {
    if (sTabTitle == "tab-time") {
		if (sMilitary == "on") {
			if (sSeconds == "on") {
					document.title = moment().format('H:mm:ss');
			} else {
					document.title = moment().format('H:mm');
			}
		} else {
			if (sSeconds == "on" && sMeridiem == "on") {
					document.title = moment().format('h:mm:ss a');
			} else if (sSeconds == "on" && sMeridiem == "off") {
					document.title = moment().format('h:mm:ss');
			} else if (sSeconds == "off" && sMeridiem == "on") {
					document.title = moment().format('h:mm a');
			} else if (sSeconds == "off" && sMeridiem == "off") {
					document.title = moment().format('h:mm');
			}
		}
		if (sSeconds == 'off') {
			setTimeout(updateTabTitle, 60000);
		} else {
			setTimeout(updateTabTitle, 500);
		}
		clearTimeout(updateTabTitle);
    } else if (sTabTitle == "tab-date") {
        getDateVars();

		if (sDateFormat == 'little') {
			if (sShortDate == 'on') {
				if (sYear == 'on') {
					document.title = shortDate+'/'+shortMonth+'/'+shortYear;
				} else {
					document.title = shortDate+'/'+shortMonth;
				}
			} else {
				if (sDay == 'on' && sYear == 'on') {
					document.title = day+', '+date+' '+month+' '+year;
				} else if (sDay == 'off' && sYear == 'on') {
					document.title = date+' '+month+' '+year;
				} else if (sDay == 'on' && sYear == 'off') {
					document.title = day+', '+date+' '+month;
				} else if (sDay == 'off' && sYear == 'off') {
					document.title = date+' '+month;
				}
			}
		} else if (sDateFormat == 'big') {
			if (sShortDate == 'on') {
				if (sYear == 'on') {
					document.title = shortYear+'/'+shortMonth+'/'+shortDate;
				} else {
					document.title = shortMonth+'/'+shortDate;
				}
			} else {
				if (sDay == 'on' && sYear == 'on') {
					document.title = day+', '+year+' '+month+' '+date;
				} else if (sDay == 'off' && sYear == 'on') {
					document.title = year+' '+month+' '+date;
				} else if (sDay == 'on' && sYear == 'off') {
					document.title = day+', '+month+' '+date;
				} else if (sDay == 'off' && sYear == 'off') {
					document.title = month+' '+date;
				}
			}
		} else {
			if (sShortDate == 'on') {
				if (sYear == 'on') {
					document.title = shortMonth+'/'+shortDate+'/'+shortYear;
				} else {
					document.title = shortMonth+'/'+shortDate;
				}
			} else {
				if (sDay == 'on' && sYear == 'on') {
					document.title = day+', '+month+' '+date+', '+year;
				} else if (sDay == 'off' && sYear == 'on') {
					document.title = month+' '+date+', '+year;
				} else if (sDay == 'on' && sYear == 'off') {
					document.title = day+', '+month+' '+date;
				} else if (sDay == 'off' && sYear == 'off') {
					document.title = month+' '+date;
				}
			}
		}
		
		setTimeout(updateTabTitle, 60000);
    	clearTimeout(updateTabTitle);
    } else if (sTabTitle == "new-tab") {
        document.title = "New Tab";
    } else if (sTabTitle == "tab-custom") {
        document.title = sTabTitleCustomMessage;
    }
};

// Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-64196229-2']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// Track clicks
function trackLinks(e) {
	var target = e.target.id;
	_gaq.push(['_trackEvent', target, 'Click', target]);
};

function trackTabs(e) {
	var target = e.target.id;
	_gaq.push(['_trackEvent', 'Setting Tabs', 'Click', target]);
};

document.addEventListener('DOMContentLoaded', function () {
	var links = document.querySelectorAll('a');
	for (var i = 0; i < links.length; i++) {
		links[i].addEventListener('click', trackLinks);
	}
	var settingsTabs = document.querySelectorAll('#settings-tabs ul li');
	for (var i = 0; i < settingsTabs.length; i++) {
		settingsTabs[i].addEventListener('click', trackTabs);
	}
});
