import { Component, NgZone, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { Delimiter } from '../../_shared/models/clock';
import { SharedService } from '../../_shared/shared.service';
import { span } from '../../_shared/lists/lists';
import * as moment from 'moment';

@Component({
  selector: 'tab-time',
  templateUrl: 'time.component.html',
  host: {'class': 'tabClocks'}
})
export class TabTimeComponent {
  currentTime: Date;
  span = span;

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

  getHour(zone: string, twentyFour: boolean, digit: 1|2): string {
    zone = this.getZone(zone);
    let format: string;
    twentyFour ? format = 'HH' : format = 'h';
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
  getMeridiem(zone: string): string {
    zone = this.getZone(zone);
    let time = moment(this.currentTime).tz(zone).format('a');
    return time;
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

  getSpan(clockSpan) {
    return this.span.find(s => s.id === clockSpan).css;
  }

}
