import { Injectable } from '@angular/core';
import { Config } from './models/config';
import { Global } from './models/global';

@Injectable()
export class SharedService {
  settingsToggleS = true;

  get settingsToggle(): boolean {
    return this.settingsToggleS;
  }
  set settingsToggle(value: boolean) {
    this.settingsToggleS = value;
  }
}
