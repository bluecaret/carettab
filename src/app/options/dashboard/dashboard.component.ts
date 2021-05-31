import { Component, OnInit } from '@angular/core';
import * as Bowser from 'bowser';
import { SharedService } from '../../_shared/shared.service';

@Component({
  selector: 'options-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class OptionsDashboardComponent implements OnInit {
  status: string;
  browser = Bowser.getParser(window.navigator.userAgent).getBrowserName();
  shareMenu = false;

  constructor(public shared: SharedService) {
  }

  ngOnInit(): void {
    this.status = this.shared.status;

    // Clear updated status
    if (this.shared.status === 'updated') {
      localStorage.setItem('caretTabStatus', 'existing');
      this.shared.status = 'existing';
      this.shared.echo('Extension status reset to "existing" after update since user opened dashboard');
    }
  }

  getReviewLink(encode: boolean): string {
    let url: string;
    if (this.browser === 'Microsoft Edge') {
      url = 'https://microsoftedge.microsoft.com/addons/detail/bfpmncaohmjelebfobabccfjgmeolloe';
    } else
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
