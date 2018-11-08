import { Component, ViewEncapsulation } from '@angular/core';
import { transition, trigger, style, state, animate } from '@angular/animations';
import { SharedService } from '../_shared/shared.service';
import { Storage } from '../_storage/storage.service';

@Component({
  selector: 'app-tab',
  templateUrl: 'tab.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('nav', [
      state('*', style({
        opacity: 1,
        transform: 'scaleX(1)'
      })),
      state('void',   style({
        opacity: 0,
        transform: 'scaleX(0.7)'
      })),
      transition('* => void', animate('200ms ease-out')),
      transition('void => *', animate('200ms ease-in'))
    ])
  ]
})
export class TabComponent {

  constructor(public shared: SharedService, public settings: Storage) {
    this.shared.optionsToggle = false;
    this.shared.optionsPage = 'Dashboard';
  }

  /** Updates storage */
  saveAll() {
    this.settings.setAll(this.settings.config);
  }

  toggleOptions() {
    if (this.shared.optionsToggle === true) {
      this.saveAll();
      this.shared.optionsToggle = false;
    } else {
      this.shared.optionsToggle = true;
    }
  }

}
