import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { searchEngines } from '../../_shared/lists/lists';

@Component({
  selector: 'tab-search',
  templateUrl: 'search.component.html',
  host: {'class': 'search'}
})
export class TabSearchComponent implements OnInit {
  engines = searchEngines;
  label: string;
  url: string;
  param: string;

  constructor(
    public settings: Storage
  ) {
    this.settings.onChange().subscribe((data) => {
      if (data.search.enabled === true) {
        this.setEngine();
      }
    });
  }

  ngOnInit() {
    this.setEngine();
  }

  setEngine() {
    let engine = this.engines.find(e => e.id === this.settings.config.search.engine);
    this.label = engine.label;
    this.url = engine.url;
    this.param = engine.param;
  }

}
