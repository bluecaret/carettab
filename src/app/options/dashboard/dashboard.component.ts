import { Component } from '@angular/core';
import * as Bowser from 'bowser';
import { SharedService } from '../../_shared/shared.service';

@Component({
  selector: 'options-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class OptionsDashboardComponent {
  browser = Bowser.getParser(window.navigator.userAgent).getBrowserName();
  shareMenu = false;

  constructor(public shared: SharedService) {
  }

  goToPage(page: string) {
    this.shared.optionsPage = page;
  }

  getReviewLink(encode: boolean): string {
    let url: string;
    // if (this.browser === 'Microsoft Edge') {
      // url = '';
    // } else
    if (this.browser === 'Firefox') {
      url = 'https://addons.mozilla.org/en-US/firefox/addon/carettab/';
    } else {
      url = 'https://chrome.google.com/webstore/detail/carettab-new-tab-clock-an/cojpndognjdcakkimaloeealehpkljna';
    }
    if (encode) {
      return encodeURIComponent(url);
    } else {
      return url;
    }
  }

}
