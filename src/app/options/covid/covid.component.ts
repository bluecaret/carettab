import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '../../_storage/storage.service';
import { title, languages } from '../../_shared/lists/lists';
import { SharedService } from '../../_shared/shared.service';
import { GoogleAnalyticsService } from '../../_shared/ga.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'options-covid',
  templateUrl: 'covid.component.html'
})
export class OptionsCovidComponent {
  selected = '';
  newCountry = '';
  public countryList = [];
  constructor(
    public settings: Storage,
    public shared: SharedService,
    public ga: GoogleAnalyticsService,
    private http: HttpClient
  ) {
    this.countryLists();
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  swap(arr: any[], from: number, to: number, position:string) {
    //Only execute the swop if we have more than one item in that position
    if (arr.filter((x) => x.position === position).length > 1)
      arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
  }

  loadData(e) {
    this.countryLists();
  }

  addCountry(model: any, isValid: boolean) {
    if (isValid && model.value.newCountry.code != '') {
      let elementId = this.shared.createID('COVID');
      this.settings.config.covidData.countries.push({
        id: elementId,
        enableFlag: true,
        code: model.value.newCountry,
        flagSize: 30,
        flagImage: `https://disease.sh/assets/img/flags/${model.value.newCountry.toLowerCase()}.png`,
        textScaling: 2,
        offset: 0,
        padding: 10,
        width: 100,
        marginHeight: 0,
        marginWidth: 0,
        name: 'default',
        position: 'n'
      });
      model.resetForm();
      this.shared.toggleOrder(elementId, true, 'n');
    }
  }

  updateCountryName(i) {
    this.settings.config.covidData.countries[i].name = this.countryList.find(
      (x) => x.code == this.settings.config.covidData.countries[i].code
    ).label;
  }
  removeCountry(i) {
    this.shared.toggleOrder(
      this.settings.config.covidData.countries[i].id,
      false,
      this.settings.config.covidData.countries[i].position
    );
    this.settings.config.covidData.countries.splice(i, 1);
  }

  /** Sets item as selected */
  setSelected(i) {
    if (this.selected !== i) {
      this.selected = i;
    } else {
      this.selected = null;
    }
  }

  countryLists() {
    this.http
      .get('https://covid19.mathdro.id/api/countries')
      .subscribe((data) => {
        this.countryList = data['countries'].map((x) => {
          return { label: x.name, code: x.iso2 };
        });
      });
  }
}
