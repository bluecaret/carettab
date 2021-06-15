import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  API_KEY = '80e6d355c23b469d96a43532210606';

  constructor(private httpClient: HttpClient) { }

  public getWeather(loc: string, days: number) {
    return this.httpClient.get(`https://api.weatherapi.com/v1/forecast.json?key=${this.API_KEY}&q=${loc}&days=${days}&aqi=no&alerts=no`);
  }

  public searchLocation(loc: string) {
    let location = encodeURI(loc);
    return this.httpClient.get(`https://api.weatherapi.com/v1/search.json?key=${this.API_KEY}&q=${location}`);
  }
}