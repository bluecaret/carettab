import { Component, HostBinding, Output, EventEmitter } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { TimezoneService, Timezone } from '../time/timezone.service';
import { SharedService } from '../../_shared/shared.service';
import { dateFormat } from '../../_shared/lists/lists';

@Component({
  selector: 'options-date',
  templateUrl: 'date.component.html'
})
export class OptionsDateComponent {
  @Output() goTo: EventEmitter<string> = new EventEmitter<string>();
  allTimezones: Timezone[];
  tzGuess: string;
  dateFormat = dateFormat;
  @HostBinding('class') hostClass: string = 'panelPlate panelPage';

  constructor(
    public shared: SharedService,
    public settings: Storage,
    public tz: TimezoneService,
  ) {
    this.allTimezones = tz.getZones();
    this.tzGuess = this.shared.zoneGuess;
  }

}
