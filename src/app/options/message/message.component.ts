import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { GoogleAnalyticsService } from '../../_shared/ga.service';

@Component({
  selector: 'options-message',
  templateUrl: 'message.component.html'
})
export class OptionsMessageComponent {

  constructor(
    public shared: SharedService,
    public settings: Storage,
    public ga: GoogleAnalyticsService
  ) {
  }

}
