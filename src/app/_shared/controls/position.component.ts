import { Component, forwardRef, Input, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SharedService } from '../shared.service';

@Component({
  selector: 'options-position',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PositionComponent),
      multi: true
    }
  ],
  template: `
    <button
      type="button"
      attr.aria-label="{{'options.common.topLeft' | translate}}"
      title="{{'options.common.topLeft' | translate}}"
      class="panelBtn"
      [ngClass]="{'active' : position === 'nw'}"
      (click)="handleClick('nw')"
    >
      <div class="matIcon" aria-hidden="true">north_west</div>
    </button>
    <button
      type="button"
      attr.aria-label="{{'options.common.topCenter' | translate}}"
      title="{{'options.common.topCenter' | translate}}"
      class="panelBtn"
      [ngClass]="{'active' : position === 'n'}"
      (click)="handleClick('n')"
    >
      <div class="matIcon" aria-hidden="true">north</div>
    </button>
    <button
      type="button"
      attr.aria-label="{{'options.common.topRight' | translate}}"
      title="{{'options.common.topRight' | translate}}"
      class="panelBtn"
      [ngClass]="{'active' : position === 'ne'}"
      (click)="handleClick('ne')"
    >
      <div class="matIcon" aria-hidden="true">north_east</div>
    </button>
    <button
      type="button"
      attr.aria-label="{{'options.common.centerLeft' | translate}}"
      title="{{'options.common.centerLeft' | translate}}"
      class="panelBtn"
      [ngClass]="{'active' : position === 'w'}"
      (click)="handleClick('w')"
    >
      <div class="matIcon" aria-hidden="true">west</div>
    </button>
    <button
      type="button"
      attr.aria-label="{{'options.common.center' | translate}}"
      title="{{'options.common.center' | translate}}"
      class="panelBtn"
      [ngClass]="{'active' : position === 'c' || position == null}"
      (click)="handleClick('c')"
    >
      <div class="matIcon" aria-hidden="true">vertical_align_center</div>
    </button>
    <button
      type="button"
      attr.aria-label="{{'options.common.centerRight' | translate}}"
      title="{{'options.common.centerRight' | translate}}"
      class="panelBtn"
      [ngClass]="{'active' : position === 'e'}"
      (click)="handleClick('e')"
    >
      <div class="matIcon" aria-hidden="true">east</div>
    </button>
    <button
      type="button"
      attr.aria-label="{{'options.common.bottomLeft' | translate}}"
      title="{{'options.common.bottomLeft' | translate}}"
      class="panelBtn"
      [ngClass]="{'active' : position === 'sw'}"
      (click)="handleClick('sw')"
    >
      <div class="matIcon" aria-hidden="true">south_west</div>
    </button>
    <button
      type="button"
      attr.aria-label="{{'options.common.bottomCenter' | translate}}"
      title="{{'options.common.bottomCenter' | translate}}"
      class="panelBtn"
      [ngClass]="{'active' : position === 's'}"
      (click)="handleClick('s')"
    >
      <div class="matIcon" aria-hidden="true">south</div>
    </button>
    <button
      type="button"
      attr.aria-label="{{'options.common.bottomRight' | translate}}"
      title="{{'options.common.bottomRight' | translate}}"
      class="panelBtn"
      [ngClass]="{'active' : position === 'se'}"
      (click)="handleClick('se')"
    >
      <div class="matIcon" aria-hidden="true">south_east</div>
    </button>
  `,
})

export class PositionComponent implements ControlValueAccessor {
  _position: string;

  @HostBinding('class') hostClass: string = 'panelBtnPlacementGroup panelInputLg';
  @Input() settingId: string;

  constructor(public shared: SharedService) {
  }

  handleClick(p: "nw" | "n" | "ne" | "w" | "c" | "e" | "sw" | "s" | "se") {
    this.position = p;
    this.shared.toggleOrder(this.settingId, true, p);
  }

  propagateChange = (_: any) => { };
  propagateTouched = (_: any) => { };

  get position(): string {
    return this._position;
  }

  set position(position: string) {
    this._position = position;
    this.propagateChange(position);
  }

  writeValue(position: string) {
    this._position = position;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {
    this.propagateTouched = fn;
  }

}
