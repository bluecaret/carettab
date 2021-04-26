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
      [title]="(shared.optionsToggle ? 'toggleSettings.close' : shared.updateType === 'quiet' && shared.status === 'updated' ? 'toggleSettings.updated' : 'toggleSettings.open') | translate">
      <span></span><span></span><span></span>
      <div class="quietUpdateNotice" *ngIf="shared.updateType === 'quiet' && shared.status === 'updated'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm1 13h-2v-6h2v6zm0-8h-2V7h2v2z" fill="limegreen" /><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#000000"/></svg>
      </div>
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
      // Updated status is set within options/dashboard/dashboard.component.ts when settings opens

      this.shared.optionsToggle = true;
    }
  }
}
