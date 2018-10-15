import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { Clock } from '../../_shared/models/clock';
import { TimezoneService, Timezone } from './timezone.service';
import { SharedService } from '../../_shared/shared.service';
import { analogStyles, offlineFontList, span } from '../../_shared/lists/lists';
import * as moment from 'moment-timezone';

@Component({
  selector: 'options-time',
  templateUrl: 'time.component.html'
})
export class OptionsTimeComponent {
  clock: Clock;
  showNew: Boolean = false;
  selected: number;
  allTimezones: Timezone[];
  tzGuess: string;
  fonts = offlineFontList;
  analog = analogStyles;
  span = span;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    public tz: TimezoneService
  ) {
    this.allTimezones = tz.getZones();
    this.tzGuess = this.shared.zoneGuess;
  }

  /** Track array by index */
  trackByFn(index: any, item: any) {
    return index;
  }

  /** Sets item as selected */
  setSelected(i) {
    if (this.selected !== i) {
      this.selected = i;
    } else {
      this.selected = null;
    }
  }

  /** Adds new clock */
  add() {
    this.settings.config.time.clocks.push(new Clock());
    let i = (this.settings.config.time.clocks.length - 1);
    this.selected = i;
    this.saveAll();
  }

  /** Deletes clock */
  delete(index: number) {
    if (confirm('Are you sure you want to delete this clock?')) {
      this.settings.config.time.clocks.splice(index, 1);
      this.saveAll();
    } else {
      return;
    }
  }

  /** Move item's placement in array up or down */
  swap(arr: any[], from: number, to: number) {
    this.selected = null;
    arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
    this.saveAll();
  }

  /** Updates storage */
  saveAll() {
    this.settings.setAll(this.settings.config);
  }

}
