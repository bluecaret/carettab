import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-s-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
  @HostBinding('class.page') pageClass = true;
}
