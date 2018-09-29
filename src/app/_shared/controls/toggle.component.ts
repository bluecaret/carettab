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
    <div [class]="type">
      <input
        *ngIf="type === 'radio'"
        type="radio"
        [id]="name+'Id'"
        [name]="name"
        [(ngModel)]="toggle"
        [disabled]="disabled"
        [required]="required">
      <input
        *ngIf="type !== 'radio'"
        type="checkbox"
        [id]="name+'Id'"
        [name]="name"
        [(ngModel)]="toggle"
        [disabled]="disabled"
        [required]="required">
      <label [for]="name+'Id'"></label>
    </div>
  `,
  host: {'class': 'customControl'}
})

export class ToggleComponent implements ControlValueAccessor {
  _toggle: boolean;

  @Input() name: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() type: 'toggle' | 'check' | 'radio' = 'toggle';

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
