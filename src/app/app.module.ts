import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HelpComponent } from './lib/help/help.component';
import { SharedService } from './lib/shared.service';

import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './settings/about/about.component';
import { BookmarksComponent } from './settings/bookmarks/bookmarks.component';
import { DashboardComponent } from './settings/dashboard/dashboard.component';
import { DateComponent } from './settings/date/date.component';
import { DesignComponent } from './settings/design/design.component';
import { ExtraComponent } from './settings/extra/extra.component';
import { MessageComponent } from './settings/message/message.component';
import { SearchComponent } from './settings/search/search.component';
import { TimeComponent } from './settings/time/time.component';

import { InterfaceComponent } from './interface/interface.component';

import { Ng2ChromeStorageModule } from './lib/storage/storage.module';
import { Settings } from './lib/storage/settings';

@NgModule({
  declarations: [
    AppComponent,
    InterfaceComponent,
    SettingsComponent,
    AboutComponent,
    BookmarksComponent,
    DashboardComponent,
    DateComponent,
    DesignComponent,
    ExtraComponent,
    MessageComponent,
    SearchComponent,
    TimeComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    Ng2ChromeStorageModule.forRoot(new Settings())
  ],
  providers: [
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
