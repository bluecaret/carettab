import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { SharedService } from '../../_shared/shared.service';
import { PremiumModalComponent } from '../../_shared/modals/premium-modal.component';

@Component({
  selector: 'options-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class OptionsDashboardComponent implements OnInit {
  status: string;
  @HostBinding('class') hostClass: string = 'panelPlate panelPage';
  @Output() goTo: EventEmitter<string> = new EventEmitter<string>();

  constructor(public shared: SharedService, private SimpleModalService: SimpleModalService) {
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
    this.shared.echo('Opened settings page:', page);
    this.goTo.emit(page);
  }

  openGetPremiumModal() {
    this.SimpleModalService.addModal(PremiumModalComponent, {});
  }

}
