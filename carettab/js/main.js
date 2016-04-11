jQuery(function($){

	var getStatus = store.get('caretTabStatus');
	if (getStatus == "installed") {
        $('.installed').addClass("carettab-status-style");
        $('.installed').delay(1500).show(0);
        store.set('caretTabStatus','current');
	} else if (getStatus == "updated") {
        $('.updated').addClass("carettab-status-style");
        $('.updated').delay(1500).show(0);
        store.set('caretTabStatus','current');
	}

	var getTime = store.get('toggleTime');
	if (getTime == "off") {
		$('#time-switch').removeAttr('Checked');
		$('.time').hide();
	} else {
		$('#time-switch').attr('Checked','Checked');
		$('.time').show();
	}
    
	if ($('.time').is(":visible")) {
        // Show/Hide Seconds if time is on
		$('.section-seconds').show();
		var getSeconds = store.get('toggleSeconds');
		if (getSeconds == "off") {
			$('#seconds-switch').removeAttr('Checked');
			$('.full-date').addClass('sm');
			$('.second').hide();
		} else {
			$('#seconds-switch').attr('Checked','Checked');
			$('.full-date').removeClass('sm');
			$('.second').show();
		}
        // Show/Hide Braces if time is on
		$('.section-braces').show();
		var getBraces = store.get('toggleBraces');
		if (getBraces == "off") {
			$('#braces-switch').removeAttr('Checked');
			$('.braces').hide();
		} else {
			$('#braces-switch').attr('Checked','Checked');
			$('.braces').show();
		}
	} else {
		$('.full-date').removeClass('sm');
		$('.section-seconds').hide();
		$('.section-braces').hide();
	}

	var getDate = store.get('toggleDate');
	if (getDate == "off") {
		$('#date-switch').removeAttr('Checked');
		$('.full-date').hide();
	} else {
		$('#date-switch').attr('Checked','Checked');
		$('.full-date').show();
	}

	var getSearch = store.get('toggleSearch');
	if (getSearch == "off") {
		$('#search-switch').removeAttr('Checked');
		$('.search').hide();
		$('.section-engine').hide();
	} else {
		$('#search-switch').attr('Checked','Checked');
		$('.search').show();
		$('.section-engine').show();
	}

	var getEngine = store.get('toggleEngine');
	if (getEngine == "bing") {
		$('#engine-switch').removeAttr('Checked');
		$('#search-form').attr('action', 'http://www.bing.com/search');
		$('#search-box').attr('placeholder', 'search bing');
	} else {
		$('#engine-switch').attr('Checked','Checked');
		$('#search-form').attr('action', 'https://www.google.com/search');
		$('#search-box').attr('placeholder', 'search google');
	}

	var getAnimation = store.get('toggleAnimation');
	if (getAnimation == "off") {
		$('#animation-switch').removeAttr('Checked');
		$('body').removeClass("animation-on");
	} else {
		$('#animation-switch').attr('Checked','Checked');
		$('body').addClass("animation-on");
	}
   
    $(".current-timezone").text(moment.tz.guess());
    
    // Show/Hide First Timezone
    var getTimezoneOne = store.get('toggleFirstTimezone');
    var getFirstTimezoneZone = store.get('firstTimezoneZone');
    if (getFirstTimezoneZone == '' || getFirstTimezoneZone == null) { getFirstTimezoneZone = 'America/New_York' }
    var getFirstTimezoneLabel = store.get('firstTimezoneLabel');
    if (getFirstTimezoneLabel == '' || getFirstTimezoneLabel == null) { getFirstTimezoneLabel = 'New York' }
    if (getTimezoneOne == "off") {
        $('#timezone1-switch').removeAttr('Checked');
        $('.timezone1-settings').hide();
        $('.zone1').hide();
    } else {
        $('#timezone1-switch').attr('Checked','Checked');
        update_timezoneOne();
        $('.timezone1-settings').show();
        $('.zone1').show();
        $('#timezone1-zone[name="timezone1-zone"]').val(getFirstTimezoneZone);
        $('.zone1 .label').text(getFirstTimezoneLabel);
        $('#timezone1-label').val(getFirstTimezoneLabel);
    }
    
    // Show/Hide Second Timezone
    var getTimezoneTwo = store.get('toggleSecondTimezone');
    var getSecondTimezoneZone = store.get('secondTimezoneZone');
    if (getSecondTimezoneZone == '' || getSecondTimezoneZone == null) { getSecondTimezoneZone = 'Europe/London' }
    var getSecondTimezoneLabel = store.get('secondTimezoneLabel');
    if (getSecondTimezoneLabel == '' || getSecondTimezoneLabel == null) { getSecondTimezoneLabel = 'London' }
    if (getTimezoneTwo == "off") {
        $('#timezone2-switch').removeAttr('Checked');
        $('.timezone2-settings').hide();
        $('.zone2').hide();
    } else {
        $('#timezone2-switch').attr('Checked','Checked');
        update_timezoneTwo();
        $('.timezone2-settings').show();
        $('.zone2').show();
        $('#timezone2-zone[name="timezone2-zone"]').val(getSecondTimezoneZone).change();
        // $('#timezone2-zone > option:eq('+getSecondTimezoneZone+')').prop('selected', true);
        $('.zone2 .label').text(getSecondTimezoneLabel);
        $('#timezone2-label').val(getSecondTimezoneLabel);
    }
    
	if ($('.time').is(":visible")) {
	    update_time();
	}
    
	if ($('.zone1').is(":visible")) {
	    update_timezoneOne();
	}
    
	if ($('.zone2').is(":visible")) {
	    update_timezoneTwo();
	}
    
	if ($('.full-date').is(":visible")) {
	    update_date();
	}
});

