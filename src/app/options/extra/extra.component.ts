import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '../../_storage/storage.service';
import { title, languages } from '../../_shared/lists/lists';
import { SharedService } from '../../_shared/shared.service';
import { GoogleAnalyticsService } from '../../_shared/ga.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'options-extra',
  templateUrl: 'extra.component.html'
})
export class OptionsExtraComponent {
  titleOptions = title;
  languages = languages;
  selected = '';
  newCountry = '';
  importStatus: string;
  public countryList = [];
  constructor(
    public settings: Storage,
    private translate: TranslateService,
    public shared: SharedService,
    public ga: GoogleAnalyticsService,
    private http: HttpClient
  ) {
    this.countryLists();
  }

  trackByFn(index: any, item: any) {
    return index;
  }
  // Reset settings
  reset() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      this.settings.clear();
      localStorage.removeItem('bgImg');
      localStorage.removeItem('ct-background');
      this.shared.echo(
        'Background removed from localStorage',
        null,
        null,
        'save'
      );
      localStorage.setItem('ct-enableAnalytics', 'true');
      location.reload();
    } else {
      return;
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  findTitleType(type) {
    return this.titleOptions.find((x) => x.id === type);
  }

  enableAnalytics(enable: boolean) {
    enable === true
      ? localStorage.setItem('ct-enableAnalytics', 'true')
      : localStorage.setItem('ct-enableAnalytics', 'false');
  }

  export() {
    let _settings = JSON.stringify(this.settings.config, null, 4); //indentation in json format, human readable

    let link = document.createElement('a'),
      blob = new Blob([_settings], { type: 'text/json' }),
      name = 'carettab-settings.json',
      url = window.URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', name);
    link.click();

    this.ga.field('button.export', 'true');
  }
  swap(arr: any[], from: number, to: number) {
    arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
  }
  import(e: any, input: any) {
    let files = e.target.files;
    let reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      let _imp = JSON.parse(e.target.result);

      if (_imp && _imp.misc && _imp.misc.schema && _imp.misc.schema === '1.0') {
        _imp.bookmark &&
          Object.assign(this.settings.config.bookmark, _imp.bookmark);
        _imp.date && Object.assign(this.settings.config.date, _imp.date);
        _imp.design && Object.assign(this.settings.config.design, _imp.design);
        _imp.i18n && Object.assign(this.settings.config.i18n, _imp.i18n);
        _imp.message &&
          Object.assign(this.settings.config.messages, _imp.message);
        _imp.misc && Object.assign(this.settings.config.misc, _imp.misc);
        _imp.order && Object.assign(this.settings.config.order, _imp.order);
        _imp.quickLink &&
          Object.assign(this.settings.config.quickLink, _imp.quickLink);
        _imp.search && Object.assign(this.settings.config.search, _imp.search);
        _imp.time && Object.assign(this.settings.config.time, _imp.time);
        this.importStatus = 'success';
        this.ga.field('button.import', 'true');
      } else {
        this.importStatus = 'error';
        this.ga.field('button.import', 'false');
      }
    };

    reader.readAsText(files[0]);
    input.value = '';
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
