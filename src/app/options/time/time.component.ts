import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Storage } from '../../_storage/storage.service';
import { Clock } from '../../_shared/models/clock';
import { TimezoneService, Timezone } from './timezone.service';
import { offlineFontList } from '../../_shared/lists/fonts';
import { SharedService } from '../../_shared/shared.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'options-time',
  templateUrl: 'time.component.html'
})
export class OptionsTimeComponent implements OnInit {
  clock: Clock;
  showNew: Boolean = false;
  submitMode: 'Save'|'Update' = 'Save';
  selected: number;
  allTimezones: Timezone[];
  tzGuess: string;
  fonts: Object[];
  formChange: any;

  @ViewChild('clockForm') clockForm: NgForm;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    public tz: TimezoneService
  ) {
    this.allTimezones = tz.getZones();
    this.tzGuess = this.shared.zoneGuess;
    this.fonts = offlineFontList;
  }

  ngOnInit() {
  }

  /** Enters Add New Item mode */
  add() {
    this.clock = new Clock();
    this.submitMode = 'Save';
    this.showNew = true;
  }

  /** Enters Edit mode */
  edit(index: number) {
    this.selected = index;
    this.clock = new Clock();
    this.clock = Object.assign({}, this.settings.config.time.clocks[this.selected]);
    this.submitMode = 'Update';
    this.showNew = true;
  }

  /** Deletes item */
  delete(index: number) {
    if (confirm('Are you sure you want to delete this clock?')) {
      this.settings.config.time.clocks.splice(index, 1);
      this.saveAll();
    } else {
      return;
    }
  }

  /** Cancels and exits edit mode */
  cancel() {
    this.showNew = false;
  }

  /** Saves new/updated item */
  save() {
    if (this.submitMode === 'Save') {
      this.settings.config.time.clocks.push(this.clock);
    } else {
      this.settings.config.time.clocks[this.selected].label = this.clock.label;
      this.settings.config.time.clocks[this.selected].timezone = this.clock.timezone;
      this.settings.config.time.clocks[this.selected].scaling = this.clock.scaling;
      this.settings.config.time.clocks[this.selected].font = this.clock.font;
      this.settings.config.time.clocks[this.selected].seconds.enabled = this.clock.seconds.enabled;
      this.settings.config.time.clocks[this.selected].seconds.dim = this.clock.seconds.dim;
      this.settings.config.time.clocks[this.selected].seconds.blink = this.clock.seconds.blink;
      this.settings.config.time.clocks[this.selected].twentyFour = this.clock.twentyFour;
      this.settings.config.time.clocks[this.selected].meridiem.blink = this.clock.meridiem.enabled;
      this.settings.config.time.clocks[this.selected].meridiem.dim = this.clock.meridiem.dim;
      this.settings.config.time.clocks[this.selected].delimiter.enabled = this.clock.delimiter.enabled;
      this.settings.config.time.clocks[this.selected].delimiter.dim = this.clock.delimiter.dim;
      this.settings.config.time.clocks[this.selected].delimiter.blink = this.clock.delimiter.blink;
      this.settings.config.time.clocks[this.selected].brackets.enabled = this.clock.brackets.enabled;
      this.settings.config.time.clocks[this.selected].brackets.dim = this.clock.brackets.dim;
      this.settings.config.time.clocks[this.selected].brackets.left = this.clock.brackets.left;
      this.settings.config.time.clocks[this.selected].brackets.right = this.clock.brackets.right;
      this.settings.config.time.clocks[this.selected].analog.enabled = this.clock.analog.enabled;
      this.settings.config.time.clocks[this.selected].analog.style = this.clock.analog.style;
    }
    this.showNew = false;
    this.saveAll();
  }

  /** Updates storage */
  saveAll() {
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

  /** Pad offset amount to display in two digits */
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
