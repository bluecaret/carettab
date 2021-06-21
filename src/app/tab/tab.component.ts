import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../_shared/shared.service';
import { Storage } from '../_storage/storage.service';
import { span, bgSize, bgBlend } from '../_shared/lists/lists';
import { tab } from '../_shared/animations';

@Component({
  selector: 'app-tab',
  templateUrl: 'tab.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    tab
  ]
})
export class TabComponent implements OnInit {
  NEW_TAB_TEXT = 'New Tab';
  span = span;
  bgSize = bgSize;
  bgBlend = bgBlend;

  constructor(
    public sanitizer: DomSanitizer,
    public shared: SharedService,
    public settings: Storage,
    private titleService: Title,
    private translate: TranslateService
  ) {
    this.shared.optionsToggle = false;
    this.titleService.setTitle(this.NEW_TAB_TEXT);
  }

  ngOnInit() {
    let localBgColor = localStorage.getItem('ct-background');
    this.shared.bgColor = localBgColor ? localBgColor : this.settings.config.design.background;
    this.translate.use(this.settings.config.i18n.lang);
    this.translate.get('title.newTab').subscribe(value => {
      this.NEW_TAB_TEXT = value;
    });
    this.shared.echo(`Loaded with language set to:`, this.translate.currentLang);


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

  setTitleOnInterval() {
    if (
      this.settings.config.time.clocks.length > 0 &&
      this.settings.config.misc.title.type === 20 ||
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
        this.titleService.setTitle( this.shared.time );
      }
    } else if (this.settings.config.misc.title.type === 30) {
      if (this.shared.date) {
        this.titleService.setTitle( this.shared.date );
      }
    } else if (this.settings.config.misc.title.type === 40) {
      if (this.shared.time && this.shared.date) {
        this.titleService.setTitle( this.shared.time + ' | ' + this.shared.date );
      }
    } else if (this.settings.config.misc.title.type === 50) {
      if (this.shared.time && this.shared.date) {
        this.titleService.setTitle( this.shared.date + ' | ' + this.shared.time );
      }
    } else if (this.settings.config.misc.title.type === 60) {
      this.titleService.setTitle( this.settings.config.misc.title.text );
    } else {
      this.titleService.setTitle( this.NEW_TAB_TEXT );
    }
  }

  getClockSpan(clockSpan) {
    return this.span.find(s => s.id === clockSpan).css;
  }

  getBgSize() {
    let s = this.bgSize.find(x => x.id === this.settings.config.design.imageSize).size;
    return s;
  }

  getBgBlend() {
    let m = this.bgBlend.find(x => x.id === this.settings.config.design.imageBlend).mode;
    return m;
  }

  getBrightness() {
    let b = this.settings.config.design.brightness * .1;
    let value = 'brightness(' + b + ')';
    return this.sanitizer.bypassSecurityTrustStyle(value);
  }

  setTimeStyles(clock): Object {
    const styles = {
      'font-size' : this.shared.getFontSize(clock.scaling, 1.7),
      'flex-basis' : this.getClockSpan(clock.span),
      'order' : this.shared.getOrder(clock.id, clock.position),
      'transform' : this.shared.getOffset(clock.offset),
      'margin' : this.shared.getMargin(clock.margin)
    };
    return styles;
  }

  setQuickLinkStyles(): Object {
    const styles = {
      'order' : this.shared.getOrder(this.settings.config.quickLink.id, this.settings.config.quickLink.position),
      'transform' : this.shared.getOffsetLarge(this.settings.config.quickLink.offset),
      'margin' : this.shared.getMargin(this.settings.config.quickLink.margin)
    };
    return styles;
  }

  setDateStyles(): Object {
    const styles = {
      'order' : this.shared.getOrder(this.settings.config.date.id, this.settings.config.date.position),
      'transform' : this.shared.getOffsetLarge(this.settings.config.date.offset),
      'margin' : this.shared.getMargin(this.settings.config.date.margin)
    };
    return styles;
  }

  setMessageStyles(): Object {
    const styles = {
      'font-size' : this.shared.getFontSize(this.settings.config.messages.scaling, 3),
      'order' : this.shared.getOrder(this.settings.config.messages.id, this.settings.config.messages.position),
      'transform' : this.shared.getOffsetLarge(this.settings.config.messages.offset),
      'margin' : this.shared.getMargin(this.settings.config.messages.margin)
    };
    return styles;
  }

  setSearchStyles(): Object {
    const styles = {
      'font-size' : this.shared.getFontSize(this.settings.config.search.scaling, 3),
      'order' : this.shared.getOrder(this.settings.config.search.id, this.settings.config.search.position),
      'transform' : this.shared.getOffsetLarge(this.settings.config.search.offset),
      'margin' : this.shared.getMargin(this.settings.config.search.margin)
    };
    return styles;
  }

  setWeatherStyles(): Object {
    const styles = {
      'font-size' : this.shared.getFontSize(this.settings.config.weather.scaling, 12),
      'order' : this.shared.getOrder(this.settings.config.weather.id, this.settings.config.weather.position),
      'transform' : this.shared.getOffsetLarge(this.settings.config.weather.offset),
      'margin' : this.shared.getMargin(this.settings.config.weather.margin)
    };
    return styles;
  }

}
