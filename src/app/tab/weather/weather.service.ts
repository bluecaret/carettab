import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '../../_storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  API_KEY = '80e6d355c23b469d96a43532210606';
  private _locName: string;

  constructor(private httpClient: HttpClient, private settings: Storage) { }

  get locName(): string {
    return this._locName;
  }
  set locName(value: string) {
    this._locName = value;
  }

  public getWeather(loc: string, days: number) {
    return this.httpClient.get(`https://api.weatherapi.com/v1/forecast.json?key=${this.API_KEY}&q=${loc}&days=${days}&aqi=no&alerts=no${this.getLang()}`);
  }

  public searchLocation(loc: string) {
    let location = encodeURI(loc);
    return this.httpClient.get(`https://api.weatherapi.com/v1/search.json?key=${this.API_KEY}&q=${location}${this.getLang()}`);
  }

  private getLang(): string {
    switch (this.settings.config.i18n.lang) {
      case "zh-CN":
        return "&lang=zh"
        break;
      case "zh-TW":
        return "&lang=zh_tw"
        break;
      case "fr-FR":
        return "&lang=fr"
        break;
      case "de-DE":
        return "&lang=de"
        break;
      // Hebrew not supported
      // case "he-IL":
      //   return "lang="
      //   break;
      case "it-IT":
        return "&lang=it"
        break;
      case "ja-jP":
        return "&lang="
        break;
      case "ko-KR":
        return "&lang=ja"
        break;
      case "pt-BR":
        return "&lang=pt"
        break;
      case "pt-PT":
        return "&lang=pt"
        break;
      case "ru-RU":
        return "&lang=ru"
        break;
      case "es-MX":
        return "&lang=es"
        break;
      case "sv-SE":
        return "&lang=sv"
        break;
      case "uk-UA":
        return "&lang=uk"
        break;
      case "ur-PK":
        return "&lang=ur"
        break;
    
      default:
        return ''
        break;
    }
  }
}