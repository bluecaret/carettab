import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoadsheddingService {
  private _areaSearchKeyword: string;
  // private _locName: string;
  // private _API_KEY: string;
  // public requestWeatherUpdate = new EventEmitter();

  constructor(private settings: Storage) { }

  get areaSearchKeyword(): string {
    return this._areaSearchKeyword;
  }
  set areaSearchKeyword(value: string) {
    this._areaSearchKeyword = value;
  }

  isEnabled() {
    let enabled = true
    if (!this.settings.config.loadshedding.enabled) enabled = false
    if (!this.settings.config.loadshedding.citizen) enabled = false
    if (!this.settings.config.loadshedding.license) enabled = false
    return enabled
  }

  // get API_KEY(): string {
  //   return this._API_KEY;
  // }
  // set API_KEY(value: string) {
  //   this._API_KEY = value;
  // }

  // get locName(): string {
  //   return this._locName;
  // }
  // set locName(value: string) {
  //   this._locName = value;
  // }

  // public async getWeather(loc: string, days: number) {
  //   let weatherKey = await this.getKeys();
  //   let getWeather = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${loc}&days=${days}&aqi=no&alerts=no${this.getLang()}`, { method: "GET" });
  //   let getWeatherJson = await getWeather.json();
  //   return getWeatherJson;
  // }

  public async checkAllowance(search: string) {
    if (this.isEnabled) {
      let license = this.settings.config.loadshedding.license;
      console.log('checkAllowance', license);

      const headers = new Headers();
      headers.append('Access-Control-Allow-Origin', 'https://developer.sepush.co.za/*');
      headers.append('token', `${license}`);
      let response = await fetch('https://developer.sepush.co.za/business/2.0/api_allowance', { method: 'GET', mode: 'cors', headers });
      const json = await response.json();

      // console.log('eskomData', json);
      return json;
    }
    return
  }

  public async searchAreas(search: string) {
    if (this.isEnabled) {
      let area = encodeURI(search);
      let license = this.settings.config.loadshedding.license;
      console.log('searchAreas license', license);

      const headers = new Headers();
      headers.append('Access-Control-Allow-Origin', 'https://developer.sepush.co.za/*');
      headers.append('token', `${license}`);
      let response = await fetch(`https://developer.sepush.co.za/business/2.0/areas_search?text=${area}`, { method: 'GET', mode: 'cors', headers });
      const json = await response.json();

      // console.log('eskomData', json);
      return json;
    }
    return
  }

  public async getAreaInfo(areaId: string) {
    if (this.isEnabled) {
      let license = this.settings.config.loadshedding.license;
      console.log('getAreaInfo license', license);

      const headers = new Headers();
      headers.append('Access-Control-Allow-Origin', 'https://developer.sepush.co.za/*');
      headers.append('token', `${license}`);
      let response = await fetch(`https://developer.sepush.co.za/business/2.0/area?id=${areaId}&test=current`, { method: 'GET', mode: 'cors', headers });
      const json = await response.json();

      // console.log('eskomData', json);
      return json;
    }
    return
  }
}
