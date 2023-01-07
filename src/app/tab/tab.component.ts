import { Component, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../_shared/shared.service';
import { WallpaperService } from '../_shared/wallpaper.service';
import { Storage } from '../_storage/storage.service';
import { fontList, span, bgSize, bgBlend, patterns } from '../_shared/lists/lists';
import { tab } from '../_shared/animations';

@Component({
  selector: 'app-tab',
  templateUrl: 'tab.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [tab]
})
export class TabComponent implements OnInit, AfterViewInit {
  NEW_TAB_TEXT = 'New Tab';
  fontList = fontList;
  span = span;
  bgSize = bgSize;
  bgBlend = bgBlend;
  patterns = patterns;
  grid = [
    'nw', 'n', 'ne',
    'w', 'c', 'e',
    'sw', 's', 'se',
  ]

  constructor(
    public sanitizer: DomSanitizer,
    public shared: SharedService,
    public settings: Storage,
    public wallpaper: WallpaperService,
    private titleService: Title,
    private translate: TranslateService
  ) {
    this.shared.optionsToggle = false;
    this.titleService.setTitle(this.NEW_TAB_TEXT);
  }

  ngOnInit() {
    this.translate.use(this.settings.config.i18n.lang);
    this.translate.get('title.newTab').subscribe((value) => {
      this.NEW_TAB_TEXT = value;
    });

    this.setTitle();
    this.setTitleOnInterval();
    this.settings.onChange().subscribe((data) => {
      if (
        this.settings.config.misc.title.type === 20 ||
        this.settings.config.misc.title.type === 40 ||
        this.settings.config.misc.title.type === 50
      ) {
        this.setTitle();
        this.setTitleOnInterval();
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Apply current wallpaper to the shared.bg variable.
      this.wallpaper.applyBackgroundImageToSharedValue();
    }, 0);
    setTimeout(() => {
      // Migrate old pattern ids that were used prior to v3.6.0
      if (this.settings.config.design.patternId === 99999 || this.settings.config.design.patternId === 900) {
        this.settings.config.design.patternId = 0;
        this.settings.setAll(this.settings.config.design, 'ct-design');
      }

      // If Unsplash list, Get next wallpaper when none is queued up.
      this.requestNewWallpaper();
    }, 500);
  }

  requestNewWallpaper() {
    if (
      this.shared.paid
      && ['topics', 'collections'].includes(this.settings.config.design.wallpaperType)
    ) {
      let that = this;
      chrome.storage.local.get('nextWallpaper', async function(result) {
        if (result.nextWallpaper == null) {
          let next = await that.wallpaper.getRandomPhotoFromUnsplashList(that.settings.config.design.wallpaperType, that.settings.config.design.unsplashId);
          chrome.storage.local.set({nextWallpaper: next});
          that.settings.config.design.wallpaperTimestamp = new Date().toLocaleString();
          that.settings.setAll(that.settings.config.design, 'ct-design');
          console.log('Next Unsplash image grabbed.', next);
        }
      })
    }
  }

  setTitleOnInterval() {
    if (
      (this.settings.config.time.clocks.length > 0 &&
        this.settings.config.misc.title.type === 20) ||
      this.settings.config.misc.title.type === 40 ||
      this.settings.config.misc.title.type === 50
    ) {
      setInterval(() => {
        this.setTitle();
      }, 500);
    } else if (
      this.settings.config.misc.title.type === 30 ||
      this.settings.config.misc.title.type === 40 ||
      this.settings.config.misc.title.type === 50
    ) {
      setInterval(() => {
        this.setTitle();
      }, 60000);
    }
  }

  setTitle() {
    if (this.settings.config.misc.title.type === 20) {
      if (this.shared.time) {
        this.titleService.setTitle(this.shared.time);
      }
    } else if (this.settings.config.misc.title.type === 30) {
      if (this.shared.date) {
        this.titleService.setTitle(this.shared.date);
      }
    } else if (this.settings.config.misc.title.type === 40) {
      if (this.shared.time && this.shared.date) {
        this.titleService.setTitle(this.shared.time + ' | ' + this.shared.date);
      }
    } else if (this.settings.config.misc.title.type === 50) {
      if (this.shared.time && this.shared.date) {
        this.titleService.setTitle(this.shared.date + ' | ' + this.shared.time);
      }
    } else if (this.settings.config.misc.title.type === 60) {
      this.titleService.setTitle(this.settings.config.misc.title.text);
    } else {
      this.titleService.setTitle(this.NEW_TAB_TEXT);
    }
  }

  getClockSpan(clockSpan) {
    return this.span.find((s) => s.id === clockSpan).css;
  }

  getAlignment(el): string {
    if (el === 'nw' || el === 'w' || el === 'sw') {
      return 'flex-start';
    } else if (el === 'ne' || el === 'e' || el === 'se') {
      return 'flex-end';
    }
    return 'center';
  }

  setTimeStyles(clock): Object {
    const styles = {
      'font-size' : this.shared.getFontSize(clock.scaling, 1.7),
      'justify-content' : this.getAlignment(clock.position),
      'width' : this.shared.getPercentWidth(clock.span),
      'order' : this.shared.getOrder(clock.id, clock.position),
      'transform' : this.shared.getOffset(clock.offset),
      'margin' : this.shared.getMargin(clock.marginHeight, clock.marginWidth)
    };
    return styles;
  }

  setQuickLinkWrapStyles(): Object {
    const styles = {
      'order': this.shared.getOrder(
        this.settings.config.quickLink.id,
        this.settings.config.quickLink.position
      )
    };
    return styles;
  }

  setQuickLinkStyles(): Object {
    const styles = {
      'font-size': this.shared.getFontSize(
        this.settings.config.quickLink.scaling
      ),
      'max-width': this.settings.config.quickLink.vertical
        ? this.shared.getMaxWidth(100)
        : this.shared.getMaxWidth(this.settings.config.quickLink.width),
      'transform': this.shared.getOffsetLarge(
        this.settings.config.quickLink.offset
      ),
      'margin': this.shared.getMargin(
        this.settings.config.quickLink.marginHeight,
        this.settings.config.quickLink.marginWidth,
        0.4
      )
    };
    return styles;
  }

  setDateWrapStyles(): Object {
    const styles = {
      'order': this.shared.getOrder(
        this.settings.config.date.id,
        this.settings.config.date.position
      )
    };
    return styles;
  }

  setDateStyles(): Object {
    const styles = {
      'transform' : this.shared.getOffsetLarge(this.settings.config.date.offset),
      'justify-content' : this.getAlignment(this.settings.config.date.position),
      'margin' : this.shared.getMargin(this.settings.config.date.marginHeight, this.settings.config.date.marginWidth)
    };
    return styles;
  }

  setMessageWrapStyles(): Object {
    const styles = {
      'order': this.shared.getOrder(
        this.settings.config.messages.id,
        this.settings.config.messages.position
      )
    };
    return styles;
  }

  setMessageStyles(): Object {
    const styles = {
      'font-size': this.shared.getFontSize(
        this.settings.config.messages.scaling,
        3
      ),
      'text-align': this.settings.config.messages.textAlign,
      'max-width': this.shared.getMaxWidth(this.settings.config.messages.width),
      'transform': this.shared.getOffsetLarge(
        this.settings.config.messages.offset
      ),
      'margin': this.shared.getMargin(
        this.settings.config.messages.marginHeight,
        this.settings.config.messages.marginWidth
      )
    };
    return styles;
  }

  setSearchWrapStyles(): Object {
    const styles = {
      'order': this.shared.getOrder(
        this.settings.config.search.id,
        this.settings.config.search.position
      )
    };
    return styles;
  }

  setSearchStyles(): Object {
    const styles = {
      'font-size': this.shared.getFontSize(
        this.settings.config.search.scaling,
        3
      ),
      'transform': this.shared.getOffsetLarge(
        this.settings.config.search.offset
      ),
      'margin': this.shared.getMargin(
        this.settings.config.search.marginHeight,
        this.settings.config.search.marginWidth
      )
    };
    return styles;
  }

  setWeatherWrapStyles(): Object {
    const styles = {
      'order': this.shared.getOrder(
        this.settings.config.weather.id,
        this.settings.config.weather.position
      )
    };
    return styles;
  }

  setWeatherStyles(): Object {
    const styles = {
      'font-size' : this.shared.getFontSize(this.settings.config.weather.scaling, 12),
      'transform' : this.shared.getOffsetLarge(this.settings.config.weather.offset),
      'margin' : this.shared.getMargin(this.settings.config.weather.marginHeight, this.settings.config.weather.marginWidth, .4)
    };
    return styles;
  }

  setNotepadWrapStyles(): Object {
    const styles = {
      'order': this.shared.getOrder(
        this.settings.config.notepad.id,
        this.settings.config.notepad.position
      )
    };
    return styles;
  }

  setNotepadStyles(): Object {
    const styles = {
      'transform' : this.shared.getOffsetLarge(this.settings.config.notepad.offset),
      'width': this.shared.getMaxWidth(this.settings.config.notepad.width),
      'height': this.shared.getMaxHeight(this.settings.config.notepad.height),
      'margin' : this.shared.getMargin(this.settings.config.notepad.marginHeight, this.settings.config.notepad.marginWidth, .4),
    };
    return styles;
  }

  setCovidCountryWrapStyles(c: any): Object {
    const styles = {
      'order': this.shared.getOrder(c.id, c.position)
    };
    return styles;
  }

  setCovidCountryStyles(c: any): Object {
    const styles = {
      'font-size': this.shared.getFontSize(c.textScaling, 12),
      'transform': this.shared.getOffset(c.offset),
      'margin': this.shared.getMargin(c.marginHeight, c.marginWidth),
      'max-width': this.shared.getMaxWidth(c.width),
      'justify-content' : this.getAlignment(c.position),
      'gap' : this.shared.getPadding(c.padding)
    };
    return styles;
  }
}
