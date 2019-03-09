import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { fontList, colors, customFontWeight, patterns, bgSize, bgBlend } from '../../_shared/lists/lists';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'options-design',
  templateUrl: 'design.component.html'
})
export class OptionsDesignComponent implements OnInit {
  fonts = fontList;
  fontWeights = customFontWeight;
  colors = colors;
  patterns = patterns;
  bgSize = bgSize;
  bgBlend = bgBlend;
  currentFont: string;
  currentWeight: number;
  imageSrc: SafeResourceUrl;
  noPattern = {
    id: 0,
    pattern: '0.png'
  };

  constructor(
    public sanitizer: DomSanitizer,
    public settings: Storage,
    public shared: SharedService
  ) {
    this.imageSrc = '';
  }

  ngOnInit() {
    this.getFont();
  }

  getFont() {
    let f = this.fonts.find(x => x.id === this.settings.config.design.font).family;
    let w = this.fonts.find(x => x.id === this.settings.config.design.font).weight;
    this.currentFont = '"' + f + '"';
    this.currentWeight = w;
  }

  getBgSize() {
    let s = this.bgSize.find(x => x.id === this.settings.config.design.imageSize).size;
    return s;
  }

  getBgBlend() {
    let m = this.bgBlend.find(x => x.id === this.settings.config.design.imageBlend).mode;
    return m;
  }

  setFont(font: string) {
    return '"' + font + '"';
  }

  setColors(c: {id: number, bg: string, fg: string}) {
    this.settings.config.design.background = c.bg;
    this.settings.config.design.foreground = c.fg;
    this.settings.config.design.colorsId = c.id;
  }

  setPattern(p: {id: number, pattern: string}) {
    let bg = './assets/patterns/' + p.pattern;
    localStorage.setItem('bgImg', bg);
    this.shared.bg = bg;
    this.settings.config.design.patternId = p.id;
    this.settings.config.design.imageSize = 10;
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
      try {
        localStorage.setItem('bgImg', uploadSrc);
        this.shared.bg = uploadSrc;
        this.settings.config.design.patternId = -1;
        this.settings.config.design.imageSize = 20;
      } catch (e) {
        if (this.isQuotaExceeded(e)) {
          let msg = 'Sorry, the file size of your image is too big.';
          msg += ' Try a smaller image or resize your image at';
          msg += ' https://www.reduceimages.com/';
          alert(msg);
        }
      }
    }, 100);
  }

  isQuotaExceeded(e) {
    let quotaExceeded = false;
    if (e) {
      if (e.code) {
        switch (e.code) {
          case 22:
            quotaExceeded = true;
            break;
          case 1014:
            // Firefox
            if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              quotaExceeded = true;
            }
            break;
        }
      }
    }
    return quotaExceeded;
  }

}
