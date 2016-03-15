jQuery(function($){

	var getStatus = store.get('caretTabStatus');
	if (getStatus == "installed") {
        $('.installed').delay(1500).show(0);
        store.set('caretTabStatus','current');
	} else if (getStatus == "updated") {
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

	var getLinks = store.get('toggleLinks');
	if (getLinks == "on") {
		$('#links-switch').attr('Checked','Checked');
		$('.quick-links').show();
		$('.section-urls').show();
	} else {
		$('#links-switch').removeAttr('Checked');
		$('.quick-links').hide();
		$('.section-urls').hide();
	}

	if (getLinks == "on") {
		var getLinkOne = store.get('linkOne');
		if (getLinkOne != "" && getLinkOne != null) {
			$("#url-link1").val(getLinkOne);
			processLinkOne();
		}
		var getLinkTwo = store.get('linkTwo');
		if (getLinkTwo != "" && getLinkTwo != null) {
			$("#url-link2").val(getLinkTwo);
			processLinkTwo();
		}

		var getLinkThree = store.get('linkThree');
		if (getLinkThree != "" && getLinkThree != null) {
			$("#url-link3").val(getLinkThree);
			processLinkThree();
		}

		var getLinkFour = store.get('linkFour');
		if (getLinkFour != "" && getLinkFour != null) {
			$("#url-link4").val(getLinkFour);
			processLinkFour();
		}
	}

	if ($('.time').is(":visible")) {
	    update_time();
	}
	if ($('.full-date').is(":visible")) {
	    update_date();
	}
});

function update_time() { 
    var dt = new Date();
    var hh = dt.getHours();
    var hr = hh;
        if (hr > 12) {hr = hh-12;}
        if (hr == 0) {hr = 12;}
    var mi = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
    var sd = dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds();
    var meridiem = hh >= 12 ? "pm" : "am";
    var div = dt.getMilliseconds() < 500 ? ":" : "";

    var getSeconds = store.get('toggleSeconds');

    $('.hour').text(hr);
    $('.minute').text(mi);
    $('.second').text(sd);

    $('.time-divider').text(div);

    if (getSeconds == "off") {
        document.title = hr + ":" + mi + " " + meridiem;
    } else {
        document.title = hr + ":" + mi + ":" + sd + " " + meridiem;
    }

    setTimeout(update_time, 500);
    clearTimeout(update_time);
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

$('.carettab-status').click(function() { 
    $('.carettab-status').fadeOut();
});   
$('.carettab-status').click(function() { 
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
		store.remove('toggleTime');
		$('#time-switch').attr('Checked','Checked');
		update_time();
	} else {
		$('.full-date').removeClass('sm');
		$('.time').slideUp();
		$('.section-seconds').slideUp();
		$('.section-braces').slideUp();
		var toggleTime = "off";
		store.remove('toggleTime');
		store.set('toggleTime',toggleTime);
		$('#time-switch').removeAttr('Checked');
	}
});

$('#seconds-switch').click(function() {
	if ($('#seconds-switch').is(':checked')) {
		$('.full-date').removeClass('sm');
		$('.second').show();
		store.remove('toggleSeconds');
		$('#seconds-switch').attr('Checked','Checked');
	} else {
		$('.full-date').addClass('sm');
		$('.second').hide();
		var toggleSeconds = "off";
		store.remove('toggleSeconds');
		store.set('toggleSeconds',toggleSeconds);
		$('#seconds-switch').removeAttr('Checked');
	}
});

$('#braces-switch').click(function() {
	if ($('#braces-switch').is(':checked')) {
		$('.braces').show();
		store.remove('toggleBraces');
		$('#braces-switch').attr('Checked','Checked');
	} else {
		$('.braces').hide();
		var toggleBraces = "off";
		store.remove('toggleBraces');
		store.set('toggleBraces',toggleBraces);
		$('#braces-switch').removeAttr('Checked');
	}
});

$('#date-switch').click(function() {
	if ($('#date-switch').is(':checked')) {
		$('.full-date').slideDown();
		store.remove('toggleDate');
		$('#date-switch').attr('Checked','Checked');
		update_date();
	} else {
		$('.full-date').slideUp();
		var toggleDate = "off";
		store.remove('toggleDate');
		store.set('toggleDate',toggleDate);
		$('#date-switch').removeAttr('Checked');
	}
});

$('#search-switch').click(function() {
	if ($('#search-switch').is(':checked')) {
		$('.search').slideDown();
		$('.section-engine').slideDown();
		store.remove('toggleSearch');
		$('#search-switch').attr('Checked','Checked');
	} else {
		$('.search').slideUp();
		$('.section-engine').slideUp();
		var toggleSearch = "off";
		store.remove('toggleSearch');
		store.set('toggleSearch',toggleSearch);
		$('#search-switch').removeAttr('Checked');
	}
});

$('#engine-switch').click(function() {
	if ($('#engine-switch').is(':checked')) {
		$('#search-form').attr('action', 'https://www.google.com/search');
		$('#search-box').attr('placeholder', 'search google');
		store.remove('toggleEngine');
		$('#engine-switch').attr('Checked','Checked');
	} else {
		$('#search-form').attr('action', 'http://www.bing.com/search');
		$('#search-box').attr('placeholder', 'search bing');
		var toggleEngine = "bing";
		store.remove('toggleEngine');
		store.set('toggleEngine',toggleEngine);
		$('#engine-switch').removeAttr('Checked');
	}
});

$('#animation-switch').click(function() {
	if ($('#animation-switch').is(':checked')) {
		$('body').addClass("animation-on");
		store.remove('toggleAnimation');
		$('#animation-switch').attr('Checked','Checked');
	} else {
		$('body').removeClass("animation-on");
		var toggleAnimation = "off";
		store.remove('toggleAnimation');
		store.set('toggleAnimation',toggleAnimation);
		$('#animation-switch').removeAttr('Checked');
	}
});

$('#links-switch').click(function() {
	if ($('#links-switch').is(':checked')) {
		var getLinkOne = store.get('linkOne');
		if (getLinkOne != "" && getLinkOne != null) {
			$("#url-link1").val(getLinkOne);
			processLinkOne();
		}
		var getLinkTwo = store.get('linkTwo');
		if (getLinkTwo != "" && getLinkTwo != null) {
			$("#url-link2").val(getLinkTwo);
			processLinkTwo();
		}

		var getLinkThree = store.get('linkThree');
		if (getLinkThree != "" && getLinkThree != null) {
			$("#url-link3").val(getLinkThree);
			processLinkThree();
		}

		var getLinkFour = store.get('linkFour');
		if (getLinkFour != "" && getLinkFour != null) {
			$("#url-link4").val(getLinkFour);
			processLinkFour();
		}
		$('.quick-links').slideDown();
		$('.section-urls').slideDown();
		var toggleLinks = "on";
		store.remove('toggleLinks');
		store.set('toggleLinks',toggleLinks);
		$('#links-switch').attr('Checked','Checked');
	} else {
		$('.quick-links').slideUp();
		$('.section-urls').slideUp();
		var toggleLinks = "off";
		store.remove('toggleLinks');
		store.set('toggleLinks',toggleLinks);
		$('#links-switch').removeAttr('Checked');
	}
});

$('.save-link1').click(function() {
	processLinkOne();
});

$('.save-link2').click(function() {
	processLinkTwo();
});

$('.save-link3').click(function() {
	processLinkThree();
});

$('.save-link4').click(function() {
	processLinkFour();
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


function processLinkOne() {
	var link = $("#url-link1").val();
	if (link == "") {
		$('.link1').remove();
		store.remove('linkOne');
	} else {
		$('.link1').remove();
		//var icon = 'http://grabicon.com/icon?domain='+link+'&size=32&origin=bluecaret.com';
		store.remove('linkOne');
		store.set('linkOne',link);
		//var html = "<a href='"+link+"' class='link link1'><img src='"+icon+"'></a>";
		var html = "<a href='"+link+"' class='link link1'>1</a>";
		$('.quick-links').append(html);
	}
}

function processLinkTwo() {
	var link = $("#url-link2").val();
	if (link == "") {
		$('.link2').remove();
		store.remove('linkTwo');
	} else {
		$('.link2').remove();
		// var icon = 'http://grabicon.com/icon?domain='+link+'&size=32&origin=bluecaret.com';
		store.remove('linkTwo');
		store.set('linkTwo',link);
		// var html = "<a href='"+link+"' class='link link2'><img src='"+icon+"'></a>";
		var html = "<a href='"+link+"' class='link link2'>2</a>";
		$('.quick-links').append(html);
	}
}

function processLinkThree() {
	var link = $("#url-link3").val();
	if (link == "") {
		$('.link3').remove();
		store.remove('linkThree');
	} else {
		$('.link3').remove();
		// var icon = 'http://grabicon.com/icon?domain='+link+'&size=32&origin=bluecaret.com';
		store.remove('linkThree');
		store.set('linkThree',link);
		// var html = "<a href='"+link+"' class='link link3'><img src='"+icon+"'></a>";
		var html = "<a href='"+link+"' class='link link3'>3</a>";
		$('.quick-links').append(html);
	}
}

function processLinkFour() {
	var link = $("#url-link4").val();
	if (link == "") {
		$('.link4').remove();
		store.remove('linkFour');
	} else {
		$('.link4').remove();
		// var icon = 'http://grabicon.com/icon?domain='+link+'&size=32&origin=bluecaret.com';
		store.remove('linkFour');
		store.set('linkFour',link);
		// var html = "<a href='"+link+"' class='link link4'><img src='"+icon+"'></a>";
		var html = "<a href='"+link+"' class='link link4'>5</a>";
		$('.quick-links').append(html);
	}
}




/* ==========================================================================
   Theme Options
   ========================================================================== */

var theme = {
	light1:"#ffffff",
	light2:"#dcdcdc",
	light3:"#b7b7b7",
	dark1:"#787878",
	dark2:"#595959",
	dark3:"#373737",
	dark4:"#000000",
	red1:"#fcd8cd",
	red2:"#f76262",
	red3:"#6f0e00",
	light:"#dcdcdc",
	dark:"#444444",
	red:"#963636",
	green:"#548C57",
	blue:"#1688DA",
};

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
	$('.theme-options > div').removeClass("on");
	$(this).addClass("on");
	store.remove('theme');
	store.set('theme',selectedTheme);
	processColor();
});

$('#text-switch').click(function() {
	if ($('#text-switch').is(':checked')) {
		$('body').removeClass("text-white");
		$('body').addClass("text-black");
		store.remove('toggleText');
		$('#text-switch').attr('Checked','Checked');
	} else {
		var toggleText = "white";
		$('body').removeClass("text-black");
		$('body').addClass("text-white");
		store.remove('toggleText');
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
