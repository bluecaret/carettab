import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'tab-message',
  templateUrl: 'message.component.html',
  host: {'class': 'message'}
})
export class TabMessageComponent {

  constructor(
    public settings: Storage
  ) {
  }

}
