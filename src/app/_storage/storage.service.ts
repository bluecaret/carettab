/*
 * ng2-chrome-storage
 * @author Hasan Hameed <hasan.hameed07@gmail.com>
 * Url: https://github.com/hasanhameed07/ng2-chrome-storage.git
 * 
 * Modified by BlueCaret (John Hancock) <john@jwh.design>
 */
import { Injectable, NgZone, Optional } from '@angular/core';
import { Settings } from './settings';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class Storage {
  storeKey = ''; // chrome storage key
  config: any;     // holds settings
  constructor(private zone: NgZone, @Optional() _settings: Settings) {
    let usethisSettings = (_settings) ? _settings : new Settings();
    this.config = usethisSettings.data;
    this.storeKey = usethisSettings.storeKey;
  }

  // to be used inside a resolver
  load() {
    return this.getChrome(this.storeKey, this.config).then((data: any) => {
      this.config = data;
      return data;
    });
  }

  // save an object
  setAll(settings: Object, key = this.storeKey): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        let saveObj = {};
        saveObj[key] = settings;
        chrome.storage.sync.set(/* String or Array */saveObj, () => this.zone.run(() => {
          resolve(true);
        }));
      } else {
        // Put the object into storage
        localStorage.setItem(key, JSON.stringify(settings));
        // hack to resolve storage change event on the same window
        window.dispatchEvent( new Event('storage') );
        resolve(true);
      }
    });
  }

  // remove a key
  remove(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        chrome.storage.sync.remove(/* String or Array */key, () => this.zone.run(() => {
          resolve(true);
        }));
      } else {
        localStorage.removeItem(key);
        resolve(true);
      }
    });
  }

  // clears the storage
  clear(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        chrome.storage.sync.clear(() => this.zone.run(() => {
          resolve(true);
        }));
      } else {
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
        chrome.storage.sync.get(/* String or Array */saveObj, (data) => this.zone.run(() => {
         resolve(data[key]);
        }));
      } else {
        let object =  (localStorage.getItem(key) === null) ? defaults : JSON.parse(localStorage.getItem(key));
        resolve(object);
      }
    });
  }

  //  change detection
  onChange(key = this.storeKey): Observable<any> {
    return Observable.create(observer => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        chrome.storage.onChanged.addListener((changes, namespace) => this.zone.run(() => {
          if (!key) {
            // give all changes
            observer.next(changes);
          } else {
            for (let tkey in changes) {
              if ( changes.hasOwnProperty( tkey ) ) {
                let storageChange = changes[tkey];
                if (tkey === key) {
                  this.config = storageChange.newValue;
                  observer.next(storageChange.newValue);
                }
              }
            }
          }
        }));
      } else {
        window.addEventListener('storage', () => this.zone.run(() => {
           let object = JSON.parse(localStorage.getItem(key));
           this.config = object;
           observer.next(object);
        }), false);
      }
    });
  }
}
