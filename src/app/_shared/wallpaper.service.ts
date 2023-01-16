import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SharedService } from './shared.service';
import { bgSize, bgBlend } from './lists/lists';
import { Storage } from '../_storage/storage.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class WallpaperService {
  private bgSize = bgSize;
  private bgBlend = bgBlend;
  private renderer: Renderer2;

  constructor(
    public rendererFactory: RendererFactory2,
    public sanitizer: DomSanitizer,
    public shared: SharedService,
    public settings: Storage
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public getBgSize() {
    if (this.shared.paid && this.settings.config.design.imageSize && [40, 50].includes(this.settings.config.design.imageSize)) {
      return `${this.settings.config.design.imageScale}%`;
    }
    let s = this.bgSize.find(
      (x) => x.id === this.settings.config.design.imageSize
    ).size;
    return s;
  }

  public getBgBlend() {
    let m = this.bgBlend.find(
      (x) => x.id === this.settings.config.design.imageBlend
    ).mode;
    return m;
  }

  public getFilters() {
    const brightness = this.settings.config.design.brightness == undefined ? 1 : this.settings.config.design.brightness;
    const contrast = this.settings.config.design.contrast == undefined ? 1 : this.settings.config.design.contrast;
    const saturation = this.settings.config.design.saturation == undefined ? 1 : this.settings.config.design.saturation;
    const blur = this.settings.config.design.imageBlur == undefined ? 0 : this.settings.config.design.imageBlur;

    let brightnessValue = `brightness(${brightness === 0 ? 0 : brightness * 0.1})`;
    let contrastValue = this.shared.paid ? `contrast(${contrast === 0 ? 0 : contrast * 0.1})` : ``;
    let saturationValue = this.shared.paid ? `saturate(${saturation === 0 ? 0 : saturation * 0.1})` : ``;
    let blurValue = this.shared.paid ? `blur(${blur}px)` : '';

    const value = `${brightnessValue} ${contrastValue} ${saturationValue} ${blurValue}`;
    // return this.sanitizer.bypassSecurityTrustStyle(value);
    return value;
  }

  private readLocalStorage = async (key: string[]) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, function(result) {
        (result === undefined) ? reject() : resolve(result);
      })
    })
  }

  public async applyBackgroundImageToSharedValue() {
    let localSettings;
    try {
      localSettings = await this.readLocalStorage(['currentWallpaper']);
    } catch (error) {
      console.error('Failed to get local storage data', error);
    }
    if (localSettings.currentWallpaper && localSettings.currentWallpaper !== '') {
      this.shared.bg = localSettings.currentWallpaper.base64;
    }
  }

  public async applyBackgroundImage() {
    await this.applyBackgroundImageToSharedValue();
    const wallpaper = document.getElementById('wallpaper');
    this.shared.bg && this.shared.bg != ''
      ? this.renderer.setStyle(wallpaper, 'background-image', 'url(' + this.shared.bg + ')')
      : null
  }

  /**
   * Get keys from AWS
   * @returns {Object} Keys - {"weatherApiKey", "unsplashKey"}
   */
  public async getKeys() {
    const awsEndpoint = 'https://d3v14xaicc.execute-api.us-west-2.amazonaws.com/default/caretTabKeys';
    const getKeys = await fetch(awsEndpoint, { method: "post" });
    const awsText = await getKeys.text();
    const awsKeys = JSON.parse(awsText);
    return awsKeys.message;
  }

  /**
   * Convert image blob data to base64
   * @param blob
   * @returns image as base64
   */
  public blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Returns a completed image object from Unsplash API
   * @param {string} endpoint - The Unsplash endpoint to use
   * @returns {Object} Object containing the image data and Unsplash metadata
   */
  public async getPhotoFromUnsplash(endpoint: string) {
    // Initialize image object
    let unsplashImage;

    // Get keys and setup endpoint url and headers
    const awsKeys = await this.shared.getKeys();
    const UNSPLASH_ACCESS_KEY = await awsKeys.unsplashKey;
    const headers = new Headers();
    headers.append('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`);

    // Request random photo from Unsplash endpoint and assign image data to unsplashImage
    const unsplashResponse = await fetch(endpoint, { headers });
    unsplashImage = await unsplashResponse.json();

    // Use links in Unsplash response to request raw photo data and assign to image as base64
    const unsplashRawImageData = await fetch(unsplashImage.urls.raw + '&q=85&w=2000');
    const unsplashImageBlob = await unsplashRawImageData.blob();
    unsplashImage.base64 = await this.blobToBase64(unsplashImageBlob);

    // Trigger download location link for Unsplash analytics.
    const unsplashDownloadLocation = unsplashImage.links.download_location;
    const unsplashDownloadLocationResponse = fetch(unsplashDownloadLocation, { headers });

    // Return entire built image object
    return unsplashImage;
  }

  /**
   * Get random photo from an Unsplash list
   * @param {('topics'|'collections')} type - The Unsplash list selected
   * @param {string} id - The ID of the Unsplash list
   * @returns {Object} Object containing the image data and Unsplash metadata
   */
  public async getRandomPhotoFromUnsplashList(type: string, id: string) {
    const unsplashEndpoint = `https://api.unsplash.com/photos/random/?${type}=${id}`;
    const unsplashImage = await this.getPhotoFromUnsplash(unsplashEndpoint);
    return unsplashImage;
  }

  /**
   * Get single photo from Unsplash
   * @param {string} id - The ID of the Unsplash photo
   * @returns {Object} Object containing the image data and Unsplash metadata
   */
  public async getSinglePhotoFromUnsplash(id: string) {
    const unsplashEndpoint = `https://api.unsplash.com/photos/${id}`;
    const unsplashImage = await this.getPhotoFromUnsplash(unsplashEndpoint);
    return unsplashImage;
  }

}
