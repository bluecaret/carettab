import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { searchEngines } from '../../_shared/lists/lists';
import { SharedService } from '../../_shared/shared.service';

@Component({
  selector: 'tab-search',
  templateUrl: 'search.component.html',
  host: {'class': 'search'}
})
export class TabSearchComponent implements OnInit {
  engines = searchEngines;
  url: string;
  param: string;
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

  ngOnInit() {
    this.setEngine();
  }

  setEngine() {
    let engine = this.engines.find(e => e.id === this.settings.config.search.engine);
    this.url = engine.url;
    this.param = engine.param;
  }

  performSearch() {
    let searchUrl = `${this.url}?${this.param}=${encodeURIComponent(this.searchText)}`
    location.replace(searchUrl);
  }

  findEngine(engine) {
    return this.engines.find(x => x.id === engine)
  }

}
