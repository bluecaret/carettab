import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { searchEngines } from '../../_shared/lists/lists';

@Component({
  selector: 'options-search',
  templateUrl: 'search.component.html'
})
export class OptionsSearchComponent {
  engines = searchEngines;

  constructor(
    public settings: Storage
  ) {
  }

  /** Updates storage */
  saveAll() {
    this.settings.setAll(this.settings.config);
  }

}
