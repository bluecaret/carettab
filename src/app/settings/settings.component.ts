import { Component, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../lib/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.component.html'
})
export class SettingsComponent {
  page: string;

  constructor(public shared: SharedService) {
    this.page = 'bookmarks';
  }

  toggleSettings() {
    this.shared.settingsToggle = !this.shared.settingsToggle;
  }

}
