var storage = chrome.storage.sync;
var err = chrome.runtime.lastError;
var addBtn = document.getElementById("s-link-add");
var newLabel = document.getElementById("s-link-label");
var newUrl = document.getElementById("s-link-url");

// Temp code to pull in old links and add to new links
storage.get([
  "links",
  "s1stLink","s1stLinkLabel","s1stLinkUrl",
  "s2ndLink","s2ndLinkLabel","s2ndLinkUrl",
  "s3rdLink","s3rdLinkLabel","s3rdLinkUrl",
  "s4thLink","s4thLinkLabel","s4thLinkUrl",
  "s5thLink","s5thLinkLabel","s5thLinkUrl",
  "s6thLink","s6thLinkLabel","s6thLinkUrl"
], function(data) {
  var allLinks = data.links ? data.links : [];
  if (data.s1stLink == "on" && data.s1stLinkLabel && data.s1stLinkUrl) {
    var link1 = new link(data.s1stLinkLabel, data.s1stLinkUrl);
    allLinks.push(link1);
  }
  if (data.s2ndLink == "on" && data.s2ndLinkLabel && data.s2ndLinkUrl) {
    var link2 = new link(data.s2ndLinkLabel, data.s2ndLinkUrl);
    allLinks.push(link2);
  }
  if (data.s3rdLink == "on" && data.s3rdLinkLabel && data.s3rdLinkUrl) {
    var link3 = new link(data.s3rdLinkLabel, data.s3rdLinkUrl);
    allLinks.push(link3);
  }
  if (data.s4thLink == "on" && data.s4thLinkLabel && data.s4thLinkUrl) {
    var link4 = new link(data.s4thLinkLabel, data.s4thLinkUrl);
    allLinks.push(link4);
  }
  if (data.s5thLink == "on" && data.s5thLinkLabel && data.s5thLinkUrl) {
    var link5 = new link(data.s5thLinkLabel, data.s5thLinkUrl);
    allLinks.push(link5);
  }
  if (data.s6thLink == "on" && data.s6thLinkLabel && data.s6thLinkUrl) {
    var link6 = new link(data.s6thLinkLabel, data.s6thLinkUrl);
    allLinks.push(link6);
  }
  storage.set({"links": allLinks }, function() { if (err) { console.log("Error Saving Link: " + err); } });
  storage.remove([
    "s1stLink","s1stLinkLabel","s1stLinkUrl",
    "s2ndLink","s2ndLinkLabel","s2ndLinkUrl",
    "s3rdLink","s3rdLinkLabel","s3rdLinkUrl",
    "s4thLink","s4thLinkLabel","s4thLinkUrl",
    "s5thLink","s5thLinkLabel","s5thLinkUrl",
    "s6thLink","s6thLinkLabel","s6thLinkUrl"
  ], function() { if (err) { console.log("Error Removing Old Links: " + err); } });
  showLinksInterface();
  showLinksSettings();
});

function link (theLabel, theUrl) {
  this.label = theLabel;
  this.url = theUrl;
}

function add() {
  storage.get("links", function(data) {
    var allLinks = data.links ? data.links : [];
    var checkedNewUrl = checkLink(newUrl.value);
    var newLink = new link(newLabel.value, checkedNewUrl);

    allLinks.push(newLink);
    storage.set({"links": allLinks }, function() { if (err) { console.log("Error Saving Link: " + err); } });

    newLabel.value = "";
    newUrl.value = "";

    showLinksInterface();
    showLinksSettings();
  });
}

function remove() {
  var id = this.getAttribute("id").replace("s-link-remove-","");
  storage.get("links", function(data) {
    var allLinks = data.links ? data.links : [];

    for(var i = 0; i < allLinks.length; i++) {
      if (i == id) {
        allLinks.splice(i, 1);
      }
    }

    storage.set({"links": allLinks }, function() { if (err) { console.log("Error Removing Link: " + err); } });

    showLinksInterface();
    showLinksSettings();
  });
}

function edit() {
  var id = this.getAttribute("id").replace("s-link-edit-","");
  var editLabel = document.getElementById("s-link-label-"+id);
  var editUrl = document.getElementById("s-link-url-"+id);

  storage.get("links", function(data) {
    var allLinks = data.links ? data.links : [];
    var editLink = new link(editLabel.value, editUrl.value);

    for(var i = 0; i < allLinks.length; i++) {
      if (i == id) {
        allLinks[i] = editLink;
      }
    }
    
    storage.set({"links": allLinks }, function() { if (err) { console.log("Error Editing Link: " + err); } });

    showLinksInterface();
    showLinksSettings();
  });
}

function showLinksInterface() {
  storage.get("links", function(data) {
    var allLinks = data.links;

    if (allLinks != undefined) {
      var html = "";

      for(var i = 0; i < allLinks.length; i++) {
        html += "<a href=\"" + allLinks[i].url + "\" id=\"i-link-" + i  + "\" class=\"link\">" + allLinks[i].label + "</a>";
      }

      document.getElementById("links").innerHTML = html;
    }
  });
}

function showLinksSettings() {
  storage.get("links", function(data) {
    var allLinks = data.links;

    if (allLinks != undefined) {
      var html = "";
      
      for(var i = 0; i < allLinks.length; i++) {
        html += "<div id=\"s-link-" + i  + "\" class=\"row\">";
        html += "  <div class=\"label\">";
        html += "    <span data-i18n=\""+ chrome.i18n.getMessage("link") +" \">Link </span>" + (i + 1);
        html += "  </div>";
        html += "  <div class=\"input input-text\" style=\"width:30%\">";
        html += "    <input id=\"s-link-label-" + i  + "\" type=\"text\" value=\"" + allLinks[i].label + "\">";
        html += "  </div>";
        html += "  <div class=\"input input-text\" style=\"width:30%\">";
        html += "    <input id=\"s-link-url-" + i  + "\" type=\"text\" value=\"" + allLinks[i].url + "\">";
        html += "  </div>";
        html += "  <div class=\"label\" style=\"flex: 0 0 auto;\">";
        html += "    <button class=\"edit-link btn\" id=\"s-link-edit-" + i  + "\">&#9998;</button>";
        html += "    <button class=\"remove-link btn\" id=\"s-link-remove-" + i  + "\">&#10006;</button>";
        html += "  </div>";
        html += "</div>";
      }

      document.getElementById("s-links").innerHTML = html;

      var removeBtns = document.getElementsByClassName("remove-link");
      for (var i=0; i < removeBtns.length; i++) {
        removeBtns[i].addEventListener("click", remove);
      }

      var editBtns = document.getElementsByClassName("edit-link");
      for (var i=0; i < editBtns.length; i++) {
        editBtns[i].addEventListener("click", edit);
      }
    }
  });
}

function checkLink(value, loaded) {
  if (value != undefined) {
    value = (value.indexOf("//") === -1) ? "http://" + value : value;
  }
  return value;
}

addBtn.addEventListener("click", add);
showLinksInterface();
showLinksSettings();