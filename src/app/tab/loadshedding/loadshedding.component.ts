import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { LoadsheddingService } from './loadshedding.service';

@Component({
  selector: 'tab-loadshedding',
  templateUrl: 'loadshedding.component.html',
  host: { 'class': 'loadshedding' }
})

export class TabLoadsheddingComponent implements OnInit {

  @Input() index: number;
  @Input() area;

  cachedAreaInfo: any = {};
  nationalStatus: any = {};
  cacheTimePeriod = 7200000; // 2 hours; 60000 =1min

  constructor(
    public shared: SharedService,
    public settings: Storage,
    public loadsheddingService: LoadsheddingService,
  ) { }
  ngOnInit() {
    let that = this;
    // read the national status
    chrome.storage.local.get('loadshedding_national_status', (ns) => {
      this.nationalStatus = ns['loadshedding_national_status'];
      let cacheUntilTime = +(this.nationalStatus.cachedAt) + this.cacheTimePeriod; // this is getTime already 
      if ((new Date()).getTime() - cacheUntilTime > this.cacheTimePeriod) {
        if (this.settings.config.loadshedding.license.trim().length >= 35) {
          // get the national status so long
          this.loadsheddingService.getSatus().then(x => {
            chrome.storage.local.set({ 'loadshedding_national_status': { cachedAt: (new Date()).getTime().toString(), data: x } });
          });
        }
      }
      // the data is still fine no need to refresh.
    });

    chrome.storage.local.get('loadshedding_' + [this.area.id], (x) => {
      let cacheUntilTime = +(x['loadshedding_' + this.area.id].cachedAt) + this.cacheTimePeriod; // this is getTime already
      if ((new Date()).getTime() > cacheUntilTime) {
        // get the current schedule for this area
        this.refreshData();
      } else {
        this.cachedAreaInfo = x['loadshedding_' + this.area.id];
      }
    });
  }
  refreshData() {
    this.loadsheddingService.getAreaInfo(this.area.id).then(newAreaData => {
      let myDate = (new Date()).getTime().toString();
      chrome.storage.local.set({ ['loadshedding_' + this.area.id]: { cachedAt: myDate, data: newAreaData } });
      this.cachedAreaInfo = { cachedAt: myDate, data: newAreaData };
    });
  }

  showData(x, data) {
    try {
      // get all the stages declared for today National (ESKOM)
      const myEvents = data.events.filter(d => {
        return new Date(x.date).getDate() == new Date(d.start).getDate();
      });
      let myData: Array<any> = [];
      myEvents.forEach(e => {

        myData.push(
          {
            stage: e.note.substring(e.note.length - 2).trim(),
            timeSlot: (new Date(e.start)).getHours().toString().padStart(2, '0') + ':' + (new Date(e.start)).getMinutes().toString().padStart(2, '0') + ' - ' + (new Date(e.end)).getHours().toString().padStart(2, '0') + ':' + (new Date(e.end)).getMinutes().toString().padStart(2, '0')
          });
      });

      return myData;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
