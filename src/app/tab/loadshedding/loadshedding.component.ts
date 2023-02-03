import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { LoadsheddingService } from './loadshedding.service'
import * as moment from 'moment';

@Component({
  selector: 'tab-loadshedding',
  templateUrl: 'loadshedding.component.html',
  host: { 'class': 'loadshedding' }
})

export class TabLoadsheddingComponent implements OnInit {
  cachedAreaInfo = [];

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private loadsheddingService: LoadsheddingService
  ) { }

  ngOnInit() {
    let that = this
    chrome.storage.local.get('loadsheddingAreaInfo', (data) => {
      let getStoredAreaInfo = data.loadsheddingAreaInfo;
      if (!getStoredAreaInfo || getStoredAreaInfo.length < 1) {
        that.setAreaInfo();
      } else {
        that.cachedAreaInfo = getStoredAreaInfo;
        console.log('getStoredAreaInfo', getStoredAreaInfo);

      }
    })

  }

  async setAreaInfo() {
    for (const area of this.settings.config.loadshedding.areas) {
      let getInfo = await this.loadsheddingService.getAreaInfo(area.id)
      this.cachedAreaInfo.push(getInfo)
    }
    chrome.storage.local.set({ 'loadsheddingAreaInfo': this.cachedAreaInfo })
  }

}
