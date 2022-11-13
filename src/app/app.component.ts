import { Component, OnInit, NgZone } from '@angular/core';
import { transition, trigger, style, state, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from './_shared/shared.service';
import { Storage } from './_storage/storage.service';
import { tab, options } from './_shared/animations';
import * as moment from 'moment';
import { compare } from 'compare-versions';
import * as Bowser from 'bowser';
import { Clock } from './_shared/models/clock';
import { Settings } from './_storage/settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    options,
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
export class AppComponent implements OnInit {

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private zone: NgZone,
    private translate: TranslateService
  ) {
    this.shared.echo('Thank you for using CaretTab!');
  }


  ngOnInit() {
    // let localBg = localStorage.getItem('ct-background');
    chrome.storage.local.get(['ctBackground'], function (data) {
      document.body.style.backgroundColor = data.ctBackground;
    });

    this.handleVersionNumbers();
    this.shared.echo('Settings from load:', '', this.settings.config);
    this.translate.setDefaultLang('en-US');

    this.shared.zoneGuess = moment.tz.guess();
    this.shared.echo('Timezone guess:', this.shared.zoneGuess);

    this.findBrowser();

    // Set background initially to blank pattern to avoid 404 error due to setTimeout
    this.shared.bg = './assets/patterns/0.png';
  }

  migrateSettings() {
    this.shared.echo('Attempting settings pre-schema migration', '', '', "warning");
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
        this.settings.config.messages.enabled = old.message.enabled;
        this.settings.config.messages.offset = old.message.offset;
        this.settings.config.messages.scaling = old.message.scaling;
        this.settings.config.messages.messageList[0].text = old.message.text;
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

        localStorage.setItem('carettabSettingsMigation', '1.1');

      } else {
        this.shared.echo('No pre-schema settings found, skipping pre-schema migration', '', '', "success");
      }

    }).catch((data: any) => {
      this.shared.echo('Error retrieving pre-schema data', '', data, "error");
    });
  }

  migrateTo11() {
    this.shared.echo('Attempting settings schema 1.0 to 1.1 migration', '', '', "warning");
    chrome.storage.sync.get([
      'ct-bookmark', 'ct-date', 'ct-design', 'ct-i18n', 'ct-message',
      'ct-misc', 'ct-order', 'ct-quick-link', 'ct-search', 'ct-time'
    ], (old) => this.zone.run(() => {
      if (chrome.runtime.lastError) {
        this.shared.echo('Error retrieving old data', '', old, "error");
      } else {
        let newSettings = new Settings();
        this.settings.config = {...newSettings};

        if (old['ct-bookmark']) {this.settings.config.bookmark = {...this.settings.config.bookmark, ...old['ct-bookmark']};}
        if (old['ct-date']) {this.settings.config.date = {...this.settings.config.date, ...old['ct-date']};}
        if (old['ct-design']) {this.settings.config.design = {...this.settings.config.design, ...old['ct-design']};}
        if (old['ct-i18n']) {this.settings.config.i18n = {...this.settings.config.i18n, ...old['ct-i18n']};}
        if (old['ct-message']) {
          if (old['ct-message'].enabled) {this.settings.config.messages.enabled = old['ct-message'].enabled;}
          if (old['ct-message'].offset) {this.settings.config.messages.offset = old['ct-message'].offset;}
          if (old['ct-message'].scaling) {this.settings.config.messages.scaling = old['ct-message'].scaling;}
          if (old['ct-message'].text) {this.settings.config.messages.messageList[0].text = old['ct-message'].text;}
        }
        if (old['ct-misc']) {this.settings.config.misc = {...this.settings.config.misc, ...old['ct-misc']};}
        this.settings.config.misc.schema = "1.1";
        if (old['ct-order'] && old['ct-order'].items) {this.settings.config.order.items = old['ct-order'].items;}
        if (old['ct-quick-link']) {this.settings.config.quickLink = {...this.settings.config.quickLink, ...old['ct-quick-link']};}
        if (old['ct-search']) {this.settings.config.search = {...this.settings.config.search, ...old['ct-search']};}
        if (old['ct-time'] && old['ct-time'].clocks) {
          this.settings.config.time.clocks = [];
          old['ct-time'].clocks.forEach(clock => {
            let newClock = new Clock();
            newClock = {...newClock, ...clock}
            this.settings.config.time.clocks.push(newClock);
          });
        }

        localStorage.setItem('carettabSettingsMigation', '1.1');

        this.shared.echo('Settings migrated, saving...', '', this.settings.config, "success");
        this.shared.saveAll();

        // localStorage.setItem('ct-background', this.settings.config.design.background);
        chrome.storage.local.set({ctBackground: this.settings.config.design.background});
        this.shared.bgColor = this.settings.config.design.background;
      }
    }));
  }

  findBrowser() {
    let b = Bowser.getParser(window.navigator.userAgent).getBrowserName();
    if (b === 'Microsoft Edge') {
      this.shared.browser = "edge";
    } else if (b === 'Chrome') {
      this.shared.browser = "chrome";
    }
  }

  handleVersionNumbers() {
    let _self = this;
    chrome.storage.local.get(['caretTabStatus', 'caretTabNewVersion', 'caretTabPrevVersion'], function (data) {
      let prevVer: string = data.caretTabPrevVersion ? data.caretTabPrevVersion : '';
      let newVer: string = data.caretTabNewVersion ? data.caretTabNewVersion : '';
      _self.shared.status = data.caretTabStatus;

      _self.shared.echo('Extension status:', _self.shared.status);

      // Display major update splash screen for version 3.0.0
      if (prevVer) {
        if (compare(prevVer, '3.5.0', '<')) {
          _self.shared.updateType = "major";
        } else if (compare(prevVer, '3.6.4', '<')) {
          _self.shared.updateType = "quiet"
        } else {
          _self.shared.updateType = "hidden"
        }
      }

      let hasMigrationHappened = localStorage.getItem('carettabSettingsMigation');

      if (!hasMigrationHappened && prevVer && compare(prevVer, '3.4.0', '<') && _self.shared.status === 'updated') {
        _self.shared.echo('Migrate pre-schema settings');
        _self.migrateSettings();
      } else if ((!hasMigrationHappened || hasMigrationHappened !== '1.1') && _self.shared.status === 'updated') {
        _self.shared.echo('Migrate settings from schema 1.0 to 1.1');
        _self.migrateTo11();
      }

      _self.shared.echo(`Version check:`, `Prev: ${prevVer} | New: ${newVer} | Type: ${_self.shared.updateType}`);
    });
  }
}
