import { Injectable } from '@angular/core';
import { offlineFontList } from './lists/lists';

@Injectable()
export class SharedService {
  private _optionsToggle: boolean;
  private _optionsPage: string;
  private _zoneGuess: string;
  private _time: string;
  private _date: string;
  private _title: string = 'New Tab';
  private _orderMin: number;
  private _orderMax: number;

  // Order number to start clocks at. Should equal the number of elements that
  // display inside the .tabCenter div excluding clocks plus one.
  public clockOrderStart = 4;

  get optionsToggle(): boolean {
    return this._optionsToggle;
  }
  set optionsToggle(value: boolean) {
    this._optionsToggle = value;
  }

  get optionsPage(): string {
    return this._optionsPage;
  }
  set optionsPage(value: string) {
    this._optionsPage = value;
  }

  get zoneGuess(): string {
    return this._zoneGuess;
  }
  set zoneGuess(value: string) {
    this._zoneGuess = value;
  }

  get orderMin(): number {
    return this._orderMin;
  }
  set orderMin(value: number) {
    this._orderMin = value;
  }

  get orderMax(): number {
    return this._orderMax;
  }
  set orderMax(value: number) {
    this._orderMax = value;
  }

  get title(): string {
    return this._title;
  }
  set title(value: string) {
    this._title = value;
  }

  get time(): string {
    return this._time;
  }
  set time(value: string) {
    this._time = value;
  }

  get date(): string {
    return this._date;
  }
  set date(value: string) {
    this._date = value;
  }

  public getFont(font: number) {
    let fontName = offlineFontList.find(f => f.id === font).family;
    return '"' + fontName + '"';
  }

  public getFontWeight(font: number) {
    let fontName = offlineFontList.find(f => f.id === font).weight;
    return fontName;
  }

  public getFontSize(size: number, baseSize?: number) {
    let emBase = baseSize ? baseSize : 10;
    return (size / emBase) + 'em';
  }

  public getOffset(size: number) {
    let offset = ((size * 5) * -1);
    return 'translateY(' + offset + '%)';
  }

  public getOffsetLarge(size: number) {
    let offset = ((size * 10) * -1);
    return 'translateY(' + offset + '%)';
  }

}
