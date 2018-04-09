import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'options-about',
  templateUrl: 'about.component.html'
})
export class OptionsAboutComponent {
  @HostBinding('class.page') pageClass = true;
}
