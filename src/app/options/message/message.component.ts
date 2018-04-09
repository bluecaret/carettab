import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'options-message',
  templateUrl: 'message.component.html'
})
export class OptionsMessageComponent {
  @HostBinding('class.page') pageClass = true;
}
