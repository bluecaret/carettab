import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { transition, trigger, style, state, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from './_shared/shared.service';
import { Storage } from './_storage/storage.service';
import { patterns } from './_shared/lists/lists';
import { tab } from './_shared/animations';
import * as moment from 'moment';
import { compare } from 'compare-versions';
import * as Bowser from 'bowser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    tab,
    trigger('fade', [
      state('*', style({
        opacity: 1
      })),
      state('void',   style({
        opacity: 0
      })),
      transition('* => void', animate('250ms ease-out')),
      transition('void => *', animate('250ms ease-in'))
    ]),
    trigger('slideIn', [
      state('*', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('void',   style({
        opacity: 0,
        transform: 'scale(0)'
      })),
      transition('* => void', animate('250ms ease-out')),
      transition('void => *', animate('250ms ease-in'))
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  patterns = patterns;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private zone: NgZone,
    private translate: TranslateService
  ) {
    this.shared.echo('Thank you for using CaretTab!');
  }

  ngOnInit() {
    this.handleVersionNumbers();
    this.shared.echo('Settings from load:', '', this.settings.config);
    this.translate.setDefaultLang('en-US');
    
    this.shared.zoneGuess = moment.tz.guess();
    this.shared.echo('Timezone guess:', this.shared.zoneGuess);

    // Run storage migration
    this.migrateSettings();

    this.findBrowser();

    this.settings.onChange().subscribe((data) => {
      this.enableAnalytics(this.settings.config.misc.enableAnalytics);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Set background image
      let savedImg = localStorage.getItem('bgImg');
      if (savedImg != null || savedImg != undefined) {
        this.shared.bg = savedImg;
        this.shared.echo('Background image found in storage', savedImg.substr(0,20))
      } else {
        let patternId = this.settings.config.design.patternId;
        let img = '0.png';

        // Check for "900" is for backwards compatibility with an old bug
        if (patternId !== 0 && patternId !== 99999 && patternId !== 900) {
          img = patterns.find(p => p.id === patternId).pattern;
          this.shared.echo('No background, use selected pattern:', patternId)
        } else {
          this.shared.echo('No background or pattern set', patternId)
        }
        let bg = './assets/patterns/' + img;
        this.shared.bg = bg;
      }
    }, 0);
  }

  enableAnalytics(enable: boolean) {
    enable === true ?
      localStorage.setItem('ct-enableAnalytics', 'true') : localStorage.setItem('ct-enableAnalytics', 'false');
  }

  migrateSettings() {
    let hasMigrationHappened = localStorage.getItem('carettabSettingsMigation');

    if (!hasMigrationHappened) {
      localStorage.setItem('carettabSettingsMigation', '1.0');

      console.log('Settings migration attempt...');
      this.shared.echo('Attempting settings migration', '', '', "warning");
      this.settings.getChrome('carettab').then((old: any) => {

        // If old settings exist
        if (Object.keys(old).length !== 0) {
          this.shared.echo('Migrating old settings', '', [this.settings.config, old], "warning");

          this.settings.config.bookmark = old.bookmarks.bookmarksBar;
          this.settings.config.quickLink.apps = old.bookmarks.quickLinks.apps;
          this.settings.config.quickLink.bookmarksManager = old.bookmarks.quickLinks.bookmarksManager;
          this.settings.config.quickLink.chromeTab = old.bookmarks.quickLinks.chromeTab;
          this.settings.config.quickLink.enabled = old.bookmarks.quickLinks.enabled;
          this.settings.config.quickLink.history = old.bookmarks.quickLinks.history;
          this.settings.config.quickLink.icons = old.bookmarks.quickLinks.icons;
          this.settings.config.quickLink.mostVisited = old.bookmarks.quickLinks.mostVisited;
          this.settings.config.quickLink.scaling = old.bookmarks.quickLinks.scaling;
          this.settings.config.quickLink.links = old.bookmarks.links;
          this.settings.config.date = old.date;
          this.settings.config.design = old.design;
          this.settings.config.i18n.lang = old.lang;
          this.settings.config.message = old.message;
          this.settings.config.order.items = old.order;
          this.settings.config.search = old.search;
          this.settings.config.time = old.time;
          this.settings.config.misc.title = old.title;

          this.shared.echo('Settings have been migrated', '', this.settings.config, "warning");

          // Delete old settings
          this.settings.remove('carettab');
          this.settings.remove('updateAllTimer');
          this.settings.remove('sPrimaryClock');
          this.settings.remove('sSeconds');
          this.settings.remove('sDimSeconds');
          this.settings.remove('sDimDelimiter');
          this.settings.remove('sMeridiem');
          this.settings.remove('sMilitary');
          this.settings.remove('sDelimiter');
          this.settings.remove('sBlinking');
          this.settings.remove('sPrimaryClockTimezone');
          this.settings.remove('s2ndClock');
          this.settings.remove('s2ndClockTimezone');
          this.settings.remove('s2ndClockLabel');
          this.settings.remove('s3rdClock');
          this.settings.remove('s3rdClockTimezone');
          this.settings.remove('s3rdClockLabel');
          this.settings.remove('s4thClock');
          this.settings.remove('s4thClockTimezone');
          this.settings.remove('s4thClockLabel');
          this.settings.remove('sDate');
          this.settings.remove('sDay');
          this.settings.remove('sYear');
          this.settings.remove('sShortDate');
          this.settings.remove('sDateFormat');
          this.settings.remove('sWeek');
          this.settings.remove('sBackground');
          this.settings.remove('sForeground');
          this.settings.remove('sTabTitle');
          this.settings.remove('sTabTitleCustomMessage');
          this.settings.remove('sCustomMessage');
          this.settings.remove('sCustomMessageText');
          this.settings.remove('sSearch');
          this.settings.remove('sEngine');
          this.settings.remove('sAnimation');
          this.settings.remove('sScale');
          this.settings.remove('sBrackets');
          this.settings.remove('sDimBrackets');
          this.settings.remove('sBracketStyle');
          this.settings.remove('sDateDelimiter');
          this.settings.remove('sWeekLabel');
          this.settings.remove('sFont');
          this.settings.remove('sHideSettingsToggle');
          this.settings.remove('sAnalog');
          this.shared.echo('Cleared old settings', '', this.settings.config, "warning");
          
          this.shared.saveAll();

        } else {
          this.shared.echo('No old settings found, skipping migration', '', '', "success");
        }

      }).catch((data: any) => {
        this.shared.echo('Error retrieving old data', '', data, "error");
      });
    }
  }

  findBrowser() {
    let b = Bowser.getParser(window.navigator.userAgent).getBrowserName();
    if (b === 'Microsoft Edge') {
      this.shared.browser = "edge";
    } else if (b === 'Firefox') {
      this.shared.browser = "firefox";
    } else if (b === 'Chrome') {
      this.shared.browser = "chrome";
    }
  }

  handleVersionNumbers() {
    let prevVer: string = localStorage.getItem("caretTabPrevVersion");
    let newVer: string = localStorage.getItem("caretTabNewVersion");
    this.shared.status = localStorage.getItem("caretTabStatus");

    this.shared.echo('Extension status:', this.shared.status);

    // Display major update splash screen for version 3.0.0
    if (prevVer) {
      if (compare(prevVer, '3.4.0', '<')) {
        this.shared.updateType = "major";
      } else if (compare(prevVer, '3.3.0', '<')) {
        this.shared.updateType = "quiet"
      } else {
        this.shared.updateType = "hidden"
      }
    }

    localStorage.setItem('caretTabUpdateType', this.shared.updateType);

    this.shared.echo(`Version check:`, `Prev: ${prevVer} | New: ${newVer} | Type: ${this.shared.updateType}`);
  }

}
