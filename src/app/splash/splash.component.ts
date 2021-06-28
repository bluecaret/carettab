import { Component, ViewEncapsulation, OnInit, NgZone } from '@angular/core';
import { transition, trigger, style, state, animate } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../_shared/shared.service';
import { Storage } from '../_storage/storage.service';
import { colors, languages } from '../_shared/lists/lists';

@Component({
  selector: 'app-splash',
  templateUrl: 'splash.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('splashFade', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', animate('800ms ease-out')),
      transition(':leave', animate('800ms ease-in')),
    ])
  ]
})
export class SplashComponent implements OnInit {
  step = 1;
  colors = colors;
  languages = languages;
  newLang: string;
  recoveredQuickLinks = [];
  printRecoveredQuickLinks: any;
  importStatus = '';
  hasBookmarkPermission: boolean;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private translate: TranslateService,
    private zone: NgZone
  ) {
  }

  ngOnInit() {
    if (this.shared.status === 'updated') {
      if (this.shared.updateType === "minor") {
        this.step = 900;
      } else if (this.shared.updateType === "major") {
        this.step = 800;
      }
    }
    this.checkBookmarkPermission();
  }

  recoverLinks() {
    if (this.recoveredQuickLinks.length > 0) {
      this.settings.config.quickLink.links = this.recoveredQuickLinks;
      this.importStatus = 'Import completed.';
      console.log('Imported Quick Links: ', this.recoveredQuickLinks);
    } else {
      this.importStatus = 'No Quick Links found to import.';
    }
  }

  removeIntro() {
    localStorage.setItem('caretTabStatus', 'existing');
    this.shared.status = 'existing';
  }

  removeIntroAndReload() {
    localStorage.setItem('caretTabStatus', 'existing');
    this.shared.status = 'existing';
    location.reload();
  }

  skipIntro() {
    this.shared.saveAll(); // Save
    this.removeIntro();
  }

  chooseLang(lang: string) {
    this.settings.config.i18n.lang = lang;
    this.translate.use(lang);
  }

  enableTime(enable: boolean) {
    if (enable) {
      this.shared.toggleOrder(this.settings.config.time.clocks[0].id, false, this.settings.config.time.clocks[0].position);
      this.settings.config.time.clocks = [];
      let newId = this.shared.createID('CLOCK');
      this.shared.toggleOrder(newId, true, 'c');
      this.settings.config.time.clocks.push({
        id: newId,
        timezone: 'Automatic',
        scaling: 10,
        span: 40,
        padding: 10,
        marginHeight: 0,
        marginWidth: 0,
        position: 'c',
        offset: 0,
        twentyFour: false,
        twoDigit: false,
        label: {
          text: 'Main clock',
          enabled: false,
          dim: false,
          scaling: 10,
          offset: 0
        },
        relativeTime: {
          enabled: false,
          dim: false,
          scaling: 10,
          offset: 0
        },
        seconds: {
          enabled: true,
          dim: false,
          scaling: 20,
          offset: 0
        },
        meridiem: {
          enabled: true,
          dim: false,
          scaling: 10,
          offset: 0,
          am: 'am',
          pm: 'pm'
        },
        delimiter: {
          enabled: true,
          dim: true,
          blink: false,
          symbol: ':',
          scaling: 10,
          offset: 0
        },
        brackets: {
          enabled: false,
          dim: false,
          left: '[',
          right: ']',
          scaling: 10,
          offset: 0,
          padding: 1
        },
        analog: {
          enabled: false,
          style: 10
        },
        binary: {
          enabled: false,
          dim: false
        }
      });
    } else {
      this.shared.toggleOrder(this.settings.config.time.clocks[0].id, false, this.settings.config.time.clocks[0].position);
      this.settings.config.time.clocks = [];
    }
    this.step = 3.1;
  }

  enableAnalytics(enable: boolean) {
    this.settings.config.misc.enableAnalytics = true;
    enable === true ?
      localStorage.setItem('ct-enableAnalytics', 'true') : localStorage.setItem('ct-enableAnalytics', 'false');
    this.step = 4;
  }

  enableDate(enable: boolean) {
    let dateId = this.settings.config.date.id;
    if (enable) {
      this.shared.toggleOrder(dateId, false, this.settings.config.date.position);
      this.settings.config.date.enabled = true;
      this.shared.toggleOrder(dateId, true, this.settings.config.date.position);
    } else {
      this.settings.config.date.enabled = false;
      this.shared.toggleOrder(dateId, false, this.settings.config.date.position);
    }
    this.step = 5;
  }

  checkBookmarkPermission() {
    const that = this;
    chrome.permissions.contains({permissions: ['bookmarks']}, function(result) {
      that.zone.run(() => {
        if (result) {
          this.hasBookmarkPermission = true;
        } else {
          this.hasBookmarkPermission = false;
        }
      });
    });
  }

  setBookmarkPermission() {
    if (this.hasBookmarkPermission) {
      this.enableBookmarks(true);
    } else {
      const that = this;
      chrome.permissions.request({permissions: ['bookmarks']}, function(granted) {
        that.zone.run(() => {
          that.enableBookmarks(true);
        });
      });
    }
  }

  enableBookmarks(enable: boolean) {
    if (enable) {
      this.settings.config.bookmark.enabled = true;
    } else {
      this.settings.config.bookmark.enabled = false;
    }
    this.step = 6;
  }

  setColors(c: {id: number, bg: string, fg: string}) {
    this.settings.config.design.background = c.bg;
    this.settings.config.design.foreground = c.fg;
    this.settings.config.design.colorsId = c.id;
    this.shared.bgColor = c.bg;
    localStorage.setItem('ct-background', c.bg);
  }

  finishIntro() {
    this.shared.saveAll(); // Save
    this.removeIntro();
    this.shared.optionsToggle = true;
  }

}
