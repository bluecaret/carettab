import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { TimezoneService, Timezone } from '../time/timezone.service';
import { SharedService } from '../../_shared/shared.service';
import { dateFormat } from '../../_shared/lists/lists';

@Component({
  selector: 'options-date',
  templateUrl: 'date.component.html'
})
export class OptionsDateComponent {
  allTimezones: Timezone[];
  tzGuess: string;
  dateFormat = dateFormat;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    public tz: TimezoneService
  ) {
    this.allTimezones = tz.getZones();
    this.tzGuess = this.shared.zoneGuess;
  }

}
