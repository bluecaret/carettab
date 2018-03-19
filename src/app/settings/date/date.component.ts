import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-s-date',
  templateUrl: 'date.component.html'
})
export class DateComponent {
  @HostBinding('class.page') pageClass = true;
}
