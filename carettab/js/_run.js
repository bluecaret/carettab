// ##############################################
// Feature Functions
// ##############################################

function updateTime() { 
    if (sPrimaryClock == 'on') {
        if (sPrimaryClockTimezone == "" || sPrimaryClockTimezone == null) {
            sPrimaryClockTimezone = moment.tz.guess();
        }

        if (sMilitary == "on") {
            $('#time').attr('datetime',moment().tz(sPrimaryClockTimezone).format('HH:mm:ss'));
            $('#time .hour').text(moment().tz(sPrimaryClockTimezone).format('H'));
        } else {
            $('#time').attr('datetime',moment().tz(sPrimaryClockTimezone).format('hh:mm:ss'));
            $('#time .hour').text(moment().tz(sPrimaryClockTimezone).format('h'));
            if (sMeridiem == "on") {
                $('#time .meridiem').text(moment().tz(sPrimaryClockTimezone).format('a'));
            }
        }
        $('#time .hour').each(function (index) { var characters = $(this).text().split(""); $this = $(this); $this.empty(); $.each(characters, function (i, el) { $this.append("<span>" + el + "</span"); }); });
        $('#time .minute').text(moment().tz(sPrimaryClockTimezone).format('mm'));
        $('#time .minute').each(function (index) { var characters = $(this).text().split(""); $this = $(this); $this.empty(); $.each(characters, function (i, el) { $this.append("<span>" + el + "</span"); }); });
        if (sSeconds == "on") {
            $('#time .second').text(moment().tz(sPrimaryClockTimezone).format('ss'));
            $('#time .second').each(function (index) { var characters = $(this).text().split(""); $this = $(this); $this.empty(); $.each(characters, function (i, el) { $this.append("<span>" + el + "</span"); }); });
        }
        
        // Blink delimiter every half second
        var dt = new Date();
        if (sDelimiter == "on" && sBlinking == "on") {
            var delimiter = $('#time .delimiter');
            if (dt.getMilliseconds() < 500) {
                $(delimiter).css({'opacity':'1'});
            } else {
                $(delimiter).css({'opacity':'0.5'});
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
}

function updateAnalog(){
    // Analog Clock
    // Inspired by http://codepen.io/Wardee-IDUK/pen/XmMvGK?editors=0110
    // and https://cssanimation.rocks/clocks/
    if (sPrimaryClock == 'on' && sAnalog == 'on') {
        if (sPrimaryClockTimezone == "" || sPrimaryClockTimezone == null) {
            sPrimaryClockTimezone = moment.tz.guess();
        }

        var analogNow = moment().tz(sPrimaryClockTimezone),
            analogSecond = analogNow.seconds() * 6,
            analogMinute = analogNow.minutes() * 6 + analogSecond / 60,
            analogHour = ((analogNow.hours() % 12) / 12) * 360 + analogMinute / 12;
        $('#analog-hour').css("transform", "rotateZ(" + analogHour + "deg)");
        $('#analog-minute').css("transform", "rotateZ(" + analogMinute + "deg)");
        $('#analog-second').css("transform", "rotateZ(" + analogSecond + "deg)");
        setTimeout(updateAnalog, 1000);
    }
}

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
        setTimeout(updateAdditionalClocks, 1000);
    }
    clearTimeout(updateAdditionalClocks);
}

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
    
    $('#date time').attr('datetime',year+'-'+shortMonth+'-'+shortDate);
    
    if (sDateFormat == 'little') {
        if (sShortDate == 'on') {
            if (sDay == 'on') {
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortDate+'.'+shortMonth+'.'+shortYear); } else { $('#date time').html(day+', '+shortDate+'.'+shortMonth); }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortDate+'-'+shortMonth+'-'+shortYear); } else { $('#date time').html(day+', '+shortDate+'-'+shortMonth); }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortDate+' '+shortMonth+' '+shortYear); } else { $('#date time').html(day+', '+shortDate+' '+shortMonth); }
                } else {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortDate+'/'+shortMonth+'/'+shortYear); } else { $('#date time').html(day+', '+shortDate+'/'+shortMonth); }
                }
            } else {
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { $('#date time').html(shortDate+'.'+shortMonth+'.'+shortYear); } else { $('#date time').html(shortDate+'.'+shortMonth); }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { $('#date time').html(shortDate+'-'+shortMonth+'-'+shortYear); } else { $('#date time').html(shortDate+'-'+shortMonth); }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { $('#date time').html(shortDate+' '+shortMonth+' '+shortYear); } else { $('#date time').html(shortDate+' '+shortMonth); }
                } else {
                    if (sYear == 'on') { $('#date time').html(shortDate+'/'+shortMonth+'/'+shortYear); } else { $('#date time').html(shortDate+'/'+shortMonth); }
                }
            }
        } else {
            if (sDay == 'on' && sYear == 'on') {
                $('#date time').html(day+', '+date+'&nbsp;'+month+'&nbsp;'+year);
            } else if (sDay == 'off' && sYear == 'on') {
                $('#date time').html(date+'&nbsp;'+month+'&nbsp;'+year);
            } else if (sDay == 'on' && sYear == 'off') {
                $('#date time').html(day+', '+date+'&nbsp;'+month);
            } else if (sDay == 'off' && sYear == 'off') {
                $('#date time').html(date+'&nbsp;'+month);
            }
        }
    } else if (sDateFormat == 'big') {
        if (sShortDate == 'on') {
            if (sDay == 'on') {
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortYear+'.'+shortMonth+'.'+shortDate); } else { $('#date time').html(day+', '+shortMonth+'.'+shortDate); }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortYear+'-'+shortMonth+'-'+shortDate); } else { $('#date time').html(day+', '+shortMonth+'-'+shortDate); }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortYear+' '+shortMonth+' '+shortDate); } else { $('#date time').html(day+', '+shortMonth+' '+shortDate); }
                } else {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortYear+'/'+shortMonth+'/'+shortDate); } else { $('#date time').html(day+', '+shortMonth+'/'+shortDate); }
                }
            } else {
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { $('#date time').html(shortYear+'.'+shortMonth+'.'+shortDate); } else { $('#date time').html(shortMonth+'.'+shortDate); }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { $('#date time').html(shortYear+'-'+shortMonth+'-'+shortDate); } else { $('#date time').html(shortMonth+'-'+shortDate); }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { $('#date time').html(shortYear+' '+shortMonth+' '+shortDate); } else { $('#date time').html(shortMonth+' '+shortDate); }
                } else {
                    if (sYear == 'on') { $('#date time').html(shortYear+'/'+shortMonth+'/'+shortDate); } else { $('#date time').html(shortMonth+'/'+shortDate); }
                }
            }
        } else {
            if (sDay == 'on' && sYear == 'on') {
                $('#date time').html(day+', '+year+'&nbsp;'+month+'&nbsp;'+date);
            } else if (sDay == 'off' && sYear == 'on') {
                $('#date time').html(year+'&nbsp;'+month+'&nbsp;'+date);
            } else if (sDay == 'on' && sYear == 'off') {
                $('#date time').html(day+', '+month+'&nbsp;'+date);
            } else if (sDay == 'off' && sYear == 'off') {
                $('#date time').html(month+'&nbsp;'+date);
            }
        }
    } else {
        if (sShortDate == 'on') {
            if (sDay == 'on') {
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortMonth+'.'+shortDate+'.'+shortYear); } else { $('#date time').html(day+', '+shortMonth+'.'+shortDate); }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortMonth+'-'+shortDate+'-'+shortYear); } else { $('#date time').html(day+', '+shortMonth+'-'+shortDate); }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortMonth+' '+shortDate+' '+shortYear); } else { $('#date time').html(day+', '+shortMonth+' '+shortDate); }
                } else {
                    if (sYear == 'on') { $('#date time').html(day+', '+shortMonth+'/'+shortDate+'/'+shortYear); } else { $('#date time').html(day+', '+shortMonth+'/'+shortDate); }
                }
            } else {
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { $('#date time').html(shortMonth+'.'+shortDate+'.'+shortYear); } else { $('#date time').html(shortMonth+'.'+shortDate); }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { $('#date time').html(shortMonth+'-'+shortDate+'-'+shortYear); } else { $('#date time').html(shortMonth+'-'+shortDate); }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { $('#date time').html(shortMonth+' '+shortDate+' '+shortYear); } else { $('#date time').html(shortMonth+' '+shortDate); }
                } else {
                    if (sYear == 'on') { $('#date time').html(shortMonth+'/'+shortDate+'/'+shortYear); } else { $('#date time').html(shortMonth+'/'+shortDate); }
                }
            }
        } else {
            if (sDay == 'on' && sYear == 'on') {
                $('#date time').html(day+', '+month+'&nbsp;'+date+',&nbsp;'+year);
            } else if (sDay == 'off' && sYear == 'on') {
                $('#date time').html(month+'&nbsp;'+date+',&nbsp;'+year);
            } else if (sDay == 'on' && sYear == 'off') {
                $('#date time').html(day+', '+month+'&nbsp;'+date);
            } else if (sDay == 'off' && sYear == 'off') {
                $('#date time').html(month+'&nbsp;'+date);
            }
        }
    }

    if (sWeek == 'on') {
        var weekNum = moment().tz(sPrimaryClockTimezone).isoWeek();

        if (sWeekLabel == 'wk') {
            $('#date .week').html('Wk. '+weekNum);
        } else if (sWeekLabel == 'pound') {
            $('#date .week').html('#'+weekNum);
        } else if (sWeekLabel == 'none') {
            $('#date .week').html(''+weekNum);
        } else {
            $('#date .week').html('Week '+weekNum);
        }
    }

    setTimeout(updateDate, 60000);
    clearTimeout(updateDate);
}
    
