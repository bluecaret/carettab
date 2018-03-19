import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-s-time',
  templateUrl: 'time.component.html'
})
export class TimeComponent {
  @HostBinding('class.page') pageClass = true;
}
