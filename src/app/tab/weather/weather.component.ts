import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { WeatherService } from './weather.service'
import * as moment from 'moment';

@Component({
  selector: 'tab-weather',
  templateUrl: 'weather.component.html',
  host: {'class': 'weather'}
})

export class TabWeatherComponent implements OnInit {
  cachedWeather;
  weather;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    let getStoredWeather = localStorage.getItem('ct-weather');
    this.cachedWeather = getStoredWeather && JSON.parse(getStoredWeather);
    this.weather = this.cachedWeather ? this.cachedWeather.report : null;
    this.setWeather();

    this.settings.onChange().subscribe((data) => {
      if (data['ct-weather']) {
        this.setWeather();
      }
    });
  }

  setWeather() {
    this.shared.echo('Refresh weather data');
    this.weatherService.getWeather(this.settings.config.weather.location.url, 3).subscribe((data)=>{
      this.shared.echo('Weather API response:', null, data);
      this.cachedWeather = {}
      let today = new Date();
      this.cachedWeather['date'] = today;
      this.cachedWeather['report'] = {...data};
      this.weather = this.cachedWeather.report;
      this.weatherService.locName = this.cachedWeather.report.location.name;
      localStorage.setItem('ct-weather', JSON.stringify(this.cachedWeather));
    });
  }

  getImperialWind(digit) {
    if (this.settings.config.weather.windUnits) {
      //mph >> ft/s
      digit = digit * 1.467;
    }
    return this.getPreciseDigit(digit);
  }

  getMetricWind(digit) {
    if (this.settings.config.weather.windUnits) {
      //km/h >> m/s
      digit = digit / 3.6;
    }
    return this.getPreciseDigit(digit);
  }

  getWindUnitType() {    
    if (this.settings.config.weather.metric === true) {
      if (this.settings.config.weather.windUnits) {
        return ' m/s';
      } else {
        return ' km/h';
      }
    }
    if (this.settings.config.weather.metric === false) {
      if (this.settings.config.weather.windUnits) {
        return ' ft/s';
      } else {
        return ' mph';
      }
    }
  }

  getPreciseDigit(digit) {
    if (this.settings.config.weather.preciseDigits) {
      return digit.toFixed(1);
    }
    return Math.round(digit);
  }

  isToday = (date) => {
    const today = new Date();
    let comparedDate = new Date(date);
    let isDateToday = comparedDate.getDate() == today.getDate() && comparedDate.getMonth() == today.getMonth() && comparedDate.getFullYear() == today.getFullYear();
    console.log('isDateToday', isDateToday);
    return isDateToday;
  }

  getDayOfWeek(date): string {
    moment.locale(this.settings.config.i18n.lang);
    let d = moment(date);
    let day = d.format('ddd');
    return day;
  }

}
