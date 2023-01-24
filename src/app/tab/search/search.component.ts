import { Component, AfterViewInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { searchEngines } from '../../../js/lists.js';
import { SharedService } from '../../_shared/shared.service';

@Component({
  selector: 'tab-search',
  templateUrl: 'search.component.html',
  host: {'class': 'search'}
})
export class TabSearchComponent implements AfterViewInit {
  engines = searchEngines;
  url: string;
  searchText: string;

  constructor(
    public shared: SharedService,
    public settings: Storage,
  ) {
    this.settings.onChange().subscribe((data) => {
      if (data['ct-search'] && data['ct-search'].newValue.enabled === true) {
        this.setEngine();
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setEngine();
    }, 0);
  }

  setEngine() {
    console.log('paid?', this.shared.paid, this.settings.config.search.customEngine);
    if (this.shared.paid && this.settings.config.search.enableCustomEngine) {

      this.url = this.settings.config.search.customEngine;
      return;
    }
    let engine = this.engines.find(e => e.id === this.settings.config.search.engine);
    this.url = engine.url;
  }

  performSearch() {
    if (!this.searchText || this.searchText.trim() == '') {
      return;
    }
    let searchUrl = `${this.url.split('%s')[0]}${encodeURIComponent(this.searchText)}${this.url.split('%s')[1]}`
    location.replace(searchUrl);
  }

}
