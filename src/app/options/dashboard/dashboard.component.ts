import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'options-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class OptionsDashboardComponent {
  @HostBinding('class.page') pageClass = true;
}
