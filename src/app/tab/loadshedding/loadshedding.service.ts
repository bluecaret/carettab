import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoadsheddingService {
  private _areaSearchKeyword: string;

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
      // return { "areas": [{ "id": "jhbcitypower2-15-bergbron", "name": "Bergbron (15)", "region": "JHB City Power" }] };

      let area = encodeURI(search);
      let license = this.settings.config.loadshedding.license;
      console.log('searchAreas license', license);

      const headers = new Headers();
      headers.append('Access-Control-Allow-Origin', 'https://developer.sepush.co.za/*');
      headers.append('token', `${license}`);
      let response = await fetch(`https://developer.sepush.co.za/business/2.0/areas_search?text=${area}`, { method: 'GET', mode: 'cors', headers });
      const json = await response.json();

      console.log('eskomData', JSON.stringify(json));
      return json;
    }
    return
  }

  public async getAreaInfo(areaId: string) {
    if (this.isEnabled) {
      // return {"loadshedding_jhbcitypower2-15-bergbron":{"cachedAt":"1675890460575","data":{"events":[{"end":"2023-02-09T01:30:00+02:00","note":"Stage 8 (TESTING: current)","start":"2023-02-08T23:00:00+02:00"}],"info":{"name":"TESTING Bergbron (15)","region":"JHB City Power"},"schedule":{"days":[{"date":"2023-02-08","name":"Wednesday","stages":[["22:00-00:30"],["14:00-16:30","22:00-00:30"],["06:00-08:30","14:00-16:30","22:00-00:30"],["06:00-08:30","14:00-16:30","22:00-00:30"],["06:00-08:30","14:00-16:30","22:00-00:30"],["06:00-08:30","14:00-18:30","22:00-00:30"],["06:00-10:30","14:00-18:30","22:00-00:30"],["00:00-02:30","06:00-10:30","14:00-18:30","22:00-00:30"]]},{"date":"2023-02-09","name":"Thursday","stages":[[],["20:00-22:30"],["12:00-14:30","20:00-22:30"],["04:00-06:30","12:00-14:30","20:00-22:30"],["00:00-02:30","04:00-06:30","12:00-14:30","20:00-22:30"],["00:00-02:30","04:00-06:30","12:00-14:30","20:00-00:30"],["00:00-02:30","04:00-06:30","12:00-16:30","20:00-00:30"],["00:00-02:30","04:00-08:30","12:00-16:30","20:00-00:30"]]},{"date":"2023-02-10","name":"Friday","stages":[["04:00-06:30"],["04:00-06:30"],["04:00-06:30","20:00-22:30"],["04:00-06:30","12:00-14:30","20:00-22:30"],["04:00-08:30","12:00-14:30","20:00-22:30"],["04:00-08:30","12:00-14:30","20:00-22:30"],["04:00-08:30","12:00-14:30","20:00-00:30"],["04:00-08:30","12:00-16:30","20:00-00:30"]]},{"date":"2023-02-11","name":"Saturday","stages":[["12:00-14:30"],["04:00-06:30","12:00-14:30"],["04:00-06:30","12:00-14:30"],["04:00-06:30","12:00-14:30","20:00-22:30"],["04:00-06:30","12:00-16:30","20:00-22:30"],["04:00-08:30","12:00-16:30","20:00-22:30"],["04:00-08:30","12:00-16:30","20:00-22:30"],["04:00-08:30","12:00-16:30","20:00-00:30"]]},{"date":"2023-02-12","name":"Sunday","stages":[["20:00-22:30"],["12:00-14:30","20:00-22:30"],["04:00-06:30","12:00-14:30","20:00-22:30"],["04:00-06:30","12:00-14:30","20:00-22:30"],["04:00-06:30","12:00-14:30","20:00-00:30"],["04:00-06:30","12:00-16:30","20:00-00:30"],["04:00-08:30","12:00-16:30","20:00-00:30"],["04:00-08:30","12:00-16:30","20:00-00:30"]]},{"date":"2023-02-13","name":"Monday","stages":[[],["18:00-20:30"],["10:00-12:30","18:00-20:30"],["02:00-04:30","10:00-12:30","18:00-20:30"],["02:00-04:30","10:00-12:30","18:00-20:30"],["02:00-04:30","10:00-12:30","18:00-22:30"],["02:00-04:30","10:00-14:30","18:00-22:30"],["02:00-06:30","10:00-14:30","18:00-22:30"]]},{"date":"2023-02-14","name":"Tuesday","stages":[["02:00-04:30"],["02:00-04:30"],["02:00-04:30","18:00-20:30"],["02:00-04:30","10:00-12:30","18:00-20:30"],["02:00-06:30","10:00-12:30","18:00-20:30"],["02:00-06:30","10:00-12:30","18:00-20:30"],["02:00-06:30","10:00-12:30","18:00-22:30"],["02:00-06:30","10:00-14:30","18:00-22:30"]]}],"source":"https://example.com/test.schedule/current"}}}};
      let license = this.settings.config.loadshedding.license;
      console.log('getAreaInfo license', license);

      const headers = new Headers();
      headers.append('Access-Control-Allow-Origin', 'https://developer.sepush.co.za/*');
      headers.append('token', `${license}`);
      let response = await fetch(`https://developer.sepush.co.za/business/2.0/area?id=${areaId}`, { method: 'GET', mode: 'cors', headers });
      const json = await response.json();

      console.log('eskomData:getAreaInfo', JSON.stringify(json));
      return json;
    }
    return
  }

  public async getSatus(){
    if (this.isEnabled) {
      let license = this.settings.config.loadshedding.license;
      console.log('getAreaInfo license', license);

      const headers = new Headers();
      headers.append('Access-Control-Allow-Origin', 'https://developer.sepush.co.za/*');
      headers.append('token', `${license}`);
      let response = await fetch(`https://developer.sepush.co.za/business/2.0/status`, { method: 'GET', mode: 'cors', headers });
      const json = await response.json();

      console.log('eskomData:getStatus', JSON.stringify(json));
      return json;
    }
    return;    
  }
}
