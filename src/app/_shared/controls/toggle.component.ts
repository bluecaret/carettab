import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'options-toggle',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    }
  ],
  template: `
    <button
      [name]="name"
      class="panelToggleBtn"
      [attr.aria-pressed]="toggle ? 'true' : 'false'"
      [id]="name+'-id'"
      [disabled]="disabled"
      [attr.aria-labelledby]="labelledby"
      (click)="toggle = !toggle"
    ></button>
  `,
  host: {'class': 'customControl'}
})

export class ToggleComponent implements ControlValueAccessor {
  _toggle: boolean;

  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() labelledby: string;
  @Input() name: string;
  @Input() value?: any;
  @Input() on?: string;
  @Input() off?: string;
  @Input() type?: 'toggle' | 'check' | 'radio' = 'toggle';

  constructor() {
  }

  propagateChange = (_: any) => { };
  propagateTouched = (_: any) => { };

  get toggle(): boolean {
    return this._toggle;
  }

  set toggle(toggle: boolean) {
    this._toggle = toggle;
    this.propagateChange(toggle);
  }

  writeValue(toggle: boolean) {
    this._toggle = toggle;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {
    this.propagateTouched = fn;
  }
}
