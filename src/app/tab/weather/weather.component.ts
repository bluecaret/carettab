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

    // if (
    //   (
    //     this.cachedWeather && this.cachedWeather.date && 
    //     !this.isToday(this.cachedWeather.date)
    //   ) || 
    //   !this.cachedWeather
    // ) {
      console.log('Refresh weather data');
      this.weatherService.getWeather(this.settings.config.weather.location.url, 3).subscribe((data)=>{
        this.shared.echo('Weather API response:', null, data);

        this.cachedWeather = {}
        let today = new Date();
        this.cachedWeather['date'] = today;
        this.cachedWeather['report'] = {...data};

        localStorage.setItem('ct-weather', JSON.stringify(this.cachedWeather));

      });
    // } else {
    //   console.log('Weather data still current');
    // }


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
