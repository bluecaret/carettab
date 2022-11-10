import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../_shared/shared.service';

@Component({
  selector: 'options-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class OptionsDashboardComponent implements OnInit {
  status: string;

  constructor(public shared: SharedService) {
  }

  ngOnInit(): void {
    this.status = this.shared.status;

    // Clear updated status
    if (this.shared.status === 'updated') {
      chrome.storage.local.set({caretTabStatus: 'existing'});
      this.shared.status = 'existing';
      this.shared.echo('Extension status reset to "existing" after update since user opened dashboard');
    }
  }

  goToPage(page: string) {
    this.shared.optionsPage = page;
    this.shared.echo('Opened settings page:', page);
    let path = encodeURI(page).toLowerCase();
  }

}
