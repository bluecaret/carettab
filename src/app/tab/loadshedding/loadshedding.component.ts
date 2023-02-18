import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { LoadsheddingService } from './loadshedding.service'

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
    let that = this
    // read the national status
    chrome.storage.local.get("loadshedding_national_status", (ns) => {
      this.nationalStatus = ns["loadshedding_national_status"];
      var cacheUntilTime = +(this.nationalStatus.cachedAt) + this.cacheTimePeriod // this is getTime already 
      if ((new Date()).getTime() - cacheUntilTime > this.cacheTimePeriod) {
        console.error("WE NEED NEW DATA");
      }
      else {
        console.log("Data is still fine for " + ((new Date()).getTime() - cacheUntilTime));
      }
    })

    chrome.storage.local.get("loadshedding_" + [this.area.id], (x) => {
      var cacheUntilTime = +(x["loadshedding_" + this.area.id].cachedAt) + this.cacheTimePeriod // this is getTime already 
      if ((new Date()).getTime() - cacheUntilTime > this.cacheTimePeriod) {
        //get the current schedule for this area
        this.loadsheddingService.getAreaInfo(this.area.id).then(newAreaData => {
          var myDate = (new Date()).getTime().toString();
          chrome.storage.local.set({ ["loadshedding_" + this.area.id]: { cachedAt: myDate, data: newAreaData } });
          this.cachedAreaInfo = newAreaData;
        })
      }
      else {
        this.cachedAreaInfo = x["loadshedding_" + this.area.id];
        console.log(this.cachedAreaInfo);
      }
    })
  }

  showData(x) {
    if (!x.stages) {
      return false;
    }
    try {
      //get all the stages declared for today National (ESKOM)
      var data = []
      if (new Date(x.date).toDateString() === new Date().toDateString()) {
        // use the current stage
        var d = +this.nationalStatus.data.status.eskom.stage;
        var stages = x.stages[d];
        if (!stages) {
          return false;
        }
        return stages &&
          stages.filter(t => {
            var stageStart = t.substr(0, 2);
            var stageEnd = t.substr(6, 2);
            var currentHour = new Date().getHours();
            return (stageStart < currentHour && (stageEnd > currentHour || stageEnd === '00'));
          });
      }
      else if (new Date(x.date) > new Date()) {

        var stagesForFutureDay = this.nationalStatus.data.status.eskom.next_stages.filter(sst => new Date(sst.stage_start_timestamp) > new Date(new Date(x.date).toDateString()) && new Date(sst.stage_start_timestamp).getDate() === new Date(new Date(x.date).toDateString()).getDate())
        stagesForFutureDay.forEach(stg => {
          let stages = x.stages[stg.stage];
          if (!stages) {
            return false;
          }
          data = data.concat(stages);
        });

        var s = new Set(data);

        return [...s];
      }
    }
    catch (err) {
      debugger;
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
