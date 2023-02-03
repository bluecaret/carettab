import { Component, HostBinding, Output, EventEmitter, NgZone } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { LoadsheddingService } from '../../tab/loadshedding/loadshedding.service';

@Component({
  selector: 'options-loadshedding',
  templateUrl: 'loadshedding.component.html'
})
export class OptionsLoadsheddingComponent {
  @Output() goTo: EventEmitter<string> = new EventEmitter<string>();
  @HostBinding('class') hostClass: string = 'panelPlate panelPage';
  hasSearched = false
  hasPermission = false
  locationList
  allowance = {}
  apiError

  constructor(
    public shared: SharedService,
    public settings: Storage,
    public loadsheddingService: LoadsheddingService,
    private zone: NgZone,
  ) {
    this.checkPermissions()
  }

  async getLocation() {
    this.shared.loading = true
    this.loadsheddingService.searchAreas(this.loadsheddingService.areaSearchKeyword).then(data => {
      if (data.error) {
        this.apiError = data.error
        this.locationList = [];
        this.hasSearched = false;
      } else {
        this.apiError = null
        this.hasSearched = true;
        this.locationList = [];
        this.locationList = [...data.areas];
      }
      this.shared.loading = false
    }).catch(err => {
      this.apiError = 'Unknown error while searching locations'
      this.locationList = [];
      this.hasSearched = false;
      this.shared.loading = false
    });
  }

  async checkAllowance() {
    this.shared.loading = true
    this.loadsheddingService.checkAllowance(this.loadsheddingService.areaSearchKeyword).then(data => {
      if (data.error) {
        this.apiError = data.error
        this.allowance = [];
      } else {
        this.apiError = null
        this.allowance = {}
        this.allowance = { ...data.allowance }
      }
      this.shared.loading = false
    }).catch(err => {
      this.apiError = 'Unknown error while checking allowance'
      this.allowance = {}
      this.shared.loading = false
    });
  }

  setLocation(loc) {
    this.settings.config.loadshedding.areas.push({id: loc.id, name: loc.name, region: loc.region});
    this.settings.setAll(this.settings.config.loadshedding, 'ct-loadshedding');
    this.apiError = null
  }

  removeLocation(loc) {
    let area = this.settings.config.loadshedding.areas.findIndex(l => l.id === loc.id)
    this.settings.config.loadshedding.areas.splice(area, 1)
    this.settings.setAll(this.settings.config.loadshedding, 'ct-loadshedding');
    this.apiError = null
  }

  checkPermissions() {
    const that = this;
    chrome.permissions.contains({ origins: ['https://developer.sepush.co.za/*'] }, function (result) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          console.error('Error checking Favicon permission', chrome.runtime.lastError);
        } else {
          if (result === true) {
            that.hasPermission = true;
          }
        }
      });
    });
  }

  setPermission() {
    const that = this;
    chrome.permissions.request({ origins: ['https://developer.sepush.co.za/*'] }, function (granted) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          console.error('Error checking Favicon permission', chrome.runtime.lastError);
        } else {
          if (granted === true) {
            that.hasPermission = true;
          }
        }
      });
    });
  }

}
