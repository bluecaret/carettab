import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-s-design',
  templateUrl: 'design.component.html'
})
export class DesignComponent {
  @HostBinding('class.page') pageClass = true;
}
