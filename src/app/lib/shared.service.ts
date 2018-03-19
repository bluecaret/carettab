import { Injectable } from '@angular/core';

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