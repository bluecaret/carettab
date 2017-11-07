var storage;

function noop() {}

function getStorage() {
  try {
    return window.localStorage;
  } catch(e) {
    return {
      getItem: noop,
      setItem: noop,
      removeItem: noop,
      getAllKeys: noop
    };
  }
}

if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
  storage = { isChromeStorage: true };

  storage.getItem = function (key, callback) {
    chrome.storage.sync.get(key, function (obj) {
      if (obj[key]) callback(null, obj[key]);
      else callback(chrome.runtime.lastError, null);
    });
  };

  storage.setItem = function (key, value, callback) {
    var obj = {};
    obj[key] = value;
    chrome.storage.sync.set(obj, function () {
      if (callback && chrome.runtime.lastError) callback(key);
    });
  };

  storage.removeItem = function(key) {
    chrome.storage.sync.remove(key);
  };
  
  storage.getAllKeys = function (callback) {
    chrome.storage.sync.get(null, function (obj) {
      callback(null, Object.keys(obj));
    });
  };
}
else storage = getStorage();