function update_time() { 
    var dt = new Date();
    var div = dt.getMilliseconds() < 500 ? ":" : "";

    var getSeconds = store.get('toggleSeconds');

    $('.clock .hour').text(moment().format('h'));
    $('.clock .minute').text(moment().format('mm'));
    if (getSeconds == "on" || getSeconds == null) {
        $('.clock .second').text(moment().format('ss'));
    }

    $('.time-divider').text(div);

    if (getSeconds == "off") {
        document.title = moment().format('h:mm a');
    } else {
        document.title = moment().format('h:mm:ss a');
    }

    setTimeout(update_time, 500);
    clearTimeout(update_time);
};

function update_timezoneOne() { 
    var getZone = store.get('firstTimezoneZone');
    if (getZone == "" || getZone == null) {
        getZone = 'America/New_York';
    }
    var time = moment().tz(getZone).format('h:mm');    
    var meridiem = moment().tz(getZone).format('a');    
    
    $('.zone1 .tztime').text(time);
    $('.zone1 .meridiem').text(meridiem);

    setTimeout(update_timezoneOne, 500);
    clearTimeout(update_timezoneOne);
};

function update_timezoneTwo() { 
    var getZone = store.get('secondTimezoneZone');
    if (getZone == "" || getZone == null) {
        getZone = 'Europe/London';
    }
    var time = moment().tz(getZone).format('h:mm');    
    var meridiem = moment().tz(getZone).format('a');    
    
    $('.zone2 .tztime').text(time);
    $('.zone2 .meridiem').text(meridiem);

    setTimeout(update_timezoneTwo, 500);
    clearTimeout(update_timezoneTwo);
};


function update_date() { 
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    var dt = new Date();

    $('.day').text(days[dt.getDay()]);
    $('.month').text(months[dt.getMonth()]);
    $('.date').text(dt.getDate());
    $('.year').text(dt.getFullYear());

    setTimeout(update_date, 60000);
    clearTimeout(update_date);
};

$('.carettab-status .status-x').click(function() { 
    $('.carettab-status').fadeOut();
});


$('#time-switch').click(function() {
	if ($('#time-switch').is(':checked')) {
		if ($('#seconds-switch').is(':checked')) {
			$('.full-date').removeClass('sm');
		} else {
			$('.full-date').addClass('sm');
		}
		$('.time').slideDown();
		$('.section-seconds').slideDown();
		$('.section-braces').slideDown();
		var toggleTime = "on";
		store.set('toggleTime',toggleTime);
		$('#time-switch').attr('Checked','Checked');
		update_time();
	} else {
		$('.full-date').removeClass('sm');
		$('.time').slideUp();
		$('.section-seconds').slideUp();
		$('.section-braces').slideUp();
		var toggleTime = "off";
		store.set('toggleTime',toggleTime);
		$('#time-switch').removeAttr('Checked');
	}
});

$('#seconds-switch').click(function() {
	if ($('#seconds-switch').is(':checked')) {
		$('.full-date').removeClass('sm');
		$('.second').show();
		var toggleSeconds = "on";
		store.set('toggleSeconds',toggleSeconds);
		$('#seconds-switch').attr('Checked','Checked');
	} else {
		$('.full-date').addClass('sm');
		$('.second').hide();
		var toggleSeconds = "off";
		store.set('toggleSeconds',toggleSeconds);
		$('#seconds-switch').removeAttr('Checked');
	}
});

$('#braces-switch').click(function() {
	if ($('#braces-switch').is(':checked')) {
		$('.braces').show();
		var toggleBraces = "on";
		store.set('toggleBraces',toggleBraces);
		$('#braces-switch').attr('Checked','Checked');
	} else {
		$('.braces').hide();
		var toggleBraces = "off";
		store.set('toggleBraces',toggleBraces);
		$('#braces-switch').removeAttr('Checked');
	}
});

