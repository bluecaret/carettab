import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Core Imports
import { AppComponent } from './app.component';
import { Ng2ChromeStorageModule } from './_storage/storage.module';
import { Settings } from './_storage/settings';
import { SharedService, TranslateCut } from './_shared/shared.service';
import { PopupService } from './_shared/controls/popup.service';
import { PositionComponent } from './_shared/controls/position.component';
import { ToggleComponent } from './_shared/controls/toggle.component';
import { RangeComponent } from './_shared/controls/range.component';
import { SettingsToggleComponent } from './_shared/controls/settings-toggle.component';
import { LogoComponent } from './_shared/controls/logo.component';
import { TooltipComponent } from './_shared/controls/tooltip.component';
import { MostVisitedMenuComponent } from './tab/bookmarks/most-visited-menu.component';
import { WeatherService } from './tab/weather/weather.service';
import * as moment from 'moment-timezone';

// Intro Imports
import { SplashComponent } from './splash/splash.component';

// Options Imports
import { NavComponent } from './options/nav.component';
import { OptionsComponent } from './options/options.component';
import { OptionsBookmarksComponent } from './options/bookmarks/bookmarks.component';
import { OptionsCovidComponent } from './options/covid/covid.component';
import { OptionsDashboardComponent } from './options/dashboard/dashboard.component';
import { OptionsDateComponent } from './options/date/date.component';
import { OptionsDesignComponent } from './options/design/design.component';
import { OptionsExtraComponent } from './options/extra/extra.component';
import { OptionsMessageComponent } from './options/message/message.component';
import { OptionsSearchComponent } from './options/search/search.component';
import { OptionsTimeComponent } from './options/time/time.component';
import { OptionsWeatherComponent } from './options/weather/weather.component';
import { TimezonePipe } from './options/time/timezone.pipe';
import { TimezoneService } from './options/time/timezone.service';

// Tab Imports
import { TabComponent } from './tab/tab.component';
import { TabBookmarksComponent } from './tab/bookmarks/bookmarks.component';
import { TabQuickLinksComponent } from './tab/bookmarks/quickLinks.component';
import { TabTimeComponent } from './tab/time/time.component';
import { TabDateComponent } from './tab/date/date.component';
import { TabMessageComponent } from './tab/message/message.component';
import { TabSearchComponent } from './tab/search/search.component';
import { TabCovidComponent } from './tab/covid/covid.component';
import { TabWeatherComponent } from './tab/weather/weather.component';

@NgModule({
  declarations: [
    AppComponent,
    ToggleComponent,
    RangeComponent,
    PositionComponent,
    SettingsToggleComponent,
    LogoComponent,
    TooltipComponent,
    MostVisitedMenuComponent,
    TranslateCut,

    SplashComponent,

    OptionsComponent,
    OptionsBookmarksComponent,
    OptionsCovidComponent,
    OptionsDashboardComponent,
    OptionsDateComponent,
    OptionsDesignComponent,
    OptionsExtraComponent,
    OptionsMessageComponent,
    OptionsSearchComponent,
    OptionsTimeComponent,
    OptionsWeatherComponent,
    TimezonePipe,

    TabComponent,
    NavComponent,
    TabBookmarksComponent,
    TabQuickLinksComponent,
    TabTimeComponent,
    TabDateComponent,
    TabMessageComponent,
    TabSearchComponent,
    TabCovidComponent,
    TabWeatherComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    Ng2ChromeStorageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    NavComponent
  ],
  providers: [
    SharedService,
    PopupService,
    TimezoneService,
    WeatherService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    MostVisitedMenuComponent
  ]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
