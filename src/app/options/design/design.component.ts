import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'options-design',
  templateUrl: 'design.component.html'
})
export class OptionsDesignComponent {
  @HostBinding('class.page') pageClass = true;
}
