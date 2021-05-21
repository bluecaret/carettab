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
import { ToggleComponent } from './_shared/controls/toggle.component';
import { RangeComponent } from './_shared/controls/range.component';
import { SettingsToggleComponent } from './_shared/controls/settings-toggle.component';
import { LogoComponent } from './_shared/controls/logo.component';
import { TooltipComponent } from './_shared/controls/tooltip.component';
import * as moment from 'moment-timezone';

// Intro Imports
import { SplashComponent } from './splash/splash.component';

// Options Imports
import { NavComponent } from './options/nav.component';
import { OptionsComponent } from './options/options.component';
import { OptionsBookmarksComponent } from './options/bookmarks/bookmarks.component';
import { OptionsDashboardComponent } from './options/dashboard/dashboard.component';
import { OptionsDateComponent } from './options/date/date.component';
import { OptionsDesignComponent } from './options/design/design.component';
import { OptionsExtraComponent } from './options/extra/extra.component';
import { OptionsMessageComponent } from './options/message/message.component';
import { OptionsSearchComponent } from './options/search/search.component';
import { OptionsTimeComponent } from './options/time/time.component';
import { TimezonePipe } from './options/time/timezone.pipe';
import { TimezoneService } from './options/time/timezone.service';

// Tab Imports
import { TabComponent } from './tab/tab.component';
import { TabBookmarksComponent } from './tab/bookmarks/bookmarks.component';
import { TabTimeComponent } from './tab/time/time.component';
import { TabDateComponent } from './tab/date/date.component';
import { TabMessageComponent } from './tab/message/message.component';
import { TabSearchComponent } from './tab/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    ToggleComponent,
    RangeComponent,
    SettingsToggleComponent,
    LogoComponent,
    TooltipComponent,
    TranslateCut,

    SplashComponent,

    OptionsComponent,
    OptionsBookmarksComponent,
    OptionsDashboardComponent,
    OptionsDateComponent,
    OptionsDesignComponent,
    OptionsExtraComponent,
    OptionsMessageComponent,
    OptionsSearchComponent,
    OptionsTimeComponent,
    TimezonePipe,

    TabComponent,
    NavComponent,
    TabBookmarksComponent,
    TabTimeComponent,
    TabDateComponent,
    TabMessageComponent,
    TabSearchComponent
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
    TimezoneService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
