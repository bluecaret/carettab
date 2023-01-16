import { ExtPay } from "./ExtPay.js";

const bgSize = [
  { id: 10, label: 'Repeat', size: 'auto' },
  { id: 20, label: 'Cover', size: 'cover' },
  { id: 30, label: 'Contain', size: 'contain' },
  { id: 40, label: 'Scale', size: 'scale' },
  { id: 50, label: 'Scale and repeat', size: 'scaleRepeat' },
];
const bgBlend = [
  { id: 10, label: 'Normal', mode: 'normal' },
  { id: 20, label: 'Color', mode: 'color' },
  { id: 30, label: 'Color burn', mode: 'color-burn' },
  { id: 40, label: 'Color dodge', mode: 'color-dodge' },
  { id: 50, label: 'Darken', mode: 'darken' },
  { id: 60, label: 'Lighten', mode: 'lighten' },
  { id: 70, label: 'Difference', mode: 'difference' },
  { id: 80, label: 'Exclusion', mode: 'exclusion' },
  { id: 90, label: 'Hard light', mode: 'hard-light' },
  { id: 100, label: 'Soft light', mode: 'soft-light' },
  { id: 110, label: 'Hue', mode: 'hue' },
  { id: 120, label: 'Saturation', mode: 'saturation' },
  { id: 130, label: 'Luminosity', mode: 'luminosity' },
  { id: 140, label: 'Multiply', mode: 'multiply' },
  { id: 150, label: 'Screen', mode: 'screen' },
  { id: 160, label: 'Overlay', mode: 'overlay' },
];

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
  let currentWallpaper, nextWallpaper, designSettings;
  currentWallpaper = await readStorage('currentWallpaper', 'local')
  nextWallpaper = await readStorage('nextWallpaper', 'local')
  extPayUser = await readStorage('user', 'local')
  try {
    designSettings = await readStorage('ct-design', 'sync')
  } catch (error) {
    console.error('Failed to get designSettings', error);
  }

  if (designSettings) {
    // Set background color
    wallpaperDiv.style.backgroundColor = designSettings.background;

    // If Unsplash image, and user has paid, apply background image
    if (['topics', 'collections', 'search'].includes(designSettings.wallpaperType)) {
      if (extPayUser && extPayUser.paid) {
        let now = new Date();
        let then = new Date(designSettings.wallpaperTimestamp);
        let thenPlusOne = new Date(then.getFullYear(), then.getMonth(), then.getDate() + 1, 0, 0, 0, 0);
        // console.log(
        //   'Init: wallpaperTimestamp, then, thenPlusOne, now',
        //   [
        //     designSettings.wallpaperTimestamp,
        //     then,
        //     thenPlusOne,
        //     now
        //   ]
        // );

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
          chrome.storage.local.set({'ct-design': designSettings});
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
  wallpaperDiv.style.backgroundColor = design.background;
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
