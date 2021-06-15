import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { GoogleAnalyticsService } from '../../_shared/ga.service';
import { WeatherService } from '../../tab/weather/weather.service';

@Component({
  selector: 'options-weather',
  templateUrl: './weather.component.html'
})
export class OptionsWeatherComponent implements OnInit {
  searchLocation: string;
  locationList: any = [];

  constructor(
    public shared: SharedService,
    public settings: Storage,
    public ga: GoogleAnalyticsService,
    private weatherService: WeatherService
  ) {
  }

  ngOnInit(): void { }

  setLocation(loc) {
    this.settings.config.weather.location = loc;
  }

  getLocation() {
    this.weatherService.searchLocation(this.searchLocation).subscribe((data)=>{
      this.shared.echo('Weather Search API response:', null, data);
      this.locationList = data;
    });
  }
}
