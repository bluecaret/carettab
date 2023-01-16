import { Component } from '@angular/core';
import { SharedService } from '../shared.service';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'app-settings-toggle',
  template: `
    <button
      (click)="toggleOptions()"
      class="openOptions"
      [ngClass]="{'open': shared.optionsToggle, 'hide': settings.config.design.hideMenu}"
      [title]="(shared.optionsToggle ? 'toggleSettings.close' : (shared.updateType === 'minor' || shared.updateType === 'quiet') && shared.status === 'updated' ? 'toggleSettings.updated' : 'toggleSettings.open') | translate">
      <span></span><span></span><span></span>
      <div class="updateNotice" *ngIf="(shared.updateType === 'minor' || shared.updateType === 'quiet') && shared.status === 'updated'"></div>
    </button>
  `
})

export class SettingsToggleComponent {

  constructor(
    public shared: SharedService,
    public settings: Storage,
  ) {
  }

  toggleOptions() {
    // Closing settings
    if (this.shared.optionsToggle === true) {
      this.shared.saveAll(); // Save
      this.shared.optionsToggle = false;

    // Opening settings
    } else {
      this.shared.optionsToggle = true;
      // Updated status is set within options/dashboard/dashboard.component.ts when settings opens
    }
  }
}
