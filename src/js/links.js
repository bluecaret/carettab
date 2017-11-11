function getLinks() {
  var links = new Array;
  var links_str;
  chrome.storage.sync.get('links', function(obj) {
    links_str = obj;
    console.log('links_str: ', links_str)
  });


  // var links_str = chrome.storage.sync.get('links', function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - GET links"); } });
  if (links_str !== null && links_str !== undefined) {
    links = JSON.parse(links_str);
  }
  return links;
}

function add() {
  var link = document.getElementById('s-link-url').value;
  console.log('link: ' + link);
  var links = getLinks();
  console.log('links: ' + links);
  links.push(link);
  console.log('links updated: ' + links);
  chrome.storage.sync.set({'links': JSON.stringify(links) }, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED links (added)"); } });
  
  showLinksInterface();
  showLinksSettings();
  
  return false;
}

function remove() {
  var id = this.getAttribute('id').replace('s-link-remove-','');
  var links = getLinks();
  links.splice(id, 1);
  chrome.storage.sync.set({'links': JSON.stringify(links) }, function() { if (!chrome.runtime.lastError) { console.log("^CaretTab - SAVED links (removed)"); } });

  showLinksInterface();
  showLinksSettings();

  return false;
}

function showLinksInterface() {
  var links = getLinks();

  for(var i=0; i<links.length; i++) {
    var html = '<a href="' + links[i] + '" id="i-link-' + i  + '" class="link">' + links[i] + '</a>';
  };

  document.getElementById('links').innerHTML = html;
}

function showLinksSettings() {
  var links = getLinks();

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
}

document.getElementById('s-link-add').addEventListener('click', add);
showLinksInterface();
showLinksSettings();