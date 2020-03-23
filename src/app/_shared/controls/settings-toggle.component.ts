import { Component } from '@angular/core';
import { SharedService } from '../shared.service';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'app-settings-toggle',
  template: `
    <button
      (click)="toggleOptions()"
      class="openOptions"
      [ngClass]="{'open': shared.optionsToggle}"
      [title]="(shared.optionsToggle ? 'toggleSettings.close' : 'toggleSettings.open') | translate">
      <span></span><span></span><span></span><span></span>
    </button>
  `
})

export class SettingsToggleComponent {

  constructor(
    public shared: SharedService,
    public settings: Storage
  ) {
  }

  toggleOptions() {
    if (this.shared.optionsToggle === true) {
      this.settings.setAll(this.settings.config); // Save
      this.shared.optionsToggle = false;
    } else {
      this.shared.status = null;
      this.shared.optionsToggle = true;
    }
  }
}
