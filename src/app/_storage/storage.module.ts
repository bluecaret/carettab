/*
 * ng2-chrome-storage
 * @author Hasan Hameed <hasan.hameed07@gmail.com>
 * Url: https://github.com/hasanhameed07/ng2-chrome-storage.git
 * 
 * Modified by BlueCaret (John Hancock) <john@jwh.design>
 */
import { ModuleWithProviders, NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Storage } from './storage.service';
import { Settings } from './settings';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
  Storage,
  { provide: APP_INITIALIZER, useFactory: (config: Storage) => () => config.load(), deps: [Storage], multi: true }  ]
})
export class Ng2ChromeStorageModule {

  static forRoot(config: Settings): ModuleWithProviders {
    return {
      ngModule: Ng2ChromeStorageModule,
      providers: [
        {provide: Settings, useValue: config }
      ]
    };
  }
}
