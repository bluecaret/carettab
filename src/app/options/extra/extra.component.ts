import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { title, languages } from '../../_shared/lists/lists';

@Component({
  selector: 'options-extra',
  templateUrl: 'extra.component.html'
})
export class OptionsExtraComponent {
  titleOptions = title;
  languages = languages;

  constructor(
    public settings: Storage
  ) {
  }

  /** Updates storage */
  saveAll() {
    this.settings.setAll(this.settings.config);
  }

  // Reset settings
  reset() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      this.settings.clear();
      location.reload();
    } else {
      return;
    }
  }
}
