import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { LoadsheddingService } from './loadshedding.service'

@Component({
  selector: 'tab-loadshedding',
  templateUrl: 'loadshedding.component.html',
  host: { 'class': 'loadshedding' }
})

export class TabLoadsheddingComponent implements OnInit {
  cachedAreaInfo = [];
  nationalStatus: any = {};
  cacheTimePeriod = 7200000; // 2 hours; 60000 =1min

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private loadsheddingService: LoadsheddingService
  ) { }
  ngOnInit() {
    let that = this
    // read the national status
    chrome.storage.local.get("loadshedding_national_status", (ns) => {
      this.nationalStatus = ns["loadshedding_national_status"];
      var cacheUntilTime = +(this.nationalStatus.cachedAt) + this.cacheTimePeriod // this is getTime already 
      if ((new Date()).getTime() - cacheUntilTime > this.cacheTimePeriod) {
        console.log("WE NEED NEW DATA");
      }
      else {
        console.log("Data is still fine for " + ((new Date()).getTime() - cacheUntilTime));
      }
    })
    this.settings.config.loadshedding.areas.forEach(area => {
      chrome.storage.local.get("loadshedding_" + [area.id], (x) => {

        var cacheUntilTime = +(x["loadshedding_" + area.id].cachedAt) + this.cacheTimePeriod // this is getTime already 
        if ((new Date()).getTime() - cacheUntilTime > this.cacheTimePeriod) {
          console.log("WE NEED NEW DATA");
        }
        else {
          this.cachedAreaInfo.push(x["loadshedding_" + area.id])
        }
      })
    });
  }
  showData(x) {
    //return x.date;
    //get all the stages declared for today National (ESKOM)
    var data = []
    if (new Date(x.date).toDateString() === new Date().toDateString()) {
      // use the current stage
      var d = +this.nationalStatus.data.status.eskom.stage;

      data = x.stages[d].filter(t => {
        var h = t.substr(0, 2);
        var mh = new Date().getHours();
        return h > mh;
      });
    }
    else if (new Date(x.date) > new Date()) {

      var stagesForFutureDay = this.nationalStatus.data.status.eskom.next_stages.filter(sst => new Date(sst.stage_start_timestamp) > new Date(new Date(x.date).toDateString()) && new Date(sst.stage_start_timestamp).getDate() === new Date(new Date(x.date).toDateString()).getDate())
      stagesForFutureDay.forEach(stg => {
        var c = x.stages[stg.stage].filter(t => {
          var h = t.substr(0, 2);
          var mh = new Date(stg.stage_start_timestamp).getHours()
          return h > mh;
        });
        data = data.concat(c);
      });

      var s = new Set(data);

      return [...s];
    }
  }
  async setAreaInfo() {
    // for (const area of this.settings.config.loadshedding.areas) {
    //   let getInfo = await this.loadsheddingService.getAreaInfo(area.id)
    //   this.cachedAreaInfo.push(getInfo)
    // }
    // chrome.storage.local.set({ 'loadsheddingAreaInfo': this.cachedAreaInfo })
  }

}