$('#timezone1-switch').click(function() {
	if ($('#timezone1-switch').is(':checked')) {
		update_timezoneOne();
		$('.timezone1-settings').slideDown();
        $('.zone1').slideDown();
		var toggleTimezoneOne = "on";
		store.set('toggleFirstTimezone',toggleTimezoneOne);
		$('#links-switch').attr('Checked','Checked');
	} else {
		$('.timezone1-settings').slideUp();
        $('.zone1').slideUp();
		var toggleTimezoneOne = "off";
		store.set('toggleFirstTimezone',toggleTimezoneOne);
		$('#timezone1-switch').removeAttr('Checked');
	}
});

$('#timezone1-zone[name="timezone1-zone"]').change(function(){
    var firstTimezoneZone = $(this).val();
    store.set('firstTimezoneZone',firstTimezoneZone);
});

$('#timezone1-label').on('input',function(e){
    var firstTimezoneLabel = $(this).val();
    store.set('firstTimezoneLabel',firstTimezoneLabel);
    $('.zone1 .label').text($(this).val());
});

$('#timezone2-switch').click(function() {
	if ($('#timezone2-switch').is(':checked')) {
		update_timezoneTwo();
		$('.timezone2-settings').slideDown();
        $('.zone2').slideDown();
		var toggleTimezoneTwo = "on";
		store.set('toggleSecondTimezone',toggleTimezoneTwo);
		$('#links-switch').attr('Checked','Checked');
	} else {
		$('.timezone2-settings').slideUp();
        $('.zone2').slideUp();
		var toggleTimezoneTwo = "off";
		store.set('toggleSecondTimezone',toggleTimezoneTwo);
		$('#timezone2-switch').removeAttr('Checked');
	}
});

$('#timezone2-zone[name="timezone2-zone"]').change(function(){
    var secondTimezoneZone = $(this).val();
    store.set('secondTimezoneZone',secondTimezoneZone);
});

$('#timezone2-label').on('input',function(e){
    var secondTimezoneLabel = $(this).val();
    store.set('secondTimezoneLabel',secondTimezoneLabel);
    $('.zone2 .label').text($(this).val());
});

$('#date-switch').click(function() {
	if ($('#date-switch').is(':checked')) {
		$('.full-date').slideDown();
		var toggleDate = "on";
		store.set('toggleDate',toggleDate);
		$('#date-switch').attr('Checked','Checked');
		update_date();
	} else {
		$('.full-date').slideUp();
		var toggleDate = "off";
		store.set('toggleDate',toggleDate);
		$('#date-switch').removeAttr('Checked');
	}
});

$('#search-switch').click(function() {
	if ($('#search-switch').is(':checked')) {
		$('.search').slideDown();
		$('.section-engine').slideDown();
		var toggleSearch = "on";
		store.set('toggleSearch',toggleSearch);
		$('#search-switch').attr('Checked','Checked');
	} else {
		$('.search').slideUp();
		$('.section-engine').slideUp();
		var toggleSearch = "off";
		store.set('toggleSearch',toggleSearch);
		$('#search-switch').removeAttr('Checked');
	}
});

$('#engine-switch').click(function() {
	if ($('#engine-switch').is(':checked')) {
		$('#search-form').attr('action', 'https://www.google.com/search');
		$('#search-box').attr('placeholder', 'search google');
		var toggleEngine = "google";
		store.set('toggleEngine',toggleEngine);
		$('#engine-switch').attr('Checked','Checked');
	} else {
		$('#search-form').attr('action', 'http://www.bing.com/search');
		$('#search-box').attr('placeholder', 'search bing');
		var toggleEngine = "bing";
		store.set('toggleEngine',toggleEngine);
		$('#engine-switch').removeAttr('Checked');
	}
});

$('#animation-switch').click(function() {
	if ($('#animation-switch').is(':checked')) {
		$('body').addClass("animation-on");
		var toggleAnimation = "on";
		store.set('toggleAnimation',toggleAnimation);
		$('#animation-switch').attr('Checked','Checked');
	} else {
		$('body').removeClass("animation-on");
		var toggleAnimation = "off";
		store.set('toggleAnimation',toggleAnimation);
		$('#animation-switch').removeAttr('Checked');
	}
});

$('#settings-toggle').click(function() {
	$('#settings-toggle').blur();
	$('#settings').toggleClass("on");
    $('.carettab-status').fadeOut();
});
$('.close').click(function() {
	$('#settings').toggleClass("on");
});