function updateTabTitle()  {
    if (sTabTitle == "tab-time") {
        if (sPrimaryClockTimezone == "" || sPrimaryClockTimezone == null) {
            sPrimaryClockTimezone = moment.tz.guess();
        }

        if (sMilitary == "on") {
            if (sSeconds == "on") {
                    document.title = moment().tz(sPrimaryClockTimezone).format('H:mm:ss');
            } else {
                    document.title = moment().tz(sPrimaryClockTimezone).format('H:mm');
            }
        } else {
            if (sSeconds == "on" && sMeridiem == "on") {
                    document.title = moment().tz(sPrimaryClockTimezone).format('h:mm:ss a');
            } else if (sSeconds == "on" && sMeridiem == "off") {
                    document.title = moment().tz(sPrimaryClockTimezone).format('h:mm:ss');
            } else if (sSeconds == "off" && sMeridiem == "on") {
                    document.title = moment().tz(sPrimaryClockTimezone).format('h:mm a');
            } else if (sSeconds == "off" && sMeridiem == "off") {
                    document.title = moment().tz(sPrimaryClockTimezone).format('h:mm');
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
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { document.title = shortDate+'.'+shortMonth+'.'+shortYear; } else { document.title = shortDate+'.'+shortMonth; }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { document.title = shortDate+'-'+shortMonth+'-'+shortYear; } else { document.title = shortDate+'-'+shortMonth; }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { document.title = shortDate+' '+shortMonth+' '+shortYear; } else { document.title = shortDate+' '+shortMonth; }
                } else {
                    if (sYear == 'on') { document.title = shortDate+'/'+shortMonth+'/'+shortYear; } else { document.title = shortDate+'/'+shortMonth; }
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
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { document.title = shortYear+'.'+shortMonth+'.'+shortDate; } else { document.title = shortMonth+'.'+shortDate; }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { document.title = shortYear+'-'+shortMonth+'-'+shortDate; } else { document.title = shortMonth+'-'+shortDate; }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { document.title = shortYear+' '+shortMonth+' '+shortDate; } else { document.title = shortMonth+' '+shortDate; }
                } else {
                    if (sYear == 'on') { document.title = shortYear+'/'+shortMonth+'/'+shortDate; } else { document.title = shortMonth+'/'+shortDate; }
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
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { document.title = shortMonth+'.'+shortDate+'.'+shortYear; } else { document.title = shortMonth+'.'+shortDate; }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { document.title = shortMonth+'-'+shortDate+'-'+shortYear; } else { document.title = shortMonth+'-'+shortDate; }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { document.title = shortMonth+' '+shortDate+' '+shortYear; } else { document.title = shortMonth+' '+shortDate; }
                } else {
                    if (sYear == 'on') { document.title = shortMonth+'/'+shortDate+'/'+shortYear; } else { document.title = shortMonth+'/'+shortDate; }
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
    } else {
        var titleTime = '';
        var titleDate = '';
        getDateVars();

        if (sPrimaryClockTimezone == "" || sPrimaryClockTimezone == null) {
            sPrimaryClockTimezone = moment.tz.guess();
        }

        if (sMilitary == "on") {
            if (sSeconds == "on") {
                    titleTime = moment().tz(sPrimaryClockTimezone).format('H:mm:ss');
            } else {
                    titleTime = moment().tz(sPrimaryClockTimezone).format('H:mm');
            }
        } else {
            if (sSeconds == "on" && sMeridiem == "on") {
                    titleTime = moment().tz(sPrimaryClockTimezone).format('h:mm:ss a');
            } else if (sSeconds == "on" && sMeridiem == "off") {
                    titleTime = moment().tz(sPrimaryClockTimezone).format('h:mm:ss');
            } else if (sSeconds == "off" && sMeridiem == "on") {
                    titleTime = moment().tz(sPrimaryClockTimezone).format('h:mm a');
            } else if (sSeconds == "off" && sMeridiem == "off") {
                    titleTime = moment().tz(sPrimaryClockTimezone).format('h:mm');
            }
        }


        if (sDateFormat == 'little') {
            if (sShortDate == 'on') {
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { titleDate = shortDate+'.'+shortMonth+'.'+shortYear; } else { titleDate = shortDate+'.'+shortMonth; }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { titleDate = shortDate+'-'+shortMonth+'-'+shortYear; } else { titleDate = shortDate+'-'+shortMonth; }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { titleDate = shortDate+' '+shortMonth+' '+shortYear; } else { titleDate = shortDate+' '+shortMonth; }
                } else {
                    if (sYear == 'on') { titleDate = shortDate+'/'+shortMonth+'/'+shortYear; } else { titleDate = shortDate+'/'+shortMonth; }
                }
            } else {
                if (sDay == 'on' && sYear == 'on') {
                    titleDate = day+', '+date+' '+month+' '+year;
                } else if (sDay == 'off' && sYear == 'on') {
                    titleDate = date+' '+month+' '+year;
                } else if (sDay == 'on' && sYear == 'off') {
                    titleDate = day+', '+date+' '+month;
                } else if (sDay == 'off' && sYear == 'off') {
                    titleDate = date+' '+month;
                }
            }
        } else if (sDateFormat == 'big') {
            if (sShortDate == 'on') {
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { titleDate = shortYear+'.'+shortMonth+'.'+shortDate; } else { titleDate = shortMonth+'.'+shortDate; }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { titleDate = shortYear+'-'+shortMonth+'-'+shortDate; } else { titleDate = shortMonth+'-'+shortDate; }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { titleDate = shortYear+' '+shortMonth+' '+shortDate; } else { titleDate = shortMonth+' '+shortDate; }
                } else {
                    if (sYear == 'on') { titleDate = shortYear+'/'+shortMonth+'/'+shortDate; } else { titleDate = shortMonth+'/'+shortDate; }
                }
            } else {
                if (sDay == 'on' && sYear == 'on') {
                    titleDate = day+', '+year+' '+month+' '+date;
                } else if (sDay == 'off' && sYear == 'on') {
                    titleDate = year+' '+month+' '+date;
                } else if (sDay == 'on' && sYear == 'off') {
                    titleDate = day+', '+month+' '+date;
                } else if (sDay == 'off' && sYear == 'off') {
                    titleDate = month+' '+date;
                }
            }
        } else {
            if (sShortDate == 'on') {
                if (sDateDelimiter == 'period') {
                    if (sYear == 'on') { titleDate = shortMonth+'.'+shortDate+'.'+shortYear; } else { titleDate = shortMonth+'.'+shortDate; }
                } else if (sDateDelimiter == 'dash') {
                    if (sYear == 'on') { titleDate = shortMonth+'-'+shortDate+'-'+shortYear; } else { titleDate = shortMonth+'-'+shortDate; }
                } else if (sDateDelimiter == 'space') {
                    if (sYear == 'on') { titleDate = shortMonth+' '+shortDate+' '+shortYear; } else { titleDate = shortMonth+' '+shortDate; }
                } else {
                    if (sYear == 'on') { titleDate = shortMonth+'/'+shortDate+'/'+shortYear; } else { titleDate = shortMonth+'/'+shortDate; }
                }
            } else {
                if (sDay == 'on' && sYear == 'on') {
                    titleDate = day+', '+month+' '+date+', '+year;
                } else if (sDay == 'off' && sYear == 'on') {
                    titleDate = month+' '+date+', '+year;
                } else if (sDay == 'on' && sYear == 'off') {
                    titleDate = day+', '+month+' '+date;
                } else if (sDay == 'off' && sYear == 'off') {
                    titleDate = month+' '+date;
                }
            }
        }

        if (sTabTitle == "tab-timedate") {
            document.title = titleTime+' - '+titleDate;
        } else if (sTabTitle == "tab-datetime") {
            document.title = titleDate+' - '+titleTime;
        }
        
        if (sSeconds == 'off') {
            setTimeout(updateTabTitle, 60000);
        } else {
            setTimeout(updateTabTitle, 500);
        }
        clearTimeout(updateTabTitle);

    }
};
