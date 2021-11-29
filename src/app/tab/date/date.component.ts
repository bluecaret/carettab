import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import * as moment from 'moment';

@Component({
  selector: 'tab-date',
  templateUrl: 'date.component.html',
  host: { 'class': 'date' }
})
export class TabDateComponent implements OnInit {
  currentDate: Date;

  constructor(
    public shared: SharedService,
    public settings: Storage
  ) { }

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
      this.settings.config.misc.title.type === 20 ||
      this.settings.config.misc.title.type === 40 ||
      this.settings.config.misc.title.type === 50
    ) {
      this.shared.date = this.getDate();
    }
  }

  getDate(): string {
    moment.locale(this.settings.config.i18n.lang);
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
    moment.locale(this.settings.config.i18n.lang);
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

  getDelimiter() {
    return this.settings.config.date.short.delimiter;
  }

  getOrdinalContentDelimiter() {
    return this.settings.config.date.ordinalContent.delimiter;
  }

  getWeekday(): string {
    moment.locale(this.settings.config.i18n.lang);
    let current = this.currentDate;
    let c = this.settings.config.date;
    let zone = this.getZone(c.timezone);
    let date = moment(current).tz(zone);
    let weekDay: string;
    let comma = this.settings.config.date.year.enabled || this.settings.config.date.month.enabled || this.settings.config.date.day.enabled ? ', ' : '';
    if (c.dayOfWeek.enabled) {
      weekDay = c.dayOfWeek.abbr ? date.format('ddd') + comma : date.format('dddd') + comma;
    } else {
      weekDay = '';
    }
    return weekDay;
  }

  getDay(): string {
    moment.locale(this.settings.config.i18n.lang);
    let current = this.currentDate;
    let c = this.settings.config.date;
    let zone = this.getZone(c.timezone);
    let date = moment(current).tz(zone);
    let day = c.day.twoDigit ? date.format('DD') : date.format('D');
    if (c.short.enabled) {
      if (c.day.enabled) {
        return day;
      }
    }
    return '';
  }

  getJulianDate(): string {
    moment.locale(this.settings.config.i18n.lang);
    let current = this.currentDate;
    let c = this.settings.config.date;
    let zone = this.getZone(c.timezone);
    let date = moment(current).tz(zone);

    let newYear = new Date(current.getFullYear(), 0, 1, 0, 0, 0); // month is 0 indexed
    let difference = current.getTime() - newYear.getTime();
    let julianDate = difference/1000/60/60/24;
    return '' + (Math.trunc(julianDate) + 1);
  }

  getMonth(): string {
    moment.locale(this.settings.config.i18n.lang);
    let current = this.currentDate;
    let c = this.settings.config.date;
    let zone = this.getZone(c.timezone);
    let date = moment(current).tz(zone);
    let month = c.month.abbr ? date.format('MMM') : date.format('MMMM');

    month = c.month.twoDigit ? date.format('MM') : date.format('M');
    if (c.short.enabled) {
      if (c.month.enabled) {
        return month;
      }
    }
    return '';
  }

  getYear(): string {
    moment.locale(this.settings.config.i18n.lang);
    let current = this.currentDate;
    let c = this.settings.config.date;
    let zone = this.getZone(c.timezone);
    let date = moment(current).tz(zone);
    let year = c.year.twoDigit ? date.format('YY') : date.format('YYYY');
    if (c.short.enabled) {
      if (c.year.enabled) {
        return year;
      }
    }
    return '';
  }
}
