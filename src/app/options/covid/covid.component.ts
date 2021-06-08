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
export class OptionsCovidComponent implements OnInit {
  status: string;
  shareMenu = false;
  public countryList = [];
  constructor(public shared: SharedService, public settings: Storage, public ga: GoogleAnalyticsService, private http: HttpClient) {
  }

  ngOnInit() {
    this.countryLists();
  }

  countryLists() {
    this.http.get('https://covid19.mathdro.id/api/countries').subscribe(data => {
      this.countryList = data.countries.map(x =>{ return  { label: x.name ,id:x.iso2};});
    }) 
  }
}