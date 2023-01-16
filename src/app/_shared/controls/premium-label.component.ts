import { Component } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { SharedService } from '../shared.service';
import { Storage } from '../../_storage/storage.service';
import { PremiumModalComponent } from '../modals/premium-modal.component';

@Component({
  selector: 'premium-label',
  template: `
    <button
      type="button"
      class="premiumLabel"
      [title]="shared.paid ? 'options.common.premiumLabelThankYou' : 'options.common.premiumLabel' | translate"
      (click)="openGetPremiumModal($event)"
      >
      <span class='matIcon'>diamond</span>
    </button>
  `,
  host: {'class': 'premiumLabelWrap'}
})

export class PremiumLabelComponent {

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private SimpleModalService: SimpleModalService
  ) {
  }

  openGetPremiumModal(e: Event) {
    e.stopPropagation();
    this.SimpleModalService.addModal(PremiumModalComponent, {});
  }
}
