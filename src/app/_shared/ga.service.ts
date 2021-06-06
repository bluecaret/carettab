import { Injectable } from '@angular/core';
import { Storage } from '../_storage/storage.service';
import { environment } from '../../environments/environment'

declare let ga: Function; // Declare ga as a function

@Injectable()
export class GoogleAnalyticsService {
  env = environment;

  constructor(private settings: Storage) { }

  public field(pageAndField: string, value: any) {
    this.event('setting', pageAndField, value);
  }

  //create our event emitter to send our data to Google Analytics
  public event(eventCategory: string, eventAction: string, eventLabel: string = null, eventValue: number = null) {
    if (this.env.production) {
      if (this.settings.config.misc.enableAnalytics) {
        ga('send', 'event', {
          eventCategory: eventCategory,
          eventLabel: eventLabel,
          eventAction: eventAction,
          eventValue: eventValue
        });
      }
    }
  }

  //create our event emitter to send our data to Google Analytics
  public pageView( title: string, path: string = '/') {
    if (this.env.production) {
      if (this.settings.config.misc.enableAnalytics) {
        ga('send', 'pageview', {
          title: title,
          page: path,
        });
      }
    }
  }

}