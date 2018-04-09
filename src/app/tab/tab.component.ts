import { Component, ViewEncapsulation } from '@angular/core';
import { SharedService } from '../_shared/shared.service';
import { Storage } from '../_storage/storage.service';

@Component({
  selector: 'app-tab',
  templateUrl: 'tab.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./_scss/tab.scss']
})
export class TabComponent {

  constructor(public shared: SharedService, public settings: Storage) {
  }

  toggleOptions() {
    this.shared.optionsToggle = !this.shared.optionsToggle;
  }

}
