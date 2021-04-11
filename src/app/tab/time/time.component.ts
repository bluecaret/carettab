import { Component, NgZone, Renderer2, ElementRef, ViewChild, Input, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { Clock } from '../../_shared/models/clock';
import { SharedService } from '../../_shared/shared.service';
import { span } from '../../_shared/lists/lists';
import * as moment from 'moment';

@Component({
  selector: 'tab-time',
  templateUrl: 'time.component.html',
  host: {'class': 'clock'}
})
export class TabTimeComponent implements OnInit {
  currentTime: Date;
  span = span;

  @Input() index: number;
  @Input() clock: Clock;

  @ViewChild('time', { static: false })
  public displayTime: ElementRef;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private zone: NgZone,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (this.settings.config.time.clocks.length > 0) {
      this.shared.zoneGuess = moment.tz.guess();
      setInterval(() => {
        this.currentTime = new Date();
        this.setTitleTime();
      }, 500);
    }
  }

  setTitleTime() {
    if (
      this.settings.config.title.type === 20 ||
      this.settings.config.title.type === 40 ||
      this.settings.config.title.type === 50
    ) {
      this.shared.time = this.constructTitleTime();
    }
  }

  constructTitleTime(): string {
    let index = this.settings.config.title.clockUsed - 1;
    let clock = this.settings.config.time.clocks[index];
    if (clock) {
      let hour1 = this.getHour(clock.timezone, clock.twentyFour, clock.zeroPadding, 1);
      let getHour2 = this.getHour(clock.timezone, clock.twentyFour, clock.zeroPadding, 2);
      let hour2 = getHour2 ? getHour2 : '';
      let min1 = this.getMinute(clock.timezone, 1);
      let min2 = this.getMinute(clock.timezone, 2);
      let sec1 = clock.seconds.enabled ? this.getSecond(clock.timezone, 1) : '';
      let sec2 = clock.seconds.enabled ? this.getSecond(clock.timezone, 2) : '';
      let meridiem = clock.meridiem.enabled ? ' ' + this.getMeridiem(clock.timezone, clock.meridiem.am, clock.meridiem.pm) : '';
      let delimiter1 = clock.delimiter.enabled ? ':' : '';
      let delimiter2 = clock.delimiter.enabled && clock.seconds.enabled ? ':' : '';

      let title = hour1 + hour2 + delimiter1 + min1 + min2 + delimiter2 + sec1 + sec2 + meridiem;
      return title;
    }
    return '';
  }

  getHour(zone: string, twentyFour: boolean, zeroPadding: boolean, digit: 1|2): string {
    moment.locale(this.settings.config.lang);
    zone = this.getZone(zone);
    let format: string;
    twentyFour ? format = 'HH' : format = 'h';
    if (twentyFour) {
      format = 'HH';
    } else if (zeroPadding) {
      format = 'hh';
    } else {
      format = 'h';
    }
    let time = moment(this.currentTime).tz(zone).format(format);
    return this.splitDigits(time, digit);
  }

  getMinute(zone: string, digit: 1|2): string {
    moment.locale(this.settings.config.lang);
    zone = this.getZone(zone);
    let time = moment(this.currentTime).tz(zone).format('mm');
    return this.splitDigits(time, digit);
  }

  getSecond(zone: string, digit: 1|2): string {
    moment.locale(this.settings.config.lang);
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
    moment.locale(this.settings.config.lang);
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

  splitDigits(time: string, digit: 1|2) {
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
