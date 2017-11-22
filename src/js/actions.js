// ##############################################
// Actions 
// ##############################################
$('#set-clock1').click(function() {
  if ($('#set-clock1').is(':checked')) {
    sPrimaryClock = 'on';
  } else {
    sPrimaryClock = 'off';
  }
  tPrimaryClock();
  updateAll();
});
$('#set-seconds').click(function() {
  if ($('#set-seconds').is(':checked')) {
    sSeconds = 'on';
  } else {
    sSeconds = 'off';
  }
  tSeconds();
  updateAll();
});
$('#set-dimseconds').click(function() {
  if ($('#set-dimseconds').is(':checked')) {
    sDimSeconds = 'on';
  } else {
    sDimSeconds = 'off';
  }
  tDimSeconds();
});
$('#set-meridiem').click(function() {
  if ($('#set-meridiem').is(':checked')) {
    sMeridiem = 'on';
  } else {
    sMeridiem = 'off';
  }
  tMeridiem();
  updateAll();
});
$('#set-military').click(function() {
  if ($('#set-military').is(':checked')) {
    sMilitary = 'on';
  } else {
    sMilitary = 'off';
  }
  tMilitary();
  updateAll();
});
$('#set-delimiter').click(function() {
  if ($('#set-delimiter').is(':checked')) {
    sDelimiter = 'on';
  } else {
    sDelimiter = 'off';
  }
  tDelimiter();
  updateAll();
});
$('#set-blinking').click(function() {
  if ($('#set-blinking').is(':checked')) {
    sBlinking = 'on';
  } else {
    sBlinking = 'off';
  }
  tBlinking();
  updateAll();
});
$('#set-time1-zone').change(function() {
  sPrimaryClockTimezone = $(this).val();
  tPrimaryClockTimezone(sPrimaryClockTimezone);
});
$('#set-time2').click(function() {
  if ($('#set-time2').is(':checked')) {
    s2ndClock = 'on';
  } else {
    s2ndClock = 'off';
  }
  t2ndClock();
  updateAll();
});
$('#set-time2-zone').change(function() {
  s2ndClockTimezone = $(this).val();
  t2ndClockTimezone(s2ndClockTimezone);
  updateAll();
});
$('#set-time2-label').on("blur", function() {
  s2ndClockLabel = $(this).val();
  t2ndClockLabel(s2ndClockLabel);
});
$('#set-time3').click(function() {
  if ($('#set-time3').is(':checked')) {
    s3rdClock = 'on';
  } else {
    s3rdClock = 'off';
  }
  t3rdClock();
  updateAll();
});
$('#set-time3-zone').change(function() {
  s3rdClockTimezone = $(this).val();
  t3rdClockTimezone(s3rdClockTimezone);
  updateAll();
});
$('#set-time3-label').on("blur", function() {
  s3rdClockLabel = $(this).val();
  t3rdClockLabel(s3rdClockLabel);
});
$('#set-time4').click(function() {
  if ($('#set-time4').is(':checked')) {
    s4thClock = 'on';
  } else {
    s4thClock = 'off';
  }
  t4thClock();
  updateAll();
});
$('#set-time4-zone').change(function() {
  s4thClockTimezone = $(this).val();
  t4thClockTimezone(s4thClockTimezone);
  updateAll();
});
$('#set-time4-label').on("blur", function() {
  s4thClockLabel = $(this).val();
  t4thClockLabel(s4thClockLabel);
});
$('#set-date').click(function() {
  if ($('#set-date').is(':checked')) {
    sDate = 'on';
  } else {
    sDate = 'off';
  }
  tDate();
  updateAll();
});
$('#set-day').click(function() {
  if ($('#set-day').is(':checked')) {
    sDay = 'on';
  } else {
    sDay = 'off';
  }
  tDay();
  updateAll();
});
$('#set-year').click(function() {
  if ($('#set-year').is(':checked')) {
    sYear = 'on';
  } else {
    sYear = 'off';
  }
  tYear();
  updateAll();
});
$('#set-shortdate').click(function() {
  if ($('#set-shortdate').is(':checked')) {
    sShortDate = 'on';
  } else {
    sShortDate = 'off';
  }
  tShortDate();
  updateAll();
});
$('#set-dateformat').on("input change", function() {
  sDateFormat = $(this).val();
  tDateFormat(sDateFormat);
  updateAll();
});
$('input[name="set-date-delimiter"]').click(function() {
  sDateDelimiter = $(this).val();
  tDateDelimiter();
  updateAll();
});
$('#set-week').click(function() {
  if ($('#set-week').is(':checked')) {
    sWeek = 'on';
  } else {
    sWeek = 'off';
  }
  tWeek();
  updateAll();
});
$('input[name="set-week-label"]').click(function() {
  sWeekLabel = $(this).val();
  tWeekLabel();
  updateAll();
});
$('#set-background').change(function() {
  sBackground = $(this).val();
  tBackground(sBackground);
});
$('#set-background-value').on("blur", function() {
  sBackground = $(this).val();
  tBackground(sBackground);
});
$('#set-foreground').change(function() {
  sForeground = $(this).val();
  tForeground(sForeground);
});
$('#set-foreground-value').on("blur", function() {
  sForeground = $(this).val();
  tForeground(sForeground);
});
$('#set-link1').click(function() {
  if ($('#set-link1').is(':checked')) {
    s1stLink = 'on';
  } else {
    s1stLink = 'off';
  }
  t1stLink();
});
$('#set-link1-url').on("blur", function() {
  s1stLinkUrl = $(this).val();
  t1stLinkUrl(s1stLinkUrl);
});
$('#set-link1-label').on("blur", function() {
  s1stLinkLabel = $(this).val();
  t1stLinkLabel(s1stLinkLabel);
});
$('#set-link2').click(function() {
  if ($('#set-link2').is(':checked')) {
    s2ndLink = 'on';
  } else {
    s2ndLink = 'off';
  }
  t2ndLink();
});
$('#set-link2-url').on("blur", function() {
  s2ndLinkUrl = $(this).val();
  t2ndLinkUrl(s2ndLinkUrl);
});
$('#set-link2-label').on("blur", function() {
  s2ndLinkLabel = $(this).val();
  t2ndLinkLabel(s2ndLinkLabel);
});
$('#set-link3').click(function() {
  if ($('#set-link3').is(':checked')) {
    s3rdLink = 'on';
  } else {
    s3rdLink = 'off';
  }
  t3rdLink();
});
$('#set-link3-url').on("blur", function() {
  s3rdLinkUrl = $(this).val();
  t3rdLinkUrl(s3rdLinkUrl);
});
$('#set-link3-label').on("blur", function() {
  s3rdLinkLabel = $(this).val();
  t3rdLinkLabel(s3rdLinkLabel);
});
$('#set-link4').click(function() {
  if ($('#set-link4').is(':checked')) {
    s4thLink = 'on';
  } else {
    s4thLink = 'off';
  }
  t4thLink();
});
$('#set-link4-url').on("blur", function() {
  s4thLinkUrl = $(this).val();
  t4thLinkUrl(s4thLinkUrl);
});
$('#set-link4-label').on("blur", function() {
  s4thLinkLabel = $(this).val();
  t4thLinkLabel(s4thLinkLabel);
});
$('#set-link5').click(function() {
  if ($('#set-link5').is(':checked')) {
    s5thLink = 'on';
  } else {
    s5thLink = 'off';
  }
  t5thLink();
});
$('#set-link5-url').on("blur", function() {
  s5thLinkUrl = $(this).val();
  t5thLinkUrl(s5thLinkUrl);
});
$('#set-link5-label').on("blur", function() {
  s5thLinkLabel = $(this).val();
  t5thLinkLabel(s5thLinkLabel);
});
$('#set-link6').click(function() {
  if ($('#set-link6').is(':checked')) {
    s6thLink = 'on';
  } else {
    s6thLink = 'off';
  }
  t6thLink();
});
$('#set-link6-url').on("blur", function() {
  s6thLinkUrl = $(this).val();
  t6thLinkUrl(s6thLinkUrl);
});
$('#set-link6-label').on("blur", function() {
  s6thLinkLabel = $(this).val();
  t6thLinkLabel(s6thLinkLabel);
});
$('#set-tab-title').on("input change", function() {
  sTabTitle = $(this).val();
  tTabTitle(sTabTitle);
  updateAll();
});
$('#set-tab-custom-message').on("blur", function() {
  sTabTitleCustomMessage = $(this).val();
  tTabTitleCustomMessage(sTabTitleCustomMessage);
  updateAll();
});
$('#set-message').click(function() {
  if ($('#set-message').is(':checked')) {
    sCustomMessage = 'on';
    tCustomMessage();
  } else {
    sCustomMessage = 'off';
    tCustomMessage();
  }
});
$('#set-message-text').on("blur", function() {
  sCustomMessageText = $(this).val();
  tCustomMessageText(sCustomMessageText);
});
$('#set-search').click(function() {
  if ($('#set-search').is(':checked')) {
    sSearch = 'on';
  } else {
    sSearch = 'off';
  }
  tSearch();
});
$('#set-engine').on("input change", function() {
  sEngine = $(this).val();
  tEngine(sEngine);
});
$('#set-animation').click(function() {
  if ($('#set-animation').is(':checked')) {
    sAnimation = 'on';
  } else {
    sAnimation = 'off';
  }
  tAnimation();
});
$('#set-brackets').click(function() {
  if ($('#set-brackets').is(':checked')) {
    sBrackets = 'on';
  } else {
    sBrackets = 'off';
  }
  tBrackets();
});
$('#set-dimbrackets').click(function() {
  if ($('#set-dimbrackets').is(':checked')) {
    sDimBrackets = 'on';
  } else {
    sDimBrackets = 'off';
  }
  tDimBrackets();
});
$('#set-dimdelimiter').click(function() {
  if ($('#set-dimdelimiter').is(':checked')) {
    sDimDelimiter = 'on';
  } else {
    sDimDelimiter = 'off';
  }
  tDimDelimiter();
});
$('input[name="set-scale"]').on("input change", function() {
  sScale = $(this).val();
  tScale();
});
$('input[name="set-bracket-style"]').click(function() {
  sBracketStyle = $(this).val();
  tBracketStyle();
});
$('input[name="set-font"]').click(function() {
  sFont = $(this).val();
  tFont();
});
$('#set-hide-settings-toggle').click(function() {
  if ($('#set-hide-settings-toggle').is(':checked')) {
    sHideSettingsToggle = 'on';
  } else {
    sHideSettingsToggle = 'off';
  }
  tHideSettingsToggle();
});
$('#set-analog').click(function() {
  if ($('#set-analog').is(':checked')) {
    sAnalog = 'off';
  } else {
    sAnalog = 'on';
  }
  tAnalog();
  updateAll();
});

