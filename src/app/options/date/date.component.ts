import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'options-date',
  templateUrl: 'date.component.html'
})
export class OptionsDateComponent {
  @HostBinding('class.page') pageClass = true;
}
