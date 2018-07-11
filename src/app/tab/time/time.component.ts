import { Component, OnInit, NgZone, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { Clock, Delimiter } from '../../_shared/models/clock';
import { SharedService } from '../../_shared/shared.service';
import * as moment from 'moment';

@Component({
  selector: 'tab-time',
  templateUrl: 'time.component.html'
})
export class TabTimeComponent implements OnInit {
  currentTime: Date;
  baseScale = 50;

  @ViewChild('time')
  public displayTime: ElementRef;

  constructor(
    public shared: SharedService, 
    public settings: Storage, 
    private zone: NgZone, 
    private renderer: Renderer2
  ) {
    if (this.settings.config.time.clocks.length > 0) {
      this.shared.zoneGuess = moment.tz.guess();
      setInterval(() => {
        this.currentTime = new Date();
      }, 500);
    }
  }

  calcSize(size: number) {
    return ((this.baseScale / 50) * size) + 'px';
  }

  getTime(c: Clock): string {
    let hour = `
      <div class="timeDigit hour">
        <span>${this.getHour(c.timezone, c.twentyFour, 1)}</span>
        <span>${this.getHour(c.timezone, c.twentyFour, 2)}</span>
      </div>
    `;
    let minute = `
      <div class="timeDigit minute">
        <span>${this.getMinute(c.timezone, 1)}</span>
        <span>${this.getMinute(c.timezone, 2)}</span>
      </div>
    `;
    let second = c.seconds.enabled ? `
      <div class="timeDigit second">
        <span>${this.getSecond(c.timezone, 1)}</span>
        <span>${this.getSecond(c.timezone, 2)}</span>
      </div>
    ` : '';
    let delimiter1 = `
      <div class="delimiter">
        ${this.getDelimiter(c.delimiter)}
      </div>
    `;
    let delimiter2 = c.seconds.enabled ? `
      <div class="delimiter">
        ${this.getDelimiter(c.delimiter)}
      </div>
    ` : '';

    return hour + delimiter1 + minute + delimiter2 + second;
  }

  getHour(zone: string, twentyFour: boolean, digit: 1|2): string {
    zone = this.getZone(zone);
    let format: string;
    twentyFour ? format = 'HH' : format = 'hh';
    let time = moment(this.currentTime).tz(zone).format(format);
    return this.splitDigits(time, digit);
  }
  getMinute(zone: string, digit: 1|2): string {
    zone = this.getZone(zone);
    let time = moment(this.currentTime).tz(zone).format('mm');
    return this.splitDigits(time, digit);
  }
  getSecond(zone: string, digit: 1|2): string {
    zone = this.getZone(zone);
    let time = moment(this.currentTime).tz(zone).format('ss');
    return this.splitDigits(time, digit);
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

  getDelimiter(delimiter: Delimiter): string {
    if (delimiter.enabled) {
      return ':';
    } else {
      return ' ';
    }
  }

  getFont(font: string) {
    return '"' + font + '"';
  }

  ngOnInit() {
  }

}
