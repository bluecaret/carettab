import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'options-search',
  templateUrl: 'search.component.html'
})
export class OptionsSearchComponent {
  @HostBinding('class.page') pageClass = true;
}
