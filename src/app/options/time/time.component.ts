import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'options-time',
  templateUrl: 'time.component.html'
})
export class OptionsTimeComponent {
  @HostBinding('class.page') pageClass = true;
}
