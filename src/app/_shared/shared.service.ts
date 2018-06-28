import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  optionsToggleS = true;

  get optionsToggle(): boolean {
    return this.optionsToggleS;
  }
  set optionsToggle(value: boolean) {
    this.optionsToggleS = value;
  }
}
