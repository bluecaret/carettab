import { Component, ElementRef, HostBinding, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SharedService } from '../_shared/shared.service';
import { Storage } from '../_storage/storage.service';
import { fadeIn } from '../_shared/animations';
import * as manifest from '../../manifest.json';

@Component({
  selector: 'app-options',
  templateUrl: 'options.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class OptionsComponent implements AfterViewInit {
  @HostBinding('class.panel') panelClass = true;
  @HostBinding('class.panelPreview') panelPreviewClass = false;
  @ViewChild('backToTop', {static: false}) backToTop: ElementRef;
  @ViewChild('closeButton', {static: false}) closeButton: ElementRef;
  ver = manifest.version;

  constructor(
    public shared: SharedService,
    public settings: Storage
  ) {
    this.shared.optionsPage = 'Wallpaper';
  }

  ngAfterViewInit() {
    this.closeButton.nativeElement.focus();
  }

  goTo(page: string) {
    this.shared.optionsPage = page;
    document.querySelector('.panel').scrollTop = 0;
  }

  togglePreview(enable: boolean) {
    this.shared.optionsPreview = enable;
    this.panelPreviewClass = enable;
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
