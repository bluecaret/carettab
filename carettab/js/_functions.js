// ##############################################
// Settings Functions
// ##############################################
function tPrimaryClock(loaded) {
    if (sPrimaryClock == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sPrimaryClock': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sPrimaryClock: on");
                }
            });
        }
        $('html').addClass('on-clock1');
        $('#set-clock1').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sPrimaryClock': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sPrimaryClock: off");
                }
            });
        }
        $('html').removeClass('on-clock1');
        $('#set-clock1').removeAttr('Checked');
    }
}

function tSeconds(loaded) {
    if (sSeconds == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sSeconds': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sSeconds: on");
                }
            });
        }
        $('html').addClass('on-seconds');
        $('#set-seconds').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sSeconds': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sSeconds: off");
                }
            });
        }
        $('html').removeClass('on-seconds');
        $('#set-seconds').removeAttr('Checked');
    }
}

function tDimSeconds(loaded) {
    if (sDimSeconds == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDimSeconds': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDimSeconds: on");
                }
            });
        }
        $('html').addClass('on-dimseconds');
        $('#set-dimseconds').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDimSeconds': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDimSeconds: off");
                }
            });
        }
        $('html').removeClass('on-dimseconds');
        $('#set-dimseconds').removeAttr('Checked');
    }
}

function tDimDelimiter(loaded) {
    if (sDimDelimiter == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDimDelimiter': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDimDelimiter: on");
                }
            });
        }
        $('html').addClass('on-dimdelimiter');
        $('#set-dimdelimiter').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDimDelimiter': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDimDelimiter: off");
                }
            });
        }
        $('html').removeClass('on-dimdelimiter');
        $('#set-dimdelimiter').removeAttr('Checked');
    }
}

function tMeridiem(loaded) {
    if (sMeridiem == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sMeridiem': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sMeridiem: on");
                }
            });
        }
        $('html').addClass('on-meridiem');
        $('#set-meridiem').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sMeridiem': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sMeridiem: off");
                }
            });
        }
        $('html').removeClass('on-meridiem');
        $('#set-meridiem').removeAttr('Checked');
    }
}

function tMilitary(loaded) {
    if (sMilitary == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sMilitary': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sMilitary: on");
                }
            });
        }
        $('html').addClass('on-military');
        $('#set-military').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sMilitary': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sMilitary: off");
                }
            });
        }
        $('html').removeClass('on-military');
        $('#set-military').removeAttr('Checked');
    }
}

function tDelimiter(loaded) {
    if (sDelimiter == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDelimiter': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDelimiter: on");
                }
            });
        }
        $('html').addClass('on-delimiter');
        $('#set-delimiter').attr('Checked', 'Checked');
        var delimiter = $('#time .delimiter');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDelimiter': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDelimiter: off");
                }
            });
        }
        $('html').removeClass('on-delimiter');
        $('#set-delimiter').removeAttr('Checked');
        var delimiter = $('#time .delimiter');
    }
}

function tBlinking(loaded) {
    if (sBlinking == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sBlinking': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sBlinking: on");
                }
            });
        }
        $('html').addClass('on-blinking');
        $('#set-blinking').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sBlinking': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sBlinking: off");
                }
            });
        }
        $('html').removeClass('on-blinking');
        $('#set-blinking').removeAttr('Checked');
        var delimiter = $('#time .delimiter');
        if (sDelimiter == 'on') {
            $(delimiter).css({
                'opacity': ''
            });
        }
    }
}

function tPrimaryClockTimezone(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sPrimaryClockTimezone': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sPrimaryClockTimezone: " + value);
            }
        });
    }
    $('#set-time1-zone').val(value);
}

