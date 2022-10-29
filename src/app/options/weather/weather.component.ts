import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { WeatherService } from '../../tab/weather/weather.service';

@Component({
  selector: 'options-weather',
  templateUrl: './weather.component.html'
})
export class OptionsWeatherComponent implements OnInit {
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
  }

  getLocation() {
    this.weatherService.searchLocation(this.weatherService.locName).subscribe((data)=>{
      this.shared.echo('Weather Search API response:', null, data);
      this.locationList = data;
    });
  }
}
