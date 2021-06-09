import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'tab-covid',
  templateUrl: 'covid.component.html',
  host: { 'class': 'covid' }
})
export class TabCovidComponent implements OnInit {

  @Input() countryCode: string;
  @Input() index: number;
  public countryData = new CovidData();
  constructor(
    public settings: Storage,
    private http: HttpClient
  ) {
  }
  ngOnInit(): void {
    this.http.get('https://corona.lmao.ninja/v2/countries/' + this.countryCode).subscribe((data: CovidData) => {
      this.countryData = data;
    });
  }

}

export class CovidData {
  todayCases: string = '';
  deaths: string= '';
  active: string= '';
  countryInfo: {
    flag: string;
  }
}