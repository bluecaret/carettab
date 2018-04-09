import { Component, HostBinding } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'options-design',
  templateUrl: 'design.component.html'
})
export class OptionsDesignComponent {
  @HostBinding('class.page') pageClass = true;

  constructor(public settings: Storage) {
  }

  saveAll() {
    this.settings.setAll(this.settings.config);
  }

}
