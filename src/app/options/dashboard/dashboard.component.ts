import { Component } from '@angular/core';
import { SharedService } from '../../_shared/shared.service';

@Component({
  selector: 'options-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class OptionsDashboardComponent {

  constructor(public shared: SharedService) {
  }

  goToPage(page: string) {
    this.shared.optionsPage = page;
  }

}
