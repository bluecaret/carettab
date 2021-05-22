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
    this.translate.use(this.settings.config.lang);
    this.translate.get('title.newTab').subscribe(value => {
      this.NEW_TAB_TEXT = value;
    });
    console.log('Current language: ', this.translate.currentLang);
    this.setTitle();
    this.setTitleOnInterval();
    this.settings.onChange().subscribe((data) => {
      if (
        this.settings.config.title.type === 20 ||
        this.settings.config.title.type === 40 ||
        this.settings.config.title.type === 50
      ) {
        this.setTitle();
        this.setTitleOnInterval();
      }
    });
  }

  toggleOptions() {
    if (this.shared.optionsToggle === true) {
      this.settings.setAll(this.settings.config); // Save
      this.shared.optionsToggle = false;
    } else {
      this.shared.optionsToggle = true;
    }
  }

  setTitleOnInterval() {
    if (
      this.settings.config.time.clocks.length > 0 &&
      this.settings.config.title.type === 20 ||
      this.settings.config.title.type === 40 ||
      this.settings.config.title.type === 50
    ) {
      setInterval(() => {
        this.setTitle();
      }, 500);
    } else if (
      this.settings.config.title.type === 30 ||
      this.settings.config.title.type === 40 ||
      this.settings.config.title.type === 50
    ) {
      setInterval(() => {
        this.setTitle();
      }, 60000);
    }
  }

  setTitle() {
    if (this.settings.config.title.type === 20) {
      if (this.shared.time) {
        this.titleService.setTitle( this.shared.time );
      }
    } else if (this.settings.config.title.type === 30) {
      if (this.shared.date) {
        this.titleService.setTitle( this.shared.date );
      }
    } else if (this.settings.config.title.type === 40) {
      if (this.shared.time && this.shared.date) {
        this.titleService.setTitle( this.shared.time + ' | ' + this.shared.date );
      }
    } else if (this.settings.config.title.type === 50) {
      if (this.shared.time && this.shared.date) {
        this.titleService.setTitle( this.shared.date + ' | ' + this.shared.time );
      }
    } else if (this.settings.config.title.type === 60) {
      this.titleService.setTitle( this.settings.config.title.text );
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

}