function t2ndClock(loaded) {
    if (s2ndClock == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                's2ndClock': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s2ndClock: on");
                }
            });
        }
        $('html').addClass('on-clock2');
        $('#set-time2').attr('Checked', 'Checked');
        $("#clock2-timezone").slideDown();
        $("#clock2-label").slideDown();
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                's2ndClock': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s2ndClock: off");
                }
            });
        }
        $('html').removeClass('on-clock2');
        $('#set-time2').removeAttr('Checked');
        $("#clock2-timezone").slideUp();
        $("#clock2-label").slideUp();
    }
}

function t2ndClockTimezone(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's2ndClockTimezone': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s2ndClockTimezone: " + value);
            }
        });
    }
    $('#set-time2-zone').val(value);
}

function t2ndClockLabel(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's2ndClockLabel': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s2ndClockLabel: " + value);
            }
        });
    }
    $('#set-time2-label').val(value);
    $('#display-clock2-label').text(value);
}

function t3rdClock(loaded) {
    if (s3rdClock == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                's3rdClock': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s3rdClock: on");
                }
            });
        }
        $('html').addClass('on-clock3');
        $('#set-time3').attr('Checked', 'Checked');
        $("#clock3-timezone").slideDown();
        $("#clock3-label").slideDown();
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                's3rdClock': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s3rdClock: off");
                }
            });
        }
        $('html').removeClass('on-clock3');
        $('#set-time3').removeAttr('Checked');
        $("#clock3-timezone").slideUp();
        $("#clock3-label").slideUp();
    }
}

function t3rdClockTimezone(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's3rdClockTimezone': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s3rdClockTimezone: " + value);
            }
        });
    }
    $('#set-time3-zone').val(value);
}

function t3rdClockLabel(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's3rdClockLabel': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s3rdClockLabel: " + value);
            }
        });
    }
    $('#set-time3-label').val(value);
    $('#display-clock3-label').text(value);
}

function t4thClock(loaded) {
    if (s4thClock == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                's4thClock': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s4thClock: on");
                }
            });
        }
        $('html').addClass('on-clock4');
        $('#set-time4').attr('Checked', 'Checked');
        $("#clock4-timezone").slideDown();
        $("#clock4-label").slideDown();
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                's4thClock': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s4thClock: off");
                }
            });
        }
        $('html').removeClass('on-clock4');
        $('#set-time4').removeAttr('Checked');
        $("#clock4-timezone").slideUp();
        $("#clock4-label").slideUp();
    }
}

function t4thClockTimezone(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's4thClockTimezone': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s4thClockTimezone: " + value);
            }
        });
    }
    $('#set-time4-zone').val(value);
}

function t4thClockLabel(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's4thClockLabel': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s4thClockLabel: " + value);
            }
        });
    }
    $('#set-time4-label').val(value);
    $('#display-clock4-label').text(value);
}

function tDate(loaded) {
    if (sDate == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDate': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDate: on");
                }
            });
        }
        $('html').addClass('on-date');
        $('#set-date').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDate': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDate: off");
                }
            });
        }
        $('html').removeClass('on-date');
        $('#set-date').removeAttr('Checked');
    }
}

function tDay(loaded) {
    if (sDay == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDay': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDay: on");
                }
            });
        }
        $('html').addClass('on-day');
        $('#set-day').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDay': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDay: off");
                }
            });
        }
        $('html').removeClass('on-day');
        $('#set-day').removeAttr('Checked');
    }
}

function tYear(loaded) {
    if (sYear == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sYear': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sYear: on");
                }
            });
        }
        $('html').addClass('on-year');
        $('#set-year').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sYear': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sYear: off");
                }
            });
        }
        $('html').removeClass('on-year');
        $('#set-year').removeAttr('Checked');
    }
}

function tShortDate(loaded) {
    if (sShortDate == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sShortDate': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sShortDate: on");
                }
            });
        }
        $('html').addClass('on-shortdate');
        $('#set-shortdate').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sShortDate': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sShortDate: off");
                }
            });
        }
        $('html').removeClass('on-shortdate');
        $('#set-shortdate').removeAttr('Checked');
    }
}

