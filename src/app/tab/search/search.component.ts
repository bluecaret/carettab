import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { searchEngines } from '../../_shared/lists/lists';
import { GoogleAnalyticsService } from '../../_shared/ga.service';
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

  constructor(
    public shared: SharedService,
    public settings: Storage,
    public ga: GoogleAnalyticsService
  ) {
    this.settings.onChange().subscribe((data) => {
      if (data && data.search && data.search.enabled === true) {
        this.setEngine();
      }
    });
  }

  ngOnInit() {
    this.setEngine();
  }

  setEngine() {
    let engine = this.engines.find(e => e.id === this.settings.config.search.engine);
    if (engine.id === 40 && this.shared.browser === 'chrome') {
      this.url = `https://find.allsearchvip.com/results.aspx?gd=SY1004045&searchsource=69`;
      this.param = `q`;
    } else if (engine.id === 40 && this.shared.browser === 'firefox') {
      this.url = `https://find.allsearchvip.com/results.aspx?gd=SY1004047&searchsource=69`;
      this.param = `q`;
    } else if (engine.id === 40 && this.shared.browser === 'edge') {
      this.url = `https://find.allsearchvip.com/results.aspx?gd=SY1004046&searchsource=69`;
      this.param = `q`;
    } else {
      this.url = engine.url;
      this.param = engine.param;
    }
  }

}
