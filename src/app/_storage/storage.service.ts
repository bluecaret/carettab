/*
 * ng2-chrome-storage
 * @author Hasan Hameed <hasan.hameed07@gmail.com>
 * Url: https://github.com/hasanhameed07/ng2-chrome-storage.git
 *
 * Modified by BlueCaret (John Hancock) <john0404@gmail.com>
 */
import { Injectable, NgZone, Optional } from '@angular/core';
import {
  Settings,
  BookmarkSettings,
  DateSettings,
  DesignSettings,
  I18nSettings,
  MessageSettings,
  MiscSettings,
  OrderSettings,
  QuickLinkSettings,
  SearchSettings,
  TimeSettings,
  CovidSettings
} from './settings';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class Storage {
  private _loadTracker = 0;

  storeKey = 'carettab'; // chrome storage key
  config: Settings; // holds settings

  constructor(private zone: NgZone, @Optional() _settings: Settings) {
    let usethisSettings = _settings ? _settings : new Settings();
    this.config = usethisSettings;
    this.config.bookmark = new BookmarkSettings();
    this.config.date = new DateSettings();
    this.config.design = new DesignSettings();
    this.config.i18n = new I18nSettings();
    this.config.covidData = new CovidSettings();
    this.config.messages = new MessageSettings();
    this.config.misc = new MiscSettings();
    this.config.order = new OrderSettings();
    this.config.quickLink = new QuickLinkSettings();
    this.config.search = new SearchSettings();
    this.config.time = new TimeSettings();
  }

  get loadTracker(): number {
    return this._loadTracker;
  }
  set loadTracker(value: number) {
    this._loadTracker = value;
  }

  // to be used inside a resolver
  load() {
    // Old load code before splitting to different keys
    // return this.getChrome(this.storeKey, this.config).then((data: any) => {
    //   this.config = data;
    //   return data;
    // });

    console.log(
      '%cLoading data from storage.sync on page load.',
      'display:inline-block;background:rgb(0, 106, 183);color:white;padding:5px;border-radius:5px;'
    );

    this.getChrome('ct-bookmark', this.config.bookmark).then((data: any) => {
      this.config.bookmark = data;
      this.loadTracker++;
    });

    this.getChrome('ct-date', this.config.date).then((data: any) => {
      this.config.date = data;
      this.loadTracker++;
    });

    this.getChrome('ct-design', this.config.design).then((data: any) => {
      this.config.design = data;
      this.loadTracker++;
    });

    this.getChrome('ct-i18n', this.config.i18n).then((data: any) => {
      this.config.i18n = data;
      this.loadTracker++;
    });

    this.getChrome('ct-message', this.config.messages).then((data: any) => {
      this.config.messages = data;
      this.loadTracker++;
    });

    this.getChrome('ct-misc', this.config.misc).then((data: any) => {
      this.config.misc = data;
      this.loadTracker++;
    });

    this.getChrome('ct-order', this.config.order).then((data: any) => {
      this.config.order = data;
      this.loadTracker++;
    });

    this.getChrome('ct-quick-link', this.config.quickLink).then((data: any) => {
      this.config.quickLink = data;
      this.loadTracker++;
    });

    this.getChrome('ct-search', this.config.search).then((data: any) => {
      this.config.search = data;
      this.loadTracker++;
    });

    this.getChrome('ct-time', this.config.time).then((data: any) => {
      this.config.time = data;
      this.loadTracker++;
    });

    this.getChrome('ct-weather', this.config.weather).then((data: any) => {
      this.config.weather = data;
      this.loadTracker++;
    });

    this.getChrome('ct-covid', this.config.covidData).then((data: any) => {
      this.config.covidData = data; 
      this.loadTracker++;
    });

    return this.config;
  }

  // save an object
  setAll(settings: Object, key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        let saveObj = {};
        saveObj[key] = settings;
        chrome.storage.sync.set(/* String or Array */ saveObj, () =>
          this.zone.run(() => {
            if (chrome.runtime.lastError) {
              console.log(
                '%cERROR saving to storage.sync',
                'display:inline-block;background:#c52525;color:white;padding:5px;border-radius:5px;',
                chrome.runtime.lastError,
                saveObj
              );
              reject(chrome.runtime.lastError);
            }
            console.log(
              '%cSaving to storage.sync',
              'display:inline-block;background:rgb(0, 106, 183);color:white;padding:5px;border-radius:5px;',
              saveObj
            );
            resolve(true);
          })
        );
      } else {
        // Put the object into storage
        console.log(
          '%cSaving to localStorage',
          'display:inline-block;background:rgb(0, 106, 183);color:white;padding:5px;border-radius:5px;',
          key,
          settings
        );
        localStorage.setItem(key, JSON.stringify(settings));
        // hack to resolve storage change event on the same window
        window.dispatchEvent(new Event('storage'));
        resolve(true);
      }
    });
  }

  // remove a key
  remove(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        chrome.storage.sync.remove(/* String or Array */ key, () =>
          this.zone.run(() => {
            if (chrome.runtime.lastError) {
              console.log(
                '%cERROR removing key from storage.sync',
                'display:inline-block;background:#c52525;color:white;padding:5px;border-radius:5px;',
                chrome.runtime.lastError,
                key
              );
              reject(chrome.runtime.lastError);
            }
            console.log(
              '%cRemoving key from storage.sync',
              'display:inline-block;background:rgb(0, 106, 183);color:white;padding:5px;border-radius:5px;',
              key
            );
            resolve(true);
          })
        );
      } else {
        console.log(
          '%cRemoving key from localStorage',
          'display:inline-block;background:rgb(0, 106, 183);color:white;padding:5px;border-radius:5px;',
          key
        );
        localStorage.removeItem(key);
        resolve(true);
      }
    });
  }

  // clears the storage
  clear(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        chrome.storage.sync.clear(() =>
          this.zone.run(() => {
            if (chrome.runtime.lastError) {
              console.log(
                '%cERROR clearing storage.sync',
                'display:inline-block;background:#c52525;color:white;padding:5px;border-radius:5px;',
                chrome.runtime.lastError
              );
              reject(chrome.runtime.lastError);
            }
            console.log(
              '%cClearing all keys from storage.sync',
              'display:inline-block;background:rgb(0, 106, 183);color:white;padding:5px;border-radius:5px;'
            );
            resolve(true);
          })
        );
      } else {
        console.log(
          '%cClearing all keys from localStorage',
          'display:inline-block;background:rgb(0, 106, 183);color:white;padding:5px;border-radius:5px;'
        );
        localStorage.clear();
        resolve(true);
      }
    });
  }

  getChrome(key: string, defaults = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        let saveObj = {};
        saveObj[key] = defaults;
        chrome.storage.sync.get(/* String or Array */ saveObj, (data) =>
          this.zone.run(() => {
            if (chrome.runtime.lastError) {
              console.log(
                '%cERROR loading from storage.sync',
                'display:inline-block;background:#c52525;color:white;padding:5px;border-radius:5px;',
                chrome.runtime.lastError,
                data
              );
              reject(chrome.runtime.lastError);
            }
            console.log(
              '%cLoad from storage.sync',
              'display:inline-block;background:rgb(0, 106, 183);color:white;padding:5px;border-radius:5px;',
              data
            );
            resolve(data[key]);
          })
        );
      } else {
        console.log(
          '%cLoad from localStorage',
          'display:inline-block;background:rgb(0, 106, 183);color:white;padding:5px;border-radius:5px;',
          key
        );
        let object =
          localStorage.getItem(key) === null
            ? defaults
            : JSON.parse(localStorage.getItem(key));
        resolve(object);
      }
    });
  }

  //  change detection
  onChange(key?: string): Observable<any> {
    return Observable.create((observer) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        chrome.storage.onChanged.addListener((changes, namespace) =>
          this.zone.run(() => {
            if (!key) {
              // give all changes
              observer.next(changes);
            } else {
              for (let tkey in changes) {
                if (changes.hasOwnProperty(tkey)) {
                  let storageChange = changes[tkey];
                  if (tkey === key) {
                    this.config = storageChange.newValue;
                    observer.next(storageChange.newValue);
                  }
                }
              }
            }
          })
        );
      } else {
        window.addEventListener(
          'storage',
          () =>
            this.zone.run(() => {
              let object = JSON.parse(localStorage.getItem(key));
              this.config = object;
              observer.next(object);
            }),
          false
        );
      }
    });
  }
}