function tDateFormat(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sDateFormat': sDateFormat
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sDateFormat: " + sDateFormat);
            }
        });
    }
    $('#set-dateformat').val(value);
}

function tWeek(loaded) {
    if (sWeek == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sWeek': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sWeek: on");
                }
            });
        }
        $('html').addClass('on-week');
        $('#set-week').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sWeek': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sWeek: off");
                }
            });
        }
        $('html').removeClass('on-week');
        $('#set-week').removeAttr('Checked');
    }
}

function tBackground(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sBackground': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sBackground: " + value);
            }
        });
    }
    $('#set-background').val(value);
    $('#set-background-value').val(value);
    $('body').css({
        'background-color': value
    });
}

function tForeground(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sForeground': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sForeground: " + value);
            }
        });
    }
    var searchDiv = $('#search');
    var analogDiv = $('#analog');
    $('#set-foreground').val(value);
    $('#set-foreground-value').val(value);
    $('body').css({
        'color': value
    });
    $('#carettab').find('a').css({
        'color': value
    });
    searchDiv.css({
        'border-color': value,
        'color': value
    });
    searchDiv.find('input').css({
        'border-color': value,
        'color': value
    });
    searchDiv.find('button').css({
        'border-color': value,
    });
    searchDiv.find('button svg').css({
        'fill': value
    });
    $('#settings-toggle').find('.st0').css({
        'fill': value
    });
    analogDiv.find('circle').css({
        'fill': value
    });
    analogDiv.find('ellipse').css({
        'fill': value
    });
    analogDiv.find('.analog-face div').css({
        'background': value
    });
}

function checkLink(value, loaded) {
    if (value != undefined) {
        value = (value.indexOf('//') === -1) ? 'http://' + value : value;
    }
    return value;
}

function t1stLink(loaded) {
    if (s1stLink == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                's1stLink': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s1stLink: on");
                }
            });
        }
        $('html').addClass('on-link1');
        $('#set-link1').attr('Checked', 'Checked');
        $("#settings-link1-url").slideDown();
        $("#settings-link1-label").slideDown();
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                's1stLink': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s1stLink: off");
                }
            });
        }
        $('html').removeClass('on-link1');
        $('#set-link1').removeAttr('Checked');
        $("#settings-link1-url").slideUp();
        $("#settings-link1-label").slideUp();
    }
}

function t1stLinkUrl(value, loaded) {
    value = checkLink(value);
    if (loaded != true) {
        chrome.storage.sync.set({
            's1stLinkUrl': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s1stLinkUrl: " + value);
            }
        });
    }
    $('#set-link1-url').val(value);
    $('#link1').attr('href', value);
}

function t1stLinkLabel(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's1stLinkLabel': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s1stLinkLabel: " + value);
            }
        });
    }
    $('#set-link1-label').val(value);
    $('#link1').text(value);
}

function t2ndLink(loaded) {
    if (s2ndLink == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                's2ndLink': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s2ndLink: on");
                }
            });
        }
        $('html').addClass('on-link2');
        $('#set-link2').attr('Checked', 'Checked');
        $("#settings-link2-url").slideDown();
        $("#settings-link2-label").slideDown();
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                's2ndLink': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s2ndLink: off");
                }
            });
        }
        $('html').removeClass('on-link2');
        $('#set-link2').removeAttr('Checked');
        $("#settings-link2-url").slideUp();
        $("#settings-link2-label").slideUp();
    }
}

function t2ndLinkUrl(value, loaded) {
    value = checkLink(value);
    if (loaded != true) {
        chrome.storage.sync.set({
            's2ndLinkUrl': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s2ndLinkUrl: " + value);
            }
        });
    }
    $('#set-link2-url').val(value);
    $('#link2').attr('href', value);
}

function t2ndLinkLabel(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's2ndLinkLabel': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s2ndLinkLabel: " + value);
            }
        });
    }
    $('#set-link2-label').val(value);
    $('#link2').text(value);
}

