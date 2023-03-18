import { Component, HostBinding, OnInit, Output, EventEmitter, Renderer2 } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { WallpaperService } from '../../_shared/wallpaper.service';
import { fontList, colors, customFontWeight, patterns, bgSize, bgBlend } from '../../../js/lists.js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'options-design',
  templateUrl: 'design.component.html'
})
export class OptionsDesignComponent implements OnInit {
  @Output() goTo: EventEmitter<string> = new EventEmitter<string>();
  fonts = fontList;
  fontWeights = customFontWeight;
  colors = colors;
  patterns = patterns;
  bgSize = bgSize;
  bgBlend = bgBlend;
  currentFont: string;
  currentWeight: number;
  imageSrc: SafeResourceUrl;
  toggleColors = false;
  togglePatterns = false;
  noPattern = {
    id: 0,
    pattern: '0.png'
  };
  unsplashPhotoSearchTerm: string;
  wallpaperType = this.settings.config.design.wallpaperType;
  unsplashPage = null;
  unsplashListItems = [];
  unsplashListPage = 1;
  @HostBinding('class') hostClass: string = 'panelPlateGroup';

  constructor(
    public renderer: Renderer2,
    public sanitizer: DomSanitizer,
    public settings: Storage,
    public shared: SharedService,
    public wallpaper: WallpaperService,
  ) {
    this.imageSrc = '';
  }

  ngOnInit() {
    this.getFont();
  }

  getFont() {
    let f = this.findFont(this.settings.config.design.font);
    let w = this.fonts.find(x => x.id === this.settings.config.design.font).weight;
    this.currentFont = '"' + f + '"';
    this.currentWeight = w;
  }

  findFont(font) {
    return this.fonts.find(x => x.id === font).family
  }

  getBgSize() {
    let s = this.findBgSize(this.settings.config.design.imageSize).size;
    return s;
  }

  findBgSize(size) {
    return this.bgSize.find(x => x.id === size)
  }

  getBgBlend() {
    let m = this.findBgBlend(this.settings.config.design.imageBlend).mode;
    return m;
  }

  findBgBlend(blend) {
    return this.bgBlend.find(x => x.id === blend)
  }

  setFont(font: string) {
    return '"' + font + '"';
  }

  setColors(c: {id: number, bg: string, fg: string}) {
    this.settings.config.design.background = c.bg;
    this.settings.config.design.foreground = c.fg;
    this.settings.config.design.colorsId = c.id;
    this.updateBackgroundStyles();
  }

  setPattern(p: {id: number, pattern: string}) {
    let bg = './assets/patterns/' + p.pattern;
    this.settings.config.design.patternId = p.id;
    this.settings.config.design.imageSize = 10;
    this.settings.config.design.wallpaperTimestamp = '';
    this.settings.config.design.wallpaperType = 'pattern';
    this.wallpaperType = 'pattern';
    this.settings.config.design.unsplashId = '';
    this.settings.config.design.unsplashList = '';
    this.settings.config.design.unsplashListLink = '';
    this.settings.config.design.unsplashCredit = '';
    this.settings.config.design.unsplashCreditLink = '';
    if (p.id === 0) {
      bg = './assets/patterns/0.png';
    }
    this.shared.bg = bg;
    let newBg = {base64: bg}
    chrome.storage.local.set({currentWallpaper: newBg});
    chrome.storage.local.set({nextWallpaper: null});

    // Apply image to wallpaper div
    this.updateBackgroundStyles();
    this.updateBackgroundImage();

    // Save design settings
    this.settings.setAll(this.settings.config.design, 'ct-design');
  }

  encodeImage(e, input) {
    let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    let pattern = /image-*/;
    let reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this.imageReaderLoader.bind(this);
    reader.readAsDataURL(file);
    input.value = '';
  }

