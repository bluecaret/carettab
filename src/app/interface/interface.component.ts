import { Component, HostBinding, Output, EventEmitter } from '@angular/core';
import { SharedService} from '../lib/shared.service';

@Component({
  selector: 'app-interface',
  template: `
    <app-i-todo></app-i-todo>
    <div style="font-size: 10vw;">12:00:00</div>
    <button
      (click)="toggleSettings()"
      id="toggleSettings"
      [ngClass]="{'toggleSettings--open': shared.settingsToggle}"
      title="Open Settings">
      <span><i class="fas fa-ellipsis-v"></i></span>
    </button>
  `
})
export class InterfaceComponent {

  constructor(public shared: SharedService) {
  }

  toggleSettings() {
    this.shared.settingsToggle = !this.shared.settingsToggle;
  }

}
