$(document).ready(function() {
  $("#select_fontfamily").higooglefonts({
    selectedCallback: function(e) {
      console.log(e);
    },
    loadedCallback: function(e) {
      console.log(e);
      $('#carettab').find('*').css("font-family", e);
    }
  });
});
