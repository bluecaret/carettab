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





  // if (sEngine == "bing") {
  //   $('#search').attr('action', 'http://www.bing.com/search');
  //   $('#search-box').attr('placeholder', 'Bing');
  //   $('#search-box').attr('name', 'q');
  // } else if (sEngine == "baidu") {
  //   $('#search').attr('action', 'http://www.baidu.com/s');
  //   $('#search-box').attr('placeholder', 'Baidu');
  //   $('#search-box').attr('name', 'wd');
  // } else if (sEngine == "yahoo") {
  //   $('#search').attr('action', 'http://search.yahoo.com/search');
  //   $('#search-box').attr('placeholder', 'Yahoo');
  //   $('#search-box').attr('name', 'p');
  // } else if (sEngine == "ask") {
  //   $('#search').attr('action', 'http://www.ask.com/web');
  //   $('#search-box').attr('placeholder', 'Ask.com');
  //   $('#search-box').attr('name', 'q');
  // } else if (sEngine == "duckduckgo") {
  //   $('#search').attr('action', 'http://www.duckduckgo.com/');
  //   $('#search-box').attr('placeholder', 'DuckDuckGo');
  //   $('#search-box').attr('name', 'q');
  // } else if (sEngine == "wolframalpha") {
  //   $('#search').attr('action', 'http://www.wolframalpha.com/input/');
  //   $('#search-box').attr('placeholder', 'Wolframalpha');
  //   $('#search-box').attr('name', 'i');
  // } else if (sEngine == "github") {
  //   $('#search').attr('action', 'https://www.github.com/search');
  //   $('#search-box').attr('placeholder', 'GitHub');
  //   $('#search-box').attr('name', 'q');
  // } else if (sEngine == "yandex") {
  //   $('#search').attr('action', 'https://yandex.com/search/');
  //   $('#search-box').attr('placeholder', 'Yandex');
  //   $('#search-box').attr('name', 'text');
  // } else {
  //   $('#search').attr('action', 'https://www.google.com/search');
  //   $('#search-box').attr('placeholder', 'Google');
  //   $('#search-box').attr('name', 'q');
  // }

}
