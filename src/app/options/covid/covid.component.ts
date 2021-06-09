import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '../../_shared/ga.service';
import { SharedService } from '../../_shared/shared.service';
import { Storage } from '../../_storage/storage.service';
import { HttpClient } from '@angular/common/http';
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'options-covid',
  templateUrl: 'covid.component.html'
})
export class OptionsCovidComponent {
  status: string;
  shareMenu = false;
  public selectedCountry = {};
  public countryList = [];
  constructor(public shared: SharedService, public settings: Storage, public ga: GoogleAnalyticsService, private http: HttpClient) {
  }

  loadData(e) {
    this.shared.toggleOrder(this.settings.config.covid.id, e);
    this.ga.field('covid.enabled', this.settings.config.covid.enabled)
    this.countryLists();
  }

  removeCountry(i) {
    this.settings.config.covid.countries.splice(i, 1);
  }

  countryLists() {
    this.http.get('https://covid19.mathdro.id/api/countries').subscribe(data => {
      this.countryList = data['countries'].map(x => { return { label: x.name, id: x.iso2 }; });
    })
  }
}