function t3rdLink(loaded) {
    if (s3rdLink == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                's3rdLink': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s3rdLink: on");
                }
            });
        }
        $('html').addClass('on-link3');
        $('#set-link3').attr('Checked', 'Checked');
        $("#settings-link3-url").slideDown();
        $("#settings-link3-label").slideDown();
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                's3rdLink': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s3rdLink: off");
                }
            });
        }
        $('html').removeClass('on-link3');
        $('#set-link3').removeAttr('Checked');
        $("#settings-link3-url").slideUp();
        $("#settings-link3-label").slideUp();
    }
}

function t3rdLinkUrl(value, loaded) {
    value = checkLink(value);
    if (loaded != true) {
        chrome.storage.sync.set({
            's3rdLinkUrl': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s3rdLinkUrl: " + value);
            }
        });
    }
    $('#set-link3-url').val(value);
    $('#link3').attr('href', value);
}

function t3rdLinkLabel(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's3rdLinkLabel': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s3rdLinkLabel: " + value);
            }
        });
    }
    $('#set-link3-label').val(value);
    $('#link3').text(value);
}

function t4thLink(loaded) {
    if (s4thLink == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                's4thLink': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s4thLink: on");
                }
            });
        }
        $('html').addClass('on-link4');
        $('#set-link4').attr('Checked', 'Checked');
        $("#settings-link4-url").slideDown();
        $("#settings-link4-label").slideDown();
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                's4thLink': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s4thLink: off");
                }
            });
        }
        $('html').removeClass('on-link4');
        $('#set-link4').removeAttr('Checked');
        $("#settings-link4-url").slideUp();
        $("#settings-link4-label").slideUp();
    }
}

function t4thLinkUrl(value, loaded) {
    value = checkLink(value);
    if (loaded != true) {
        chrome.storage.sync.set({
            's4thLinkUrl': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s4thLinkUrl: " + value);
            }
        });
    }
    $('#set-link4-url').val(value);
    $('#link4').attr('href', value);
}

function t4thLinkLabel(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's4thLinkLabel': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s4thLinkLabel: " + value);
            }
        });
    }
    $('#set-link4-label').val(value);
    $('#link4').text(value);
}

function t5thLink(loaded) {
    if (s5thLink == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                's5thLink': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s5thLink: on");
                }
            });
        }
        $('html').addClass('on-link5');
        $('#set-link5').attr('Checked', 'Checked');
        $("#settings-link5-url").slideDown();
        $("#settings-link5-label").slideDown();
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                's5thLink': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s5thLink: off");
                }
            });
        }
        $('html').removeClass('on-link5');
        $('#set-link5').removeAttr('Checked');
        $("#settings-link5-url").slideUp();
        $("#settings-link5-label").slideUp();
    }
}

function t5thLinkUrl(value, loaded) {
    value = checkLink(value);
    if (loaded != true) {
        chrome.storage.sync.set({
            's5thLinkUrl': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s5thLinkUrl: " + value);
            }
        });
    }
    $('#set-link5-url').val(value);
    $('#link5').attr('href', value);
}

function t5thLinkLabel(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's5thLinkLabel': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s5thLinkLabel: " + value);
            }
        });
    }
    $('#set-link5-label').val(value);
    $('#link5').text(value);
}

function t6thLink(loaded) {
    if (s6thLink == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                's6thLink': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s6thLink: on");
                }
            });
        }
        $('html').addClass('on-link6');
        $('#set-link6').attr('Checked', 'Checked');
        $("#settings-link6-url").slideDown();
        $("#settings-link6-label").slideDown();
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                's6thLink': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED s6thLink: off");
                }
            });
        }
        $('html').removeClass('on-link6');
        $('#set-link6').removeAttr('Checked');
        $("#settings-link6-url").slideUp();
        $("#settings-link6-label").slideUp();
    }
}

