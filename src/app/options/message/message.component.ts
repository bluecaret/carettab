import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'options-message',
  templateUrl: 'message.component.html'
})
export class OptionsMessageComponent {

  constructor(
    public settings: Storage
  ) {
  }

  /** Updates storage */
  saveAll() {
    this.settings.setAll(this.settings.config);
  }

}
