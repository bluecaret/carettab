import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'options-extra',
  templateUrl: 'extra.component.html'
})
export class OptionsExtraComponent {
  @HostBinding('class.page') pageClass = true;
}