function t6thLinkUrl(value, loaded) {
    value = checkLink(value);
    if (loaded != true) {
        chrome.storage.sync.set({
            's6thLinkUrl': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s6thLinkUrl: " + value);
            }
        });
    }
    $('#set-link6-url').val(value);
    $('#link6').attr('href', value);
}

function t6thLinkLabel(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            's6thLinkLabel': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED s6thLinkLabel: " + value);
            }
        });
    }
    $('#set-link6-label').val(value);
    $('#link6').text(value);
}

function tTabTitle(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sTabTitle': sTabTitle
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sTabTitle: " + sTabTitle);
            }
        });
    }
    $('#set-tab-title').val(value);
}

function tTabTitleCustomMessage(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sTabTitleCustomMessage': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sTabTitleCustomMessage: " + value);
            }
        });
    }
    $('#set-tab-custom-message').val(value);
}

function tCustomMessage(loaded) {
    if (sCustomMessage == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sCustomMessage': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sCustomMessage: on");
                }
            });
        }
        $('html').addClass('on-message');
        $('#set-message').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sCustomMessage': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sCustomMessage: off");
                }
            });
        }
        $('html').removeClass('on-message');
        $('#set-message').removeAttr('Checked');
    }
}

function tCustomMessageText(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sCustomMessageText': value
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sCustomMessageText: " + value);
            }
        });
    }
    $('#set-message-text').val(value);
    $('#message').text(value);
}

function tSearch(loaded) {
    if (sSearch == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sSearch': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sSearch: on");
                }
            });
        }
        $('html').addClass('on-search');
        $('#set-search').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sSearch': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sSearch: off");
                }
            });
        }
        $('html').removeClass('on-search');
        $('#set-search').removeAttr('Checked');
    }
}

function tEngine(value, loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sEngine': sEngine
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sEngine:" + sEngine);
            }
        });
    }
    $('#set-engine').val(value);
    if (sEngine == "bing") {
        $('#search').attr('action', 'http://www.bing.com/search');
        $('#search-box').attr('placeholder', 'Bing');
        $('#search-box').attr('name', 'q');
    }
    else if (sEngine == "baidu") {
        $('#search').attr('action', 'http://www.baidu.com/s');
        $('#search-box').attr('placeholder', 'Baidu');
        $('#search-box').attr('name', 'wd');
    }
    else if (sEngine == "yahoo") {
        $('#search').attr('action', 'http://search.yahoo.com/search');
        $('#search-box').attr('placeholder', 'Yahoo');
        $('#search-box').attr('name', 'p');
    }
    else if (sEngine == "ask") {
        $('#search').attr('action', 'http://www.ask.com/web');
        $('#search-box').attr('placeholder', 'Ask.com');
        $('#search-box').attr('name', 'q');
    }
    else if (sEngine == "duckduckgo") {
        $('#search').attr('action', 'http://www.duckduckgo.com/');
        $('#search-box').attr('placeholder', 'DuckDuckGo');
        $('#search-box').attr('name', 'q');
    }
    else if (sEngine == "wolframalpha") {
        $('#search').attr('action', 'http://www.wolframalpha.com/input/');
        $('#search-box').attr('placeholder', 'Wolframalpha');
        $('#search-box').attr('name', 'i');
    }
    else if (sEngine == "github") {
        $('#search').attr('action', 'https://www.github.com/search');
        $('#search-box').attr('placeholder', 'GitHub');
        $('#search-box').attr('name', 'q');
    }
    else {
        $('#search').attr('action', 'https://www.google.com/search');
        $('#search-box').attr('placeholder', 'Google');
        $('#search-box').attr('name', 'q');
    }
}

function tAnimation(loaded) {
    if (sAnimation == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sAnimation': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sAnimation: on");
                }
            });
        }
        $('html').addClass('on-animation');
        $('#set-animation').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sAnimation': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sAnimation: off");
                }
            });
        }
        $('html').removeClass('on-animation');
        $('#set-animation').removeAttr('Checked');
    }
}