  imageReaderLoader(e) {
    let reader = e.target;
    let uploadSrc = reader.result;
    setTimeout(() => {
      let newBg = {base64: uploadSrc}
      chrome.storage.local.set({currentWallpaper: newBg}, () => {
        if (chrome.runtime.lastError && chrome.runtime.lastError.message.startsWith('QUOTA_BYTES')) {
          let msg = 'Sorry, the file size of your image is too big.';
          msg += ' Try a smaller image or resize your image at';
          msg += ' https://www.reduceimages.com/';
          alert(msg);
          this.shared.echo('Background image failed, image file too large', chrome.runtime.lastError.message, uploadSrc.substr(0,20), 'error')
          return;
        } else if (chrome.runtime.lastError) {
          let msg = 'Sorry, image failed to save. Please try again.';
          alert(msg);
          this.shared.echo('Background image failed for unknown reason', chrome.runtime.lastError.message, uploadSrc.substr(0,20), 'error')
          return;
        } else {
          this.settings.config.design.patternId = 0;
          this.settings.config.design.imageSize = 20;
          this.settings.config.design.wallpaperTimestamp = '';
          this.settings.config.design.wallpaperType = 'upload';
          this.wallpaperType = 'upload';
          this.settings.config.design.unsplashId = '';
          this.settings.config.design.unsplashList = '';
          this.settings.config.design.unsplashListLink = '';
          this.settings.config.design.unsplashCredit = '';
          this.settings.config.design.unsplashCreditLink = '';

          this.shared.bg = uploadSrc;
          chrome.storage.local.set({nextWallpaper: null});

          this.updateBackgroundStyles();
          this.updateBackgroundImage();

          this.settings.setAll(this.settings.config.design, 'ct-design');
        }
      });

    }, 100);
  }

  /**
   * Applies CSS styles for background color and image to the wallpaper div.
   */
  updateBackgroundStyles() {
    const wallpaper = document.getElementById('wallpaper');
    this.renderer.setStyle(wallpaper, 'background-color', this.settings.config.design.background);
    this.renderer.setStyle(wallpaper, 'filter', this.wallpaper.getFilters());
    this.renderer.setStyle(wallpaper, 'background-size', this.wallpaper.getBgSize());
    this.renderer.setStyle(wallpaper, 'background-blend-mode', this.wallpaper.getBgBlend());
    this.renderer.setStyle(wallpaper, 'background-repeat', [10, 50].includes(this.settings.config.design.imageSize) ? 'repeat' : 'no-repeat');
  }

  /**
   * Applies image to background-image style of the wallpaper div
   */
  updateBackgroundImage() {
    const wallpaper = document.getElementById('wallpaper');
    this.renderer.setStyle(wallpaper, 'background-image', this.shared.bg && this.shared.bg !== '' ? 'url(' + this.shared.bg + ')' : 'none');
  }

  openUnsplash() {
    this.unsplashPage = null;
    this.goTo.emit('Unsplash');
  }

  openUnsplashPhotoSearch() {
    this.wallpaperType = 'search';
    this.unsplashPage = 'search';
    this.getList(1);
  }

  openUnsplashTopics() {
    this.wallpaperType = 'topics';
    this.unsplashPage = 'topics';
    this.getList(1);
  }

  openUnsplashCollections() {
    this.wallpaperType = 'collections';
    this.unsplashPage = 'collections';
    this.getList(1);
  }

