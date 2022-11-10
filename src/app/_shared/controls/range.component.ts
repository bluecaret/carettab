import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'options-range',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeComponent),
      multi: true
    }
  ],
  template: `
    <div class="panelRangeWrap">
      <output class="panelOutput" [value]="range"></output>
      <input
        class="panelRange"
        type="range"
        [attr.aria-labelledby]="labelledby"
        [attr.list]="name+'-tickmarks'"
        [id]="name+'Id'"
        [name]="name"
        [min]="min"
        [max]="max"
        [(ngModel)]="range"
        [disabled]="disabled"
        [required]="required">
    </div>
  `,
  host: {'class': 'customControl'}
})

export class RangeComponent implements ControlValueAccessor {
  _range: number;

  @Input() labelledby: string;
  @Input() min: number;
  @Input() max: number;
  @Input() name: string;
  @Input() disabled: boolean;
  @Input() required: boolean;

  constructor() {
  }

  propagateChange = (_: any) => { };
  propagateTouched = (_: any) => { };

  get range(): number {
    return this._range;
  }

  set range(range: number) {
    this._range = range;
    this.propagateChange(range);
  }

  writeValue(range: number) {
    this._range = range;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {
    this.propagateTouched = fn;
  }
}
