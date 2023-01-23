import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private _locName: string;
  private _API_KEY: string;
  public requestWeatherUpdate = new EventEmitter();

  constructor(private settings: Storage) { }

  get API_KEY(): string {
    return this._API_KEY;
  }
  set API_KEY(value: string) {
    this._API_KEY = value;
  }

  get locName(): string {
    return this._locName;
  }
  set locName(value: string) {
    this._locName = value;
  }

  public async getKeys() {
    if (!this.API_KEY || this.API_KEY == '') {
      const awsEndpoint = 'https://d3v14xaicc.execute-api.us-west-2.amazonaws.com/default/caretTabKeys';
      let getKeys = await fetch(awsEndpoint, { method: "post" });
      let awsJson = await getKeys.text();
      let parsed = await JSON.parse(awsJson).message.weatherApiKey;
      return JSON.parse(awsJson).message.weatherApiKey;
    }
    return this.API_KEY;
  }

  public async getWeather(loc: string, days: number) {
    let weatherKey = await this.getKeys();
    let getWeather = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${loc}&days=${days}&aqi=no&alerts=no${this.getLang()}`, { method: "GET"});
    let getWeatherJson = await getWeather.json();
    return getWeatherJson;
  }

  public async searchLocation(loc: string) {
    let weatherKey = await this.getKeys();
    let location = encodeURI(loc);
    let getSearch = await fetch(`https://api.weatherapi.com/v1/search.json?key=${weatherKey}&q=${location}${this.getLang()}`, { method: "GET"});
    let getSearchJson = await getSearch.json();
    return getSearchJson;
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
