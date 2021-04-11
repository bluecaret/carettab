import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import * as moment from 'moment';

@Component({
  selector: 'tab-date',
  templateUrl: 'date.component.html',
  host: {'class': 'date'}
})
export class TabDateComponent implements OnInit {
  currentDate: Date;

  constructor(
    public shared: SharedService,
    public settings: Storage
  ) {}

  ngOnInit() {
    if (this.settings.config.date.enabled) {
      this.shared.zoneGuess = moment.tz.guess();
      setInterval(() => {
        this.currentDate = new Date();
        this.setTitleDate();
      }, 500);
    }
  }

  setTitleDate() {
    if (
      this.settings.config.title.type === 20 ||
      this.settings.config.title.type === 40 ||
      this.settings.config.title.type === 50
    ) {
      this.shared.date = this.getDate();
    }
  }

  getDate(): string {
    moment.locale(this.settings.config.lang);
    let current = this.currentDate;
    let c = this.settings.config.date;
    let zone = this.getZone(c.timezone);
    let date = moment(current).tz(zone);
    let year = c.year.twoDigit ? date.format('YY') : date.format('YYYY');
    let month = c.month.abbr ? date.format('MMM') : date.format('MMMM');
    let day = c.day.twoDigit ? date.format('DD') : date.format('D');
    let weekDay: string;
    if (c.dayOfWeek.enabled) {
      weekDay = c.dayOfWeek.abbr ? date.format('ddd') + ', ' : date.format('dddd') + ', ';
    } else {
      weekDay = '';
    }
    let delimiter = c.short.delimiter;
    if (c.short.enabled) {
      month = c.month.twoDigit ? date.format('MM') : date.format('M');
      if (c.format === 10) {
        if (c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + day + delimiter + month + delimiter + year;
        } else if (!c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + day;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + day + delimiter + month;
        } else if (c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + day + delimiter + year;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month;
        } else if (c.year.enabled && c.month.enabled && !c.day.enabled) {
          return weekDay + month + delimiter + year;
        } else if (c.year.enabled && !c.month.enabled && !c.day.enabled) {
          return weekDay + year;
        } else {
          return weekDay;
        }
      } else if (c.format === 20) {
        if (c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month + delimiter + day + delimiter + year;
        } else if (!c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + day;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month + delimiter + day;
        } else if (c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + day + delimiter + year;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month;
        } else if (c.year.enabled && c.month.enabled && !c.day.enabled) {
          return weekDay + month + delimiter + year;
        } else if (c.year.enabled && !c.month.enabled && !c.day.enabled) {
          return weekDay + year;
        } else {
          return weekDay;
        }
      } else if (c.format === 30) {
        if (c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + year + delimiter + month + delimiter + day;
        } else if (!c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + day;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month + delimiter + day;
        } else if (c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + year + delimiter + day;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month;
        } else if (c.year.enabled && c.month.enabled && !c.day.enabled) {
          return weekDay + year + delimiter + month;
        } else if (c.year.enabled && !c.month.enabled && !c.day.enabled) {
          return weekDay + year;
        } else {
          return weekDay;
        }
      }
    } else {
      if (c.format === 10) {
        if (c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + day + ' ' + month + ' ' + year;
        } else if (!c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + day;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + day + ' ' + month;
        } else if (c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + day + ' ' + year;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month;
        } else if (c.year.enabled && c.month.enabled && !c.day.enabled) {
          return weekDay + month + ' ' + year;
        } else if (c.year.enabled && !c.month.enabled && !c.day.enabled) {
          return weekDay + year;
        } else {
          return weekDay;
        }
      } else if (c.format === 20) {
        if (c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month + ' ' + day + ', ' + year;
        } else if (!c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + day;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month + ' ' + day;
        } else if (c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + day + ', ' + year;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month;
        } else if (c.year.enabled && c.month.enabled && !c.day.enabled) {
          return weekDay + month + ' ' + year;
        } else if (c.year.enabled && !c.month.enabled && !c.day.enabled) {
          return weekDay + year;
        } else {
          return weekDay;
        }
      } else if (c.format === 30) {
        if (c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + year + ' ' + month + ' ' + day;
        } else if (!c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + day;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month + ' ' + day;
        } else if (c.year.enabled && !c.month.enabled && c.day.enabled) {
          return weekDay + year + ' ' + day;
        } else if (!c.year.enabled && c.month.enabled && c.day.enabled) {
          return weekDay + month;
        } else if (c.year.enabled && c.month.enabled && !c.day.enabled) {
          return weekDay + year + ' ' + month;
        } else if (c.year.enabled && !c.month.enabled && !c.day.enabled) {
          return weekDay + year;
        } else {
          return weekDay;
        }
      }
    }
  }

  getWeekNumber() {
    moment.locale(this.settings.config.lang);
    let format = this.settings.config.date.week.iso ? 'W' : 'w';
    return moment(this.currentDate).tz(this.getZone(this.settings.config.date.timezone)).format(format);
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

}
