import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { GoogleAnalyticsService } from '../../_shared/ga.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'options-covid',
  templateUrl: 'covid.component.html'
})
export class OptionsCovidComponent {
  selected = '';
  newCountry = null;
  public countryList = [];
  constructor(
    public settings: Storage,
    public shared: SharedService,
    public ga: GoogleAnalyticsService,
    private http: HttpClient
  ) {
    this.countryLists();
  }

  /* Sets item as selected */
  setSelected(i) {
    if (this.selected !== i) {
      this.selected = i;
    } else {
      this.selected = null;
    }
  }

  addCountry(model: any, isValid: boolean) {
    if (isValid && model.value.newCountry.code != '') {
      let elementId = this.shared.createID('COVID');
      this.settings.config.covidData.countries.push({
        id: elementId,
        enableFlag: true,
        enableCountryName: true,
        enablePer1M: false,
        enableToday: true,
        enableActive: true,
        enableRecovered: false,
        enableDeaths: false,
        code: model.value.newCountry,
        flagImage: `https://disease.sh/assets/img/flags/${model.value.newCountry.toLowerCase()}.png`,
        textScaling: 12,
        offset: 0,
        padding: 10,
        width: 100,
        marginHeight: 5,
        marginWidth: 0,
        name: 'default',
        position: 's'
      });
      model.resetForm();
      this.shared.toggleOrder(elementId, true, 's');
    }
  }

  updateCountryName(i) {
    let newCountry = this.countryList.find(
      (x) => x.code == this.settings.config.covidData.countries[i].code
    );
    this.settings.config.covidData.countries[i].name = newCountry.label;
    this.settings.config.covidData.countries[i].flagImage = `https://disease.sh/assets/img/flags/${newCountry.code.toLowerCase()}.png`;
  }

  removeCountry(i) {
    this.shared.toggleOrder(
      this.settings.config.covidData.countries[i].id,
      false,
      this.settings.config.covidData.countries[i].position
    );
    this.settings.config.covidData.countries.splice(i, 1);
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

  copy(index: number) {
    let newCountry = {...this.settings.config.covidData.countries[index]};
    newCountry.id = this.shared.createID('CLOCK');
    this.settings.config.covidData.countries.push(newCountry);
    let i = (this.settings.config.covidData.countries.length - 1);
    this.shared.toggleOrder(this.settings.config.covidData.countries[i].id, true, this.settings.config.covidData.countries[index].position);
    this.selected = null;
    this.shared.echo('COVID country copied', null, newCountry);
  }
}