  async getList(page: number) {
    if (this.wallpaperType !== 'search' && this.wallpaperType !== 'topics' && this.wallpaperType !== 'collections') { return }
    this.shared.loading = true;
    const awsEndpoint = 'https://d3v14xaicc.execute-api.us-west-2.amazonaws.com/default/caretTabKeys';
    let unsplashEndpoint = `https://api.unsplash.com/topics?per_page=11&page=${page}`;
    if (this.wallpaperType === 'collections') {
      unsplashEndpoint = `https://api.unsplash.com/collections?per_page=11&page=${page}`;
    }
    if (this.wallpaperType === 'search') {
      unsplashEndpoint = `https://api.unsplash.com/search/photos?per_page=11&page=${page}&query=${this.unsplashPhotoSearchTerm.trim()}`;
    }

    let getKeys = await fetch(awsEndpoint, { method: "post" });
    const awsText = await getKeys.text();
    const awsKeys = await JSON.parse(awsText);
    let UNSPLASH_ACCESS_KEY = awsKeys.message.unsplashKey;

    // Get image
    const headers = new Headers();
    headers.append('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`);
    let response = await fetch(unsplashEndpoint, { headers });
    const json = await response.json();

    if (this.wallpaperType === 'search') {
      this.unsplashListItems = json.results;
    } else {
      this.unsplashListItems = json;
    }
    this.unsplashListPage = page;

    this.shared.loading = false;
  }

  async getSelectedUnsplashImage(id: string, title: string, link: string) {
    try {
      this.shared.loading = true;

      // Retreive images from Unsplash
      let image, nextImage;
      if (['search'].includes(this.wallpaperType)) {
        image = await this.wallpaper.getSinglePhotoFromUnsplash(id);
        nextImage = await this.wallpaper.getSinglePhotoFromUnsplash(id);
      }
      if (['topics', 'collections'].includes(this.wallpaperType)) {
        image = await this.wallpaper.getRandomPhotoFromUnsplashList(this.wallpaperType, id);
        nextImage = await this.wallpaper.getRandomPhotoFromUnsplashList(this.wallpaperType, id);
      }

      // Set images to browser local storage
      chrome.storage.local.set({currentWallpaper: image});
      chrome.storage.local.set({nextWallpaper: nextImage});

      // Apply settings related to unsplash images
      this.settings.config.design.patternId = 0;
      this.settings.config.design.imageSize = 20;
      this.settings.config.design.wallpaperTimestamp = new Date().toLocaleString();
      this.settings.config.design.wallpaperType = this.wallpaperType;
      this.settings.config.design.unsplashId = id;
      this.settings.config.design.unsplashList = this.wallpaperType === 'search' ? '' : title;
      this.settings.config.design.unsplashListLink = this.wallpaperType === 'search' ? '' : link;
      this.settings.config.design.unsplashCredit = image.user.name;
      this.settings.config.design.unsplashCreditLink = image.user.links.html;

      // Apply image to shared bg value
      this.shared.bg = image.base64;

      // Apply image to wallpaper div
      this.updateBackgroundStyles();
      this.updateBackgroundImage();

      // Save design settings
      this.settings.setAll(this.settings.config.design, 'ct-design');
      this.shared.loading = false;
    } catch (err) {
      this.shared.loading = false;
      this.shared.echo('Error getting selected Unsplash image', err)
    }
  }

  removeWallpaper() {
    this.settings.config.design.patternId = 0;
    this.settings.config.design.wallpaperTimestamp = '';
    this.settings.config.design.wallpaperType = null;
    this.wallpaperType = null;
    this.settings.config.design.unsplashId = '';
    this.settings.config.design.unsplashList = '';
    this.settings.config.design.unsplashListLink = '';
    this.settings.config.design.unsplashCredit = '';
    this.settings.config.design.unsplashCreditLink = '';
    chrome.storage.local.remove(['currentWallpaper']);
    chrome.storage.local.remove(['nextWallpaper']);
    this.shared.bg = '';
    this.settings.setAll(this.settings.config.design, 'ct-design');
    this.updateBackgroundStyles();
    this.updateBackgroundImage();
  }

  resetWallpaperStyles() {
    this.settings.config.design.brightness = 10;
    this.settings.config.design.contrast = 10;
    this.settings.config.design.saturation = 10;
    this.settings.config.design.imageBlur = 0;
    this.settings.config.design.imageScale = 100;
    this.settings.config.design.imageBlend = 10;
    this.updateBackgroundStyles();
  }

}
