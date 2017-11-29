var storage = chrome.storage.sync;
var err = chrome.runtime.lastError;
var addBtn = document.getElementById('s-link-add');
var newLabel = document.getElementById('s-link-label');
var newUrl = document.getElementById('s-link-url');

function link (theLabel, theUrl) {
  this.label = theLabel;
  this.url = theUrl;
}

function add() {
  storage.get('links', function(data) {
    var allLinks = data.links ? data.links : [];
    var newLink = new link(newLabel.value, newUrl.value);

    allLinks.push(newLink);
    storage.set({'links': allLinks }, function() { if (err) { console.log('Error Saving Link: ' + err); } });

    showLinksInterface();
    showLinksSettings();
  });
}

function remove() {
  var id = this.getAttribute('id').replace('s-link-remove-','');
  storage.get('links', function(data) {
    var allLinks = data.links ? data.links : [];

    for(var i = 0; i < allLinks.length; i++) {
      if (i == id) {
        allLinks.splice(i, 1);
      }
    };

    storage.set({'links': allLinks }, function() { if (err) { console.log('Error Removing Link: ' + err); } });

    showLinksInterface();
    showLinksSettings();
  });
}

function edit() {
  var id = this.getAttribute('id').replace('s-link-edit-','');
  var editLabel = document.getElementById('s-link-label-'+id);
  var editUrl = document.getElementById('s-link-url-'+id);

  storage.get('links', function(data) {
    var allLinks = data.links ? data.links : [];
    var editLink = new link(editLabel.value, editUrl.value);

    for(var i = 0; i < allLinks.length; i++) {
      if (i == id) {
        allLinks[i] = editLink;
      }
    };
    
    storage.set({'links': allLinks }, function() { if (err) { console.log('Error Editing Link: ' + err); } });

    showLinksInterface();
    showLinksSettings();
  });
}

function showLinksInterface() {
  storage.get('links', function(data) {
    var allLinks = data.links;

    if (allLinks != undefined) {
      console.log('start link interface: ', allLinks);
      var html = ''

      for(var i = 0; i < allLinks.length; i++) {
        html += '<a href="' + allLinks[i].url + '" id="i-link-' + i  + '" class="link">' + allLinks[i].label + '</a>';
      };

      document.getElementById('links').innerHTML = html;
    }
  });
}

function showLinksSettings() {
  storage.get('links', function(data) {
    var allLinks = data.links;

    if (allLinks != undefined) {
      var html = '';
      
      for(var i = 0; i < allLinks.length; i++) {
        html += '<div id="s-link-' + i  + '" class="row">';
        html += '  <div class="label">';
        html += '    <span data-i18n="'+ chrome.i18n.getMessage("link") +' ">Link </span>' + (i + 1);
        html += '  </div>';
        html += '  <div class="input input-text" style="width:30%">';
        html += '    <input id="s-link-label-' + i  + '" type="text" value="' + allLinks[i].label + '">';
        html += '  </div>';
        html += '  <div class="input input-text" style="width:30%">';
        html += '    <input id="s-link-url-' + i  + '" type="text" value="' + allLinks[i].url + '">';
        html += '  </div>';
        html += '  <div class="label" style="flex: 0 0 auto;">';
        html += '    <button class="edit-link btn" id="s-link-edit-' + i  + '">&#9998;</button>';
        html += '    <button class="remove-link btn" id="s-link-remove-' + i  + '">&#10006;</button>';
        html += '  </div>';
        html += '</div>';
      };

      document.getElementById('s-links').innerHTML = html;

      var removeBtns = document.getElementsByClassName('remove-link');
      for (var i=0; i < removeBtns.length; i++) {
        removeBtns[i].addEventListener('click', remove);
      };

      var editBtns = document.getElementsByClassName('edit-link');
      for (var i=0; i < editBtns.length; i++) {
        editBtns[i].addEventListener('click', edit);
      };
    };
  });
}

function checkLink(value, loaded) {
  if (value != undefined) {
    value = (value.indexOf('//') === -1) ? 'http://' + value : value;
  }
  return value;
}

addBtn.addEventListener('click', add);
showLinksInterface();
showLinksSettings();