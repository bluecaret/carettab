jQuery(function($){

	var getSeconds = localStorage.getItem('toggleSeconds');
	if (getSeconds == "off") {
		$('.toggle-seconds').removeClass("on");
		$('.second').hide();
	} else {
		$('.toggle-seconds').addClass("on");
		$('.second').show();
	}

	var getSearch = localStorage.getItem('toggleSearch');
	var noSearch = "no-search";
	if (getSearch == "off") {
		$('.toggle-search').removeClass(getSearch);
		$('#wrapper').addClass(noSearch);
		$('.search').hide();
	} else {
		$('.toggle-search').addClass(getSearch);
		$('#wrapper').removeClass(noSearch);
		$('.search').show();
	}

    (function update_time(){ 
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        var dt = new Date();
        var hh = dt.getHours();
        var hr = hh;
	        if (hr > 12) {hr = hh-12;}
	        if (hr == 0) {hr = 12;}
        var mi = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
        var sd = dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds();
        var meridiem = hh >= 12 ? "pm" : "am";
        var div = dt.getMilliseconds() < 500 ? ":" : "";

        var getSeconds = localStorage.getItem('toggleSeconds');

        $('.hour').text(hr);
        $('.minute').text(mi);
        $('.second').text(sd);
        $('.day').text(days[dt.getDay()]);
        $('.month').text(months[dt.getMonth()]);
        $('.date').text(dt.getDate());
        $('.year').text(dt.getFullYear());

        $('.time-divider').text(div);

        if (getSeconds == "off") {
	        document.title = hr + ":" + mi + " " + meridiem;
        } else {
	        document.title = hr + ":" + mi + ":" + sd + " " + meridiem;
        }

        setTimeout(update_time, 500);
        clearTimeout();
    })();
});

$('.toggle-seconds').click(function() {
	if ($('.toggle-seconds').hasClass('on')) {
		$('.second').hide();
		var toggleSeconds = "off";
		localStorage.removeItem('toggleSeconds');
		localStorage.setItem('toggleSeconds',toggleSeconds);
		$('.toggle-seconds').toggleClass('on');
	} else {
		$('.second').show();
		localStorage.removeItem('toggleSeconds');
		$('.toggle-seconds').toggleClass('on');
	}
});

$('.toggle-search').click(function() {
	var noSearch = "no-search";
	if ($('.toggle-search').hasClass('on')) {
		$('.search').hide();
		var toggleSearch = "off";
		localStorage.removeItem('toggleSearch');
		localStorage.setItem('toggleSearch',toggleSearch);
		$('.toggle-search').toggleClass('on');
		$('#wrapper').addClass(noSearch);
	} else {
		$('.search').show();
		localStorage.removeItem('toggleSearch');
		$('.toggle-search').toggleClass('on');
		$('#wrapper').removeClass(noSearch);
	}
});

$('.menu').click(function() {
	$('.menu-group').toggle();
	$('.settings').toggle();
});
$('.close').click(function() {
	$('.menu-group').toggle();
	$('.settings').toggle();
});


// Theme Options

/* ==========================================================================
   Auto text color
   http://stackoverflow.com/a/27836093/2666062
   http://jsfiddle.net/1t0heesf/1/
   Credit: Woru (http://stackoverflow.com/users/4428212/woru)
   ========================================================================== */

var themeLight = "#dcdcdc";
var themeDark = "#444444";
var themeRed = "#963636";
var themeGreen = "#548C57";
var themeBlue = "#1688DA";

function currentTheme() {
	var color;
	var getTheme = localStorage.getItem('theme');
	if (getTheme == "light") {
		color	= themeLight;
	}
	else if (getTheme == "dark") {
		color	= themeDark;
	}
	else if (getTheme == "red") {
		color	= themeRed;
	}
	else if (getTheme == "green") {
		color	= themeGreen;
	}
	else if (getTheme == "blue") {
		color	= themeBlue;
	}
	else {
		color	= themeLight;
	}
	return color;
}

function invertCssColor(color) {
    var rgb = invertColor(hexColor2rgb(color));
    return rgb2hexColor(rgb);
}

function invertColor(rgb) {
    var yuv = rgb2yuv(rgb);
    var factor = 90;
    var threshold = 100;
    yuv.y = clamp(yuv.y + (yuv.y > threshold ? -factor : factor));
    return yuv2rgb(yuv);
}

function rgb2hexColor(rgb) {
    return '#' + dec2hex(rgb.r) + dec2hex(rgb.g) + dec2hex(rgb.b);
}

function hexColor2rgb(color) {
    color = color.substring(1); // remove #
    return {
        r: parseInt(color.substring(0, 2), 16),
        g: parseInt(color.substring(2, 4), 16),
        b: parseInt(color.substring(4, 6), 16)
    };
}

function rgb2hexColor(rgb) {
    return '#' + dec2hex(rgb.r) + dec2hex(rgb.g) + dec2hex(rgb.b);
}

function dec2hex(n) {
    var hex = n.toString(16);
    if (hex.length < 2) {
        return '0' + hex;
    }
    return hex;
}

function rgb2yuv(rgb){
  var y = clamp(rgb.r *  0.29900 + rgb.g *  0.587   + rgb.b * 0.114);
  var u = clamp(rgb.r * -0.16874 + rgb.g * -0.33126 + rgb.b * 0.50000 + 128);
  var v = clamp(rgb.r *  0.50000 + rgb.g * -0.41869 + rgb.b * -0.08131 + 128);
  return {y:y, u:u, v:v};
}

function yuv2rgb(yuv){
  var y = yuv.y;
  var u = yuv.u;
  var v = yuv.v;
  var r = clamp(y + (v - 128) *  1.40200);
  var g = clamp(y + (u - 128) * -0.34414 + (v - 128) * -0.71414);
  var b = clamp(y + (u - 128) *  1.77200);
  return {r:r,g:g,b:b};
}
    
function clamp(n){
    if (n<0) { return 0;}
    if (n>255) { return 255;}
    return Math.floor(n);
}

function processColor() {

	// Change Background Color
	$("body").each(function() {
		var c1 = currentTheme();
		var c2 = invertCssColor(c1);
        $(this).css({
        	"background-color": c1,
        	"color": c2,
        });
    });

	// Change Border Color
	$("input, .theme > div").each(function() {
		var c1 = currentTheme();
		var c2 = invertCssColor(c1);
        $(this).css({
        	"border-color": c2
        });
    });
}

$('.theme > div').click(function() {
	var selectedTheme = $(this).attr("class");
	localStorage.removeItem('theme');
	localStorage.setItem('theme',selectedTheme);
	processColor();
});

$(document).ready(function(){
	processColor();

	$(".light").css({"background-color": themeLight});
	$(".dark").css({"background-color": themeDark});
	$(".red").css({"background-color": themeRed});
	$(".green").css({"background-color": themeGreen});
	$(".blue").css({"background-color": themeBlue});
});
