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
      attr.aria-label="Top left"
      title="Top left"
      class="panelBtn"
      [ngClass]="{'active' : position === 'nw'}"
      (click)="handleClick('nw')"
    >
      <div class="matIcon" aria-hidden="true">north_west</div>
    </button>
    <button
      type="button"
      attr.aria-label="Top center"
      title="Top center"
      class="panelBtn"
      [ngClass]="{'active' : position === 'n'}"
      (click)="handleClick('n')"
    >
      <div class="matIcon" aria-hidden="true">north</div>
    </button>
    <button
      type="button"
      attr.aria-label="Top right"
      title="Top right"
      class="panelBtn"
      [ngClass]="{'active' : position === 'ne'}"
      (click)="handleClick('ne')"
    >
      <div class="matIcon" aria-hidden="true">north_east</div>
    </button>
    <button
      type="button"
      attr.aria-label="Center left"
      title="Center left"
      class="panelBtn"
      [ngClass]="{'active' : position === 'w'}"
      (click)="handleClick('w')"
    >
      <div class="matIcon" aria-hidden="true">west</div>
    </button>
    <button
      type="button"
      attr.aria-label="Center"
      title="Center"
      class="panelBtn"
      [ngClass]="{'active' : position === 'c' || position == null}"
      (click)="handleClick('c')"
    >
      <div class="matIcon" aria-hidden="true">vertical_align_center</div>
    </button>
    <button
      type="button"
      attr.aria-label="Center right"
      title="Center right"
      class="panelBtn"
      [ngClass]="{'active' : position === 'e'}"
      (click)="handleClick('e')"
    >
      <div class="matIcon" aria-hidden="true">east</div>
    </button>
    <button
      type="button"
      attr.aria-label="Bottom left"
      title="Bottom left"
      class="panelBtn"
      [ngClass]="{'active' : position === 'sw'}"
      (click)="handleClick('sw')"
    >
      <div class="matIcon" aria-hidden="true">south_west</div>
    </button>
    <button
      type="button"
      attr.aria-label="Bottom center"
      title="Bottom center"
      class="panelBtn"
      [ngClass]="{'active' : position === 's'}"
      (click)="handleClick('s')"
    >
      <div class="matIcon" aria-hidden="true">south</div>
    </button>
    <button
      type="button"
      attr.aria-label="Bottom right"
      title="Bottom right"
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
