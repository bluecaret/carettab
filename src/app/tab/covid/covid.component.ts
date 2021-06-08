import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'tab-covid',
  templateUrl: 'covid.component.html',
  host: { 'class': 'covid' }
})
export class TabCovidComponent implements OnInit {

  @Input() country: string;
  @Input() index: number;
  public countryData = {};
  constructor(
    public settings: Storage,
    private http: HttpClient
  ) {
  }
  ngOnInit(): void {
    this.http.get('https://corona.lmao.ninja/v2/countries/' + this.country).subscribe(data => {
      debugger;
      this.countryData = data;
    });
  }

}
