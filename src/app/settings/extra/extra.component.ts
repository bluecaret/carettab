import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-s-extra',
  templateUrl: 'extra.component.html'
})
export class ExtraComponent {
  @HostBinding('class.page') pageClass = true;
}