function tScale(loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sScale': sScale
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sScale: " + sScale);
            }
        });
    }
    $('input[name="set-scale"]').val(sScale);
    $('#carettab').css('font-size', sScale + 'vw');
}

function tBrackets(loaded) {
    if (sBrackets == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sBrackets': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sBrackets: on");
                }
            });
        }
        $('html').addClass('on-brackets');
        $('#set-brackets').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sBrackets': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sBrackets: off");
                }
            });
        }
        $('html').removeClass('on-brackets');
        $('#set-brackets').removeAttr('Checked');
    }
}

function tDimBrackets(loaded) {
    if (sDimBrackets == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDimBrackets': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDimBrackets: on");
                }
            });
        }
        $('html').addClass('on-dimbrackets');
        $('#set-dimbrackets').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sDimBrackets': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sDimBrackets: off");
                }
            });
        }
        $('html').removeClass('on-dimbrackets');
        $('#set-dimbrackets').removeAttr('Checked');
    }
}

function tBracketStyle(loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sBracketStyle': sBracketStyle
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sBracketStyle: " + sBracketStyle);
            }
        });
    }
    $('input[name="set-bracket-style"][value="' + sBracketStyle + '"]').attr('Checked', 'Checked');
    $('html').removeClass("brackets-curly brackets-square brackets-straight brackets-paran brackets-slash");
    $('html').addClass('brackets-' + sBracketStyle + '');
}

function tDateDelimiter(loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sDateDelimiter': sDateDelimiter
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sDateDelimiter: " + sDateDelimiter);
            }
        });
    }
    $('input[name="set-date-delimiter"][value="' + sDateDelimiter + '"]').attr('Checked', 'Checked');
    $('html').removeClass("date-delimiter-slash date-delimiter-period date-delimiter-dash date-delimiter-space");
    $('html').addClass('date-delimiter-' + sDateDelimiter + '');
}

function tWeekLabel(loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sWeekLabel': sWeekLabel
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sWeekLabel: " + sWeekLabel);
            }
        });
    }
    $('input[name="set-week-label"][value="' + sWeekLabel + '"]').attr('Checked', 'Checked');
    $('html').removeClass("week-label-week week-label-wk week-label-pound week-label-none");
    $('html').addClass('week-label-' + sWeekLabel + '');
}

function tFont(loaded) {
    if (loaded != true) {
        chrome.storage.sync.set({
            'sFont': sFont
        }, function() {
            if (!chrome.runtime.lastError) {
                console.log("^CaretTab - SAVED sFont: " + sFont);
            }
        });
    }
    $('input[name="set-font"][value="' + sFont + '"]').attr('Checked', 'Checked');
    $('body').removeClass("font-exo-2 font-quicksand font-amatic-sc font-anton font-eb-garamond font-lobster font-monoton font-press-start-2p font-special-elite");
    $('body').addClass('font-' + sFont + '');
}

function tHideSettingsToggle(loaded) {
    if (sHideSettingsToggle == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sHideSettingsToggle': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sHideSettingsToggle: on");
                }
            });
        }
        $('html').removeClass('on-settings-toggle');
        $('#set-hide-settings-toggle').attr('Checked', 'Checked');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sHideSettingsToggle': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sHideSettingsToggle: off");
                }
            });
        }
        $('html').addClass('on-settings-toggle');
        $('#set-hide-settings-toggle').removeAttr('Checked');
    }
}

function tAnalog(loaded) {
    if (sAnalog == 'on') {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sAnalog': 'on'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sAnalog: on");
                }
            });
        }
        $('#set-analog').removeAttr('Checked');
        $('html').addClass('on-analog');
    }
    else {
        if (loaded != true) {
            chrome.storage.sync.set({
                'sAnalog': 'off'
            }, function() {
                if (!chrome.runtime.lastError) {
                    console.log("^CaretTab - SAVED sAnalog: off");
                }
            });
        }
        $('html').removeClass('on-analog');
        $('#set-analog').attr('Checked', 'Checked');
    }
}
