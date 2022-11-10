import { Component, ViewEncapsulation } from '@angular/core';
import { SharedService } from '../_shared/shared.service';
import { Storage } from '../_storage/storage.service';
import { fadeIn, options } from '../_shared/animations';
import * as manifest from '../../manifest.json';

@Component({
  selector: 'app-options',
  templateUrl: 'options.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    fadeIn,
    options
  ]
})
export class OptionsComponent {
  ver = manifest.version;

  constructor(
    public shared: SharedService,
    public settings: Storage
  ) {
    this.shared.optionsPage = 'Dashboard';
  }

  togglePreview(enable: boolean) {
    console.log('togglePreview', enable);

    this.shared.optionsPreview = enable;
  }

  getReviewLink(encode: boolean): string {
    let url: string;
    if (this.shared.browser === 'edge') {
      url = 'https://microsoftedge.microsoft.com/addons/detail/bfpmncaohmjelebfobabccfjgmeolloe';
    } else {
      url = 'https://chrome.google.com/webstore/detail/carettab-new-tab-clock-an/cojpndognjdcakkimaloeealehpkljna';
    }
    if (encode) {
      return encodeURIComponent(url);
    } else {
      return url;
    }
  }

  closeOptions() {
    this.shared.saveAll(); // Save
    this.shared.optionsToggle = false;
    this.shared.echo('Settings panel closed and saving data');
  }

}
