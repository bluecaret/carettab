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
  private _advancedLayout: boolean = false;
  private _updateType: "major" | "minor" | "quiet" | "hidden";
  private _allBookmarks: any;

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

  get advancedLayout(): boolean {
    return this._advancedLayout;
  }
  set advancedLayout(value: boolean) {
    this._advancedLayout = value;
  }

  get updateType(): "major" | "minor" | "quiet" | "hidden" {
    return this._updateType;
  }
  set updateType(value: "major" | "minor" | "quiet" | "hidden") {
    this._updateType = value;
  }

  get allBookmarks(): any {
    return this._allBookmarks;
  }
  set allBookmarks(value: any) {
    this._allBookmarks = value;
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
  
  public getImageSize(size: number, baseSize?: number) {
    let base = baseSize ? baseSize : 10;
    return ((size / base)) + 'em';
  }
  
  public getMaxWidth(size: number) {
    // Max width will always be based on viewport as opposed to scaling method.
    return (size * 1) + 'vw';
  }

  public getMargin(height: number, width: number, multiplier = .1) {
    return `${height * multiplier}em ${width * multiplier}em`;
  }

  public getPadding(size: number, multiplier = .1) {
    return (size * multiplier) + 'em';
  }

  public getOffset(size: number) {
    let offset = ((size * 5) * -1);
    return 'translateY(' + offset + '%)';
  }

  public getOffsetLarge(size: number) {
    let offset = ((size * 10) * -1);
    return 'translateY(' + offset + '%)';
  }

  public toggleOrder(id: string, enabled: boolean, position: string = "c") {
    let positionOrder: any[];
    switch (position) {
      case "nw":
        positionOrder = this.settings.config.order.nw;
        break;
      case "n":
        positionOrder = this.settings.config.order.n;
        break;
      case "ne":
        positionOrder = this.settings.config.order.ne;
        break;
      case "w":
        positionOrder = this.settings.config.order.w;
        break;
      case "c":
        positionOrder = this.settings.config.order.items;
        break;
      case "e":
        positionOrder = this.settings.config.order.e;
        break;
      case "sw":
        positionOrder = this.settings.config.order.sw;
        break;
      case "s":
        positionOrder = this.settings.config.order.s;
        break;
      case "se":
        positionOrder = this.settings.config.order.se;
        break;
    
      default:
        positionOrder = this.settings.config.order.items;
        break;
    }

    if (!enabled) {
      this.removeOrder(id);
    } else {
      this.removeOrder(id);
      let sorted = positionOrder;
      if (positionOrder.length > 1) {
        sorted = positionOrder.sort((a, b) => a.order - b.order);
      }
      let newOrderNumber = 1;
      if (positionOrder.length > 0) {
        newOrderNumber = (sorted[sorted.length - 1].order) + 1;
      }
      positionOrder.push({
        id: id,
        order: newOrderNumber
      });
    }
  }

  private removeOrder(id: string) {
    let foundInList = false;
    let positionOrder;

    let inNW = this.settings.config.order.nw.some(e => e.id === id);
    let inN = this.settings.config.order.n.some(e => e.id === id);
    let inNE = this.settings.config.order.ne.some(e => e.id === id);
    let inW = this.settings.config.order.w.some(e => e.id === id);
    let inC = this.settings.config.order.items.some(e => e.id === id);
    let inE = this.settings.config.order.e.some(e => e.id === id);
    let inSW = this.settings.config.order.sw.some(e => e.id === id);
    let inS = this.settings.config.order.s.some(e => e.id === id);
    let inSE = this.settings.config.order.se.some(e => e.id === id);

    foundInList = (inNW || inN || inNE || inW || inC || inE || inSW || inS || inSE);
    
    if (foundInList) {
      if (inNW) {positionOrder = this.settings.config.order.nw}
      if (inN) {positionOrder = this.settings.config.order.n}
      if (inNE) {positionOrder = this.settings.config.order.ne}
      if (inW) {positionOrder = this.settings.config.order.w}
      if (inC) {positionOrder = this.settings.config.order.items}
      if (inE) {positionOrder = this.settings.config.order.e}
      if (inSW) {positionOrder = this.settings.config.order.sw}
      if (inS) {positionOrder = this.settings.config.order.s}
      if (inSE) {positionOrder = this.settings.config.order.se}

      if (positionOrder) {
        let elIndex = positionOrder.findIndex(e => e.id === id);
        positionOrder.splice(elIndex, 1);
        let sorted = positionOrder;
        if (positionOrder.length > 1) {
          sorted = positionOrder.sort((a, b) => a.order - b.order);
        }
        sorted.forEach((e, index) => {
          e.order = index + 1;
        });
      }
    }
  }

  public changeOrder(id: string, up: boolean, position: string = "c") {
    let positionOrder: any[];
    switch (position) {
      case "nw":
        positionOrder = this.settings.config.order.nw;
        break;
      case "n":
        positionOrder = this.settings.config.order.n;
        break;
      case "ne":
        positionOrder = this.settings.config.order.ne;
        break;
      case "w":
        positionOrder = this.settings.config.order.w;
        break;
      case "c":
        positionOrder = this.settings.config.order.items;
        break;
      case "e":
        positionOrder = this.settings.config.order.e;
        break;
      case "sw":
        positionOrder = this.settings.config.order.sw;
        break;
      case "s":
        positionOrder = this.settings.config.order.s;
        break;
      case "se":
        positionOrder = this.settings.config.order.se;
        break;
    
      default:
        positionOrder = this.settings.config.order.items;
        break;
    }

    let sibling: any;
    let el = positionOrder.find(e => e.id === id);

    if (up) {
      sibling = positionOrder.find(e => e.order === el.order - 1);
      if (sibling) {
        sibling.order += 1;
        el.order -= 1;
      }
    } else {
      sibling = positionOrder.find(e => e.order === el.order + 1);
      if (sibling) {
        sibling.order -= 1;
        el.order += 1;
      }
    }
  }

  public getOrder(id: string, position: string = "c") {
    let positionOrder: any[];
    switch (position) {
      case "nw":
        positionOrder = this.settings.config.order.nw;
        break;
      case "n":
        positionOrder = this.settings.config.order.n;
        break;
      case "ne":
        positionOrder = this.settings.config.order.ne;
        break;
      case "w":
        positionOrder = this.settings.config.order.w;
        break;
      case "c":
        positionOrder = this.settings.config.order.items;
        break;
      case "e":
        positionOrder = this.settings.config.order.e;
        break;
      case "sw":
        positionOrder = this.settings.config.order.sw;
        break;
      case "s":
        positionOrder = this.settings.config.order.s;
        break;
      case "se":
        positionOrder = this.settings.config.order.se;
        break;
    
      default:
        positionOrder = this.settings.config.order.items;
        break;
    }

    let el = positionOrder.find(e => e.id === id);
    if (el) {
      return el.order;
    } else {
      return 'unset';
    }
  }

  public isFirst(id: string, position: string = "c"): boolean {
    let positionOrder: any[];
    switch (position) {
      case "nw":
        positionOrder = this.settings.config.order.nw;
        break;
      case "n":
        positionOrder = this.settings.config.order.n;
        break;
      case "ne":
        positionOrder = this.settings.config.order.ne;
        break;
      case "w":
        positionOrder = this.settings.config.order.w;
        break;
      case "c":
        positionOrder = this.settings.config.order.items;
        break;
      case "e":
        positionOrder = this.settings.config.order.e;
        break;
      case "sw":
        positionOrder = this.settings.config.order.sw;
        break;
      case "s":
        positionOrder = this.settings.config.order.s;
        break;
      case "se":
        positionOrder = this.settings.config.order.se;
        break;
    
      default:
        positionOrder = this.settings.config.order.items;
        break;
    }

    let el = positionOrder.find(e => e.id === id);
    if (el) {
      return el.order === 1;
    } else {
      return false;
    }
  }

  public isLast(id: string, position: string = "c"): boolean {
    let positionOrder: any[];
    switch (position) {
      case "nw":
        positionOrder = this.settings.config.order.nw;
        break;
      case "n":
        positionOrder = this.settings.config.order.n;
        break;
      case "ne":
        positionOrder = this.settings.config.order.ne;
        break;
      case "w":
        positionOrder = this.settings.config.order.w;
        break;
      case "c":
        positionOrder = this.settings.config.order.items;
        break;
      case "e":
        positionOrder = this.settings.config.order.e;
        break;
      case "sw":
        positionOrder = this.settings.config.order.sw;
        break;
      case "s":
        positionOrder = this.settings.config.order.s;
        break;
      case "se":
        positionOrder = this.settings.config.order.se;
        break;
    
      default:
        positionOrder = this.settings.config.order.items;
        break;
    }

    let el = positionOrder.find(e => e.id === id);
    if (el) {
      let sorted = positionOrder.sort((a, b) => a.order - b.order);
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
    this.settings.setAll(this.settings.config.messages, 'ct-message');
    this.settings.setAll(this.settings.config.misc, 'ct-misc');
    this.settings.setAll(this.settings.config.order, 'ct-order');
    this.settings.setAll(this.settings.config.quickLink, 'ct-quick-link');
    this.settings.setAll(this.settings.config.search, 'ct-search');
    this.settings.setAll(this.settings.config.time, 'ct-time');
    this.settings.setAll(this.settings.config.weather, 'ct-weather');
  }

  public getRandomNumber(min,max): number {
    return Math.floor(Math.random() * (max - min)) + min;
  };
}

@Pipe({ name: 'translateCut' })
export class TranslateCut implements PipeTransform {
  transform(value: string, index: string): string {
    const cutIndex = Number(index);
    return value.split('|')[cutIndex];
  }
}
