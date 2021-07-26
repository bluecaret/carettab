import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { SharedService } from '../../_shared/shared.service';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'tab-covid',
  templateUrl: 'covid.component.html',
  host: { class: 'covid' }
})
export class TabCovidComponent implements OnInit {
  @Input() countryCode: string;
  @Input() index: number;

  public countryData = new CovidData();

  constructor(
    public settings: Storage,
    private http: HttpClient,
    public shared: SharedService
  ) {}

  ngOnInit(): void {
    this.getCovidFromApi();

    this.settings.onChange().subscribe((data) => {
      if (data['ct-covid']) {
        this.getCovidFromApi();
      }
    });
  }

  getCovidFromApi() {
    this.http
      .get('https://corona.lmao.ninja/v2/countries/' + this.countryCode)
      .subscribe((data: CovidData) => {
        this.shared.echo('COVID API response', null, data);
        this.countryData = data;
      });
  }

}

export class CovidData {
  todayCases: number = null;
  deaths: number = null;
  deathsPerOneMillion: number = null;
  active: number = null;
  activePerOneMillion: number = null;
  recovered: number = null;
  recoveredPerOneMillion: number = null;
  country: string = '';
  countryInfo: {
    flag: string;
  };
}
