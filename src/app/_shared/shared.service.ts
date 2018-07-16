import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  private _optionsToggle = true;
  private _zoneGuess: string;

  get optionsToggle(): boolean {
    return this._optionsToggle;
  }
  set optionsToggle(value: boolean) {
    this._optionsToggle = value;
  }

  get zoneGuess(): string {
    return this._zoneGuess;
  }
  set zoneGuess(value: string) {
    this._zoneGuess = value;
  }
}
