import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { Clock } from '../../_shared/models/clock';
import { TimezoneService, Timezone } from './timezone.service';
import { SharedService } from '../../_shared/shared.service';
import { analogStyles } from '../../_shared/lists/analog';
import { offlineFontList } from '../../_shared/lists/fonts';
import { span } from '../../_shared/lists/span';
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
  fonts: Object[];
  analog = analogStyles;
  span = span;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    public tz: TimezoneService
  ) {
    this.allTimezones = tz.getZones();
    this.tzGuess = this.shared.zoneGuess;
    this.fonts = offlineFontList;
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
    console.log('save: ', this.settings.config);
    this.settings.setAll(this.settings.config);
  }

  /** Format timezone to remove underscores and replace with spaces */
  timezoneFormat(zone: string): string {
    const z = zone.split('/');
    const country = z[0].replace('_', ' ');
    let area;
    if (z.length > 1) {
      area = ' / ' + z[z.length - 1].replace('_', ' ');
    } else {
      area = '';
    }
    return country + area;
  }

  /** Get offset of timezone */
  timezoneOffset(zone: string): string {
    let offset = moment.tz(zone).utcOffset();
    const neg = offset < 0;
    if (neg) {
      offset = -1 * offset;
    }
    const hours = Math.floor(offset / 60);
    const minutes = (offset / 60 - hours) * 60;
    let sym = neg ? '-' : '+';
    let paddedHours = this.pad(hours.toString());
    let paddedMinutes = this.pad(minutes.toString());
    return '(GMT' + sym + paddedHours + ':' + paddedMinutes + ')';
  }

  /** Pad timezone offset amount to display in two digits */
  private pad(string: string): string {
    let width = 2;
    let padding = '0';
    padding = padding.substr(0, 1);
    if (string.length < width) {
      return padding.repeat(width - string.length) + string;
    } else {
      return string;
    }
  }

}
