import { Component, ViewEncapsulation } from '@angular/core';
import { SharedService } from '../_shared/shared.service';
import { Storage } from '../_storage/storage.service';
import { fadeIn, options } from '../_shared/animations';

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

  constructor(
    public shared: SharedService,
    public settings: Storage
  ) {
    this.shared.optionsPage = 'Dashboard';
  }

  goToPage(page: string) {
    this.shared.optionsPage = page;
  }

}
