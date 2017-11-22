var storage = chrome.storage.local;
var links = new Array();

function add() {
  var link = {};
  link.label = document.getElementById('s-link-label').value;
  link.url = document.getElementById('s-link-url').value;
  console.log('link: ', link);
  storage.get('links', function(data) { 
    links = data;
    console.log('links: ', links);
    links.push(label);
    chrome.storage.sync.set({'links': JSON.stringify(links) }, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED links (added)"); } });
    
    showLinksInterface();
    showLinksSettings();
  return false;
  });
}

function remove() {
  var id = this.getAttribute('id').replace('s-link-remove-','');
  links.splice(id, 1);
  chrome.storage.sync.set({'links': JSON.stringify(links) }, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED links (removed)"); } });

  showLinksInterface();
  showLinksSettings();

  return false;
}

function showLinksInterface() {
  storage.get('links', function(data) {
    links = data.links;
    if (links != undefined) {
      for(var i=0; i<links.length; i++) {
        var html = '<a href="' + links[i] + '" id="i-link-' + i  + '" class="link">' + links[i] + '</a>';
      };
      document.getElementById('links').innerHTML = html;
    }
  });
}

function showLinksSettings() {
  storage.get('links', function(data) {
    links = data;
    console.log(links);
    if (links != undefined) {
      var html = '';
      for(var i=0; i<links.length; i++) {
        html += '<div id="s-link-' + i  + '" class="row">';
        html += '  <div class="label">';
        html += '    <span data-i18n="link1Url">Link 1 URL</span>';
        html += '    <small data-i18n="linkUrlDesc">Enter a URL for this link (including http:// or https://)</small>';
        html += '  </div>';
        html += '  <div class="input input-text">';
        html += '    <input id="s-link-url-' + i  + '" type="text" value="' + links[i] + '"><button class="remove" id="s-link-remove' + i  + '">x</button>';
        html += '  </div>';
        html += '</div>';
      };

      document.getElementById('s-links').innerHTML = html;

      var buttons = document.getElementsByClassName('remove');
      for (var i=0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', remove);
      };
    };
  });
}

document.getElementById('s-link-add').addEventListener('click', add);
showLinksInterface();
showLinksSettings();