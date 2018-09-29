import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Core Imports
import { AppComponent } from './app.component';
import { Ng2ChromeStorageModule } from './_storage/storage.module';
import { Settings } from './_storage/settings';
import { HelpComponent } from './_shared/help/help.component';
import { SharedService } from './_shared/shared.service';
import { MomentModule } from 'ngx-moment';
import { ToggleComponent } from './_shared/controls/toggle.component';
import { RangeComponent } from './_shared/controls/range.component';
import * as moment from 'moment-timezone';

// Options Imports
import { OptionsComponent } from './options/options.component';
import { OptionsAboutComponent } from './options/about/about.component';
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
import { NavComponent } from './tab/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    HelpComponent,
    ToggleComponent,
    RangeComponent,

    OptionsComponent,
    OptionsAboutComponent,
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
    TabTimeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    Ng2ChromeStorageModule,
    MomentModule
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
