import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-s-message',
  templateUrl: 'message.component.html'
})
export class MessageComponent {
  @HostBinding('class.page') pageClass = true;
}
