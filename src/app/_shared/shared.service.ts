import { Injectable } from '@angular/core';
import { Config } from './models/config';
import { Global } from './models/global';

@Injectable()
export class SharedService {
  optionsToggleS = false;

  get optionsToggle(): boolean {
    return this.optionsToggleS;
  }
  set optionsToggle(value: boolean) {
    this.optionsToggleS = value;
  }
}
