import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-s-search',
  templateUrl: 'search.component.html'
})
export class SearchComponent {
  @HostBinding('class.page') pageClass = true;
}