// CLick theme
$('#theme01').click(function() {
  sBackground = '#FFFFFF';
  sForeground = '#000000';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme02').click(function() {
  sBackground = '#FFFFFF';
  sForeground = '#7AC943';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme03').click(function() {
  sBackground = '#FFFFFF';
  sForeground = '#00A99D';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme04').click(function() {
  sBackground = '#FFFFFF';
  sForeground = '#3FA9F5';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme05').click(function() {
  sBackground = '#FFFFFF';
  sForeground = '#93278F';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme06').click(function() {
  sBackground = '#FFFFFF';
  sForeground = '#FF7BAC';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme07').click(function() {
  sBackground = '#FFFFFF';
  sForeground = '#FF1D25';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme08').click(function() {
  sBackground = '#FFFFFF';
  sForeground = '#FF931E';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme09').click(function() {
  sBackground = '#000000';
  sForeground = '#FFFFFF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme10').click(function() {
  sBackground = '#000000';
  sForeground = '#7AC943';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme11').click(function() {
  sBackground = '#000000';
  sForeground = '#00A99D';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme12').click(function() {
  sBackground = '#000000';
  sForeground = '#3FA9F5';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme13').click(function() {
  sBackground = '#000000';
  sForeground = '#93278F';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme14').click(function() {
  sBackground = '#000000';
  sForeground = '#FF7BAC';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme15').click(function() {
  sBackground = '#000000';
  sForeground = '#FF1D25';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme16').click(function() {
  sBackground = '#000000';
  sForeground = '#FF931E';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme17').click(function() {
  sBackground = '#E6E6E6';
  sForeground = '#333333';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme18').click(function() {
  sBackground = '#7AC943';
  sForeground = '#000000';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme19').click(function() {
  sBackground = '#00A99D';
  sForeground = '#000000';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme20').click(function() {
  sBackground = '#3FA9F5';
  sForeground = '#000000';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme21').click(function() {
  sBackground = '#93278F';
  sForeground = '#000000';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme22').click(function() {
  sBackground = '#FF7BAC';
  sForeground = '#000000';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme23').click(function() {
  sBackground = '#FF1D25';
  sForeground = '#000000';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme24').click(function() {
  sBackground = '#FF931E';
  sForeground = '#000000';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme25').click(function() {
  sBackground = '#333333';
  sForeground = '#E6E6E6';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme26').click(function() {
  sBackground = '#7AC943';
  sForeground = '#FFFFFF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme27').click(function() {
  sBackground = '#00A99D';
  sForeground = '#FFFFFF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme28').click(function() {
  sBackground = '#3FA9F5';
  sForeground = '#FFFFFF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme29').click(function() {
  sBackground = '#93278F';
  sForeground = '#FFFFFF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme30').click(function() {
  sBackground = '#FF7BAC';
  sForeground = '#FFFFFF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme31').click(function() {
  sBackground = '#FF1D25';
  sForeground = '#FFFFFF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme32').click(function() {
  sBackground = '#FF931E';
  sForeground = '#FFFFFF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme33').click(function() {
  sBackground = '#BDCCD4';
  sForeground = '#534741';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme34').click(function() {
  sBackground = '#E2EDC1';
  sForeground = '#00A055';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme35').click(function() {
  sBackground = '#C9F2EE';
  sForeground = '#0000FF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme36').click(function() {
  sBackground = '#C8EAF5';
  sForeground = '#00AEEF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme37').click(function() {
  sBackground = '#D8D6EC';
  sForeground = '#702C8D';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme38').click(function() {
  sBackground = '#FCE3EE';
  sForeground = '#F190AC';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme39').click(function() {
  sBackground = '#EEDFAC';
  sForeground = '#534741';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme40').click(function() {
  sBackground = '#FFFAC0';
  sForeground = '#F4783B';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme41').click(function() {
  sBackground = '#E1E9F2';
  sForeground = '#004080';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme42').click(function() {
  sBackground = '#EAF3E0';
  sForeground = '#008080';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme43').click(function() {
  sBackground = '#004040';
  sForeground = '#FFFFFF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme44').click(function() {
  sBackground = '#0000FF';
  sForeground = '#FFFFFF';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme45').click(function() {
  sBackground = '#93278F';
  sForeground = '#FF931E';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme46').click(function() {
  sBackground = '#FAC8D3';
  sForeground = '#895881';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme47').click(function() {
  sBackground = '#C1172C';
  sForeground = '#FFF200';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});
$('#theme48').click(function() {
  sBackground = '#FF8040';
  sForeground = '#000000';
  $('set-background').val(sBackground);
  $('set-foreground').val(sForeground);
  tBackground(sBackground);
  tForeground(sForeground);
});

// Change tabs in Settings panel
$('nav li button').click(function() {
  var tab_id = $(this).attr('data-tab');
  $('nav li button').removeClass('active');
  $('.section').removeClass('active');
  $(this).addClass('active');
  $("#" + tab_id).addClass('active');
});

// Open settings panel
$('#settings-toggle').click(function() {
  $('#settings-toggle').blur();
  $('#config').toggleClass("active");
  $('#carettab').toggleClass("active");
  $('.carettab-status').fadeOut();
  chrome.storage.sync.set({
    'caretTabStatus': "existing"
  }, function() {
    if (!chrome.runtime.lastError) {
      console.log("^CaretTab - Set Status: existing");
    }
  });
});

// Close status message
$('.status-message-close').click(function() {
  $('.carettab-status').fadeOut();
  chrome.storage.sync.set({
    'caretTabStatus': "existing"
  }, function() {
    if (!chrome.runtime.lastError) {
      console.log("^CaretTab - Set Status: existing");
    }
  });
});

// Close settings panel via close button
$('#close-settings').click(function() {
  $('#config').toggleClass("active");
  $('#carettab').toggleClass("active");
});

// Close status message via close button
$('.status-x').click(function() {
  $('.carettab-status').fadeOut();
  chrome.storage.sync.set({
    'caretTabStatus': "existing"
  }, function() {
    if (!chrome.runtime.lastError) {
      console.log("^CaretTab - Set Status: existing");
    }
  });
});

// Close settings panel via clicking outside menu
$(document).mousedown(function(e) {
  var container = $("#config");
  if (container.hasClass("active")) {
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.removeClass("active");
      $('#carettab').removeClass("active");
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