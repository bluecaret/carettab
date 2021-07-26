import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { SharedService } from '../../_shared/shared.service';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'tab-covid',
  templateUrl: 'covid.component.html',
  host: { class: 'covid' }
})
export class TabCovidComponent implements OnInit, OnChanges {
  @Input() countryCode: string;
  @Input() index: number;
  public countryData = new CovidData();
  constructor(
    public settings: Storage,
    private http: HttpClient,
    public shared: SharedService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.http
      .get('https://corona.lmao.ninja/v2/countries/' + this.countryCode)
      .subscribe((data: CovidData) => {
        this.shared.echo(JSON.stringify(data));
        this.countryData = data;
      });
  }
  ngOnInit(): void {
    this.http
      .get('https://corona.lmao.ninja/v2/countries/' + this.countryCode)
      .subscribe((data: CovidData) => {
        this.shared.echo(JSON.stringify(data));
        this.countryData = data;
      });
  }

  getGap(padding: number) {
    return padding * 0.1 + 'em';
  }
}

export class CovidData {
  todayCases: number = null;
  deaths: number = null;
  active: number = null;
  recovered: number = null;
  country: string = '';
  countryInfo: {
    flag: string;
  };
}
