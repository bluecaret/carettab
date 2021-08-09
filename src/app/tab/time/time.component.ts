import { Component, NgZone, Renderer2, ElementRef, ViewChild, ViewChildren, Input, OnInit, QueryList } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { Clock } from '../../_shared/models/clock';
import { SharedService } from '../../_shared/shared.service';
import { span } from '../../_shared/lists/lists';
import * as moment from 'moment';

@Component({
  selector: 'tab-time',
  templateUrl: 'time.component.html',
  host: { 'class': 'clock' }
})
export class TabTimeComponent implements OnInit {
  currentTime: Date;
  span = span;
  binaryMarkers: Array<any>;

  @Input() index: number;
  @Input() clock: Clock;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private zone: NgZone,
    private renderer: Renderer2
  ) { 
    this.binaryMarkers = [
      [
        [false, false],
        [false, false, false, false]
      ],
      [
        [false, false, false],
        [false, false, false, false]
      ],
      [
        [false, false, false],
        [false, false, false, false]
      ]
    ]
  }

  ngOnInit() {
    if (this.settings.config.time.clocks.length > 0) {
      this.shared.zoneGuess = moment.tz.guess();
      this.setBinaryTime();
      setInterval(() => {
        this.currentTime = new Date();
        this.setTitleTime();
        this.setBinaryTime();
      }, 500);
    }
  }

  setTitleTime() {
    if (
      this.settings.config.misc.title.type === 20 ||
      this.settings.config.misc.title.type === 40 ||
      this.settings.config.misc.title.type === 50
    ) {
      this.shared.time = this.constructTitleTime();
    }
  }

  setBinaryTime() {
    if (this.clock.binary && this.clock.binary.enabled) {

      var hours = parseInt(this.getHour(this.clock.timezone, this.clock.twentyFour, this.clock.twoDigit, 1) + this.getHour(this.clock.timezone, this.clock.twentyFour, this.clock.twoDigit, 2));
      var minutes = parseInt(this.getMinute(this.clock.timezone, 1) + this.getMinute(this.clock.timezone, 2));
      var seconds = parseInt(this.getSecond(this.clock.timezone, 1) + this.getSecond(this.clock.timezone, 2));

      if (seconds == 0) {
        this.resetMarkers(this.binaryMarkers[2]);
        if (minutes == 0) {
          this.resetMarkers(this.binaryMarkers[1]);
          if (hours > 23) {
            this.resetMarkers(this.binaryMarkers[0]);
          }
        }
      }
      this.updateBinaryClock(this.binaryMarkers[0], hours);
      this.updateBinaryClock(this.binaryMarkers[1], minutes);
      this.updateBinaryClock(this.binaryMarkers[2], seconds);
    }
  }

  setActiveMarkers(column, time) {
    let binary = this.toBinary(parseInt(time));
    this.resetMarkerColumn(column);

    for (let i = 0; i <= binary.length - 1; i++) {
      if (parseInt(binary[(binary.length - 1) - i]) > 0) {
        column[(column.length - 1) - i] = true;
      }
    }
  }

  updateBinaryClock(markerColumns, time) {
    this.resetMarkers(markerColumns);

    for (let s = 0; s <= time.toString().length - 1; s++) {
      let column = markerColumns[(markerColumns.length - 1) - s];
      this.setActiveMarkers(column, parseInt(time.toString()[(time.toString().length - 1) - s]))
    }
  }

  resetMarkers = (markerColumns) => {
    for (var c = 0; c <= markerColumns.length - 1; c++) {
      this.resetMarkerColumn(markerColumns[(markerColumns.length - 1) - c]);
    }
  }

  resetMarkerColumn(column) {
    for (var i = column.length - 1; i >= 0; i--) {
      column[(column.length - 1) - i] = false;
    }
  }
  
  toBinary(v) {
    //makes a binary value from a number
    return (v).toString(2);
  }

  constructTitleTime(): string {
    let titleIndex = this.settings.config.misc.title.clockUsed - 1;
    let titleClock = this.settings.config.time.clocks[titleIndex];
    if (titleClock) {
      let hour1 = this.getHour(titleClock.timezone, titleClock.twentyFour, titleClock.twoDigit, 1);
      let getHour2 = this.getHour(titleClock.timezone, titleClock.twentyFour, titleClock.twoDigit, 2);
      let hour2 = getHour2 ? getHour2 : '';
      let min1 = this.getMinute(titleClock.timezone, 1);
      let min2 = this.getMinute(titleClock.timezone, 2);
      let sec1 = titleClock.seconds.enabled ? this.getSecond(titleClock.timezone, 1) : '';
      let sec2 = titleClock.seconds.enabled ? this.getSecond(titleClock.timezone, 2) : '';
      let meridiem = titleClock.meridiem.enabled ? ' ' + this.getMeridiem(titleClock.timezone, titleClock.meridiem.am, titleClock.meridiem.pm) : '';
      let delimiter1 = titleClock.delimiter.enabled ? ':' : '';
      let delimiter2 = titleClock.delimiter.enabled && titleClock.seconds.enabled ? ':' : '';

      let title = hour1 + hour2 + delimiter1 + min1 + min2 + delimiter2 + sec1 + sec2 + meridiem;
      return title;
    }
    return '';
  }

  getHour(zone: string, twentyFour: boolean, twoDigit: boolean, digit: 1 | 2): string {
    moment.locale(this.settings.config.i18n.lang);
    zone = this.getZone(zone);
    let format: string;
    twentyFour ? format = 'HH' : format = 'h';
    if (twentyFour) {
      format = 'HH';
    } else if (twoDigit) {
      format = 'hh';
    } else {
      format = 'h';
    }
    let time = moment(this.currentTime).tz(zone).format(format);
    return this.splitDigits(time, digit);
  }

  getMinute(zone: string, digit: 1 | 2): string {
    moment.locale(this.settings.config.i18n.lang);
    zone = this.getZone(zone);
    let time = moment(this.currentTime).tz(zone).format('mm');
    return this.splitDigits(time, digit);
  }

  getSecond(zone: string, digit: 1 | 2): string {
    moment.locale(this.settings.config.i18n.lang);
    zone = this.getZone(zone);
    let time = moment(this.currentTime).tz(zone).format('ss');
    return this.splitDigits(time, digit);
  }

  getMeridiem(zone: string, am: string, pm: string): string {
    moment.locale('en-US');
    zone = this.getZone(zone);
    let time = moment(this.currentTime).tz(zone).format('a');
    if (time === 'pm') {
      return pm;
    } else if (time === 'am') {
      return am;
    }
    return time;
  }

  getRelative(zone: string) {
    moment.locale(this.settings.config.i18n.lang);
    zone = this.getZone(zone);
    let here = moment(this.currentTime);
    let hereOffset = here.utcOffset();
    let there = moment(this.currentTime).tz(zone);
    let thereOffset = there.utcOffset();
    let offset = (thereOffset - hereOffset) / 60;
    let diff;
    if (offset === 1) {
      diff = '+' + offset + ' hour';
    } else if (offset === -1) {
      diff = offset + ' hour';
    } else if (offset < -1) {
      diff = offset + ' hours';
    } else {
      diff = '+' + offset + ' hours';
    }
    return diff;
  }

  getBlink(isBlinking): boolean {
    let time = Number(moment(this.currentTime).format('SSS'));
    if (time > 500 && isBlinking) {
      return true;
    }
    return false;
  }

  showMeridiem(zone: string, am: string, pm: string): boolean {
    moment.locale('en-US');
    zone = this.getZone(zone);
    let time = moment(this.currentTime).tz(zone).format('a');
    if (time === 'pm' && pm !== '') {
      return true;
    } else if (time === 'am' && am !== '') {
      return true;
    }
    return false;
  }

  splitDigits(time: string, digit: 1 | 2) {
    let timeSplit = time.split('');
    if (digit === 1) {
      return timeSplit[0];
    } else if (digit === 2) {
      return timeSplit[1];
    }
  }

  getZone(zone: string) {
    if (zone === 'Automatic') {
      zone = this.shared.zoneGuess;
    }
    return zone;
  }

  getWidth(size: number) {
    return (size * .06) + 'em';
  }

  getPadding(size: number) {
    return (size * .1) + 'em';
  }

  getAnalogSecond(zone: string): string {
    zone = this.getZone(zone);
    let time = moment(this.currentTime).tz(zone);
    let second = time.seconds() * 6;
    return 'rotateZ(' + second + 'deg)';
  }

  getAnalogMinute(zone: string): string {
    zone = this.getZone(zone);
    let time = moment(this.currentTime).tz(zone);
    let second = time.seconds() * 6;
    let minute = time.minutes() * 6 + second / 60;
    return 'rotateZ(' + minute + 'deg)';
  }

  getAnalogHour(zone: string): string {
    zone = this.getZone(zone);
    let time = moment(this.currentTime).tz(zone);
    let second = time.seconds() * 6;
    let minute = time.minutes() * 6 + second / 60;
    let hour = ((time.hours() % 12) / 12) * 360 + minute / 12;
    return 'rotateZ(' + hour + 'deg)';
  }

}
