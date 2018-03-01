// ##############################################
// Feature Functions
// ##############################################
function updateAll() {
  var dt = new Date();
  var timeDiv = $("#time");
  var hourDiv = timeDiv.find(".hour");
  var minuteDiv = timeDiv.find(".minute");
  var secondDiv = timeDiv.find(".second");
  var meridiemDiv = timeDiv.find(".meridiem");
  var delimiterDiv = timeDiv.find(".delimiter");
  var timeOutput = "";
  var dateOutput = "";

  // Time
  if (
    (sPrimaryClock == "on") ||
    (sPrimaryClock == "off" && sTabTitle == "tab-time") ||
    (sPrimaryClock == "off" && sTabTitle == "tab-timedate") ||
    (sPrimaryClock == "off" && sTabTitle == "tab-datetime")
  ) {
    if (sPrimaryClockTimezone == "" || sPrimaryClockTimezone == null) {
      sPrimaryClockTimezone = moment.tz.guess();
    }
    if (sAnalog == "on") {
      var analogNow = moment().tz(sPrimaryClockTimezone),
        analogSecond = analogNow.seconds() * 6,
        analogMinute = analogNow.minutes() * 6 + analogSecond / 60,
        analogHour = ((analogNow.hours() % 12) / 12) * 360 + analogMinute / 12;
      $("#analog-hour").css("transform", "rotateZ(" + analogHour + "deg)");
      $("#analog-minute").css("transform", "rotateZ(" + analogMinute + "deg)");
      $("#analog-second").css("transform", "rotateZ(" + analogSecond + "deg)");
      if (sMilitary == "on") {
        timeOutput = moment().tz(sPrimaryClockTimezone).format("H:mm");
        if (sSeconds == "on") {
          timeOutput = moment().tz(sPrimaryClockTimezone).format("H:mm:ss");
        }
      } else {
        timeOutput = moment().tz(sPrimaryClockTimezone).format("h:mm");
        if (sSeconds == "on") {
          timeOutput = moment().tz(sPrimaryClockTimezone).format("h:mm:ss");
        }
        if (sMeridiem == "on") {
          timeOutput = moment().tz(sPrimaryClockTimezone).format("h:mm a");
          if (sSeconds == "on") {
            timeOutput = moment().tz(sPrimaryClockTimezone).format("h:mm:ss a");
          }
        }
      }
    } else {
      if (sMilitary == "on") {
        timeOutput = moment().tz(sPrimaryClockTimezone).format("H:mm");
        timeDiv.attr("datetime", moment().tz(sPrimaryClockTimezone).format("HH:mm:ss"));
        hourDiv.text(moment().tz(sPrimaryClockTimezone).format("H"));
        if (sSeconds == "on") {
          timeOutput = moment().tz(sPrimaryClockTimezone).format("H:mm:ss");
        }
      } else {
        timeOutput = moment().tz(sPrimaryClockTimezone).format("h:mm");
        timeDiv.attr("datetime", moment().tz(sPrimaryClockTimezone).format("hh:mm:ss"));
        hourDiv.text(moment().tz(sPrimaryClockTimezone).format("h"));
        if (sSeconds == "on") {
          timeOutput = moment().tz(sPrimaryClockTimezone).format("h:mm:ss");
        }
        if (sMeridiem == "on") {
          timeOutput = moment().tz(sPrimaryClockTimezone).format("h:mm a");
          meridiemDiv.text(moment().tz(sPrimaryClockTimezone).format("a"));
          if (sSeconds == "on") {
            timeOutput = moment().tz(sPrimaryClockTimezone).format("h:mm:ss a");
          }
        }
      }
      hourDiv.each(function(index) {
        var characters = $(this).text().split("");
        $this = $(this);
        $this.empty();
        $.each(characters, function(i, el) {
          $this.append("<span>" + el + "</span");
        });
      });
      minuteDiv.text(moment().tz(sPrimaryClockTimezone).format("mm"));
      minuteDiv.each(function(index) {
        var characters = $(this).text().split("");
        $this = $(this);
        $this.empty();
        $.each(characters, function(i, el) {
          $this.append("<span>" + el + "</span");
        });
      });
      if (sSeconds == "on") {
        secondDiv.text(moment().tz(sPrimaryClockTimezone).format("ss"));
        secondDiv.each(function(index) {
          var characters = $(this).text().split("");
          $this = $(this);
          $this.empty();
          $.each(characters, function(i, el) {
            $this.append("<span>" + el + "</span");
          });
        });
      }
      // Blink delimiter every half second
      if (sDelimiter == "on" && sBlinking == "on") {
        if (dt.getMilliseconds() < 500) {
          delimiterDiv.css({
            "opacity": "1"
          });
        } else {
          delimiterDiv.css({
            "opacity": "0.5"
          });
        }
      }
    }
  }

  // Additional Clocks
  if (s2ndClock == "on") {
    var clock2Div = $("#display-clock2-time");
    if (s2ndClockTimezone == "" || s2ndClockTimezone == null) {
      s2ndClockTimezone = moment.tz.guess();
    }
    if (sMilitary == "on") {
      clock2Div.find(".hour").text(moment().tz(s2ndClockTimezone).format("H"));
      clock2Div.find(".minute").text(moment().tz(s2ndClockTimezone).format("mm"));
      clock2Div.find("time").attr("datetime", moment().tz(s2ndClockTimezone).format("H:mm"));
    } else {
      clock2Div.find(".hour").text(moment().tz(s2ndClockTimezone).format("h"));
      clock2Div.find(".minute").text(moment().tz(s2ndClockTimezone).format("mm"));
      clock2Div.find(".meridiem").text(moment().tz(s2ndClockTimezone).format("a"));
      clock2Div.find("time").attr("datetime", moment().tz(s2ndClockTimezone).format("h:mm"));
    }
  }
  if (s3rdClock == "on") {
    var clock3Div = $("#display-clock3-time");
    if (s3rdClockTimezone == "" || s3rdClockTimezone == null) {
      s3rdClockTimezone = moment.tz.guess();
    }
    if (sMilitary == "on") {
      clock3Div.find(".hour").text(moment().tz(s3rdClockTimezone).format("H"));
      clock3Div.find(".minute").text(moment().tz(s3rdClockTimezone).format("mm"));
      clock3Div.find("time").attr("datetime", moment().tz(s3rdClockTimezone).format("H:mm"));
    } else {
      clock3Div.find(".hour").text(moment().tz(s3rdClockTimezone).format("h"));
      clock3Div.find(".minute").text(moment().tz(s3rdClockTimezone).format("mm"));
      clock3Div.find(".meridiem").text(moment().tz(s3rdClockTimezone).format("a"));
      clock3Div.find("time").attr("datetime", moment().tz(s3rdClockTimezone).format("h:mm"));
    }
  }
  if (s4thClock == "on") {
    var clock4Div = $("#display-clock4-time");
    if (s4thClockTimezone == "" || s4thClockTimezone == null) {
      s4thClockTimezone = moment.tz.guess();
    }
    if (sMilitary == "on") {
      clock4Div.find(".hour").text(moment().tz(s4thClockTimezone).format("H"));
      clock4Div.find(".minute").text(moment().tz(s4thClockTimezone).format("mm"));
      clock4Div.find("time").attr("datetime", moment().tz(s4thClockTimezone).format("H:mm"));
    } else {
      clock4Div.find(".hour").text(moment().tz(s4thClockTimezone).format("h"));
      clock4Div.find(".minute").text(moment().tz(s4thClockTimezone).format("mm"));
      clock4Div.find(".meridiem").text(moment().tz(s4thClockTimezone).format("a"));
      clock4Div.find("time").attr("datetime", moment().tz(s4thClockTimezone).format("h:mm"));
    }
  }

  // Date

  if (
    (sDate == "on") ||
    (sDate == "off" && sTabTitle == "tab-date") ||
    (sDate == "off" && sTabTitle == "tab-timedate") ||
    (sDate == "off" && sTabTitle == "tab-datetime")
  ) {
    months = [
      chrome.i18n.getMessage("january"), 
      chrome.i18n.getMessage("february"), 
      chrome.i18n.getMessage("march"), 
      chrome.i18n.getMessage("april"), 
      chrome.i18n.getMessage("may"), 
      chrome.i18n.getMessage("june"), 
      chrome.i18n.getMessage("july"), 
      chrome.i18n.getMessage("august"), 
      chrome.i18n.getMessage("september"), 
      chrome.i18n.getMessage("october"),
      chrome.i18n.getMessage("november"), 
      chrome.i18n.getMessage("december")
    ];
    days = [
      chrome.i18n.getMessage("sunday"), 
      chrome.i18n.getMessage("monday"), 
      chrome.i18n.getMessage("tuesday"), 
      chrome.i18n.getMessage("wednesday"), 
      chrome.i18n.getMessage("thursday"), 
      chrome.i18n.getMessage("friday"), 
      chrome.i18n.getMessage("saturday")
    ];
    day = days[dt.getDay()];
    year = dt.getFullYear();
    shortYear = dt.getFullYear().toString().substr(2, 2);
    month = months[dt.getMonth()];
    shortMonth = ("0" + (dt.getMonth() + 1)).slice(-2); // Returns a double digit month (01 vs 1)
    date = dt.getDate();
    shortDate = ("0" + dt.getDate()).slice(-2); // Returns a double digit date (01 vs 1)
    $("#date time").attr("datetime", year + "-" + shortMonth + "-" + shortDate);
    if (sDateFormat == "little") {
      if (sShortDate == "on") {
        if (sDay == "on") {
          if (sDateDelimiter == "period") {
            if (sYear == "on") {
              dateOutput = day + ", " + shortDate + "." + shortMonth + "." + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortDate + "." + shortMonth;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "dash") {
            if (sYear == "on") {
              dateOutput = day + ", " + shortDate + "-" + shortMonth + "-" + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortDate + "-" + shortMonth;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "space") {
            if (sYear == "on") {
              dateOutput = day + ", " + shortDate + " " + shortMonth + " " + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortDate + " " + shortMonth;
              $("#date time").html(dateOutput);
            }
          } else {
            if (sYear == "on") {
              dateOutput = day + ", " + shortDate + "/" + shortMonth + "/" + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortDate + "/" + shortMonth;
              $("#date time").html(dateOutput);
            }
          }
        } else {
          if (sDateDelimiter == "period") {
            if (sYear == "on") {
              dateOutput = shortDate + "." + shortMonth + "." + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortDate + "." + shortMonth;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "dash") {
            if (sYear == "on") {
              dateOutput = shortDate + "-" + shortMonth + "-" + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortDate + "-" + shortMonth;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "space") {
            if (sYear == "on") {
              dateOutput = shortDate + " " + shortMonth + " " + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortDate + " " + shortMonth;
              $("#date time").html(dateOutput);
            }
          } else {
            if (sYear == "on") {
              dateOutput = shortDate + "/" + shortMonth + "/" + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortDate + "/" + shortMonth;
              $("#date time").html(dateOutput);
            }
          }
        }
      } else {
        if (sDay == "on" && sYear == "on") {
          dateOutput = day + ", " + date + " " + month + " " + year;
          $("#date time").html(dateOutput);
        } else if (sDay == "off" && sYear == "on") {
          dateOutput = date + " " + month + " " + year;
          $("#date time").html(dateOutput);
        } else if (sDay == "on" && sYear == "off") {
          dateOutput = day + ", " + date + " " + month;
          $("#date time").html(dateOutput);
        } else if (sDay == "off" && sYear == "off") {
          dateOutput = date + "&nbsp;" + month;
          $("#date time").html(dateOutput);
        }
      }
    } else if (sDateFormat == "big") {
      if (sShortDate == "on") {
        if (sDay == "on") {
          if (sDateDelimiter == "period") {
            if (sYear == "on") {
              dateOutput = day + ", " + shortYear + "." + shortMonth + "." + shortDate;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortMonth + "." + shortDate;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "dash") {
            if (sYear == "on") {
              dateOutput = day + ", " + shortYear + "-" + shortMonth + "-" + shortDate;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortMonth + "-" + shortDate;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "space") {
            if (sYear == "on") {
              dateOutput = day + ", " + shortYear + " " + shortMonth + " " + shortDate;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortMonth + " " + shortDate;
              $("#date time").html(dateOutput);
            }
          } else {
            if (sYear == "on") {
              dateOutput = day + ", " + shortYear + "/" + shortMonth + "/" + shortDate;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortMonth + "/" + shortDate;
              $("#date time").html(dateOutput);
            }
          }
        } else {
          if (sDateDelimiter == "period") {
            if (sYear == "on") {
              dateOutput = shortYear + "." + shortMonth + "." + shortDate;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortMonth + "." + shortDate;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "dash") {
            if (sYear == "on") {
              dateOutput = shortYear + "-" + shortMonth + "-" + shortDate;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortMonth + "-" + shortDate;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "space") {
            if (sYear == "on") {
              dateOutput = shortYear + " " + shortMonth + " " + shortDate;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortMonth + " " + shortDate;
              $("#date time").html(dateOutput);
            }
          } else {
            if (sYear == "on") {
              dateOutput = shortYear + "/" + shortMonth + "/" + shortDate;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortMonth + "/" + shortDate;
              $("#date time").html(dateOutput);
            }
          }
        }
      } else {
        if (sDay == "on" && sYear == "on") {
          dateOutput = day + ", " + year + " " + month + " " + date;
          $("#date time").html(dateOutput);
        } else if (sDay == "off" && sYear == "on") {
          dateOutput = year + " " + month + " " + date;
          $("#date time").html(dateOutput);
        } else if (sDay == "on" && sYear == "off") {
          dateOutput = day + ", " + month + " " + date;
          $("#date time").html(dateOutput);
        } else if (sDay == "off" && sYear == "off") {
          dateOutput = month + " " + date;
          $("#date time").html(dateOutput);
        }
      }
    } else {
      if (sShortDate == "on") {
        if (sDay == "on") {
          if (sDateDelimiter == "period") {
            if (sYear == "on") {
              dateOutput = day + ", " + shortMonth + "." + shortDate + "." + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortMonth + "." + shortDate;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "dash") {
            if (sYear == "on") {
              dateOutput = day + ", " + shortMonth + "-" + shortDate + "-" + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortMonth + "-" + shortDate;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "space") {
            if (sYear == "on") {
              dateOutput = day + ", " + shortMonth + " " + shortDate + " " + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortMonth + " " + shortDate;
              $("#date time").html(dateOutput);
            }
          } else {
            if (sYear == "on") {
              dateOutput = day + ", " + shortMonth + "/" + shortDate + "/" + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = day + ", " + shortMonth + "/" + shortDate;
              $("#date time").html(dateOutput);
            }
          }
        } else {
          if (sDateDelimiter == "period") {
            if (sYear == "on") {
              dateOutput = shortMonth + "." + shortDate + "." + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortMonth + "." + shortDate;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "dash") {
            if (sYear == "on") {
              dateOutput = shortMonth + "-" + shortDate + "-" + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortMonth + "-" + shortDate;
              $("#date time").html(dateOutput);
            }
          } else if (sDateDelimiter == "space") {
            if (sYear == "on") {
              dateOutput = shortMonth + " " + shortDate + " " + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortMonth + " " + shortDate;
              $("#date time").html(dateOutput);
            }
          } else {
            if (sYear == "on") {
              dateOutput = shortMonth + "/" + shortDate + "/" + shortYear;
              $("#date time").html(dateOutput);
            } else {
              dateOutput = shortMonth + "/" + shortDate;
              $("#date time").html(dateOutput);
            }
          }
        }
      } else {
        if (sDay == "on" && sYear == "on") {
          dateOutput = day + ", " + month + " " + date + ", " + year;
          $("#date time").html(dateOutput);
        } else if (sDay == "off" && sYear == "on") {
          dateOutput = month + " " + date + ", " + year;
          $("#date time").html(dateOutput);
        } else if (sDay == "on" && sYear == "off") {
          dateOutput = day + ", " + month + " " + date;
          $("#date time").html(dateOutput);
        } else if (sDay == "off" && sYear == "off") {
          dateOutput = month + " " + date;
          $("#date time").html(dateOutput);
        }
      }
    }
    if (sWeek == "on") {
      var weekNum = moment().tz(sPrimaryClockTimezone).isoWeek();
      if (sWeekLabel == "wk") {
        $("#date .week").html("Wk. " + weekNum);
      } else if (sWeekLabel == "pound") {
        $("#date .week").html("#" + weekNum);
      } else if (sWeekLabel == "none") {
        $("#date .week").html("" + weekNum);
      } else {
        $("#date .week").html("Week " + weekNum);
      }
    }
  }

  // Tab title
  if (sTabTitle == "tab-time") {
    document.title = timeOutput;
  } else if (sTabTitle == "tab-date") {
    document.title = dateOutput;
  } else if (sTabTitle == "tab-timedate") {
    document.title = timeOutput + " - " + dateOutput;
  } else if (sTabTitle == "tab-datetime") {
    document.title = dateOutput + " - " + timeOutput;
  } else if (sTabTitle == "new-tab") {
    document.title = "New Tab";
  } else if (sTabTitle == "tab-custom") {
    document.title = sTabTitleCustomMessage;
  }

  // Set timeout
  if (sPrimaryClock == "on" || s2ndClock == "on" || s3rdClock == "on" || s4thClock == "on" || sTabTitle == "tab-time" || sTabTitle == "tab-timedate" || sTabTitle == "tab-datetime") {
    clearTimeout(updateAllTimer);
    updateAllTimer = setTimeout(updateAll, 500);
  } else if (sDate == "on" || sTabTitle == "tab-date") {
    clearTimeout(updateAllTimer);
    updateAllTimer = setTimeout(updateAll, 60000);
  } else {
    clearTimeout(updateAllTimer);
  }
}