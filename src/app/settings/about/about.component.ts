import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-s-about',
  templateUrl: 'about.component.html'
})
export class AboutComponent {
  @HostBinding('class.page') pageClass = true;
}
