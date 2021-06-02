import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { fontList, customFontWeight } from './lists/lists';
import { Storage } from '../_storage/storage.service';

@Injectable()
export class SharedService {
  private _optionsToggle: boolean;
  private _optionsPage: string;
  private _zoneGuess: string;
  private _time: string;
  private _date: string;
  private _title: string = 'New Tab';
  private _bg: string;
  private _bgColor: string;
  private _browser: string;
  private _status: string;
  private _updateType: "major" | "minor" | "quiet" | "hidden";

  constructor(
    public settings: Storage
  ) {
  }

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

  get bg(): string {
    return this._bg;
  }
  set bg(value: string) {
    this._bg = value;
  }

  get bgColor(): string {
    return this._bgColor;
  }
  set bgColor(value: string) {
    this._bgColor = value;
  }

  get browser(): string {
    return this._browser;
  }
  set browser(value: string) {
    this._browser = value;
  }

  get status(): string {
    return this._status;
  }
  set status(value: string) {
    this._status = value;
  }

  get updateType(): "major" | "minor" | "quiet" | "hidden" {
    return this._updateType;
  }
  set updateType(value: "major" | "minor" | "quiet" | "hidden") {
    this._updateType = value;
  }

  public echo(msg: string, str?: any, obj?: any, type?: 'warning' | 'error' | 'success' | 'save') {
    let strStyle = 'display:inline-block;background:#f1f3f7;color:black;padding:5px;margin:0 0 0 5px;border-radius:5px;';
    let style = 'display:inline-block;background:#ccd0da;color:black;padding:5px;border-radius:5px;';
    if (type === 'warning') {
      style = 'display:inline-block;background:#ffe000;color:black;padding:5px;border-radius:5px;';
    } else if (type === 'error') {
      style = 'display:inline-block;background:#c52525;color:white;padding:5px;border-radius:5px;';
    } else if (type === 'success') {
      style = 'display:inline-block;background:#7aa76b;color:white;padding:5px;border-radius:5px;';
    } else if (type === 'save') {
      style = 'display:inline-block;background:rgb(0, 106, 183);color:white;padding:5px;border-radius:5px;';
    }
    if (str) {
      console.log(
        `%c${msg}%c${str}`, 
        style, 
        strStyle
      );
    }
    if (obj) {
      console.log(
        `%c${msg}`, 
        style, 
        obj
      );
    }
    if (!str && !obj) {
      console.log(
        `%c${msg}`, 
        style
      );
    }
  }

  public createID(prefix: string) {
    return prefix + '_' + (
      Number(String(Math.random()).slice(2)) +
      Date.now() +
      Math.round(performance.now())
    ).toString(36).toUpperCase();
  }

  public getFont(font: number, custom: string) {
    let fontName;
    if (font !== 0) {
      fontName = fontList.find(f => f.id === font).family;
    } else {
      fontName = custom;
    }
    return '"' + fontName + '"';
  }

  public getFontWeight(font: number, weight: number) {
    let fontWeight;
    if (font !== 0) {
      fontWeight = fontList.find(f => f.id === font).weight;
    } else {
      fontWeight = customFontWeight.find(w => w.id === weight).weight;
    }
    return fontWeight;
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

  public toggleOrder(id: string, enabled: boolean) {
      if (!enabled) {
        let elIndex = this.settings.config.order.items.findIndex(e => e.id === id);
        this.settings.config.order.items.splice(elIndex, 1);
        let sorted = this.settings.config.order.items;
        if (this.settings.config.order.items.length > 1) {
          sorted = this.settings.config.order.items.sort((a, b) => a.order - b.order);
        }
        sorted.forEach((e, index) => {
          e.order = index + 1;
        });
      } else {
        let sorted = this.settings.config.order.items;
        if (this.settings.config.order.items.length > 1) {
          sorted = this.settings.config.order.items.sort((a, b) => a.order - b.order);
        }
        let newOrderNumber = 1;
        if (this.settings.config.order.items.length > 0) {
          newOrderNumber = (sorted[sorted.length - 1].order) + 1;
        }
        this.settings.config.order.items.push({
          id: id,
          order: newOrderNumber
        });
      }
  }

  public changeOrder(id: string, up: boolean) {
    let sibling: any;
    let el = this.settings.config.order.items.find(e => e.id === id);

    if (up) {
      sibling = this.settings.config.order.items.find(e => e.order === el.order - 1);
      if (sibling) {
        sibling.order += 1;
        el.order -= 1;
      }
    } else {
      sibling = this.settings.config.order.items.find(e => e.order === el.order + 1);
      if (sibling) {
        sibling.order -= 1;
        el.order += 1;
      }
    }
  }

  public getOrder(id: string) {
    let el = this.settings.config.order.items.find(e => e.id === id);
    if (el) {
      return el.order;
    } else {
      return 'unset';
    }
  }

  public isFirst(id: string): boolean {
    let el = this.settings.config.order.items.find(e => e.id === id);
    if (el) {
      return el.order === 1;
    } else {
      return false;
    }
  }

  public isLast(id: string): boolean {
    let el = this.settings.config.order.items.find(e => e.id === id);
    if (el) {
      let sorted = this.settings.config.order.items.sort((a, b) => a.order - b.order);
      let last = sorted[sorted.length - 1].order;
      return el.order === last;
    } else {
      return false;
    }
  }

  public saveAll() {
    this.echo('Saving all data', '', this.settings.config, "save");

    this.settings.setAll(this.settings.config.bookmark, 'ct-bookmark');
    this.settings.setAll(this.settings.config.date, 'ct-date');
    this.settings.setAll(this.settings.config.design, 'ct-design');
    this.settings.setAll(this.settings.config.i18n, 'ct-i18n');
    this.settings.setAll(this.settings.config.message, 'ct-message');
    this.settings.setAll(this.settings.config.misc, 'ct-misc');
    this.settings.setAll(this.settings.config.order, 'ct-order');
    this.settings.setAll(this.settings.config.quickLink, 'ct-quick-link');
    this.settings.setAll(this.settings.config.search, 'ct-search');
    this.settings.setAll(this.settings.config.time, 'ct-time');
  }

}

@Pipe({ name: 'translateCut' })
export class TranslateCut implements PipeTransform {
  transform(value: string, index: string): string {
    const cutIndex = Number(index);
    return value.split('|')[cutIndex];
  }
}
