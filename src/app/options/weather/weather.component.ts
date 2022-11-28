import { Component, HostBinding, OnInit, Output, EventEmitter } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { WeatherService } from '../../tab/weather/weather.service';

@Component({
  selector: 'options-weather',
  templateUrl: './weather.component.html'
})
export class OptionsWeatherComponent implements OnInit {
  @Output() goTo: EventEmitter<string> = new EventEmitter<string>();
  @HostBinding('class') hostClass: string = 'panelPlate panelPage';
  hasSearched = false;
  locationList: any = [];

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private weatherService: WeatherService
  ) {
  }

  ngOnInit(): void { }

  setLocation(loc) {
    this.settings.config.weather.location.url = loc;
    this.settings.setAll(this.settings.config.weather, 'ct-weather');
    this.locationList = [];
    this.hasSearched = false;
  }

  async getLocation() {
    this.weatherService.searchLocation(this.weatherService.locName).then(data => {
      this.shared.echo('Weather Search API response:', null, data);
      this.hasSearched = true;
      this.locationList = data;
    });
  }
}
