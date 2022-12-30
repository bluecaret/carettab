import { Component, HostBinding, NgZone, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '../../_storage/storage.service';
import { title, languages } from '../../_shared/lists/lists';
import { SharedService } from '../../_shared/shared.service';
import { createViewChild } from '@angular/compiler/src/core';

@Component({
  selector: 'options-extra',
  templateUrl: 'extra.component.html'
})
export class OptionsExtraComponent {
  @HostBinding('class') hostClass: string = 'panelPlate panelPage';
  @Output() goTo: EventEmitter<string> = new EventEmitter<string>();
  titleOptions = title;
  languages = languages;
  importStatus: string;

  constructor(
    public settings: Storage,
    private translate: TranslateService,
    public shared: SharedService,
    private zone: NgZone,
  ) {
  }

  // Reset settings
  reset() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      this.settings.clear();
      chrome.storage.local.remove(['currentWallpaper', 'nextWallpaper']);
      this.shared.echo(
        'Background removed from localStorage',
        null,
        null,
        'save'
      );
      location.reload();
    } else {
      return;
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  findTitleType(type) {
    return this.titleOptions.find((x) => x.id === type);
  }

  export() {
    let _settings = JSON.stringify(this.settings.config, null, 4); //indentation in json format, human readable

    let link = document.createElement('a'),
      blob = new Blob([_settings], { type: 'text/json' }),
      name = 'carettab-settings.json',
      url = window.URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', name);
    link.click();
  }

  import(e: any, input: any) {
    let files = e.target.files;
    let reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      let _imp = JSON.parse(e.target.result);

      if (_imp && _imp.misc && _imp.misc.schema && (_imp.misc.schema === '1.0' || _imp.misc.schema === '1.1')) {
        _imp.bookmark && Object.assign(this.settings.config.bookmark, _imp.bookmark);
        _imp.date && Object.assign(this.settings.config.date, _imp.date);
        _imp.design && Object.assign(this.settings.config.design, _imp.design);
        _imp.i18n && Object.assign(this.settings.config.i18n, _imp.i18n);
        _imp.covidData && Object.assign(this.settings.config.covidData, _imp.covidData);
        _imp.message && Object.assign(this.settings.config.messages, _imp.message);
        _imp.messages && Object.assign(this.settings.config.messages, _imp.messages);
        _imp.misc && Object.assign(this.settings.config.misc, _imp.misc);
        _imp.order && Object.assign(this.settings.config.order, _imp.order);
        _imp.quickLink && Object.assign(this.settings.config.quickLink, _imp.quickLink);
        _imp.search && Object.assign(this.settings.config.search, _imp.search);
        _imp.time && Object.assign(this.settings.config.time, _imp.time);
        _imp.weather && Object.assign(this.settings.config.weather, _imp.weather);
        this.importStatus = 'success';

        if (_imp.bookmark.icons || _imp.quickLink.icons) {
          this.checkFaviconPermission();
        }

        if (_imp.bookmark.enabled) {
          this.checkBookmarkPermission();
        }

        if (_imp.bookmark.mostVisited || _imp.quickLink.mostVisited) {
          this.checkTopSitesPermission();
        }
      } else {
        this.importStatus = 'error';
      }
    };

    reader.readAsText(files[0]);
    input.value = '';
  }

  checkFaviconPermission() {
    const that = this;
    chrome.permissions.contains({permissions: ['favicon']}, function(result) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error checking Favicon permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Permission check: Favicon allowed?', result);
        if (result === false) {
          that.setFaviconPermission();
        }
      });
    });
  }

  setFaviconPermission() {
    const that = this;
    chrome.permissions.request({permissions: ['favicon']}, function(granted) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error setting Favicon permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Set Permission: Favicon', granted);
      });
    });
  }

  checkBookmarkPermission() {
    const that = this;
    chrome.permissions.contains({permissions: ['bookmarks']}, function(result) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error checking Bookmark permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Permission check: Bookmark allowed?', result);
        if (result === false) {
          that.setBookmarkPermission();
        }
      });
    });
  }

  setBookmarkPermission() {
    const that = this;
    chrome.permissions.request({permissions: ['bookmarks']}, function(granted) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error setting Bookmark permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Set Permission: Bookmark', granted);
      });
    });
  }

  checkTopSitesPermission() {
    const that = this;
    chrome.permissions.contains({permissions: ['topSites']}, function(result) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error checking TopSites permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Permission check: TopSites allowed?', result);
        if (result === false) {
          that.setTopSitesPermission();
        }
      });
    });
  }

  setTopSitesPermission() {
    const that = this;
    chrome.permissions.request({permissions: ['topSites']}, function(granted) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error setting TopSites permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Set Permission: TopSites', granted);
      });
    });
  }
}
