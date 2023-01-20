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

// REMOVE AFTER MIGRATION FROM OLD BACKGROUND IS NO LONGER NEEDED
const patterns = [
  { id: 200, pattern: 'checkered-pattern.png' },
  { id: 300, pattern: 'escheresque-dark.png' },
  { id: 400, pattern: '45-degree-fabric-dark.png' },
  { id: 600, pattern: 'flowers.png' },
  { id: 700, pattern: '60-lines.png' },
  { id: 800, pattern: 'clean-gray-paper.png' },
  { id: 1000, pattern: 'always-grey.png' },
  { id: 1100, pattern: 'climpek.png' },
  { id: 1200, pattern: 'gplay.png' },
  { id: 1300, pattern: 'arabesque.png' },
  { id: 1400, pattern: 'concrete-wall.png' },
  { id: 1600, pattern: 'arches.png' },
  { id: 1700, pattern: 'connected.png' },
  { id: 1900, pattern: 'argyle.png' },
  { id: 2000, pattern: 'crisp-paper-ruffles.png' },
  { id: 2100, pattern: 'inspiration-geometry.png' },
  { id: 2300, pattern: 'crissxcross.png' },
  { id: 2400, pattern: 'lined-paper-2.png' },
  { id: 2500, pattern: 'back-pattern.png' },
  { id: 2600, pattern: 'cubes.png' },
  { id: 2700, pattern: 'mirrored-squares.png' },
  { id: 2800, pattern: 'batthern.png' },
  { id: 2900, pattern: 'dark-brick-wall.png' },
  { id: 3000, pattern: 'ps-neutral.png' },
  { id: 3100, pattern: 'binding-dark.png' },
  { id: 3300, pattern: 'purty-wood.png' },
  { id: 3500, pattern: 'dark-geometric.png' },
  { id: 3600, pattern: 'retina-wood.png' },
  { id: 3700, pattern: 'black-thread-light.png' },
  { id: 3800, pattern: 'dark-leather.png' },
  { id: 3900, pattern: 'shattered.png' },
  { id: 4000, pattern: 'brick-wall.png' },
  { id: 4100, pattern: 'dark-mosaic.png' },
  { id: 4200, pattern: 'skulls.png' },
  { id: 4300, pattern: 'brick-wall-dark.png' },
  { id: 4400, pattern: 'diagmonds.png' },
  { id: 4500, pattern: 'tileable-wood.png' },
  { id: 4600, pattern: 'bright-squares.png' },
  { id: 4700, pattern: 'diagmonds-light.png' },
  { id: 4800, pattern: 'tree-bark.png' },
  { id: 4900, pattern: 'candyhole.png' },
  { id: 5100, pattern: 'use-your-illusion.png' },
  { id: 5300, pattern: 'diamond-upholstery.png' },
  { id: 5400, pattern: 'white-diamond.png' },
  { id: 5500, pattern: 'cartographer.png' },
  { id: 5600, pattern: 'escheresque.png' },
  { id: 5700, pattern: 'xv.png' }
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
