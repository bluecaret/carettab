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
  baseScale = 200;
  baseOffset = 0;

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
  calcOffset(size: number) {
    return ((this.baseOffset / 50) * size) + 'px';
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