$(document).mouseup(function (e) {
    var container = $("#settings");
    if (container.hasClass("on")) {
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	        container.removeClass("on");
	        $('.theme-options').removeClass("on");
	    }
    }
});


/* ==========================================================================
   Theme Options
   ========================================================================== */

var light1 = "#ffffff";
var light2 = "#D6D6D6";
var light3 = "#5B6677";
var dark1 = "#313840";
var dark2 = "#1F2327";
var dark3 = "#000000";
var red1 = "#FF8F7E";
var red2 = "#CC3E28";
var red3 = "#7F2719";
var blue1 = "#70ADFF";
var blue2 = "#1C68CC";
var blue3 = "#12417F";
var green1 = "#D2FFBF";
var green2 = "#7DCC5C";
var green3 = "#4E7F39";
var purple1 = "#D08EFF";
var purple2 = "#A672CC";
var purple3 = "#68477F";

var light = "#dcdcdc";
var dark = "#444444";
var red = "#963636";
var green = "#548C57";
var blue = "#1688DA";

function setThemeOptions() {
	$(".light1").css({"background-color": light1});
	$(".light2").css({"background-color": light2});
	$(".light3").css({"background-color": light3});
	$(".dark1").css({"background-color": dark1});
	$(".dark2").css({"background-color": dark2});
	$(".dark3").css({"background-color": dark3});
	$(".red1").css({"background-color": red1});
	$(".red2").css({"background-color": red2});
	$(".red3").css({"background-color": red3});
	$(".blue1").css({"background-color": blue1});
	$(".blue2").css({"background-color": blue2});
	$(".blue3").css({"background-color": blue3});
	$(".green1").css({"background-color": green1});
	$(".green2").css({"background-color": green2});
	$(".green3").css({"background-color": green3});
	$(".purple1").css({"background-color": purple1});
	$(".purple2").css({"background-color": purple2});
	$(".purple3").css({"background-color": purple3});

	$(".light").css({"background-color": light});
	$(".dark").css({"background-color": dark});
	$(".red").css({"background-color": red});
	$(".green").css({"background-color": green});
	$(".blue").css({"background-color": blue});
}

function currentTheme() {
	var getTheme = store.get('theme');
	var themeClass = "."+getTheme;
	var color = getTheme;

	if (getTheme == "light") {
		color	= light;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "dark") {
		color	= dark;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "red") {
		color	= red;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "green") {
		color	= green;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "blue") {
		color	= blue;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "light1") {
		color	= light1;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "light2") {
		color	= light2;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "light3") {
		color	= light3;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "dark1") {
		color	= dark1;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "dark2") {
		color	= dark2;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "dark3") {
		color	= dark3;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "red1") {
		color	= red1;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "red2") {
		color	= red2;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "red3") {
		color	= red3;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "blue1") {
		color	= blue1;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "blue2") {
		color	= blue2;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "blue3") {
		color	= blue3;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "green1") {
		color	= green1;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "green2") {
		color	= green2;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "green3") {
		color	= green3;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "purple1") {
		color	= purple1;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "purple2") {
		color	= purple2;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else if (getTheme == "purple3") {
		color	= purple3;
		$('.theme-options > div').removeClass("on");
		$(themeClass).addClass("on");
	}
	else {
		color	= light1;
		$('.theme-options > div').removeClass("on");
		$(".light1").addClass("on");
	}
	return color;
}

function loadColor() {
	$("body").each(function() {
		var c1 = currentTheme();
        $(this).css({
        	"background-color": c1,
        });
    });
}

function processColor() {
	$("body").each(function() {
		var c1 = currentTheme();
        $(this).animate({
        	backgroundColor: c1,
        }, 500);
    });
}

$('.theme-options > div').click(function() {
	var selectedTheme = $(this).attr("class");
	store.set('theme',selectedTheme);
	processColor();
});

$('#text-switch').click(function() {
	if ($('#text-switch').is(':checked')) {
		var toggleText = "black";
		$('body').removeClass("text-white");
		$('body').addClass("text-black");
		store.set('toggleText',toggleText);
		$('#text-switch').attr('Checked','Checked');
	} else {
		var toggleText = "white";
		$('body').removeClass("text-black");
		$('body').addClass("text-white");
		store.set('toggleText',toggleText);
		$('#text-switch').removeAttr('Checked');
	}
});

$(document).ready(function(){
    var getText = store.get('toggleText');
    if (getText == "white") {
		$('body').addClass("text-white");
		$('body').removeClass("text-black");
    	$('#text-switch').removeAttr('Checked');
    } else {
		$('body').addClass("text-black");
		$('body').removeClass("text-white");
    	$('#text-switch').attr('Checked','Checked');
    }

	loadColor();
	setThemeOptions();
});
