import { ExtPay } from "./ExtPay.js";
import { bgSize, bgBlend, patterns } from './lists.js';

let extpay = ExtPay("carettab");
let extPayUser;
let wallpaperDiv = document.getElementById('wallpaper');

const readStorage = async (key, area) => {
  return new Promise((resolve, reject) => {
    chrome.storage[area].get([key], function (result) {
      if (result === undefined) {
        reject();
      } else {
        resolve(result[key]);
      }
    });
  });
};

async function setUserData() {
  let user = await extpay.getUser();
  extPayUser = user;
  chrome.storage.local.set({user: user})
}

function getBgSize(design, paid) {
  if (paid && design.imageSize && (design.imageSize === 40 || design.imageSize === 50)) {
    return `${design.imageScale}%`;
  }
  let s = bgSize.find(
    (x) => x.id === design.imageSize
  ).size;
  return s;
}

function getBgBlend(design) {
  let m = bgBlend.find(
    (x) => x.id === design.imageBlend
  ).mode;
  return m;
}

function getFilters(design, paid) {
  const brightness = design.brightness == undefined ? 1 : design.brightness;
  const contrast = design.contrast == undefined ? 1 : design.contrast;
  const saturation = design.saturation == undefined ? 1 : design.saturation;
  const blur = design.imageBlur == undefined ? 0 : design.imageBlur;

  let brightnessValue = `brightness(${brightness === 0 ? 0 : brightness * 0.1})`;
  let contrastValue = paid ? `contrast(${contrast === 0 ? 0 : contrast * 0.1})` : ``;
  let saturationValue = paid ? `saturate(${saturation === 0 ? 0 : saturation * 0.1})` : ``;
  let blurValue = paid ? `blur(${blur}px)` : '';

  const value = `${brightnessValue} ${contrastValue} ${saturationValue} ${blurValue}`;
  return value;
}

/**
 * setBackground grabs the currently saved wallpaper and applies it to the DOM.
 * If a random photo, will swap the current one to the next daily.
 *
 * The init file is only to be used to apply the background styles to the DOM. Retrieving
 * initial images is done upon wallpaper selection within the design options component,
 * and images are refreshed daily within the tab component.
 */
async function setBackground() {
  let currentWallpaper, nextWallpaper, designSettings, oldBg;
  currentWallpaper = await readStorage('currentWallpaper', 'local')
  oldBg = localStorage.getItem('bgImg');
  nextWallpaper = await readStorage('nextWallpaper', 'local')
  extPayUser = await readStorage('user', 'local')
  try {
    designSettings = await readStorage('ct-design', 'sync')
  } catch (error) {
    console.error('Failed to get designSettings', error);
  }

  // Migrate old background settings to new for v3.7.0.
  if ( designSettings &&
    // If currentWallpaper hasn't been set yet
    (currentWallpaper == undefined || currentWallpaper == null || currentWallpaper === '')
    // And an oldBg exists OR a pattern is set
    && (
      (oldBg != undefined && oldBg != null && oldBg !== '')
      || (designSettings.patternId != null && designSettings.patternId !== 0 && designSettings.patternId !== 9999)
    )
  ) {
    let newBg = {base64: null};

    if (designSettings.patternId != null && designSettings.patternId !== 0 && designSettings.patternId !== 9999) {
      let patternLink = patterns.filter(p => designSettings.patternId === p.id)[0].pattern;
      newBg.base64 = './assets/patterns/' + patternLink;
      designSettings.wallpaperType = 'pattern';
      console.log('set pattern');
    } else {
      newBg.base64 = oldBg;
      designSettings.wallpaperType = 'upload';
      console.log('set upload');
    }

    console.log('migrate old background:', designSettings.wallpaperType, newBg);

    chrome.storage.local.set({currentWallpaper: newBg});
    chrome.storage.local.set({nextWallpaper: null});
    chrome.storage.sync.set({'ct-design': designSettings});

    localStorage.removeItem('bgImg');

    applyBackgroundStyles(designSettings, newBg.base64);
    return;
  }

  if (designSettings) {

    // If Unsplash image, and user has paid, apply background image
    if (['topics', 'collections', 'search'].includes(designSettings.wallpaperType)) {
      if (extPayUser && extPayUser.paid) {
        let now = new Date();
        let then = new Date(designSettings.wallpaperTimestamp);
        let thenPlusOne = new Date(then.getFullYear(), then.getMonth(), then.getDate() + 1, 0, 0, 0, 0);

        if (
          ['topics', 'collections'].includes(designSettings.wallpaperType)
          && thenPlusOne < now
          && nextWallpaper != null
        ) {
          // Move next image to current
          currentWallpaper = nextWallpaper;
          nextWallpaper = null; // Set as null so app knows to request a new image

          designSettings.wallpaperTimestamp = new Date().toLocaleString();
          designSettings.unsplashCredit = currentWallpaper.user.name;
          designSettings.unsplashCreditLink = currentWallpaper.user.links.html;

          chrome.storage.local.set({currentWallpaper: currentWallpaper});
          chrome.storage.local.set({nextWallpaper: nextWallpaper});
          chrome.storage.sync.set({'ct-design': designSettings});
        }

        // Set background image
        applyBackgroundStyles(designSettings, currentWallpaper.base64);
      }
    }

    // If pattern or user upload, set background image
    if (['upload', 'pattern'].includes(designSettings.wallpaperType)) {
      applyBackgroundStyles(designSettings, currentWallpaper.base64);
    }
  }


}

function applyBackgroundStyles(design, bg) {
  wallpaperDiv.style.backgroundImage = `url(${bg})`;
  wallpaperDiv.style.filter = getFilters(design, (extPayUser && extPayUser.paid));
  wallpaperDiv.style.backgroundSize = getBgSize(design);
  wallpaperDiv.style.backgroundBlendMode = getBgBlend(design);
  wallpaperDiv.style.backgroundRepeat = [10, 50].includes(design.imageSize) ? 'repeat' : 'no-repeat';
}

async function init() {
  await setBackground();
  setUserData();
} init();
